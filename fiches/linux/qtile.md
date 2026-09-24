---
title: "qtile : raccourcis, configuration Python et pièges AZERTY"
tags: [linux, bureau]
created: 2026-09-24
updated: 2026-09-24
status: brouillon
---

## En bref

qtile est un gestionnaire de fenêtres en pavage (*tiling window manager*) comme
i3, mais **sa configuration est un vrai programme Python** : raccourcis, bureaux,
dispositions et barre sont des objets Python dans `~/.config/qtile/config.py`.
On peut donc écrire des boucles, des conditions et des fonctions, là où i3 n'a
qu'une liste de `bindsym`.

Il tourne sous X11 ou sous Wayland. Cette fiche vise la session **X11**, celle
qu'on choisit à l'écran de connexion.

La touche mod (*modifier*) est déclarée en tête de la configuration :
`mod = "mod4"`, c'est-à-dire **Super** (touche Windows). Dans les tableaux,
`Mod` = cette touche.

Le réflexe du premier démarrage :

```text
Mod+Entrée      terminal
Mod+r           lancer une application (invite dans la barre)
Mod+Ctrl+r      recharger la configuration
Mod+Ctrl+q      quitter qtile
```

## Raccourcis par défaut

Ceux de la configuration fournie par le paquet, recopiée dans
`~/.config/qtile/config.py` au premier démarrage.

| Touches | Effet |
| --- | --- |
| `Mod+Entrée` | ouvre un terminal (le premier trouvé par `guess_terminal()`) |
| `Mod+r` | **invite de commande dans la barre** : taper le nom du programme, Entrée |
| `Mod+w` | **ferme** la fenêtre active |
| `Mod+h/j/k/l` | déplace le focus gauche / bas / haut / droite |
| `Mod+espace` | fenêtre suivante |
| `Mod+Shift+h/j/k/l` | **déplace la fenêtre** dans cette direction |
| `Mod+Ctrl+h/j/k/l` | agrandit la fenêtre dans cette direction |
| `Mod+n` | remet toutes les tailles à égalité (*normalize*) |
| `Mod+Shift+Entrée` | dans une colonne : fenêtres empilées ⇄ une seule visible |
| `Mod+Tab` | **change de disposition** (*layout*), pas de fenêtre |
| `Mod+f` | plein écran (*fullscreen*), même touche pour en sortir |
| `Mod+t` | bascule la fenêtre en flottant (*floating*) et retour |
| `Mod+1` … `Mod+9` | va au bureau (*group*) 1 à 9 |
| `Mod+Shift+1` … `Mod+Shift+9` | **envoie** la fenêtre sur ce bureau **et y va** |
| `Mod+Ctrl+r` | recharge la configuration |
| `Mod+Ctrl+q` | **quitte qtile**, donc ferme la session |
| `Mod+clic gauche` | déplace une fenêtre à la souris (elle devient flottante) |
| `Mod+clic droit` | la redimensionne à la souris |

Il n'y a **pas de lanceur graphique** par défaut : c'est `Mod+r`, une invite
en texte dans la barre. `h/j/k/l` sont bien ceux de Vim, contrairement à i3.

Trois différences avec i3 qui surprennent au début :

- `Mod+Shift+1` **suit** la fenêtre sur le bureau d'arrivée ; i3 l'envoie sans
  y aller ;
- les bureaux s'appellent des *groups* et existent tous en permanence, même
  vides ;
- il n'y a pas de découpe à armer (`Mod+h` / `Mod+v` d'i3) : c'est la
  disposition qui décide où va la nouvelle fenêtre.

## Dispositions (*layouts*)

La liste `layouts` de la configuration donne les dispositions disponibles,
parcourues dans l'ordre par `Mod+Tab`. Par défaut, il y en a deux :

| Disposition | Effet |
| --- | --- |
| `Columns` | les fenêtres côte à côte en colonnes, empilables dans une colonne |
| `Max` | **une seule fenêtre visible**, les autres cachées derrière |

« Ma fenêtre est passée en grand et je ne retrouve plus les autres » : c'est
`Max`. `Mod+Tab` revient à `Columns`, et `Mod+j` / `Mod+k` font défiler les
fenêtres cachées sans en sortir.

