---
title: "Git : revert, annuler un commit publié"
tags: [git, procedure]
created: 2026-09-09
updated: 2026-09-09
status: brouillon
---

## En bref

`git revert` annule un commit en en créant **un nouveau, inverse** — il ne
réécrit pas l'historique. C'est l'annulation sûre : on peut la pousser sans
casser le dépôt des autres, contrairement à `git reset` qui, lui, récrit et n'est
acceptable que sur du travail **non encore poussé**.

## Commandes

```sh
git revert a1b2c3d                # cree un commit qui defait exactement a1b2c3d
git revert HEAD                    # annule le dernier commit
git revert HEAD~2                  # annule l'avant-avant-dernier (les autres restent)
git revert -n a1b2c3d             # prepare l'annulation SANS committer (--no-commit)
```

```sh
git revert --continue             # apres avoir resolu un conflit et git add
git revert --abort                # tout annuler, revenir a l'etat d'avant
```

## revert vs reset

| | `git revert` | `git reset` |
| --- | --- | --- |
| Effet | ajoute un commit inverse | efface des commits |
| Historique | conservé, traçable | réécrit |
| Déjà poussé ? | **oui, sans danger** | non, jamais |

Règle : dès qu'un commit est parti sur le remote, c'est `revert`. `reset` reste
pour rattraper un commit local qu'on n'a pas encore partagé.

## Pièges

- **Annuler un merge exige `-m`.** Un commit de fusion a deux parents ; git ne
  sait pas lequel garder. `git revert -m 1 a1b2c3d` garde le **premier** parent
  (la branche sur laquelle on avait fusionné). Sans `-m`, git refuse.
- **Ré-annuler pour ré-appliquer.** Après un `revert` d'un merge, refusionner la
  branche ne rejoue rien (git la croit déjà fusionnée). Il faut alors
  `revert` le revert. C'est déroutant mais logique : chaque revert est un commit
  comme un autre.
- **`revert` ne touche qu'à un commit à la fois** (ou une liste explicite). Pour
  défaire « les trois derniers », les trois hashs, ou une plage `HEAD~3..HEAD`.
- **Ce n'est pas `git restore`.** `restore` remet un *fichier* dans un état
  passé sans créer de commit ; `revert` annule un *commit* entier.

## Voir aussi

- [Git : cherry-pick, rejouer un commit précis](cherry-pick.md)
- [Git : voir l'historique et l'arbre des commits](historique.md)
- <https://git-scm.com/docs/git-revert>
