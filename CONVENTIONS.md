# Conventions

Écrit pour moi-dans-six-mois. Si un jour une règle d'ici gêne plus qu'elle
n'aide, la changer — mais la changer *ici* et dans `scripts/index.js` en même
temps, sinon la CI et la doc divergent.

## Principe directeur

**Hiérarchie peu profonde pour ranger, tags pour croiser.**

Un dossier répond à « où je le pose » — il n'y a qu'une bonne réponse et elle
doit être immédiate. Les tags répondent à « par quoi je le retrouve » — il y en
a plusieurs, et c'est normal. Toute envie de créer `fiches/reseau/dns/records/`
est le signe qu'il faut un tag, pas un dossier.

Corollaire non négociable : **ce sont des fichiers markdown ordinaires**. Pas de
`[[wikilink]]`, pas de base de données, pas de format d'outil. Le dépôt doit
rester intégralement exploitable avec `grep`, un éditeur de texte et un
navigateur pointé sur Forgejo.

## Arborescence

```
fiches/<domaine>/<fiche>.md    les fiches classées — UN SEUL niveau
inbox/                         zone de dépôt, non triée, non contraignante
templates/fiche.md             modèle à copier
scripts/index.js               l'indexeur
assets/<domaine>/              images, mêmes noms de domaines que fiches/
```

`fiches/`, `inbox/` et `assets/` sont volontairement absents du dépôt tant
qu'ils sont vides (pas de `.gitkeep`). Après un clone frais, les recréer au
besoin :

```sh
mkdir -p fiches inbox assets
```

L'indexeur tolère leur absence sans broncher.

### Créer un domaine

Un domaine est un dossier sous `fiches/`, nommé en kebab-case. Il n'y a pas de
liste fermée : ce sont les tags qui sont contraints, pas les dossiers.

Règle par défaut : le créer quand une **troisième** fiche du même sujet arrive.
Avant, elles vivent très bien ailleurs. Le but est d'empêcher la création
*spéculative* — pas d'ouvrir `fiches/jq/` pour une fiche isolée.

**Exception** : quand tu sais déjà que le sujet portera dix fiches, crée-le tout
de suite. `wordpress` a été créé à la première fiche pour cette raison.

**Un domaine nomme un sujet, jamais une nature.** `wordpress`, `docker`,
`reseau` répondent instantanément à « où je le pose ». `outils`, `web`, `divers`
n'y répondent pas : tout peut y tomber, donc tout y tombe. C'est le test à
appliquer avant de créer un dossier.

Le corollaire tient en une phrase : **large = tag, précis = domaine.** `web` est
un excellent tag — il croise une fiche WordPress et une fiche HTTP — et un
mauvais dossier.

## Nommage des fichiers

kebab-case, minuscules, sans accent ni espace, extension `.md`.

```
fiches/reseau/resolution-dns.md      oui
fiches/reseau/Résolution DNS.md      non
```

Motif vérifié : `^[a-z0-9]+(-[a-z0-9]+)*\.md$`.

Le nom de fichier n'a pas à répéter le domaine : `fiches/git/remotes.md`, pas
`fiches/git/git-remotes.md`.

## Frontmatter

Obligatoire en tête de **chaque** fiche, sans ligne avant.

```yaml
---
title: Remotes git et miroirs
tags: [git, procedure]
created: 2026-08-17
updated: 2026-08-17
status: stable
---
```

| Clé | Obligatoire | Format |
| --- | --- | --- |
| `title` | oui | chaîne non vide, lisible, accents autorisés |
| `tags` | oui | liste non vide, chaque valeur présente dans `TAGS.md` |
| `created` | oui | `YYYY-MM-DD`, date réelle |
| `updated` | oui | `YYYY-MM-DD`, ≥ `created` |
| `status` | non | `brouillon` (défaut) ou `stable` |

`status: brouillon` veut dire « je ne m'y fierais pas les yeux fermés ». C'est
le défaut, y compris quand la clé est absente : le doute est l'état par défaut.

