#!/usr/bin/env node
'use strict';

/**
 * Indexeur de memento.
 *
 *   node scripts/index.js            regenere le README (zone entre marqueurs)
 *   node scripts/index.js --check    ne reecrit rien, sort en 1 si non conforme
 *
 * Aucune dependance externe : le frontmatter accepte est volontairement un
 * sous-ensemble strict de YAML, decrit dans CONVENTIONS.md.
 */

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const FICHES_DIR = 'fiches';
const INBOX_DIR = 'inbox';
const TAGS_FILE = 'TAGS.md';
const README_FILE = 'README.md';

const MARK_START = '<!-- INDEX:START -->';
const MARK_END = '<!-- INDEX:END -->';

const KNOWN_KEYS = ['title', 'tags', 'created', 'updated', 'status'];
const STATUSES = ['brouillon', 'stable'];
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// ---------------------------------------------------------------- utilitaires

/** Tri stable et independant de la locale (les noms de fichiers sont ASCII). */
function byString(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}

function unquote(value) {
  if (value.length >= 2) {
    const first = value[0];
    const last = value[value.length - 1];
    if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
      return value.slice(1, -1);
    }
  }
  return value;
}

function isRealDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

/** Echappe les caracteres qui casseraient un libelle de lien markdown. */
function escapeLabel(text) {
  return String(text).replace(/([[\]])/g, '\\$1');
}

/** Chemin POSIX, pour que le README soit identique sous Windows. */
function toPosix(p) {
  return p.split(path.sep).join('/');
}

// -------------------------------------------------------------------- lecture

function walkMarkdown(absDir, relPrefix, out) {
  let entries;
  try {
    entries = fs.readdirSync(absDir, { withFileTypes: true });
  } catch (err) {
    if (err.code === 'ENOENT') return out; // dossier pas encore cree : normal
    throw err;
  }
  for (const entry of entries.sort((a, b) => byString(a.name, b.name))) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
    const rel = `${relPrefix}/${entry.name}`;
    if (entry.isDirectory()) {
      walkMarkdown(path.join(absDir, entry.name), rel, out);
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) {
      out.push(rel);
    }
  }
  return out;
}

/**
 * Vocabulaire de tags : seules les lignes `- \`tag\` — description` comptent.
 * Le reste de TAGS.md est libre (titres, prose, exemples).
 */
