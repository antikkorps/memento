---
title: "Git : voir l'historique et l'arbre des commits"
tags: [git, terminal]
created: 2026-09-09
updated: 2026-09-09
status: brouillon
---

## En bref

La commande de l'arbre (*graph*), celle qu'on cherche toujours et qu'on
n'utilise pas assez pour la retenir :

```sh
git log --graph --oneline --all --decorate    # l'arbre complet, branches et tags nommes
```

À transformer en alias tout de suite, sinon on ne la retape jamais :

```sh
git config --global alias.tree "log --graph --oneline --all --decorate"
git tree                          # desormais, l'arbre en trois lettres
```

## Parcourir l'historique

```sh
git log --oneline -10             # les 10 derniers, une ligne chacun
git log --graph --oneline         # l'arbre de la branche COURANTE seulement (sans --all)
git show a1b2c3d                  # un commit en detail : message + diff
git show a1b2c3d --stat           # ... juste les fichiers touches
git log -p -- chemin/fichier      # l'historique d'un fichier, avec les diffs
```

## Filtrer

```sh
git log --author="johndoe"        # par auteur
git log --since="2 weeks ago"     # depuis une date (--until pour borner l'autre cote)
git log --grep="correctif"        # par mot dans le message de commit
git log main..feature             # les commits de feature PAS encore dans main
git log --oneline --no-merges     # masquer les commits de fusion
```

## Détails

- **`--all` change tout.** Sans lui, `--graph` ne montre que la branche courante
  et ses ancêtres — donc pas les autres branches, ce qui donne un « arbre » en
  ligne droite trompeur. C'est `--all` qui affiche les embranchements réels.
- **`--decorate`** ajoute les noms de branches et de tags en face des commits ;
  souvent actif par défaut sur les git récents, mais l'écrire ne coûte rien.
- `A..B` (deux points) en `log` liste les commits de `B` absents de `A` — pour
  « qu'y a-t-il sur cette branche que main n'a pas ». À ne pas confondre avec le
  `A...B` de `git diff` (voir la fiche diff).

## Pièges

- **`--graph` sans `--all` ment par omission.** On croit voir tout le dépôt, on
  ne voit qu'une branche. Le réflexe « pourquoi mon arbre est plat » vient
  presque toujours de l'oubli de `--all`.
- **Sur un gros dépôt, `git log --all` est long à défiler.** Borner avec `-20`
  ou une date : `git log --graph --oneline --all -30`.
- `git show` sans argument montre `HEAD` : pratique pour revoir ce qu'on vient de
  committer avant de pousser.

## Voir aussi

- [Git : diff, comparer les changements](diff.md)
- [Git : chercher dans le code et l'historique](recherche.md)
- [Git : revert, annuler un commit publié](revert.md)
- <https://git-scm.com/docs/git-log>
