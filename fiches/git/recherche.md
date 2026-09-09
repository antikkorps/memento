---
title: "Git : chercher dans le code et l'historique"
tags: [git, texte]
created: 2026-09-09
updated: 2026-09-09
status: brouillon
---

## En bref

Deux recherches très différentes : `git grep` fouille le code **tel qu'il est
maintenant** (bien plus vite que `grep -r`, car limité aux fichiers suivis), et
la « pioche » (*pickaxe*) `git log -S` / `-G` fouille **l'historique** — quand
une ligne est-elle apparue, quel commit l'a supprimée.

## Chercher dans le code (git grep)

```sh
git grep "TODO"                   # dans tous les fichiers suivis, recursif par defaut
git grep -n "TODO"                # avec numeros de ligne
git grep -i "todo"                # insensible a la casse
git grep -l "TODO"                # seulement les noms de fichiers qui matchent
git grep -c "TODO"                # le nombre d'occurrences par fichier
git grep "foo" a1b2c3d           # dans un commit ou une branche precise, pas le disque
git grep -e foo --and -e bar      # les deux motifs sur la MEME ligne
```

## Chercher dans l'historique (pickaxe)

```sh
git log -S "connectDB"            # commits qui AJOUTENT ou RETIRENT cette chaine
git log -S "connectDB" -p         # ... en montrant le diff de chacun
git log -G "regex.*ici"           # commits dont le diff CONTIENT ce motif (regex)
git log --grep "correctif"        # commits dont le MESSAGE contient ce mot
git log -p -- chemin/fichier      # tout l'historique d'un fichier, diffs compris
git log -L :maFonction:fichier.js # l'evolution d'une fonction, commit par commit
```

## Détails

- `-S` compte les **occurrences** : il ne remonte que les commits où le *nombre*
  d'apparitions de la chaîne change. Idéal pour « quand cette fonction a-t-elle
  été introduite / retirée ».
- `-G` matche le **texte du diff** : il remonte tout commit dont le diff contient
  le motif, même si le nombre d'occurrences ne bouge pas (une ligne modifiée qui
  contient la chaîne des deux côtés).
- `git grep` accepte un *treeish* (`git grep motif HEAD~5`) : chercher dans le
  passé sans faire de checkout.

## Pièges

- **`git grep` ne voit que les fichiers suivis.** Un fichier non ajouté
  (*untracked*) est invisible, là où `grep -r` le trouverait. C'est un avantage
  (pas de bruit du `node_modules/` ignoré) mais une surprise si on cherche un
  fichier fraîchement créé.
- **`-S` n'est pas une recherche de sous-chaîne classique.** Une ligne modifiée
  qui garde le même nombre d'occurrences du motif n'apparaît pas : c'est `-G`
  qu'il faut alors.
- **`--grep` cherche dans les messages, pas dans le code.** Confondre `-S`
  (contenu) et `--grep` (message de commit) fait chercher au mauvais endroit.
- Pour une vraie regex avec `git grep`, ajouter `-E` (comme `grep -E`) ; par
  défaut c'est une regex basique.

## Voir aussi

- [grep : filtrer des lignes](../shell/grep.md)
- [Git : voir l'historique et l'arbre des commits](historique.md)
- [Git : bisect, trouver le commit fautif par dichotomie](bisect.md)
- <https://git-scm.com/docs/git-grep>