Les clés hors de ce tableau sont **tolérées mais ignorées** par l'index, et
signalées en `note` à chaque exécution. Utile pour expérimenter (`source:`,
`related:`) sans casser la CI ; si une clé s'installe dans l'usage, la promouvoir
dans le tableau ci-dessus et dans `KNOWN_KEYS` de `scripts/index.js`.

### Sous-ensemble YAML accepté

L'indexeur n'a **aucune dépendance** : il implémente un parseur strict, qui
couvre exactement ce dont le schéma a besoin.

```yaml
cle: valeur              # quotes simples ou doubles optionnelles
cle: [a, b]              # liste inline
cle:                     # liste bloc
  - a
  - b
```

Tout le reste (objets imbriqués, scalaires multilignes `|` et `>`, ancres)
produit une erreur explicite plutôt qu'une interprétation approximative. C'est
délibéré : le frontmatter doit rester trivial à lire à l'œil.

Si un jour ce sous-ensemble devient réellement limitant, remplacer
`parseFrontmatter()` par `gray-matter` — la validation, elle, ne bouge pas ;
elle n'a jamais dépendu du parseur.

## Tags

Règles de nommage et vocabulaire : `TAGS.md`. En résumé — minuscules, sans
accent, **au singulier**, kebab-case.

Un tag absent de `TAGS.md` fait échouer la CI. C'est le garde-fou central du
dépôt : sans lui, la moitié des fiches finit sous `réseaux` et l'autre sous
`reseau`, et l'index par tag ne vaut plus rien.

Viser 2 à 4 tags par fiche. Un seul tag et c'est probablement le domaine
redit ; plus de cinq et aucun ne discrimine.

## Liens

Markdown relatif standard, et rien d'autre :

```md
Voir [la résolution DNS](../reseau/resolution-dns.md).
```

Ils restent cliquables dans Forgejo, sur le miroir GitHub, dans n'importe quel
éditeur, et `git grep` les retrouve. Les `[[wikilink]]` ne marchent que dans les
outils qui les implémentent — c'est exactement le lock-in qu'on évite ici.

**L'indexeur vérifie que chaque lien relatif pointe sur un fichier existant**, et
un lien mort fait échouer la CI. C'est le pendant indispensable du choix
ci-dessus : puisque tout repose sur des chemins relatifs, renommer une fiche
casse silencieusement les liens qui la visaient — Forgejo affiche un lien mort
sans rien signaler, et `git grep` ne sait pas qu'il devrait chercher.

Le détail de ce qui est contrôlé :

- les cibles relatives et celles commençant par `/` (racine du dépôt, comme dans
  le rendu Forgejo), qu'il s'agisse d'un lien ou d'une image ;
- les liens externes (`https:`, `mailto:`, `//…`) et les ancres seules
  (`[voir](#pieges)`) sont ignorés : rien à vérifier sur le disque ;
- **les blocs de code sont ignorés**, pour qu'une fiche qui montre la syntaxe
  markdown ne casse pas la CI avec son propre exemple ;
- un lien qui sort du dépôt (`../../../etc/passwd`) est signalé comme tel.

Un lien cassé **n'exclut pas** la fiche de l'index, contrairement à un
frontmatter invalide : elle reste listée et trouvable par tag. Elle est
incomplète, pas illisible — la sanction doit être proportionnée.

Images : `assets/<domaine>/`, mêmes domaines que `fiches/`, référencées en
relatif — `![schéma](../../assets/reseau/handshake.png)`.

## Liens externes et fiches `ressource`

Un lien vers une lecture externe n'est pas une fiche. Il va dans la section
**« Voir aussi »** de la fiche qu'il sert.

Quand il n'existe pas encore de fiche sur le sujet, et seulement dans ce cas :
une fiche `ressources.md` **scopée au domaine** — `fiches/git/ressources.md` —
taguée `ressource`. Jamais de fichier de marque-pages global : c'est le même
piège qu'un `lexique.md` global ou qu'un domaine `outils`, tout y tombe et plus
rien ne s'y retrouve.

Une fiche `ressource` doit dire **pourquoi** chaque lien mérite d'être ouvert et
dans quel ordre les aborder. Une liste d'URL nues ne vaut pas mieux que les
favoris du navigateur — que tu n'ouvres jamais non plus.

