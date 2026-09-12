---
title: "Git : nettoyer les branches et lire git branch -vv"
tags: [git, procedure]
created: 2026-09-09
updated: 2026-09-09
status: brouillon
---

## En bref

Après quelques merges de branches distantes, `git branch` et `git branch -a` se
remplissent de bruit : des références de suivi (*remote-tracking*) vers des
branches qui n'existent plus, et des branches locales devenues orphelines. Deux
opérations distinctes pour faire le ménage — et il faut les deux, `prune` seul ne
suffit pas.

## Commandes

```sh
git fetch --prune                 # fetch + supprime les origin/* disparues du remote
git fetch -p                      # idem, forme courte
git remote prune origin           # nettoie origin/* SANS fetcher
git remote prune --dry-run origin # montre ce qui serait supprime, ne touche a rien
git config --global fetch.prune true   # tout fetch (donc tout pull) prune desormais
```

```sh
git branch -vv                    # branches locales + leur suivi + avance/retard
git branch -a                     # locales ET distantes (origin/*)
git branch --merged main          # celles deja fusionnees dans main : sures a supprimer
git branch --no-merged main       # celles qui portent encore du travail non fusionne
```

```sh
git branch -d nom-de-branche      # supprime une branche locale fusionnee (refus sinon)
git branch -D nom-de-branche      # force, meme non fusionnee : le travail est perdu
```

## Lire `git branch -vv`

```text
* main            a1b2c3d [origin/main] dernier sujet de commit
  feature/login   d4e5f6a [origin/feature/login: ahead 2] wip
  vieille-branche 7890abc [origin/vieille-branche: gone] ...
```

- La colonne entre crochets est la branche **suivie** (*upstream*).
- `ahead 2` / `behind 3` : nombre de commits d'avance / de retard sur elle.
- **`: gone]`** : l'upstream a été supprimé côté remote (souvent après merge de la
  PR) — c'est *exactement* le bruit à nettoyer. `prune` ne les enlève pas : il
  n'agit que sur `origin/*`, pas sur la branche locale.

## Supprimer les branches locales dont l'upstream a disparu

`prune` retire les `origin/*` fantômes ; les branches locales `: gone]`, elles,
restent jusqu'à suppression manuelle.

```sh
git fetch -p                      # d'abord actualiser l'etat des origin/*
git branch -vv | grep ': gone]'   # verifier CE QUI sera vise, toujours, avant de supprimer
```

```sh
git branch -vv | grep ': gone]' | grep -v '^\*' | awk '{print $1}' | xargs -r git branch -D
```

Ligne à ligne : les branches à upstream disparu, `grep -v '^\*'` écarte la
branche courante, `awk` ne garde que le nom, `xargs` supprime. Le `-D` force :
une branche `: gone]` n'est plus « fusionnée » aux yeux de git même si sa PR l'a
été, donc `-d` la refuserait.

## Détails

- `git remote prune origin` et `git fetch --prune` font la même chose sur
  `origin/*` ; le second fetch d'abord, c'est celui du quotidien.
- `git gc --prune=now` n'a **rien à voir** : il compacte la base d'objets et
  supprime les objets inatteignables. Rien avec les branches. Ne pas confondre
  les deux `prune`.
- Pour ne pas voir `origin/HEAD -> origin/main` traîner dans `git branch -a`
  après un changement de branche par défaut : `git remote set-head origin -a`.

## Pièges

- **`git create-branch` n'existe pas**, et `git branch` tout court **liste**, il
  ne nettoie pas. Le ménage des références passe par `fetch --prune` /
  `remote prune`, jamais par une sous-commande `branch`.
- **`prune` ne touche pas aux branches locales.** C'est la confusion centrale :
  il nettoie `origin/vieille-branche`, pas la locale `vieille-branche`. D'où
  l'étape `git branch -vv | grep ': gone]'` en plus.
- **`-D` détruit sans filet.** Sur une branche jamais poussée, le travail est
  irrécupérable (sauf `git reflog`, et pas éternellement). Toujours lancer le
  `grep ': gone]'` seul d'abord pour voir la liste, avant d'y ajouter le `xargs`.
- **`--merged` sans argument compare à la branche courante**, pas à `main`. Si tu
  n'es pas sur `main`, `git branch --merged` répond à côté : préciser
  `git branch --merged main`.
- **`xargs -r` est une extension GNU** (ne lance pas la commande si l'entrée est
  vide). Sous BSD/macOS, `-r` n'existe pas — mais `git branch -D` sans argument
  échoue proprement, sans rien détruire.
- **`fetch.prune true` est en général ce qu'on veut, mais il est global** : sur
  un dépôt où plusieurs personnes poussent des branches de travail, un `origin/*`
  qui disparaît le fait disparaître chez toi au prochain pull. C'est le
  comportement voulu ici, mais le savoir évite la surprise.

## Voir aussi

- [Remotes git et miroirs](remotes.md)
- <https://git-scm.com/docs/git-branch>
- <https://git-scm.com/docs/git-fetch#Documentation/git-fetch.txt---prune>
