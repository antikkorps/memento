---
title: "Git : bisect, trouver le commit fautif par dichotomie"
tags: [git, depannage]
created: 2026-09-09
updated: 2026-09-09
status: brouillon
---

## En bref

Un bug est apparu, on ne sait pas quand : `git bisect` fait une recherche par
dichotomie (*binary search*) dans l'historique. On marque un commit sûr et un
commit cassé, git propose le commit du milieu à tester, et recommence — en
`log₂(n)` essais au lieu de tous les parcourir.

## Commandes

```sh
git bisect start                  # demarre la session
git bisect bad                    # le commit actuel (HEAD) est casse
git bisect good v1.2.0            # ce commit-la, lui, etait bon
                                  # git checkout alors un commit du milieu
```

À chaque commit proposé, on teste, puis on répond :

```sh
git bisect good                   # ce commit-ci est bon -> le bug est APRES
git bisect bad                    # ce commit-ci est casse -> le bug est AVANT ou ICI
git bisect skip                   # impossible a tester (ne compile pas) : git en propose un autre
git bisect reset                  # termine : revient sur la branche de depart
```

À la fin, git nomme le **premier commit mauvais**.

## Automatiser avec un script

```sh
git bisect start HEAD v1.2.0      # bad (HEAD) puis good (v1.2.0) en une ligne
git bisect run ./test.sh          # git rejoue tout seul jusqu'au coupable
git bisect run npm test           # ou directement la commande de test
```

`git bisect run` lit le **code de sortie** du script à chaque étape :

| Code de sortie | Sens pour bisect |
| --- | --- |
| `0` | commit **bon** |
| `1`–`127` sauf `125` | commit **mauvais** |
| `125` | commit **intestable**, équivaut à `git bisect skip` |

## Pièges

- **Sans `git bisect reset`, on reste sur un commit détaché** (*detached HEAD*),
  en plein milieu de l'historique. C'est la première source de confusion : après
  un bisect, toujours `reset` pour retrouver sa branche.
- **`good` et `bad` ne sont pas interchangeables.** `bad` = « le bug est là » ;
  `good` = « le bug n'y est pas encore ». Les inverser désigne le mauvais commit
  sans erreur visible.
- **Le test doit être fiable et reproductible.** Un bug intermittent fait
  répondre `good` à un commit cassé, et bisect converge sur un innocent.
- **`git bisect run` réserve `125` au « skip ».** Un script qui renvoie `125`
  pour dire « échec » fait sauter le commit au lieu de le marquer mauvais.
- `git bisect log` enregistre la session ; `git bisect replay fichier` la
  rejoue — utile pour reprendre après s'être trompé de réponse.

## Voir aussi

- [Git : chercher dans le code et l'historique](recherche.md)
- [Git : voir l'historique et l'arbre des commits](historique.md)
- <https://git-scm.com/docs/git-bisect>