## Pièces jointes (PDF, cheat sheets, archives)

**Un PDF n'est pas une fiche.** Il n'a pas de frontmatter, n'apparaît pas dans
l'index par tag, `git grep` ne le traverse pas et `git diff` n'en montre rien.
Posé seul dans `fiches/`, c'est un fichier que ta propre recherche ne trouvera
jamais.

La règle : le binaire va dans `assets/<domaine>/`, et une **fiche pointeur** le
présente.

```
assets/reseau/cheatsheet-tcpdump.pdf
fiches/reseau/tcpdump.md
```

La fiche pointeur est courte et contient au minimum :

- un frontmatter normal (donc des tags, donc une place dans l'index) ;
- le lien relatif vers le PDF ;
- une section `## Source` avec l'URL d'origine **et la date de récupération** ;
- ce que tu en retiens : les trois choses que tu y cherches réellement.

Sans provenance datée, un PDF devient inexploitable en dix-huit mois : tu ne
sauras plus s'il est périmé. C'est la seule partie non négociable.

Réécrire plutôt que joindre quand tu n'utilises qu'une fraction du document, ou
quand tu as dû l'adapter à ton contexte — c'est la réécriture qui fait retenir.
Joindre quand c'est une référence dense consultée en diagonale.

Poids : git stocke chaque version d'un binaire intégralement, sans delta. Une
cheat sheet de quelques centaines de Ko qui ne change jamais est négligeable.
N'envisager `git-lfs` qu'au-delà de plusieurs dizaines de Mo — c'est un outil de
plus entre toi et tes fichiers, exactement ce que ce dépôt cherche à éviter.

L'indexeur ignore tout ce qui n'est pas `.md` : rien à configurer.

## inbox/

Zone de dépôt brut : on y jette ce qui n'est pas encore une fiche.

Elle est **indexée mais non contraignante**. Une fiche mal formée dans `inbox/`
produit un avertissement, jamais un échec de CI — sinon la zone tampon n'en est
plus une et l'inbox se vide dans le presse-papiers plutôt que dans le dépôt.

En contrepartie, `inbox/` est une dette : ce qui y traîne n'apparaît pas dans
l'index par tag tant que son frontmatter n'est pas valide. La vider
régulièrement, ou assumer.

Trier une fiche = lui écrire un frontmatter valide, la déplacer dans
`fiches/<domaine>/`, relancer `npm run index`.

## Indexeur

```sh
npm run index                        # régénère README.md
npm run check                        # ne réécrit rien, sort en 1 si non conforme (CI)
node scripts/index.js --tag reseau   # fiches portant ce tag
node scripts/index.js --tag          # vocabulaire avec le nombre de fiches par tag
```

### Recherche par tag

`--tag` passe par le parseur de frontmatter, pas par une expression régulière.
C'est ce qui le distingue d'un `git grep` :

- la forme bloc (`tags:` puis `- reseau` en dessous) est trouvée ;
- `reseau` ne matche pas un futur `reseau-local` ;
- le mot présent dans le corps du texte n'est pas un faux positif ;
- les fiches non conformes, absentes du résultat, sont signalées sur `stderr`
  plutôt que silencieusement oubliées.

Sortie : `chemin  titre`, un par ligne. Les chemins étant en kebab-case, ils ne
contiennent jamais d'espace — `| awk '{print $1}'` est donc sûr :

```sh
node scripts/index.js --tag reseau | awk '{print $1}' | xargs $EDITOR
```

Codes de sortie façon `grep` : `0` si au moins une fiche correspond, `1` si
aucune ou si le tag est absent de `TAGS.md` (avec suggestion des tags proches).

L'équivalent `npm run tag -- reseau` fonctionne, mais le `--` supplémentaire le
rend peu pratique : préférer l'appel direct, ou un alias shell.

`npm run index` régénère **la zone entre les marqueurs** `<!-- INDEX:START -->`
et `<!-- INDEX:END -->` du README. Ce qui est au-dessus est à toi et survit aux
régénérations. Si les marqueurs disparaissent, le script réécrit le fichier
entier avec son préambule par défaut.

Le README généré ne contient **aucune date de génération** : c'est ce qui rend
le script idempotent. Deux exécutions consécutives produisent un fichier
identique, donc un `git diff` vide. Ne pas ajouter d'horodatage.

Niveaux de sortie :

| Préfixe | Sens | Fait échouer `--check` |
| --- | --- | --- |
| `erreur` | fiche de `fiches/` non conforme | oui |
| `attention` | fiche de `inbox/` non conforme | non |
| `note` | clé inconnue, tag inutilisé, README périmé, `updated` en retard | non |

Le README périmé est signalé mais ne bloque pas : il n'y a pas de hook
pre-commit (choix assumé, voir plus bas), donc l'oubli est probable et ne
justifie pas un échec de build. Pour le rendre bloquant, transformer cette note
en erreur dans `main()`.

### `updated` confronté à git

`updated` est saisi à la main, donc il dérive : on modifie une fiche et on
oublie la date. L'indexeur compare cette date à ce que git sait du fichier et
émet une `note` quand elle est en retard :

```
note      fiches/git/remotes.md: updated = 2026-08-17, modifiee le 2026-09-02
```

La date de référence est celle du dernier commit touchant le fichier, **ou la
date du jour si le fichier est modifié dans le répertoire de travail** — ce
second cas est le plus utile : il prévient avant le commit, au moment où la
correction coûte une seconde.

C'est une `note`, jamais une erreur : une date en retard n'invalide pas le
contenu, elle signale un oubli. La bloquer rendrait impossible un commit qui ne
touche qu'à la mise en forme.

Si git est absent, si le dépôt n'a pas encore de commit, ou si l'on travaille
sur une copie non versionnée, la vérification se tait — le memento doit rester
utilisable sans git. Sur un clone superficiel (`--depth 1`), seuls les fichiers
du dernier commit ont une date connue : la couverture est partielle, mais il n'y
a jamais de faux positif.

## Pas de hook pre-commit

Un `pre-commit` qui régénère le README et l'ajoute au commit a été écarté :
il modifie le contenu committé après relecture, et il ne se propage pas au clone
puisque les hooks ne sont pas versionnés. Réflexe à prendre à la place : après
avoir ajouté ou modifié une fiche, `npm run index` avant `git add`.

## CI

`.forgejo/workflows/check.yml` lance `npm run check` à chaque push et chaque PR.
Rien d'autre — pas de déploiement, pas de génération de site.

Le `runs-on:` dépend des labels déclarés par ton runner Forgejo
(`forgejo-runner`, fichier `config.yml`, section `runner.labels`). Si le
workflow ne démarre jamais, c'est presque toujours ça.

## Remotes

`origin` pointe sur Forgejo ; le miroir GitHub est configuré **côté Forgejo**,
donc rien à pousser à la main.

```sh
git remote add origin ssh://git@git.fvienot.link/fvienot/memento.git
git push -u origin main
```

## Raccourcis : `make` et `scripts/m`

Deux façades, complémentaires plutôt que redondantes — le partage se fait sur
un critère simple : **make pour ce qui ne prend pas d'argument, `m` pour le
reste.**

`make tag reseau` ne peut pas fonctionner : make interprète `reseau` comme une
seconde cible à construire et répond `No rule to make target`. Il faut
`make tag TAG=reseau`, ce qui reste acceptable pour un tag, mais devient absurde
pour `m new <domaine> <nom>` et ses deux arguments positionnels. Make impose
aussi d'être à la racine du dépôt, là où `m` marche de partout.

### make

```sh
make            # aide
make check      # conformité (identique à la CI)
make index      # régénère le README
make tag TAG=reseau
```

### scripts/m

Dispatcher POSIX. Il déduit la racine du dépôt de son propre chemin, donc il
marche depuis n'importe quel répertoire.

```sh
alias m=~/documents/memento/scripts/m
```

```
m tag [nom]            fiches portant ce tag ; sans nom, liste le vocabulaire
m find <mot>           cherche dans le corps des fiches, ouvre le résultat
m new <domaine> <nom>  crée une fiche depuis le modèle, dates pré-remplies
m inbox <nom>          crée une note brute dans inbox/, sans frontmatter
m check                vérifie la conformité (identique à la CI)
m index                régénère le README
```

`m find` complète `m tag` : le tag dit *par quoi je retrouve une fiche*, `find`
fouille ce qu'il y a **dedans** — une option, un message d'erreur, un nom de
commande. Le motif est une **chaîne littérale**, insensible à la casse : pas de
regex à échapper. Pour une vraie expression régulière, `git grep -i` reste là.

Le comportement dépend d'où va la sortie :

- **dans un terminal**, les résultats passent dans `fzf`, avec le fichier en
  aperçu positionné sur la ligne trouvée ; la sélection s'ouvre dans l'éditeur,
  à la bonne ligne (`nk`, `vi`, `vim`, `nvim`, `view`, `nano`, `micro`
  reçoivent `+ligne`, `helix` reçoit `fichier:ligne`, les autres le fichier
  seul) ;
- **dans un pipe ou une redirection**, c'est une sortie `grep` classique
  (`chemin:ligne:texte`), donc `awk`-able. Idem si `fzf` n'est pas installé :
  il est un confort, pas une dépendance.

Codes de sortie façon `grep`, comme `--tag` : `0` si au moins une ligne
correspond, `1` sinon. `rg` est utilisé s'il est présent, `grep -R` sinon —
même sortie dans les deux cas.

### Quel éditeur

`m find`, `m new` et `m inbox` ouvrent tous le même : `$VISUAL`, sinon
`$EDITOR`, sinon le premier de `nk`, `nvim`, `vim`, `vi`, `nano`, `micro`
trouvé dans le `PATH` (`nk` = nvim sur la configuration kickstart, via
`NVIM_APPNAME`). Le chemin du fichier est affiché **avant** l'ouverture, ce qui laisse
une trace exploitable dans le terminal ; si vraiment aucun éditeur n'est
disponible, il n'y a que cette ligne et la sortie reste `0`.

Le repli sur le `PATH` évite de dépendre d'une variable que le shell ne définit
pas toujours — mais définir `EDITOR` dans `~/.zshrc` reste préférable : tout le
reste du système en dépend aussi (`git commit`, `crontab -e`, `sudoedit`).

Attention au piège : **un alias de shell n'est pas un exécutable.** Un
`alias nk='NVIM_APPNAME=... nvim'` dans `~/.zshrc` n'existe que dans le zsh
interactif — aucun script, aucun `$EDITOR`, aucun `command -v` ne le voit. Pour
qu'un éditeur soit utilisable partout, il lui faut un vrai fichier exécutable
dans le `PATH` :

```sh
# ~/.local/bin/nk
#!/bin/sh
exec env NVIM_APPNAME=nvim-kickstart nvim "$@"
```


`m new` fait les trois choses qu'on rate à la main : il remplit `created` et
`updated` à la date du jour, il refuse un nom ou un domaine hors kebab-case
*avant* que le fichier existe, et il refuse d'écraser une fiche existante. Puis
il ouvre `$EDITOR` — ou affiche simplement le chemin si `$EDITOR` n'est pas
défini.

Ni `m` ni le `Makefile` ne sont indispensables : tout ce qu'ils font reste
faisable avec `cp`, `sed` et `node scripts/index.js`. C'est du confort, pas une
dépendance — les supprimer ne casse rien, et la CI n'appelle ni l'un ni l'autre
(elle lance `npm run check` directement, pour ne pas dépendre de `make` dans
l'image du runner).

## Ajouter une fiche, la procédure complète

```sh
m new reseau nmap        # crée, pré-remplit les dates, ouvre l'éditeur
                         # → titre, tags, puis supprimer le bloc de rappel
m check                  # conformité
m index                  # README
git add fiches/reseau/nmap.md README.md
git commit -m "docs(fiches): ajoute une fiche sur nmap"
```

Sans le raccourci, la version longue :

```sh
cp templates/fiche.md fiches/<domaine>/<fiche>.md
$EDITOR fiches/<domaine>/<fiche>.md
npm run check && npm run index
```
