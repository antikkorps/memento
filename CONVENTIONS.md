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

Un domaine est un dossier sous `fiches/`, nommé en kebab-case. Le créer quand
une **troisième** fiche du même sujet arrive — avant, elles vivent très bien
dans un domaine plus large. Il n'y a pas de liste fermée de domaines : ce sont
les tags qui sont contraints, pas les dossiers.

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

Images : `assets/<domaine>/`, mêmes domaines que `fiches/`, référencées en
relatif — `![schéma](../../assets/reseau/handshake.png)`.

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
npm run index     # régénère README.md
npm run check     # ne réécrit rien, sort en 1 si non conforme (utilisé par la CI)
```

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
| `note` | clé inconnue, tag inutilisé, README périmé | non |

Le README périmé est signalé mais ne bloque pas : il n'y a pas de hook
pre-commit (choix assumé, voir plus bas), donc l'oubli est probable et ne
justifie pas un échec de build. Pour le rendre bloquant, transformer cette note
en erreur dans `main()`.

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

## Ajouter une fiche, la procédure complète

```sh
cp templates/fiche.md fiches/<domaine>/<fiche>.md
$EDITOR fiches/<domaine>/<fiche>.md      # frontmatter + supprimer le bloc de rappel
npm run check                            # conformité
npm run index                            # index
git add fiches/<domaine>/<fiche>.md README.md
git commit -m "docs(fiches): ajoute une fiche sur <sujet>"
```