function readVocabulary() {
  const abs = path.join(ROOT, TAGS_FILE);
  if (!fs.existsSync(abs)) {
    return { tags: new Set(), missingFile: true };
  }
  const tags = new Set();
  for (const line of fs.readFileSync(abs, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*-\s+`([^`]+)`/);
    if (m) tags.add(m[1]);
  }
  return { tags, missingFile: false };
}

// -------------------------------------------------------------- frontmatter

/**
 * Sous-ensemble de YAML supporte :
 *   cle: valeur                (quotes simples ou doubles optionnelles)
 *   cle: [a, b]                (liste inline)
 *   cle:                       (liste bloc)
 *     - a
 * Tout le reste est une erreur explicite plutot qu'une interpretation.
 */
function parseFrontmatter(raw) {
  let text = raw;
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
  const lines = text.split(/\r?\n/);

  if (lines[0] !== '---') {
    return { error: 'frontmatter absent : le fichier ne commence pas par une ligne "---"' };
  }
  let end = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i] === '---') {
      end = i;
      break;
    }
  }
  if (end === -1) {
    return { error: 'frontmatter non ferme : pas de ligne "---" de fermeture' };
  }

  const data = Object.create(null);
  const order = [];
  let listKey = null;

  for (const line of lines.slice(1, end)) {
    if (line.trim() === '' || /^\s*#/.test(line)) continue;

    const item = line.match(/^\s*-\s+(.*)$/);
    if (item) {
      if (!listKey) return { error: `element de liste sans cle parente : "${line}"` };
      data[listKey].push(unquote(item[1].trim()));
      continue;
    }

    const pair = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!pair) {
      // Cas de loin le plus frequent : la cle est indentee. En YAML les cles de
      // premier niveau commencent colonne 1 ; autant le dire explicitement.
      if (/^\s+[A-Za-z0-9_-]+\s*:/.test(line)) {
        return {
          error: `cle indentee : "${line.trim()}" doit commencer en colonne 1, sans espace avant`,
        };
      }
      return { error: `ligne de frontmatter illisible : "${line}"` };
    }

    const key = pair[1];
    const value = pair[2].trim();
    if (key in data) return { error: `cle "${key}" definie deux fois` };
    order.push(key);
    listKey = null;

    if (value === '') {
      data[key] = [];
      listKey = key;
    } else if (value.startsWith('[')) {
      if (!value.endsWith(']')) return { error: `liste inline non fermee pour "${key}"` };
      const inner = value.slice(1, -1).trim();
      data[key] = inner === ''
        ? []
        : inner.split(',').map((s) => unquote(s.trim())).filter((s) => s !== '');
    } else {
      data[key] = unquote(value);
    }
  }

  return { data, order };
}

// -------------------------------------------------------------- validation

function validate(relPath, data, order, vocabulary) {
  const errors = [];
  const warnings = [];

  const base = path.posix.basename(relPath);
  const zone = relPath.split('/')[0];

  // -- nom de fichier et profondeur
  if (!SLUG.test(base.replace(/\.md$/, ''))) {
    errors.push('nom de fichier hors convention (kebab-case, minuscules, sans accent)');
  }
  const segments = relPath.split('/');
  if (zone === FICHES_DIR) {
    if (segments.length === 2) {
      errors.push(`fiche a la racine de ${FICHES_DIR}/ : elle doit etre dans un dossier de domaine`);
    } else if (segments.length > 3) {
      errors.push(`profondeur > 1 : ${FICHES_DIR}/<domaine>/<fiche>.md et rien de plus`);
    }
    const domain = segments[1];
    if (segments.length >= 3 && !SLUG.test(domain)) {
      errors.push(`nom de domaine hors convention : "${domain}"`);
    }
  }

  // -- title
  if (typeof data.title !== 'string' || data.title.trim() === '') {
    errors.push('title manquant ou vide');
  }

  // -- tags
  if (!Array.isArray(data.tags)) {
    errors.push('tags manquant, ou ecrit comme une valeur simple au lieu d\'une liste');
  } else if (data.tags.length === 0) {
    errors.push('tags vide : au moins un tag est requis');
  } else {
    const seen = new Set();
    for (const tag of data.tags) {
      if (seen.has(tag)) {
        warnings.push(`tag "${tag}" repete`);
        continue;
      }
      seen.add(tag);
      if (!SLUG.test(tag)) {
        errors.push(`tag "${tag}" hors convention (minuscules, sans accent, kebab-case)`);
      } else if (!vocabulary.has(tag)) {
        errors.push(`tag "${tag}" absent de ${TAGS_FILE}`);
      }
    }
  }

  // -- dates
  for (const key of ['created', 'updated']) {
    if (typeof data[key] !== 'string' || data[key] === '') {
      errors.push(`${key} manquant`);
    } else if (!isRealDate(data[key])) {
      errors.push(`${key} = "${data[key]}" : date invalide (attendu YYYY-MM-DD)`);
    }
  }
  if (isRealDate(data.created) && isRealDate(data.updated) && data.updated < data.created) {
    errors.push(`updated (${data.updated}) anterieur a created (${data.created})`);
  }

  // -- status
  if (data.status !== undefined && !STATUSES.includes(data.status)) {
    errors.push(`status = "${data.status}" : attendu ${STATUSES.join(' ou ')}`);
  }

  // -- cles inconnues : tolerees, mais signalees
  for (const key of order) {
    if (!KNOWN_KEYS.includes(key)) warnings.push(`cle inconnue "${key}" (ignoree par l'index)`);
  }

  return { errors, warnings };
}

// ------------------------------------------------------------------ collecte

function collect() {
  const vocabulary = readVocabulary();
  const notes = [];
  const problems = []; // { file, zone, errors, warnings }

  const files = [
    ...walkMarkdown(path.join(ROOT, FICHES_DIR), FICHES_DIR, []),
    ...walkMarkdown(path.join(ROOT, INBOX_DIR), INBOX_DIR, []),
  ];

  for (const rel of files) {
    const zone = rel.split('/')[0];
    const raw = fs.readFileSync(path.join(ROOT, toPosix(rel).split('/').join(path.sep)), 'utf8');
    const parsed = parseFrontmatter(raw);

    if (parsed.error) {
      problems.push({ file: rel, zone, errors: [parsed.error], warnings: [] });
      continue;
    }
    const { errors, warnings } = validate(rel, parsed.data, parsed.order, vocabulary.tags);
    if (errors.length || warnings.length) problems.push({ file: rel, zone, errors, warnings });
    if (errors.length === 0) {
      notes.push({
        file: rel,
        zone,
        domain: zone === FICHES_DIR ? rel.split('/')[1] : null,
        title: parsed.data.title.trim(),
        tags: [...new Set(parsed.data.tags)].sort(byString),
        created: parsed.data.created,
        updated: parsed.data.updated,
        status: parsed.data.status || 'brouillon',
      });
    }
  }

  notes.sort((a, b) => byString(a.file, b.file));
  problems.sort((a, b) => byString(a.file, b.file));
  return { notes, problems, vocabulary };
}

// -------------------------------------------------------------------- rendu

