---
title: "Git : diff, comparer les changements"
tags: [git, texte]
created: 2026-09-09
updated: 2026-09-09
status: brouillon
---

## En bref

`git diff` compare deux états. Le piège de départ est de croire qu'il montre
« tout ce qui a changé » : par défaut il ne montre que ce qui n'est **pas encore
indexé** (*staged*). Une fois `git add` passé, il faut `--staged` pour revoir ce
qu'on s'apprête à committer.

## Commandes

```sh
git diff                          # arbre de travail vs index : le NON encore add
git diff --staged                 # index vs dernier commit : ce qui SERA committe (= --cached)
git diff HEAD                     # tout ce qui a change depuis le dernier commit (staged + non)
git diff a1b2c3d b4e5f6a         # entre deux commits
git diff main feature             # entre deux branches (leurs sommets)
git diff main...feature           # depuis leur ancetre commun (voir Pieges)
git diff -- chemin/fichier        # limiter a un fichier ou un dossier
```

Vues résumées, sans le détail ligne à ligne :

```sh
git diff --stat                   # un resume par fichier (+/- de lignes)
git diff --name-only              # juste les noms des fichiers modifies
git diff --name-status            # les noms, prefixes de M/A/D (modifie/ajoute/supprime)
git diff --word-diff              # diff mot a mot, lisible pour de la prose
```

## Pièges

- **Après `git add`, `git diff` semble vide.** Le changement est passé dans
  l'index : il est maintenant sous `git diff --staged`. C'est la confusion la
  plus fréquente. `git diff HEAD` montre les deux d'un coup.
- **`..` et `...` ne veulent pas dire la même chose que dans `git log`.** En
  `diff`, `A..B` (ou `A B`) compare les deux **sommets** ; `A...B` compare `B` à
  l'**ancêtre commun** — c'est ce dernier qui répond à « qu'ai-je ajouté sur ma
  branche depuis que je l'ai créée », donc celui d'une revue de PR.
- **`git diff` ne diffe pas les fichiers non suivis.** Un fichier jamais ajouté
  n'a aucune version de référence : il n'apparaît pas. `git add -N fichier` le
  déclare (*intent-to-add*) pour le voir apparaître dans le diff.
- **Les fichiers binaires** ne se diffent pas ligne à ligne : git affiche
  seulement « Binary files differ », sauf configuration d'un *textconv*.

## Voir aussi

- [Git : voir l'historique et l'arbre des commits](historique.md)
- [Git : chercher dans le code et l'historique](recherche.md)
- <https://git-scm.com/docs/git-diff>
