---
title: "Neovim : annuler, couper, coller, déplacer"
tags: [editeur, terminal]
created: 2026-09-23
updated: 2026-09-23
status: stable
---

## En bref

Deux idées suffisent à débloquer 90 % des situations : **`u` annule** (et
`Ctrl-r` refait), et **`d` ne supprime pas, il coupe** — ce qu'on efface part
dans un registre et se recolle avec `p`. Il n'existe pas de commande « couper »
séparée, c'est `d`.

| Frappe | Quand |
| --- | --- |
| `u` | annuler la dernière modification |
| `Ctrl-r` | refaire (*redo*) |
| `dd` puis `p` | déplacer une ligne ailleurs |
| `"0p` | recoller la dernière **copie**, même après des `dd` |

## Annuler

| Frappe | Effet |
| --- | --- |
| `u` | annule la dernière modification |
| `Ctrl-r` | refait ce que `u` vient d'annuler |
| `3u` | annule trois fois |
| `U` | annule **toutes** les modifications de la ligne courante |
| `:earlier 1f` | revient à l'état **sauvegardé** précédent (`f` = file) |
| `:earlier 5m` | l'état d'il y a cinq minutes (`10s`, `2h` marchent aussi) |
| `:later 30s` | dans l'autre sens |
| `g-` / `g+` | circule dans l'arbre d'annulation, branches abandonnées comprises |

Une **saisie** = tout ce qui a été tapé entre `i` et `Échap`. Un seul `u` efface
donc le paragraphe entier qu'on vient d'écrire, pas le dernier caractère : pour
annuler plus finement, il faut repasser en mode normal plus souvent.

`:earlier 1f` raisonne en `:w` plutôt qu'en frappes — c'est le bon outil quand
on a saccagé une fonction et qu'on veut juste revenir à la dernière version qui
compilait.

Avec `undofile` activé (`vim.o.undofile = true`, la valeur de kickstart),
**l'historique d'annulation survit à la fermeture du fichier** : on peut fermer
nvim, revenir le lendemain, et `u` remonte encore.

## Couper, copier, coller

Le point qui manque quand on vient d'ailleurs : **`d` est le couper**, pas une
suppression définitive.

| Frappe | Effet |
| --- | --- |
| `yy` | copier la ligne (*yank*) |
| `dd` | **couper** la ligne |
| `3dd` | couper trois lignes |
| `D` | couper du curseur à la fin de la ligne |
| `x` | couper le caractère sous le curseur |
| `V` `j` `d` | sélectionner plusieurs lignes, puis couper |
| `p` | coller après (en dessous, pour une ligne) |
| `P` | coller avant (au-dessus) |

## Déplacer une ligne

| Frappe | Effet |
| --- | --- |
| `dd` `p` | couper, aller ailleurs, coller — le cas général |
| `ddp` | échange la ligne courante avec celle du dessous |
| `:m+1` | descend la ligne d'un cran, sans passer par un registre |
| `:m-2` | la remonte d'un cran |
| `:m0` | l'envoie tout en haut du fichier |
| `:'<,'>m'>+1` | descend toute une sélection visuelle |

`:m` (*move*) ne touche à aucun registre : le presse-papiers reste intact, ce
qui évite le piège de la section suivante.

## Les registres, et le piège classique

`y` et `d` écrivent dans **le même** registre par défaut. Conséquence : un `dd`
fait après un `yy` écrase ce qu'on croyait avoir copié.

| Registre | Contenu |
| --- | --- |
| `""` | le registre par défaut, écrit par `y` **et** par `d` |
| `"0` | la dernière **copie** (`y`), jamais touchée par les `d` |
| `"1` à `"9` | les dernières **coupes**, de la plus récente à la plus ancienne |
| `"+` | le presse-papiers système |

Donc : `"0p` colle la dernière copie en ignorant tous les `dd` intermédiaires.
C'est la commande à connaître le jour où l'on se dit « mais j'avais copié ça ! ».

`:reg` affiche le contenu de tous les registres.

## Pièges

- **`dd` n'est pas une suppression** : tout ce qu'on « efface » reste
  récupérable, soit par `u`, soit par `p`.
- **`dd` écrase le `yy` précédent.** La parade est `"0p`, pas un nouveau `yy`.
- **`u` annule toute une saisie d'insertion**, pas un caractère.
- **`%` saute à l'accolade jumelle** : le meilleur moyen de trouver quelle
  accolade n'est pas fermée quand le compilateur se plaint d'un délimiteur.

## Voir aussi

- [Ouvrir, recharger, circuler entre les fichiers](fichiers-et-tampons.md)
- [Copier une commande vers le presse-papiers](presse-papiers.md) — le registre
  `"+` et le flux vers le terminal.
