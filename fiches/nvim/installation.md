---
title: "Neovim : installer une config kickstart sur une machine neuve"
tags: [editeur, procedure, git]
created: 2026-09-12
updated: 2026-09-12
status: stable
---

## En bref

Remonter Neovim et sa config sur une machine fraîche : la tarball officielle
dans `~/.local` (pas apt), le fork cloné dans `~/.config/nvim`, les dépendances
externes, puis la synchro avec kickstart amont. Une demi-heure, dont l'essentiel
en téléchargement.

## Commandes

```sh
# 1. Neovim : derniere version stable, sans sudo
curl -sL -o /tmp/nvim.tar.gz \
  https://github.com/neovim/neovim/releases/download/stable/nvim-linux-x86_64.tar.gz
mkdir -p ~/.local/opt && tar xzf /tmp/nvim.tar.gz -C ~/.local/opt
mv ~/.local/opt/nvim-linux-x86_64 ~/.local/opt/nvim-0.12.5   # versionner le dossier
ln -sfn ~/.local/opt/nvim-0.12.5/bin/nvim ~/.local/bin/nvim
nvim --version

# 2. Dependances externes
sudo apt install ripgrep fd-find xclip     # wl-clipboard si la session est Wayland
npm install -g tree-sitter-cli             # optionnel : compiler un parser absent

# 3. La config (fork public : HTTPS suffit, pas besoin de cle SSH)
git clone https://github.com/antikkorps/kickstart.nvim.git ~/.config/nvim
nvim                                       # vim.pack installe tout au 1er demarrage
```

## Récupérer les mises à jour de kickstart

Le fork suit un dépôt vivant. Une fois pour toutes :

```sh
git -C ~/.config/nvim remote add upstream https://github.com/nvim-lua/kickstart.nvim.git
```

Puis à chaque envie de rattraper l'amont :

```sh
git -C ~/.config/nvim fetch upstream
git -C ~/.config/nvim rev-list --left-right --count HEAD...upstream/master
#   0   17     <- 0 commit a moi, 17 en retard : fast-forward garanti
git -C ~/.config/nvim merge upstream/master
nvim                                       # laisser vim.pack rattraper les plugins
```

`rev-list --left-right --count` avant de fusionner : le premier chiffre est le
nombre de commits **à moi**, le second le retard. Tant que le premier est `0`,
la fusion est un fast-forward et ne peut pas conflicter.

## Détails

**La tarball plutôt qu'apt.** Debian 13 propose Neovim 0.10.4, or kickstart
utilise `vim.pack` — le gestionnaire de plugins intégré, arrivé en **0.12**, qui
remplace lazy.nvim. En 0.10, la config ne démarre pas. La tarball officielle est
autonome (binaire, `lib/`, `share/`) et n'a besoin d'aucun droit root.

Le dossier est nommé avec sa version et le `PATH` ne voit qu'un lien
symbolique : la mise à jour consiste à extraire la nouvelle à côté et à
repointer le lien. Les deux versions cohabitent, le retour en arrière est
immédiat.

```sh
ln -sfn ~/.local/opt/nvim-0.13.0/bin/nvim ~/.local/bin/nvim   # mise a jour
ln -sfn ~/.local/opt/nvim-0.12.5/bin/nvim ~/.local/bin/nvim   # retour arriere
```

Neovim, lui, résout son propre chemin réel pour trouver son `runtime` : le lien
symbolique ne le gêne pas. Ce n'est **pas** le cas de tous les outils — voir les
pièges.

**La clé SSH n'est pas un prérequis.** Cloner un dépôt public se fait en HTTPS
sans aucune authentification. La clé ne sert qu'à *pousser*. Une fois posée sur
<https://github.com/settings/keys> :

```sh
ssh -T git@github.com          # doit repondre "Hi <user>! You've successfully authenticated"
git -C ~/.config/nvim remote set-url origin git@github.com:antikkorps/kickstart.nvim.git
```

**Vérifier l'état.** `:checkhealth` dans Neovim, ou sans ouvrir l'interface :

```sh
nvim --headless "+checkhealth" "+w! /tmp/health.txt" "+qa" && grep "❌ ERROR" /tmp/health.txt
```

## Pièges

- **`vim.pack` impose Neovim ≥ 0.12.** Une config kickstart récente n'a plus
  lazy.nvim ; installée sur le Neovim d'apt (0.10), elle échoue au démarrage.
  C'est la raison d'être de la tarball.
- **Cloner ailleurs que dans `~/.config/nvim`.** Neovim ne lit que ce chemin
  (`:echo stdpath('config')`). Cloner dans `~/kickstart.nvim` puis faire un lien
  est le réflexe qui coûte le plus de temps.
- **Les trois avertissements du premier `:checkhealth` headless** —
  `lua-language-server`, `stylua`, plus la lib de blink.cmp — ne sont pas des
  erreurs : Mason et blink installent leurs binaires au premier démarrage
  **interactif**. Ouvrir Neovim pour de vrai une fois, puis re-vérifier.
- **`blink_cmp_fuzzy lib is not downloaded/built` ne se corrige pas.** Kickstart
  choisit délibérément le matcher en Lua (`fuzzy = { implementation = 'lua' }`
  dans `init.lua`) pour ne pas imposer une toolchain Rust. Le health check
  signale l'absence de la lib native sans savoir qu'elle a été écartée exprès.
  Pour le matcher Rust — plus rapide sur gros projets, binaire précompilé
  téléchargé tout seul : `implementation = 'prefer_rust_with_warning'`.
- **Le premier commit à soi met fin aux fast-forwards.** Tant que le fork est
  vierge, rattraper l'amont est gratuit. Dès qu'on personnalise, il faut
  arbitrer — d'où l'intérêt de tout mettre dans `lua/custom/`, que l'amont ne
  touche pas.

## Voir aussi

- [Neovim : copier une commande vers le presse-papiers](presse-papiers.md)
- [kickstart.nvim amont](https://github.com/nvim-lua/kickstart.nvim)
- [Guide de `vim.pack` par l'auteur de mini.nvim](https://echasnovski.com/blog/2026-03-13-a-guide-to-vim-pack)
