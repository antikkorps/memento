---
title: "grep : chercher dans les fichiers"
tags: [ligne-de-commande, texte]
created: 2026-09-02
updated: 2026-09-02
status: stable
---

## En bref

Trouver les lignes qui matchent, et surtout leur contexte. `grep` filtre —
c'est tout ce qu'il fait, et c'est pour ça qu'il est bon. Pour transformer,
c'est [sed](sed.md) ; pour calculer, c'est [awk](awk.md).

## Les cas de tous les jours

```sh
grep -rniE 'error|fail' /var/log     # recursif, insensible a la casse, regex etendue
grep -v '^#' -e '^$' fichier.conf    # exclure commentaires et lignes vides
grep -A3 -B3 'motif' fichier         # 3 lignes apres et avant (ou -C3 pour les deux)
grep -c 'motif' fichier              # compter les lignes qui matchent
grep -l 'motif' *.md                 # ne lister que les fichiers concernes
grep -o 'DEFINER=[^ ]*' dump.sql     # n'afficher que la partie qui matche
```

| Option | Effet |
| --- | --- |
| `-r` / `-R` | descend dans les dossiers (`-R` suit les liens symboliques) |
| `-n` | numéro de ligne — indispensable pour ouvrir ensuite dans l'éditeur |
| `-i` | insensible à la casse |
| `-E` | regex **étendue** : `+`, `?`, `|`, `()` sans antislash |
| `-F` | motif littéral, aucun caractère spécial |
| `-v` | inverse : les lignes qui **ne** matchent pas |
| `-w` | mot entier (`grep -w cat` ne matche pas `concatenate`) |
| `-c` `-l` `-o` | compte / liste les fichiers / n'affiche que la correspondance |
| `-A n` `-B n` `-C n` | contexte après / avant / autour |
| `--include='*.md'` | ne lit que ces fichiers, en récursif |
| `--exclude-dir=.git` | saute un dossier entier (à cumuler : `node_modules`) |

## ripgrep

```sh
rg 'motif' --type ts        # bien plus rapide, respecte .gitignore
rg -F 'chaine litterale'
rg --files | rg motif       # chercher un nom de fichier
```

`rg` ignore par défaut ce que `.gitignore` exclut et saute les binaires : c'est
ce qui le rend rapide, et c'est aussi ce qui le fait « rater » un fichier que
`grep -r` aurait trouvé. Dans le doute sur un dépôt, `rg -uu` désactive ces
filtres.

## Pièges

- **`grep` sans `-E` parle regex *basique*** : `+`, `?`, `|`, `()` y sont des
  caractères ordinaires et doivent être échappés. Dans le doute, `-E`.
- **Un motif qui vient d'une variable doit être `-F`.** Un chemin, une version,
  une adresse IP contiennent des `.` et des `/` qui sont des métacaractères :
  `grep -F "$motif"` évite les faux positifs silencieux.
- **`grep` sort en `1` quand il ne trouve rien.** Dans un script en `set -e`,
  un `grep` qui ne matche pas tue le script. Écrire
  `grep motif f || true`, ou tester explicitement avec `if grep -q motif f`.
- `-q` sort dès la première correspondance sans rien afficher : c'est la bonne
  forme dans un `if`, et elle évite de lire un gros fichier en entier.
- Sur un dossier contenant des binaires, `grep -r` affiche
  `Binary file ... matches` : `-I` les ignore complètement.
- L'ordre des résultats de `grep -r` dépend du système de fichiers. Pour une
  sortie stable (diff, CI), passer par `sort`.

## Voir aussi

- [sed ou awk : lequel choisir](sed-ou-awk.md)
- [sed : substituer et éditer des lignes](sed.md)
- [awk : colonnes, filtres et calculs](awk.md)
- <https://www.gnu.org/software/grep/manual/grep.html>
