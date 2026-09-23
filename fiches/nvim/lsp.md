---
title: "Neovim : naviguer, renommer et lire les erreurs avec le LSP"
tags: [editeur, rust]
created: 2026-09-23
updated: 2026-09-23
status: stable
---

## En bref

Le serveur de langage (*language server*) transforme l'éditeur : il comprend le
code au lieu de le colorer. Quatre réflexes couvrent l'essentiel — **`grd`**
aller à la définition, **`grn`** renommer partout, **`gra`** appliquer une
correction proposée, **`K`** lire la doc sous le curseur.

Sans serveur attaché, rien de tout ça ne marche : `:checkhealth vim.lsp` dit qui
tourne réellement sur le tampon courant.

## Naviguer

| Frappe | Effet |
| --- | --- |
| `grd` | aller à la **définition** du symbole sous le curseur |
| `grr` | lister toutes les **références** |
| `gri` | les **implémentations** |
| `grt` | la définition du **type** |
| `gO` | les symboles du fichier (plan du document) |
| `K` | la documentation, en fenêtre flottante |
| `Ctrl-o` | revenir d'où l'on vient après un saut |

## Corriger

| Frappe | Effet |
| --- | --- |
| `grn` | **renommer** le symbole partout dans le projet |
| `gra` | **actions de code** : corrections proposées par le serveur |
| `]d` / `[d` | diagnostic suivant / précédent |
| `<leader>sd` | tous les diagnostics du projet, en fuzzy |
| `<leader>th` | affiche les types inférés en gris (*inlay hints*) |

`<leader>th` est le meilleur professeur quand on apprend un langage à inférence
de types : il montre ce que le compilateur a déduit, là où le code ne l'écrit
pas.

## Rust : lire vraiment le message du compilateur

Avec [rustaceanvim](https://github.com/mrcjkb/rustaceanvim), qui enveloppe
`rust-analyzer` :

| Frappe | Effet |
| --- | --- |
| `<leader>rd` | le message **rustc complet** du diagnostic |
| `<leader>re` | l'explication de l'erreur, façon `rustc --explain E0382` |
| `<leader>rr` | lancer le **test sous le curseur** |

Le premier est le plus précieux. Dans le tampon, une erreur d'emprunt se résume
à une ligne tronquée ; le message complet de rustc montre les deux flèches
(« first borrow occurs here », « second mutable borrow ») et le `help:` — c'est
justement la partie qui explique.

## Pièges

- **`grn` renomme, il ne re-cible pas.** Il est exactement aussi juste que la
  résolution de noms au moment où on l'invoque. Si un élément local masque un
  import global (un test nommé comme la fonction qu'il teste, avec un
  `use super::*`), les appels pointent déjà sur le mauvais élément : le
  renommage propage la faute, proprement et partout.
- **`grn` ne touche qu'au code.** Un nom cité dans un commentaire ou une chaîne
  de caractères reste à corriger à la main.
- **Deux serveurs attachés au même tampon** produisent des diagnostics et des
  actions en double. Cas typique : un plugin qui configure le serveur lui-même
  (rustaceanvim) *et* une déclaration du même serveur dans la config.
  `:checkhealth vim.lsp` les liste.
- **Les `help:` du compilateur ne sont pas des ordres.** rustc suggère parfois
  sur la seule ressemblance des noms (`O` → `Ok`). La ligne à croire est
  `error:` ; les suggestions s'évaluent.

## Voir aussi

- [Annuler, couper, coller, déplacer](annuler-couper-deplacer.md)
- [str, &str et String](../rust/chaines.md)