D'autres dispositions sont déjà dans le fichier, en commentaire :
`MonadTall` (une grande à gauche, les autres empilées à droite), `Bsp` (découpe
en deux à chaque fenêtre, proche d'i3), `TreeTab` (onglets verticaux)…
Décommenter la ligne, recharger.

## Configuration

Les raccourcis sont des objets `Key` dans la liste `keys` :

```python
Key([mod], "d", lazy.spawn("rofi -show drun"), desc="Lanceur"),
Key([mod], "Tab", lazy.spawn("rofi -show window"), desc="Fenetres"),
Key([mod], "z", lazy.next_layout(), desc="Disposition suivante"),
Key([mod], "Left", lazy.layout.left(), desc="Focus a gauche"),
```

`lazy.spawn()` lance une commande, `lazy.layout.*` agit sur la disposition,
`lazy.window.*` sur la fenêtre active. `spawn()` **ne passe pas par un shell** :
pas de `~`, pas de `$HOME`. Pour un script perso, construire le chemin en
Python, avec `import os` en tête du fichier :

```python
Key([mod, "shift"], "e", lazy.spawn(os.path.expanduser("~/.config/qtile/scripts/power-menu"))),
```

Couleur et épaisseur des bordures (*borders*), à régler **sur chaque
disposition** :

```python
layout.Columns(
    border_focus="#1f4e8c",         # fenetre active
    border_normal="#222222",        # les autres
    border_focus_stack="#1f4e8c",   # idem quand plusieurs fenetres sont empilees dans une colonne
    border_normal_stack="#222222",
    border_width=3,
),
```

Envoyer une fenêtre sur un bureau **sans la suivre**, comme sous i3 : dans la
boucle sur `groups`, enlever `switch_group=True` de
`lazy.window.togroup(i.name, switch_group=True)`.

## Piloter qtile en ligne de commande

```sh
qtile cmd-obj -o root -f reload_config            # recharge la config (= Mod+Ctrl+r)
qtile cmd-obj -o root -f display_kb               # les raccourcis REELLEMENT charges
qtile cmd-obj -o group -f info                    # bureau courant : fenetres, flottantes, focus
qtile cmd-obj -o root -f shutdown                 # quitte qtile (= Mod+Ctrl+q)
python3 -m py_compile ~/.config/qtile/config.py   # erreur de syntaxe Python ?
qtile check                                       # verifie la config (sans mypy, saute le typage)
tail -f ~/.local/share/qtile/qtile.log            # le journal, a garder ouvert pendant les essais
xev                                               # affiche le keysym de la touche pressee
```

`display_kb` est la commande de diagnostic numéro un : elle dit ce que qtile a
**effectivement** chargé, pas ce que contient le fichier.

## Éteindre, redémarrer, verrouiller

Comme i3, qtile n'a **aucun raccourci pour éteindre la machine**. Les commandes
`systemctl` sont dans la fiche [systemctl](systemctl.md). Un menu rofi lié à
`Mod+Shift+e` :

```sh
#!/bin/sh
# ~/.config/qtile/scripts/power-menu  (chmod +x)
# menu rofi : verrouiller, veille, deconnexion, redemarrer, eteindre
choice=$(printf '%s\n' Verrouiller Veille Déconnexion Redémarrer Éteindre \
    | rofi -dmenu -i -p "Session")

case "$choice" in
    Verrouiller) i3lock -c 000000 ;;
    Veille)      i3lock -c 000000 && systemctl suspend ;;
    Déconnexion) qtile cmd-obj -o root -f shutdown ;;
    Redémarrer)  systemctl reboot ;;
    Éteindre)    systemctl poweroff ;;
esac
```

`Échap` dans rofi renvoie un choix vide : le `case` ne fait rien, c'est
l'annulation. Le reste de ce que rofi sait faire est dans [rofi](rofi.md).

## Versionner la configuration

Deux fichiers suffisent : `config.py` et les scripts. Le dossier `__pycache__`
est régénéré par Python et n'a rien à faire dans git.

```sh
cd ~/.config/qtile
git init -b main
printf '__pycache__/\n' > .gitignore
git add .gitignore config.py scripts/
git commit -m "Config qtile initiale"
git remote add origin git@github.com:johndoe/config_qtile.git
git push -u origin main
git clone git@github.com:johndoe/config_qtile.git ~/.config/qtile   # sur une autre machine
```

Les remotes ont leur fiche : [remotes git](../git/remotes.md).

## Pièges

- **Sur un clavier AZERTY, `Mod+1` … `Mod+9` ne font rien.** Sous X11, qtile
  lit le keysym **sans Shift** de la touche pressée : sur la rangée du haut
  d'un AZERTY, c'est `&`, `é`, `"`… jamais un chiffre. La configuration par
  défaut ne peut donc jamais correspondre. Garder les noms de bureaux en
  chiffres, mais lier les keysyms réels :

  ```python
  groups = [Group(i) for i in "123456789"]

  # AZERTY : keysyms de la rangee du haut, sans Shift
  azerty = ["ampersand", "eacute", "quotedbl", "apostrophe", "parenleft",
            "minus", "egrave", "underscore", "ccedilla"]

  for i, k in zip(groups, azerty):
      keys.extend([
          Key([mod], k, lazy.group[i.name].toscreen()),
          Key([mod, "shift"], k, lazy.window.togroup(i.name, switch_group=True)),
      ])
  ```

  `Mod+Shift+é` marche alors aussi : Shift est lu comme un modificateur, pas
  comme un changement de touche. Ce n'est **pas** le même symptôme que sous i3,
  où `Mod+Shift+&` répond à la place de `Mod+1`.
- **Une modification ne prend pas effet** : la configuration n'a pas été
  rechargée, ou le rechargement a échoué. Vérifier avec `display_kb` plutôt que
  de relire le fichier, et recharger en ligne de commande avec
  `qtile cmd-obj -o root -f reload_config`.
- **`Mod+Tab` ne change pas de fenêtre**, il change de disposition. Si le
  réflexe vient d'i3 avec rofi, le déplacer (par exemple sur `Mod+z`) et lier
  `Mod+Tab` à `rofi -show window`.
- **« Fenêtre détachée »** : elle flotte au-dessus des autres après un `Mod+t`
  ou un `Mod+clic`. `Mod+t` la remet dans la grille. `display_kb` ne le montre
  pas, mais `qtile cmd-obj -o group -f info` la liste sous `floating_info`.
- **Le bouton `[ shutdown ]` de la barre n'éteint pas la machine.** C'est le
  widget `QuickExit` : il **quitte qtile** après un compte à rebours de
  5 secondes, et un second clic pendant le décompte annule.
- **`Press <M-r> to spawn` dans la barre** n'est qu'un texte d'aide de la
  configuration par défaut : un `widget.TextBox(...)` dans la liste des widgets
  de `screens`, à supprimer. `M` = Mod.
- **Taper `&` dans l'invite `Mod+r` casse son affichage** : le widget `Prompt`
  passe le texte à Pango, qui l'interprète comme du balisage. Le journal montre
  `parse_markup() failed for b'&'`. rofi n'a pas ce défaut.
- **Des erreurs `KB command error left: No such command`** dans le journal : un
  raccourci `lazy.layout.left()` pressé en disposition `Max`, qui n'a ni gauche
  ni droite. Sans conséquence ; en `Max`, c'est `Mod+j` / `Mod+k`.
- **`lazy.spawn("~/script")` ne trouve rien** : pas de shell, donc pas
  d'expansion du `~`. Voir `os.path.expanduser()` plus haut.

## Voir aussi

- [i3 : raccourcis par défaut et configuration](i3.md)
- [rofi : lanceur, sélecteur de fenêtres et menus](rofi.md)
- [i3 : l'écran gris de i3lock, et sortir d'un verrouillage](verrouillage-ecran.md)
- [systemctl : éteindre, redémarrer, piloter les services](systemctl.md)
- [Remotes git et miroirs](../git/remotes.md)
- <https://docs.qtile.org/en/latest/manual/config/index.html>
- <https://docs.qtile.org/en/latest/manual/config/lazy.html>
