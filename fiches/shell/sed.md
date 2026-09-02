---
title: "sed : substituer et éditer des lignes"
tags: [ligne-de-commande, texte]
created: 2026-09-02
updated: 2026-09-02
status: stable
---

## En bref

Remplacer, supprimer, insérer, extraire un bloc. Pour `sed`, une ligne est une
**chaîne de caractères** — dès qu'on pense « colonne 3 » ou « somme », c'est
[awk](awk.md) qu'il faut.

## Substituer

```sh
sed 's/ancien/nouveau/' f          # 1re occurrence de chaque ligne
sed 's/ancien/nouveau/g' f         # toutes les occurrences
sed -i.bak 's/a/b/g' f             # en place, en gardant f.bak
sed 's#/usr/local#/opt#g' f        # autre delimiteur : plus de \/ a echapper
sed -E 's/([0-9]+)-([0-9]+)/\2-\1/' f   # regex etendue et groupes de capture
sed '/motif/s/a/b/' f              # substituer seulement sur les lignes qui matchent
sed 's/^/# /' f                    # commenter toutes les lignes
sed 's/[[:space:]]*$//' f          # supprimer les espaces en fin de ligne
```

Le délimiteur du `s///` est libre : `s#...#...#`, `s|...|...|`, `s,...,...,`.
Dès qu'un chemin apparaît dans le motif, en changer rend la commande lisible.

## Sélectionner des lignes

```sh
sed -n '10,20p' f                  # lignes 10 a 20 (-n : n'affiche que ce qu'on demande)
sed -n '$p' f                      # la derniere ligne
sed -n '/debut/,/fin/p' f          # le bloc entre deux motifs
sed -n 's/^Version: //p' f         # extraire une valeur : -n + p = seulement ce qui matche
sed -n '120,175p;175q' f | nl -ba -v120
```

Ce dernier mérite l'explication : `175q` arrête `sed` à la ligne 175 au lieu de
lire tout le fichier — décisif sur un dump de plusieurs Go. `nl -ba -v120`
renumérote la sortie **comme dans le fichier d'origine** (`-ba` numérote aussi
les lignes vides, `-v` fixe le départ), ce qui permet de recoller un message
d'erreur qui parle de la ligne 143.

## Supprimer et insérer

```sh
sed '/^#/d ; /^$/d' f              # enlever commentaires et lignes vides
sed '1d' f                         # supprimer l'entete
sed '$d' f                         # supprimer la derniere ligne
sed '3i\ligne' f                   # inserer avant la ligne 3
sed '3a\ligne' f                   # inserer apres la ligne 3
sed 's/.*/\U&/' f                  # tout en majuscules (GNU sed uniquement)
```

## Nettoyer un fichier en le lisant

`sed` est fait pour être au milieu d'un tuyau : pas de fichier intermédiaire,
pas de second passage.

```sh
sed 's/DEFINER=[^ ]*//g' dump.sql | mysql -u app -p ma_base
```

C'est le cas d'usage détaillé dans [MySQL : dumps et
imports](../base-de-donnees/mysql-dumps.md).

## Pièges

- **Toujours essayer sans `-i` d'abord.** `sed -i` réécrit le fichier sans
  demander et sans historique. `-i.bak` garde une copie ; c'est le minimum sur
  un fichier qui n'est pas versionné.
- **`-i` seul n'existe pas sur macOS/BSD** : il y attend un suffixe
  (`sed -i '' 's/a/b/'`). Un script qui marche sur Debian casse sur un Mac, et
  inversement.
- `\U`, `\L`, `\1` en dehors de `-E`, `-i` sans suffixe : ce sont des extensions
  **GNU**. Pour du portable, s'en tenir à `s///`, `d`, `p` et `-n`.
- Sans `-n`, `p` affiche la ligne **deux fois** : une fois par le comportement
  par défaut, une fois par le `p`.
- `sed` travaille ligne à ligne : un motif à cheval sur deux lignes ne matchera
  jamais. C'est le moment de passer à `perl -0777 -pe` ou à Python.
- `&` dans le remplacement veut dire « tout ce qui a matché ». Pour un `&`
  littéral, l'échapper : `\&`.

## Voir aussi

- [sed ou awk : lequel choisir](sed-ou-awk.md)
- [awk : colonnes, filtres et calculs](awk.md)
- [MySQL : dumps et imports](../base-de-donnees/mysql-dumps.md)
- <https://www.gnu.org/software/sed/manual/sed.html>
