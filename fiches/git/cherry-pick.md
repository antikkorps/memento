---
title: "Git : cherry-pick, rejouer un commit précis"
tags: [git, procedure]
created: 2026-09-09
updated: 2026-09-09
status: brouillon
---

## En bref

`git cherry-pick` prend **un commit existant** et le rejoue sur la branche
courante. Le cas type : un correctif fait sur `main` qu'on veut aussi sur une
branche de maintenance, sans fusionner tout le reste.

## Commandes

```sh
git cherry-pick a1b2c3d           # rejoue ce commit sur la branche courante
git cherry-pick a1b2c3d f6e5d4c   # plusieurs commits, dans cet ordre
git cherry-pick a1b2c3d^..f6e5d4c # une plage, a1b2c3d INCLUS (voir Pieges pour le ^)
git cherry-pick -n a1b2c3d        # applique les changements SANS committer (--no-commit)
git cherry-pick -x a1b2c3d        # ajoute "(cherry picked from commit ...)" au message
```

En cas de conflit :

```sh
git cherry-pick --continue        # apres avoir resolu et git add
git cherry-pick --abort           # tout annuler, revenir a l'etat d'avant
git cherry-pick --skip            # abandonner CE commit, passer au suivant (dans une plage)
```

## Pièges

- **Un cherry-pick crée un NOUVEAU commit, avec un hash différent.** Le contenu
  est le même, l'identité non. Si la branche source est ensuite fusionnée, le
  même changement peut apparaître deux fois — git le gère souvent, mais pas
  toujours proprement. Pour un simple report de correctif, c'est sans
  conséquence ; pour du long terme, un vrai `merge` est préférable.
- **La plage `A..B` EXCLUT `A`.** `git cherry-pick v1..v2` ne rejoue pas `v1`
  lui-même. Pour l'inclure : `A^..B` (à partir du parent de A). C'est l'erreur
  la plus courante, et rien ne la signale.
- **`-x` n'est utile que sur des commits publics.** La ligne « cherry picked
  from » pointe vers un hash ; si le commit source n'existe que dans un dépôt
  local, la référence ne mène nulle part pour les autres.
- **Cherry-pick ne déplace pas, il copie.** Le commit d'origine reste où il est.
  Pour vraiment déplacer un commit, c'est un rebase.

## Voir aussi

- [Git : revert, annuler un commit publié](revert.md)
- [Git : nettoyer les branches et lire git branch -vv](branches.md)
- <https://git-scm.com/docs/git-cherry-pick>
