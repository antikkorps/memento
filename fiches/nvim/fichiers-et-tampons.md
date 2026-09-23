---
title: "Neovim : ouvrir, recharger, circuler entre les fichiers"
tags: [editeur, terminal]
created: 2026-09-23
updated: 2026-09-23
status: stable
---

## En bref

Quatre réflexes couvrent 90 % des allers-retours entre fichiers. Le plus
précieux n'est pas d'ouvrir, c'est de **recharger** : dès qu'un outil extérieur
touche au fichier (un script, une mise en forme, un agent), le fichier ouvert
(*buffer*) affiche encore l'ancienne version, et le prochain `:w` écrase tout.

| Frappe | Quand |
| --- | --- |
| `:e` | recharger le fichier courant depuis le disque |
| `<leader>sf` | ouvrir un fichier qu'on cherche par son nom |
| `<leader><leader>` | revenir à un fichier déjà ouvert |
| `Ctrl-^` | aller-retour avec le fichier précédent |

## Ouvrir

`:e` est l'abréviation de `:edit`. Tab complète les chemins.

| Frappe | Effet |
| --- | --- |
| `:e src/fill.rs` | ouvre ce fichier à la place de l'actuel |
| `:e` | recharge le fichier courant (voir plus bas) |
| `:e!` | recharge en **jetant** les modifications non enregistrées |
| `:e %:h/autre.rs` | `%` = fichier courant, `%:h` = son dossier |
| `:e #` | le fichier précédent, comme `Ctrl-^` |
| `:ene` | un tampon vide, sans nom |

Les deux raccourcis de kickstart font le même travail plus vite quand on ne
connaît pas le chemin par cœur : `<leader>sf` cherche un fichier par son nom,
`<leader>s.` liste les fichiers récents.

`:e` garde deux usages irremplaçables : recharger, et le cas « je connais le
chemin exact et je tape plus vite que je ne cherche ».

## Recharger quand un outil extérieur a modifié le fichier

Le cas courant : le fichier est ouvert dans nvim, et un script, un formateur ou
un agent le réécrit depuis le terminal.

| Frappe | Effet |
| --- | --- |
| `:e` | relit le fichier depuis le disque |
| `:checktime` | vérifie si le fichier a changé, et recharge si l'option `autoread` est active |
| `:e!` | relit **en abandonnant** les modifications du tampon |

`autoread` est active par défaut dans Neovim : le fichier est rechargé tout
seul, **mais seulement quand nvim s'en aperçoit** — en entrant dans le tampon,
après une commande shell. Dans un terminal, tant que le curseur reste dans le
même fichier, rien ne se passe. D'où le réflexe : `:e` avant de reprendre
l'édition d'un fichier qu'un autre outil a pu toucher.

## Circuler entre les fichiers ouverts (*buffers*)

Un fichier ouvert reste chargé en mémoire même quand on ne le voit plus :
c'est un **tampon** (*buffer*). L'option `hidden` étant active par défaut, il
survit à la fermeture de sa fenêtre, modifications comprises.

| Frappe | Effet |
| --- | --- |
| `:ls` | lister les tampons (`%a` = affiché, `+` = modifié) |
| `:b fill` | aller au tampon dont le nom contient `fill` |
| `:bn` / `:bp` | tampon suivant / précédent |
| `Ctrl-^` | bascule avec le tampon précédent — aller-retour instantané |
| `<leader><leader>` | la même liste, en fuzzy (kickstart) |
| `:bd` | fermer le tampon (*buffer delete*) |

## Ouvrir deux fichiers côte à côte (*split*)

| Frappe | Effet |
| --- | --- |
| `:vs autre.rs` | ouvre en fenêtre verticale (côte à côte) |
| `:sp autre.rs` | en fenêtre horizontale (l'une au-dessus de l'autre) |
| `Ctrl-h` `Ctrl-j` `Ctrl-k` `Ctrl-l` | passer d'une fenêtre à l'autre (kickstart) |
| `Ctrl-w q` | fermer la fenêtre courante |
| `Ctrl-w o` | ne garder que la fenêtre courante (*only*) |

## Pièges

- **`:e` refuse de recharger si le tampon est modifié** — `E37: No write since
  last change`. C'est une protection, pas un bug : soit `:w` pour garder ton
  travail, soit `:e!` pour le jeter. Il n'y a pas de troisième porte.
- **Tampon, fenêtre et onglet sont trois choses différentes.** `:q` ferme la
  *fenêtre*, pas le tampon — qui reste chargé et réapparaît dans `:ls`. Pour
  fermer vraiment un fichier, c'est `:bd`.
- **`:bd` sur un tampon modifié refuse aussi**, même message. `:bd!` jette.
- **Un fichier ouvert dans deux nvim en même temps** produit un `.swp` et
  l'avertissement `E325: ATTENTION`. Répondre `(R)ecover` seulement si on sait
  que l'autre session a planté ; sinon `(Q)uit`, et fermer l'autre session.
- **`autoread` ne prévient pas quand le fichier a changé ET le tampon aussi** :
  là nvim demande explicitement quoi faire (`W12`). C'est exactement la
  situation qu'on veut éviter en rechargeant avant d'éditer.

## Voir aussi

- [Copier une commande vers le presse-papiers](presse-papiers.md) — l'autre
  moitié du flux `m find` → éditeur → terminal.
- [Installation de Neovim](installation.md)