function renderIndex(model) {
  const { notes, vocabulary } = model;
  const classees = notes.filter((n) => n.zone === FICHES_DIR);
  const inbox = notes.filter((n) => n.zone === INBOX_DIR);
  const out = [];

  const link = (n) => `[${escapeLabel(n.title)}](${n.file})`;

  // -- arborescence
  out.push('## Fiches', '');
  if (classees.length === 0) {
    out.push('_Aucune fiche classée pour l\'instant._', '');
  } else {
    const domains = [...new Set(classees.map((n) => n.domain))].sort(byString);
    for (const domain of domains) {
      out.push(`### ${domain}`, '');
      for (const n of classees.filter((x) => x.domain === domain)) {
        const flag = n.status === 'brouillon' ? ' — _brouillon_' : '';
        out.push(`- ${link(n)}${flag}`);
      }
      out.push('');
    }
  }

  // -- inbox
  out.push('## Inbox', '');
  if (inbox.length === 0) {
    out.push('_Vide._', '');
  } else {
    for (const n of inbox) out.push(`- ${link(n)}`);
    out.push('');
  }

  // -- index par tag
  out.push('## Index par tag', '');
  const byTag = new Map();
  for (const n of notes) {
    for (const tag of n.tags) {
      if (!byTag.has(tag)) byTag.set(tag, []);
      byTag.get(tag).push(n);
    }
  }
  if (byTag.size === 0) {
    out.push('_Aucun tag utilisé pour l\'instant._', '');
  } else {
    for (const tag of [...byTag.keys()].sort(byString)) {
      out.push(`### ${tag}`, '');
      for (const n of byTag.get(tag)) out.push(`- ${link(n)}`);
      out.push('');
    }
  }

  // -- compteurs
  const brouillons = notes.filter((n) => n.status === 'brouillon').length;
  out.push(
    '## Compteurs',
    '',
    '| | |',
    '| --- | --: |',
    `| Fiches classées | ${classees.length} |`,
    `| Fiches en inbox | ${inbox.length} |`,
    `| Brouillons | ${brouillons} |`,
    `| Tags utilisés | ${byTag.size} |`,
    `| Tags déclarés | ${vocabulary.tags.size} |`,
    ''
  );

  return out;
}

const DEFAULT_README = [
  '# memento',
  '',
  'Base de connaissance personnelle : des fiches markdown, une hiérarchie peu',
  'profonde pour ranger, des tags pour croiser.',
  '',
  'Les conventions sont dans [CONVENTIONS.md](CONVENTIONS.md), le vocabulaire de',
  'tags dans [TAGS.md](TAGS.md), le modèle de fiche dans',
  '[templates/fiche.md](templates/fiche.md).',
  '',
  'Régénérer l\'index après avoir ajouté ou modifié une fiche :',
  '',
  '```sh',
  'npm run index',
  '```',
  '',
  'Tout ce qui suit est généré par `scripts/index.js` : ne pas l\'éditer à la main.',
  '',
];

function buildReadme(model, previous) {
  const zone = [MARK_START, '', ...renderIndex(model), MARK_END];

  if (previous !== null) {
    const start = previous.indexOf(MARK_START);
    const end = previous.indexOf(MARK_END);
    if (start !== -1 && end !== -1 && end > start) {
      const head = previous.slice(0, start);
      const tail = previous.slice(end + MARK_END.length);
      return head + zone.join('\n') + tail;
    }
  }
  return `${[...DEFAULT_README, ...zone].join('\n')}\n`;
}

// --------------------------------------------------------------------- sortie

function report(model, { checkMode }) {
  const { problems, notes, vocabulary } = model;
  let blocking = 0;

  if (vocabulary.missingFile) {
    console.error(`erreur    ${TAGS_FILE} introuvable : aucun tag ne peut être validé`);
    blocking += 1;
  }

  for (const p of problems) {
    // inbox/ est une zone de depot brut : ses non-conformites n'echouent pas.
    const level = p.zone === INBOX_DIR ? 'attention' : 'erreur   ';
    for (const e of p.errors) {
      console.error(`${level} ${p.file}: ${e}`);
      if (p.zone !== INBOX_DIR) blocking += 1;
    }
    for (const w of p.warnings) console.error(`note      ${p.file}: ${w}`);
  }

  if (!checkMode) {
    const used = new Set(notes.flatMap((n) => n.tags));
    const unused = [...vocabulary.tags].filter((t) => !used.has(t)).sort(byString);
    if (unused.length) console.error(`note      tags déclarés et jamais utilisés : ${unused.join(', ')}`);
  }

  return blocking;
}

function main() {
  const checkMode = process.argv.includes('--check');
  const model = collect();
  const blocking = report(model, { checkMode });

  const readmePath = path.join(ROOT, README_FILE);
  const previous = fs.existsSync(readmePath) ? fs.readFileSync(readmePath, 'utf8') : null;
  const next = buildReadme(model, previous);

  if (checkMode) {
    if (previous !== next) {
      console.error(`note      ${README_FILE} n'est pas à jour : lancer \`npm run index\``);
    }
    if (blocking > 0) {
      console.error(`\n${blocking} problème(s) bloquant(s).`);
      process.exit(1);
    }
    console.log(`ok : ${model.notes.length} fiche(s) conforme(s).`);
    return;
  }

  if (previous !== next) {
    fs.writeFileSync(readmePath, next);
    console.log(`${README_FILE} régénéré (${model.notes.length} fiche(s)).`);
  } else {
    console.log(`${README_FILE} déjà à jour (${model.notes.length} fiche(s)).`);
  }
  if (blocking > 0) process.exitCode = 1;
}

main();
