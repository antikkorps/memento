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
zstyle ':bracketed-paste-magic' active-widgets ''
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

`active-widgets` est une liste de **motifs de noms de widgets** à laisser actifs
pendant le collage — `self-*` par défaut, ce qui laisse justement passer le
`self-insert` détourné. La vider revient à n'en activer aucun, et `man
zshcontrib` le dit mot pour mot :

> If this style is not set (explicitly deleted) or set to an empty value, no
> widgets are active and the pasted text is inserted literally.

Le traitement caractère par caractère disparaît, la sécurité du bracketed paste
reste entière : rien ne s'exécute avant Entrée.

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

## Charger nvm paresseusement

Le piège des recettes courantes est de ne définir que des fonctions-relais pour
`node`, `npm` et `npx` : `node` n'existe alors plus dans le `PATH` tant qu'on ne
l'a pas appelé, ce qui casse tout ce qui est lancé hors d'un shell interactif —
un serveur de langage démarré par un éditeur, lui-même lancé depuis i3.

La version sans cet inconvénient met le `bin` de la version par défaut dans le
`PATH` — `node`, `npm`, `npx` et les binaires installés en global restent donc
immédiats — et ne charge `nvm.sh` qu'au premier appel à `nvm` :

```sh
export NVM_DIR="$HOME/.nvm"

# `alias/default` contient souvent un prefixe ("24"), pas une version complete.
__nvm_bin=''
if [ -s "$NVM_DIR/alias/default" ]; then
	__nvm_want=$(cat "$NVM_DIR/alias/default")
	case "$__nvm_want" in v*) ;; *) __nvm_want="v$__nvm_want" ;; esac
	if [ -d "$NVM_DIR/versions/node/$__nvm_want/bin" ]; then
		__nvm_bin="$NVM_DIR/versions/node/$__nvm_want/bin"
	else
		__nvm_bin=$(ls -d "$NVM_DIR/versions/node/$__nvm_want"*/bin 2>/dev/null | sort -V | tail -1)
	fi
fi
[ -z "$__nvm_bin" ] && __nvm_bin=$(ls -d "$NVM_DIR"/versions/node/v*/bin 2>/dev/null | sort -V | tail -1)
[ -n "$__nvm_bin" ] && path_prepend "$__nvm_bin"
unset __nvm_want __nvm_bin

# Au premier appel : se supprime, charge le vrai nvm.sh (qui redefinit `nvm`),
# puis relaie la commande. Les appels suivants vont droit au but.
nvm() {
	unset -f nvm
	[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
	nvm "$@"
}
```

Mesuré sur la même machine : **480 ms → 90 ms** à l'ouverture d'un shell, sans
rien perdre. `nvm ls` et `nvm use` fonctionnent normalement, avec 280 ms de
latence la première fois seulement.

## Pièges

- **`zsh-syntax-highlighting` doit être le dernier de `plugins=()`.** Il
  enveloppe les widgets définis avant lui et ignore ceux chargés après.
- **Le `zstyle` doit venir après `source $ZSH/oh-my-zsh.sh`**, sinon oh-my-zsh
  le recouvre en chargeant `lib/misc.zsh`.
- **Ne pas recopier `active-widgets '\e[201~'`.** Ce snippet est partout sur le
  web et il est faux : la valeur est lue comme un **motif**, où `[201~` ouvre
  une classe de caractères jamais fermée. zsh répond alors, à chaque collage :

  ```
  bracketed-paste-magic:56: bad pattern: \e[201~
  ```

  La valeur vide est la forme documentée. Pour vérifier sans ouvrir de terminal,
  dans un pseudo-terminal jetable :

  ```sh
  printf '\033[200~echo UN\necho DEUX\033[201~\rexit\r' | script -qec "zsh -i" /dev/null
  ```
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
