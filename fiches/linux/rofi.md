---
title: "rofi : lanceur, sélecteur de fenêtres et menus"
tags: [linux, bureau]
created: 2026-09-09
updated: 2026-09-09
status: brouillon
---

## En bref

rofi remplace `dmenu` sous i3, et fait bien plus : lancer une application,
**basculer vers une fenêtre déjà ouverte**, ouvrir une session SSH, ou servir de
menu à n'importe quel script shell (`-dmenu`). Une seule interface, quatre
usages.

## Les modes utiles

```sh
rofi -show drun                # applications installees (fichiers .desktop), avec icones
rofi -show run                 # binaires du PATH — plus brut, trouve ce que drun ignore
rofi -show window              # basculer vers une fenetre ouverte : le mode le plus rentable
rofi -show ssh                 # hotes lus dans ~/.ssh/config et known_hosts
rofi -show filebrowser         # naviguer et ouvrir un fichier
rofi -show combi -modes "window,drun,run"    # tout dans une seule liste
rofi -modes drun -show drun -show-icons      # forcer les icones sans toucher a la config
```

`rofi` sans `-show` n'affiche que son aide : le mode est obligatoire.

## Le brancher dans i3

```
bindsym $mod+d exec --no-startup-id rofi -show drun     # remplace dmenu_run
bindsym $mod+Tab exec --no-startup-id rofi -show window
bindsym $mod+Shift+Return exec --no-startup-id rofi -show run
```

Le `--no-startup-id` n'est pas décoratif : sans lui, le curseur reste en
« chargement » une dizaine de secondes après chaque lancement.

## Se déplacer dans la liste

| Touches | Effet |
| --- | --- |
| taper | filtre la liste (insensible à la casse avec `-i`) |
| `↓` `↑` ou `Ctrl+n` `Ctrl+p` | descendre / monter |
| `Entrée` | valider |
| `Shift+Entrée` | lancer **dans un terminal** |
| `Ctrl+Entrée` | valider le texte tapé **tel quel**, même s'il ne correspond à rien |
| `Shift+→` `Shift+←` | mode suivant / précédent (utile en `combi`) |
| `Échap` | annuler |
| `Ctrl+u` | vider la ligne de saisie |

Attention : `Ctrl+k` **n'est pas** « ligne du haut », c'est « supprimer jusqu'à
la fin de la ligne » — le réflexe Vim se retourne contre soi ici.

## En menu pour un script (`-dmenu`)

C'est là que rofi devient un outil de tous les jours : il lit des lignes sur
l'entrée standard et écrit la ligne choisie sur la sortie standard.

```sh
ls ~/documents | rofi -dmenu -i -p "fichier"           # -i : insensible a la casse
printf 'oui\nnon\n' | rofi -dmenu -p "confirmer ?"
rofi -dmenu -p "note" < /dev/null                      # saisie libre, sans liste
```

Le menu système qui manque à i3, à poser dans `~/.local/bin/menu-systeme` puis à
lier sur `$mod+Shift+s` :

```sh
#!/bin/sh
choix=$(printf 'verrouiller\nfermer la session\nsuspendre\nredemarrer\neteindre\n' |
        rofi -dmenu -i -p 'systeme')
case "$choix" in
  verrouiller)        i3lock -c 000000 ;;
  "fermer la session") i3-msg exit ;;
  suspendre)          systemctl suspend ;;
  redemarrer)         systemctl reboot ;;
  eteindre)           systemctl poweroff ;;
esac
```

```sh
chmod +x ~/.local/bin/menu-systeme    # sans ca, i3 ne lance rien et ne dit rien
```

## Configuration et thème

```sh
rofi -dump-config > ~/.config/rofi/config.rasi    # config commentee, valeurs par defaut
rofi-theme-selector                               # essayer les themes livres, Alt+a pour appliquer
rofi -show drun -theme gruvbox-dark               # essayer un theme sans rien enregistrer
rofi -no-config -show drun                        # demarrer sans config : pour isoler un probleme
```

```
configuration {
    modes: "drun,run,window";
    show-icons: true;
    terminal: "x-terminal-emulator";
    kb-row-up: "Up,Control+p";
}
@theme "gruvbox-dark"
```

Le format `.rasi` est propre à rofi (l'ancien réglage par `Xresources` a
disparu) ; il ressemble à du CSS et s'édite comme tel.

## Pièges

- **`drun` et `run` ne montrent pas la même chose.** `drun` liste les
  applications déclarées par un fichier `.desktop` — c'est ce qu'on veut en
  général ; `run` liste les exécutables du `PATH`. Un outil installé à la main
  n'apparaît que dans `run`, une application graphique ne se lance
  correctement (variables, working directory) que par `drun`.
- **`-modi` est l'ancien nom de `-modes`.** Les exemples trouvés en ligne
  utilisent souvent `-modi` ; il fonctionne encore, en affichant un
  avertissement. Écrire `-modes` (rofi ≥ 1.7).
- **Un script lancé depuis i3 sans `--no-startup-id`** laisse le curseur tourner
  et, pour un script non exécutable, échoue **en silence** : i3 ne remonte
  aucune erreur. Tester le script dans un terminal avant de le lier.
- **`rofi -show window` ne voit que la session X courante.** Rien des fenêtres
  d'un autre écran X, ni de WSLg.
- **Une erreur de syntaxe dans `config.rasi` fait démarrer rofi sans thème**,
  en affichant l'erreur dans une fenêtre. `rofi -no-config` permet de vérifier
  que le problème vient bien de là.
- **Le mode `ssh` n'ouvre pas la même chose que le terminal habituel** : il
  utilise la clé `terminal` de la configuration, `x-terminal-emulator` par
  défaut, pas `$TERMINAL`.

## Voir aussi

- [i3 : raccourcis par défaut et configuration](i3.md)
- Le menu système, déjà écrit et mieux fini que le script ci-dessus :
  <https://github.com/jluttine/rofi-power-menu> — à ouvrir en premier, c'est un
  *mode* rofi (donc `rofi -show power-menu`, pas un script qui relance rofi) et
  il demande confirmation sur les actions irréversibles.
  <https://github.com/danrog303/rofi-power-menu> est l'équivalent en shell POSIX
  pur, à préférer sur une machine où l'on ne veut rien installer.
- <https://davatorium.github.io/rofi/>
- <https://github.com/davatorium/rofi/blob/next/CONFIG.md>
