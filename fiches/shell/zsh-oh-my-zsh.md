---
title: "zsh et oh-my-zsh : collage multi-lignes, config partagée avec bash"
tags: [terminal, depannage, procedure]
created: 2026-09-12
updated: 2026-09-12
status: stable
---

## En bref

Le collage d'un bloc de plusieurs lignes qui avale des caractères et ajoute des
backslashes n'est pas un défaut de zsh : c'est oh-my-zsh qui remplace le widget
de collage natif. Une ligne de `zstyle` le neutralise. Au passage, comment tenir
une config commune à bash et zsh pour que les deux restent interchangeables.

## Le collage cassé : cause et correctif

```zsh
# dans ~/.zshrc, APRES `source $ZSH/oh-my-zsh.sh`
zstyle ':bracketed-paste-magic' active-widgets '\e[201~'
```

Depuis la version 5.1, zsh gère le *bracketed paste* avec un widget natif écrit
en C : le terminal encadre le texte collé de `\e[200~` et `\e[201~`, zsh avale
le bloc entier et l'insère tel quel, sans rien exécuter avant Entrée.

oh-my-zsh le remplace — `lib/misc.zsh`, chargé inconditionnellement :

```zsh
autoload -Uz bracketed-paste-magic
zle -N bracketed-paste bracketed-paste-magic   # le widget natif saute
autoload -Uz url-quote-magic
zle -N self-insert url-quote-magic             # ...et self-insert aussi
```

`bracketed-paste-magic` refait passer le texte collé **caractère par
caractère** dans `self-insert`, lui-même devenu `url-quote-magic`. Sur un bloc
de vingt lignes, cela fait des milliers d'appels de widgets, chacun redessinant
la coloration syntaxique et l'autosuggestion. D'où les trois symptômes :

- lenteur visible, le texte s'écrit comme s'il était tapé ;
- caractères avalés quand le rendu ne suit plus ;
- backslashes parasites — `url-quote-magic` croit reconnaître une URL et échappe
  les `?` et les `&`.

Le `zstyle` dit à `bracketed-paste-magic` de n'activer aucun widget pendant le
collage, sauf à la marque de fin `\e[201~`. Le traitement caractère par
caractère disparaît, la sécurité du bracketed paste reste entière.

Si un résidu persiste, on peut rendre son widget à zsh sans détour :

```zsh
zle -N bracketed-paste .bracketed-paste   # le natif, visible dans `zle -la`
```

Deux réglages complémentaires, l'autosuggestion étant l'autre gourmande :

```zsh
ZSH_AUTOSUGGEST_BUFFER_MAX_SIZE=20   # pas de suggestion sur un buffer long
ZSH_AUTOSUGGEST_MANUAL_REBIND=1      # evite un rebind a chaque prompt
```

## Une config commune aux deux shells

Le piège du passage à zsh n'est pas zsh : c'est que `~/.bashrc` n'est plus lu.
Tout ce qui y vivait — `PATH`, nvm, `EDITOR` — disparaît d'un coup, avec le
sentiment que le nouveau shell a cassé quelque chose.

La parade : un `~/.shellrc` en POSIX strict, sourcé par les deux.

```sh
# ~/.shellrc — ce que bash et zsh ont en commun
path_prepend() {
	case ":$PATH:" in
	*":$1:"*) ;;                     # deja present : ne rien faire
	*) PATH="$1:$PATH" ;;
	esac
}
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
path_prepend "$HOME/.local/bin"
export PATH
command -v nvim >/dev/null 2>&1 && export EDITOR=nvim VISUAL=nvim
```

```sh
# a la fin de ~/.bashrc ET de ~/.zshrc
[ -f "$HOME/.shellrc" ] && . "$HOME/.shellrc"
```

Le test `case` de `path_prepend` rend le fichier **idempotent** : le sourcer
deux fois n'empile pas de doublons dans le `PATH`.

Vérification, la même commande dans les deux shells :

```sh
zsh  -i -c 'echo "$PATH" | tr ":" "\n" | sort | uniq -d'   # vide = pas de doublon
bash -ic 'echo "node=$(node -v) EDITOR=$EDITOR"'
```

## Changer de shell de connexion

```sh
zsh                      # essayer d'abord, sans rien changer
chsh -s /usr/bin/zsh     # bascule ; effective a la prochaine session
chsh -s /bin/bash        # retour arriere, a tout moment
```

bash reste installé quoi qu'il arrive, et le shell de `root` n'est pas touché.
Un `.zshrc` cassé ne condamne donc jamais la machine.

## Mesurer le démarrage

```sh
for i in 1 2 3; do /usr/bin/time -f "%e s" zsh -i -c true; done
```

Ordres de grandeur relevés sur une machine de bureau :

| Ce qui est chargé | Coût |
| --- | --- |
| zsh nu | ~ 5 ms |
| oh-my-zsh + 2 plugins, cache de complétion chaud | ~ 60 ms |
| `nvm.sh` | ~ 280 ms |
| `brew shellenv` | ~ 15 ms par appel |

La lenteur au démarrage vient presque toujours de `nvm.sh`, jamais du shell.
Le charger paresseusement est possible, au prix d'une subtilité : `node`
n'existe alors plus dans le `PATH` tant qu'on ne l'a pas appelé une fois, ce qui
surprend les outils lancés hors d'un shell interactif.

## Pièges

- **`zsh-syntax-highlighting` doit être le dernier de `plugins=()`.** Il
  enveloppe les widgets définis avant lui et ignore ceux chargés après.
- **Le `zstyle` doit venir après `source $ZSH/oh-my-zsh.sh`**, sinon oh-my-zsh
  le recouvre en chargeant `lib/misc.zsh`.
- **`bindkey "^[[200~"` répond `bracketed-paste` dans les deux cas** : oh-my-zsh
  ne change pas le nom du widget, il change la fonction derrière. La liaison ne
  permet donc pas de diagnostiquer ; c'est le `zstyle` qui tranche.
- **Répéter `eval "$(brew shellenv)"`** ne casse pas le `PATH`, qui est
  idempotent, mais fork un `brew` à chaque appel — quatre lignes identiques
  coûtaient ici 50 ms au lieu de 5.
- **La complétion nvm livrée est écrite pour bash.** En zsh elle réclame
  `bashcompinit`, plus cher que ce qu'elle rapporte : la réserver à bash.

## Voir aussi

- [Neovim : installer une config kickstart sur une machine neuve](../nvim/installation.md)
- [Ressources sur le shell et la ligne de commande](../linux/ressources.md)
- <https://github.com/ohmyzsh/ohmyzsh/blob/master/lib/misc.zsh>
