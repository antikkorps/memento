---
title: "Neovim : copier une commande vers le presse-papiers"
tags: [editeur, terminal]
created: 2026-09-03
updated: 2026-09-03
status: stable
---

## En bref

Le flux complet : `m find` ouvre la fiche **sur la bonne ligne**, on attrape la
commande, on quitte, on colle dans le terminal. Trois touches, pas la souris.

## La boucle

```sh
m find "tuer un processus"     # fzf ; affiner en tapant `windows`
                               # Entree -> nvim s'ouvre A la ligne trouvee
```

Puis, dans nvim :

| Touche | Effet |
| --- | --- |
| `0y$` | copie la ligne **sans le retour à la ligne** — le cas courant ici |
| `yy` | copie la ligne entière, **retour à la ligne compris** |
| `yiw` | copie le mot sous le curseur (`taskkill`) |
| `yi"` | copie ce qu'il y a entre guillemets |
| `yi(` | idem entre parenthèses |
| `yip` | copie **tout le paragraphe** — donc tout un bloc de code |
| `y$` | du curseur à la fin de la ligne |
| `V` puis `j` puis `y` | sélection de plusieurs lignes |
| `Ctrl-V` puis `j` puis `y` | sélection **en colonne**, pour ne prendre que les commandes sans les commentaires alignés |
| `ZZ` | quitter (`ZQ` sans enregistrer) |

`yip` est le plus rentable ici : les blocs de code des fiches sont entourés de
lignes vides, donc curseur dedans + `yip` = tout le bloc dans le presse-papiers.

## Par où commencer

Le tableau ci-dessus est une référence, pas un programme. Tant qu'un geste n'est
pas automatique, **la souris est effectivement plus rapide** — et le rester
quelques jours est normal, pas un échec. Le seul moyen d'y arriver est d'en
ajouter **un seul à la fois**, jusqu'à ne plus y penser :

1. **`0y$` d'abord, et rien d'autre.** `m find` ouvre déjà sur la bonne
   ligne : dans neuf cas sur dix, il n'y a rien à viser, juste à copier. Le `0`
   ramène en début de ligne, le `y$` copie jusqu'au bout — et sans le retour à
   la ligne, donc la commande se colle dans le terminal **sans s'exécuter**.
2. **Puis `yip`**, quand `yy` ne demande plus de réflexion. Le curseur est
   dans un bloc de code, `yip` prend le bloc entier.
3. **Puis `/motif` et `n`**, pour arriver sur la ligne sans les flèches.

Trois gestes couvrent tout le flux. Le reste de cette fiche se lit le jour où
l'un des trois ne suffit pas.

Pour découvrir le reste sans l'apprendre par cœur, deux entrées complémentaires
de which-key, qui affiche l'aide dès la première touche :

```text
:WhichKey            toutes les combinaisons, par prefixe
:Telescope keymaps   la meme chose, mais cherchable au clavier
```

## Ça marche sans rien configurer

La configuration kickstart pose `vim.o.clipboard = 'unnamedplus'`
(`init.lua`, vers la ligne 125). Conséquence : **le registre par défaut *est* le
presse-papiers système.** Un `yy` simple suffit, pas besoin de `"+yy`.

Sur cette machine (WSL2 + WSLg), c'est `xclip` qui fait le pont vers le
presse-papiers Windows. Pour vérifier après une mise à jour :

```vim
:checkhealth vim.provider
:echo has('clipboard')          " doit renvoyer 1
```

## Aller vite dans la fiche

```text
/motif<Entree>   chercher ; n / N pour l'occurrence suivante / precedente
*                chercher le mot sous le curseur
}  {             sauter au paragraphe suivant / precedent (= bloc suivant)
gg  G            debut / fin du fichier
Ctrl-O           revenir ou on etait
:%y+             copier TOUTE la fiche
```

## Registres, quand le presse-papiers ne suffit plus

```text
"ayy             copier dans le registre a
"ap              coller le registre a
:reg             voir tous les registres
"0p              coller la DERNIERE copie (jamais une suppression)
"_dd             supprimer sans toucher au presse-papiers (registre « trou noir »)
```

## Coller dans le terminal

| Terminal | Coller |
| --- | --- |
| Windows Terminal | `Ctrl+Shift+V`, ou clic droit |
| WSL / Linux | `Ctrl+Shift+V`, ou clic milieu (sélection primaire) |
| Dans nvim | `p` après le curseur, `P` avant |

## Pièges

- **`d` et `x` écrasent le presse-papiers.** Avec `unnamedplus`, supprimer une
  ligne remplace ce qu'on venait de copier — on colle la mauvaise chose sans
  comprendre. Deux parades : `"0p` colle toujours la dernière **copie**, et
  `"_d` supprime dans le trou noir sans rien écraser.
- **Coller dans le terminal, ce n'est pas `Ctrl+V`.** Dans un terminal,
  `Ctrl+V` est une séquence de contrôle : il faut `Ctrl+Shift+V`.
- **`yy` copie aussi le retour à la ligne.** Collée dans un terminal, la
  commande **s'exécute immédiatement**, sans laisser le temps de la relire.
  `0y$` copie le même texte sans ce retour à la ligne : la commande s'affiche à
  l'invite et attend un `Entrée`. C'est la raison de le préférer ici, et elle
  vaut aussi pour tout ce qu'on copie depuis une page web.
- **`y$` seul part du curseur, pas du début de la ligne.** Après un `/motif` ou
  un déplacement, la colonne n'est plus 0 et la commande est tronquée par la
  gauche — sans que rien ne le signale. D'où le `0` devant.
- **which-key s'affiche dès `y`, ce n'est pas un menu qui attend un choix.**
  La configuration kickstart pose `delay = 0` (`init.lua`), donc l'aide
  surgit instantanément sur tous les opérateurs — `y`, `d`, `c`, `g`, `z`.
  Les enchaînements restent valides : taper le second `y` sans marquer de pause
  exécute bien `yy`. **Ce `delay = 0` est un choix, pas un défaut à corriger** :
  tant qu'on apprend, l'aide instantanée est la façon la plus rapide de
  découvrir les options d'un opérateur. Ne pas le passer à `400` par réflexe de
  confort — on y perd l'apprentissage.
- `y` copie sans sortir du mode normal : inutile d'entrer en visuel pour une
  ligne entière, `yy` suffit.
- **Sans provider, `unnamedplus` échoue en silence** : la copie reste interne à
  nvim et rien ne signale le problème. Sur une machine neuve, installer `xclip`
  (X11/WSLg), `wl-clipboard` (Wayland) ou `win32yank` (WSL sans WSLg), puis
  `:checkhealth vim.provider`.
- Un `Ctrl-V` en mode normal démarre une sélection en colonne — ce n'est pas un
  collage raté, c'est le mode bloc visuel.

## Voir aussi

- [Windows : lister et arrêter un processus](../windows/processus.md)
- [Linux : lister, inspecter et tuer un processus](../linux/processus.md)
