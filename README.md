# memento

Base de connaissance personnelle : des fiches markdown, une hiérarchie peu
profonde pour ranger, des tags pour croiser.

Les conventions sont dans [CONVENTIONS.md](CONVENTIONS.md), le vocabulaire de
tags dans [TAGS.md](TAGS.md), le modèle de fiche dans
[templates/fiche.md](templates/fiche.md).

## Mise en place

Sur une machine neuve : cloner, mettre `scripts/` dans le `PATH`, vérifier.

```sh
git clone ssh://git@git.fvienot.link/fvienot/memento.git ~/Documents/memento
echo 'export PATH="$HOME/Documents/memento/scripts:$PATH"' >> ~/.bashrc
. ~/.bashrc
m check
```

Prérequis : `node` ≥ 18 et `git`. **Pas de `npm install`** — le dépôt n'a aucune
dépendance, `package.json` ne sert qu'à porter les raccourcis `npm run`. `fzf` et
`rg` sont facultatifs : sans `fzf`, `m find` sort du texte (`chemin:ligne:texte`)
au lieu d'ouvrir un sélecteur ; sans `rg`, il retombe sur `grep`.

**Ne pas installer `m` par un lien symbolique.** Il déduit la racine du dépôt du
chemin par lequel il a été appelé (`dirname $0/..`) et ne résout pas les liens :
un `ln -s .../scripts/m ~/.local/bin/m` le fait chercher les fiches dans
`~/.local`, et il répond `ni fiches/ ni inbox/ : rien a chercher`. Le `PATH`
ci-dessus est la voie sûre ; à défaut, un alias :

```sh
echo 'alias m=~/Documents/memento/scripts/m' >> ~/.bashrc
```

L'alias suffit au quotidien, mais il n'existe que dans un shell interactif : ni
un script ni un `xargs` ne le verront.

## Usage

Régénérer l'index après avoir ajouté ou modifié une fiche :

```sh
m index
```

Chercher les fiches portant un tag (sans nom, `m tag` liste le vocabulaire) :

```sh
m tag reseau
```

Chercher **dans** le corps des fiches (`fzf` si le terminal est interactif,
sortie `grep` sinon). Le motif est littéral et peut tenir en plusieurs mots, les
guillemets étant facultatifs :

```sh
m find definer
m find supprimer un fichier
```

Depuis la racine du dépôt, `npm run index`, `npm run check` et `make` font la
même chose sans passer par `m`.

Tout ce qui suit est généré par `scripts/index.js` : ne pas l'éditer à la main.

<!-- INDEX:START -->

## Fiches

### base-de-donnees

- [MySQL : dumps et imports](fiches/base-de-donnees/mysql-dumps.md)
- [MySQL / MariaDB : commandes courantes](fiches/base-de-donnees/mysql.md)
- [PostgreSQL : dumps et restaurations](fiches/base-de-donnees/postgres-dumps.md)
- [PostgreSQL : commandes courantes](fiches/base-de-donnees/postgres.md)

### ci

- [Plusieurs jobs dans un seul workflow](fiches/ci/jobs.md)
- [Forgejo Actions : anatomie d'un workflow](fiches/ci/workflow.md)

### docker

- [Docker : commandes courantes](fiches/docker/commandes-courantes.md)

### git

- [Git : bisect, trouver le commit fautif par dichotomie](fiches/git/bisect.md) — _brouillon_
- [Git : nettoyer les branches et lire git branch -vv](fiches/git/branches.md) — _brouillon_
- [Git : cherry-pick, rejouer un commit précis](fiches/git/cherry-pick.md) — _brouillon_
- [Git : diff, comparer les changements](fiches/git/diff.md) — _brouillon_
- [Git : voir l'historique et l'arbre des commits](fiches/git/historique.md) — _brouillon_
- [Git : chercher dans le code et l'historique](fiches/git/recherche.md) — _brouillon_
- [Remotes git et miroirs](fiches/git/remotes.md)
- [Ressources pour apprendre git](fiches/git/ressources.md)
- [Git : revert, annuler un commit publié](fiches/git/revert.md) — _brouillon_

### javascript

- [JavaScript : sélectionner dans le DOM (querySelector)](fiches/javascript/selection-du-dom.md)
- [JavaScript : les méthodes de tableau](fiches/javascript/tableaux.md)

### linux

- [Linux : droits, propriétaire et umask](fiches/linux/droits.md)
- [fail2ban : bannir les tentatives répétées](fiches/linux/fail2ban.md)
- [Linux : créer, copier, renommer, supprimer](fiches/linux/fichiers.md)
- [i3 : raccourcis par défaut et configuration](fiches/linux/i3.md) — _brouillon_
- [lsof : trouver ce qui occupe un port, un volume ou un fichier](fiches/linux/lsof.md) — _brouillon_
- [Lister les paquets installés manuellement](fiches/linux/paquets-installes.md)
- [Linux : lister, inspecter et tuer un processus](fiches/linux/processus.md)
- [Ressources sur le shell et la ligne de commande](fiches/linux/ressources.md)
- [rofi : lanceur, sélecteur de fenêtres et menus](fiches/linux/rofi.md) — _brouillon_
- [ufw : le pare-feu simple](fiches/linux/ufw.md)
- [Linux : utilisateurs, groupes et mots de passe](fiches/linux/utilisateurs.md)
- [WSL : ouvrir un fichier, franchir la frontière Windows](fiches/linux/wsl.md)

### nvim

- [Neovim : installer une config kickstart sur une machine neuve](fiches/nvim/installation.md)
- [Neovim : copier une commande vers le presse-papiers](fiches/nvim/presse-papiers.md)

### reseau

- [Adressage IP, masques et sous-réseaux](fiches/reseau/adressage-ip.md)
- [Codes de réponse HTTP](fiches/reseau/codes-http.md)
- [DNS : résolution et enregistrements](fiches/reseau/dns.md)
- [HTTPS et TLS : ce qui se passe avant la page](fiches/reseau/https.md)
- [Le modèle OSI en 7 couches](fiches/reseau/modele-osi.md)
- [nmap : scan de ports et découverte réseau](fiches/reseau/nmap.md)
- [SSH : clés, configuration et tunnels](fiches/reseau/ssh.md)
- [TCP et UDP : quand et pourquoi](fiches/reseau/tcp-udp.md)
- [tcpdump : capturer et lire le trafic réseau](fiches/reseau/tcpdump.md)

### rust

- [Rust : propriété (*ownership*) et emprunts (*borrowing*)](fiches/rust/ownership-et-emprunts.md) — _brouillon_

### securite

- [Les attaques web courantes](fiches/securite/attaques-web.md)
- [Chiffrement, hachage et signature](fiches/securite/chiffrement.md)
- [Cryptographie : les algorithmes et leurs calculs](fiches/securite/cryptographie-calculs.md)
- [Générer des secrets, clés et mots de passe](fiches/securite/generer-des-secrets.md)
- [hashcat : casser des hachages sur GPU](fiches/securite/hashcat.md)
- [John the Ripper : casser des hachages hors ligne](fiches/securite/john-the-ripper.md)
- [Lexique de l'évaluation de sécurité](fiches/securite/lexique.md)
- [Maliciels, attaques et vocabulaire des menaces](fiches/securite/menaces.md)
- [Metasploit : le framework d'exploitation](fiches/securite/metasploit.md)
- [Outils crypto en ligne : identifier, décoder, casser](fiches/securite/outils-crypto.md)

### shell

- [awk : colonnes, filtres et calculs](fiches/shell/awk.md)
- [grep : chercher dans les fichiers](fiches/shell/grep.md)
- [sed ou awk : lequel choisir](fiches/shell/sed-ou-awk.md)
- [sed : substituer et éditer des lignes](fiches/shell/sed.md)
- [zsh et oh-my-zsh : collage multi-lignes, config partagée avec bash](fiches/shell/zsh-oh-my-zsh.md)

### windows

- [cmd : historique, redirections et raccourcis](fiches/windows/cmd.md)
- [dir : lister, trier et filtrer en cmd](fiches/windows/dir.md)
- [Windows : droits NTFS et icacls](fiches/windows/droits.md)
- [Windows : élévation (UAC) et édition d'un fichier protégé](fiches/windows/elevation.md)
- [Équivalences bash / cmd / PowerShell](fiches/windows/equivalences-bash.md)
- [Windows : créer, copier, renommer, supprimer](fiches/windows/fichiers.md)
- [findstr : le grep de cmd](fiches/windows/findstr.md)
- [PowerShell : objets, pipeline et repères](fiches/windows/powershell.md)
- [Windows : lister et arrêter un processus](fiches/windows/processus.md)
- [Windows : reconnaissance système en ligne de commande](fiches/windows/reconnaissance.md) — _brouillon_

### wordpress

- [WordPress : custom post types et requêtes](fiches/wordpress/post-types-et-requetes.md) — _brouillon_

## Inbox

_Vide._

## Index par tag

### base-de-donnees

- [MySQL : dumps et imports](fiches/base-de-donnees/mysql-dumps.md)
- [MySQL / MariaDB : commandes courantes](fiches/base-de-donnees/mysql.md)
- [PostgreSQL : dumps et restaurations](fiches/base-de-donnees/postgres-dumps.md)
- [PostgreSQL : commandes courantes](fiches/base-de-donnees/postgres.md)

### bureau

- [i3 : raccourcis par défaut et configuration](fiches/linux/i3.md)
- [rofi : lanceur, sélecteur de fenêtres et menus](fiches/linux/rofi.md)

### cicd

- [Plusieurs jobs dans un seul workflow](fiches/ci/jobs.md)
- [Forgejo Actions : anatomie d'un workflow](fiches/ci/workflow.md)

### conteneur

- [Docker : commandes courantes](fiches/docker/commandes-courantes.md)

### depannage

- [Git : bisect, trouver le commit fautif par dichotomie](fiches/git/bisect.md)
- [lsof : trouver ce qui occupe un port, un volume ou un fichier](fiches/linux/lsof.md)
- [Linux : lister, inspecter et tuer un processus](fiches/linux/processus.md)
- [DNS : résolution et enregistrements](fiches/reseau/dns.md)
- [Rust : propriété (*ownership*) et emprunts (*borrowing*)](fiches/rust/ownership-et-emprunts.md)
- [zsh et oh-my-zsh : collage multi-lignes, config partagée avec bash](fiches/shell/zsh-oh-my-zsh.md)
- [Windows : lister et arrêter un processus](fiches/windows/processus.md)

### editeur

- [Neovim : installer une config kickstart sur une machine neuve](fiches/nvim/installation.md)
- [Neovim : copier une commande vers le presse-papiers](fiches/nvim/presse-papiers.md)

### git

- [Plusieurs jobs dans un seul workflow](fiches/ci/jobs.md)
- [Forgejo Actions : anatomie d'un workflow](fiches/ci/workflow.md)
- [Git : bisect, trouver le commit fautif par dichotomie](fiches/git/bisect.md)
- [Git : nettoyer les branches et lire git branch -vv](fiches/git/branches.md)
- [Git : cherry-pick, rejouer un commit précis](fiches/git/cherry-pick.md)
- [Git : diff, comparer les changements](fiches/git/diff.md)
- [Git : voir l'historique et l'arbre des commits](fiches/git/historique.md)
- [Git : chercher dans le code et l'historique](fiches/git/recherche.md)
- [Remotes git et miroirs](fiches/git/remotes.md)
- [Ressources pour apprendre git](fiches/git/ressources.md)
- [Git : revert, annuler un commit publié](fiches/git/revert.md)
- [Neovim : installer une config kickstart sur une machine neuve](fiches/nvim/installation.md)

### javascript

- [JavaScript : sélectionner dans le DOM (querySelector)](fiches/javascript/selection-du-dom.md)
- [JavaScript : les méthodes de tableau](fiches/javascript/tableaux.md)

### linux

- [Linux : droits, propriétaire et umask](fiches/linux/droits.md)
- [fail2ban : bannir les tentatives répétées](fiches/linux/fail2ban.md)
- [Linux : créer, copier, renommer, supprimer](fiches/linux/fichiers.md)
- [i3 : raccourcis par défaut et configuration](fiches/linux/i3.md)
- [lsof : trouver ce qui occupe un port, un volume ou un fichier](fiches/linux/lsof.md)
- [Lister les paquets installés manuellement](fiches/linux/paquets-installes.md)
- [Linux : lister, inspecter et tuer un processus](fiches/linux/processus.md)
- [Ressources sur le shell et la ligne de commande](fiches/linux/ressources.md)
- [rofi : lanceur, sélecteur de fenêtres et menus](fiches/linux/rofi.md)
- [ufw : le pare-feu simple](fiches/linux/ufw.md)
- [Linux : utilisateurs, groupes et mots de passe](fiches/linux/utilisateurs.md)
- [WSL : ouvrir un fichier, franchir la frontière Windows](fiches/linux/wsl.md)

### php

- [WordPress : custom post types et requêtes](fiches/wordpress/post-types-et-requetes.md)

### procedure

- [MySQL : dumps et imports](fiches/base-de-donnees/mysql-dumps.md)
- [MySQL / MariaDB : commandes courantes](fiches/base-de-donnees/mysql.md)
- [PostgreSQL : dumps et restaurations](fiches/base-de-donnees/postgres-dumps.md)
- [PostgreSQL : commandes courantes](fiches/base-de-donnees/postgres.md)
- [Git : nettoyer les branches et lire git branch -vv](fiches/git/branches.md)
- [Git : cherry-pick, rejouer un commit précis](fiches/git/cherry-pick.md)
- [Remotes git et miroirs](fiches/git/remotes.md)
- [Git : revert, annuler un commit publié](fiches/git/revert.md)
- [Lister les paquets installés manuellement](fiches/linux/paquets-installes.md)
- [Neovim : installer une config kickstart sur une machine neuve](fiches/nvim/installation.md)
- [Générer des secrets, clés et mots de passe](fiches/securite/generer-des-secrets.md)
- [zsh et oh-my-zsh : collage multi-lignes, config partagée avec bash](fiches/shell/zsh-oh-my-zsh.md)
- [Windows : élévation (UAC) et édition d'un fichier protégé](fiches/windows/elevation.md)

### reseau

- [Docker : commandes courantes](fiches/docker/commandes-courantes.md)
- [fail2ban : bannir les tentatives répétées](fiches/linux/fail2ban.md)
- [ufw : le pare-feu simple](fiches/linux/ufw.md)
- [Adressage IP, masques et sous-réseaux](fiches/reseau/adressage-ip.md)
- [Codes de réponse HTTP](fiches/reseau/codes-http.md)
- [DNS : résolution et enregistrements](fiches/reseau/dns.md)
- [HTTPS et TLS : ce qui se passe avant la page](fiches/reseau/https.md)
- [Le modèle OSI en 7 couches](fiches/reseau/modele-osi.md)
- [nmap : scan de ports et découverte réseau](fiches/reseau/nmap.md)
- [SSH : clés, configuration et tunnels](fiches/reseau/ssh.md)
- [TCP et UDP : quand et pourquoi](fiches/reseau/tcp-udp.md)
- [tcpdump : capturer et lire le trafic réseau](fiches/reseau/tcpdump.md)
- [Metasploit : le framework d'exploitation](fiches/securite/metasploit.md)

### ressource

- [Ressources pour apprendre git](fiches/git/ressources.md)
- [Ressources sur le shell et la ligne de commande](fiches/linux/ressources.md)
- [Outils crypto en ligne : identifier, décoder, casser](fiches/securite/outils-crypto.md)

### rust

- [Rust : propriété (*ownership*) et emprunts (*borrowing*)](fiches/rust/ownership-et-emprunts.md)

### sauvegarde

- [MySQL : dumps et imports](fiches/base-de-donnees/mysql-dumps.md)
- [PostgreSQL : dumps et restaurations](fiches/base-de-donnees/postgres-dumps.md)

### securite

- [Linux : droits, propriétaire et umask](fiches/linux/droits.md)
- [fail2ban : bannir les tentatives répétées](fiches/linux/fail2ban.md)
- [ufw : le pare-feu simple](fiches/linux/ufw.md)
- [Linux : utilisateurs, groupes et mots de passe](fiches/linux/utilisateurs.md)
- [Adressage IP, masques et sous-réseaux](fiches/reseau/adressage-ip.md)
- [Codes de réponse HTTP](fiches/reseau/codes-http.md)
- [HTTPS et TLS : ce qui se passe avant la page](fiches/reseau/https.md)
- [Le modèle OSI en 7 couches](fiches/reseau/modele-osi.md)
- [nmap : scan de ports et découverte réseau](fiches/reseau/nmap.md)
- [SSH : clés, configuration et tunnels](fiches/reseau/ssh.md)
- [TCP et UDP : quand et pourquoi](fiches/reseau/tcp-udp.md)
- [tcpdump : capturer et lire le trafic réseau](fiches/reseau/tcpdump.md)
- [Les attaques web courantes](fiches/securite/attaques-web.md)
- [Chiffrement, hachage et signature](fiches/securite/chiffrement.md)
- [Cryptographie : les algorithmes et leurs calculs](fiches/securite/cryptographie-calculs.md)
- [Générer des secrets, clés et mots de passe](fiches/securite/generer-des-secrets.md)
- [hashcat : casser des hachages sur GPU](fiches/securite/hashcat.md)
- [John the Ripper : casser des hachages hors ligne](fiches/securite/john-the-ripper.md)
- [Lexique de l'évaluation de sécurité](fiches/securite/lexique.md)
- [Maliciels, attaques et vocabulaire des menaces](fiches/securite/menaces.md)
- [Metasploit : le framework d'exploitation](fiches/securite/metasploit.md)
- [Outils crypto en ligne : identifier, décoder, casser](fiches/securite/outils-crypto.md)
- [Windows : droits NTFS et icacls](fiches/windows/droits.md)
- [Windows : reconnaissance système en ligne de commande](fiches/windows/reconnaissance.md)

### terminal

- [MySQL / MariaDB : commandes courantes](fiches/base-de-donnees/mysql.md)
- [PostgreSQL : commandes courantes](fiches/base-de-donnees/postgres.md)
- [Git : voir l'historique et l'arbre des commits](fiches/git/historique.md)
- [Linux : droits, propriétaire et umask](fiches/linux/droits.md)
- [Linux : créer, copier, renommer, supprimer](fiches/linux/fichiers.md)
- [Linux : lister, inspecter et tuer un processus](fiches/linux/processus.md)
- [Ressources sur le shell et la ligne de commande](fiches/linux/ressources.md)
- [Linux : utilisateurs, groupes et mots de passe](fiches/linux/utilisateurs.md)
- [WSL : ouvrir un fichier, franchir la frontière Windows](fiches/linux/wsl.md)
- [Neovim : copier une commande vers le presse-papiers](fiches/nvim/presse-papiers.md)
- [DNS : résolution et enregistrements](fiches/reseau/dns.md)
- [nmap : scan de ports et découverte réseau](fiches/reseau/nmap.md)
- [SSH : clés, configuration et tunnels](fiches/reseau/ssh.md)
- [tcpdump : capturer et lire le trafic réseau](fiches/reseau/tcpdump.md)
- [Chiffrement, hachage et signature](fiches/securite/chiffrement.md)
- [Cryptographie : les algorithmes et leurs calculs](fiches/securite/cryptographie-calculs.md)
- [hashcat : casser des hachages sur GPU](fiches/securite/hashcat.md)
- [John the Ripper : casser des hachages hors ligne](fiches/securite/john-the-ripper.md)
- [Metasploit : le framework d'exploitation](fiches/securite/metasploit.md)
- [awk : colonnes, filtres et calculs](fiches/shell/awk.md)
- [grep : chercher dans les fichiers](fiches/shell/grep.md)
- [sed ou awk : lequel choisir](fiches/shell/sed-ou-awk.md)
- [sed : substituer et éditer des lignes](fiches/shell/sed.md)
- [zsh et oh-my-zsh : collage multi-lignes, config partagée avec bash](fiches/shell/zsh-oh-my-zsh.md)
- [cmd : historique, redirections et raccourcis](fiches/windows/cmd.md)
- [dir : lister, trier et filtrer en cmd](fiches/windows/dir.md)
- [Windows : droits NTFS et icacls](fiches/windows/droits.md)
- [Windows : élévation (UAC) et édition d'un fichier protégé](fiches/windows/elevation.md)
- [Équivalences bash / cmd / PowerShell](fiches/windows/equivalences-bash.md)
- [Windows : créer, copier, renommer, supprimer](fiches/windows/fichiers.md)
- [findstr : le grep de cmd](fiches/windows/findstr.md)
- [PowerShell : objets, pipeline et repères](fiches/windows/powershell.md)
- [Windows : lister et arrêter un processus](fiches/windows/processus.md)
- [Windows : reconnaissance système en ligne de commande](fiches/windows/reconnaissance.md)

### texte

- [Git : diff, comparer les changements](fiches/git/diff.md)
- [Git : chercher dans le code et l'historique](fiches/git/recherche.md)
- [awk : colonnes, filtres et calculs](fiches/shell/awk.md)
- [grep : chercher dans les fichiers](fiches/shell/grep.md)
- [sed ou awk : lequel choisir](fiches/shell/sed-ou-awk.md)
- [sed : substituer et éditer des lignes](fiches/shell/sed.md)
- [findstr : le grep de cmd](fiches/windows/findstr.md)

### web

- [JavaScript : sélectionner dans le DOM (querySelector)](fiches/javascript/selection-du-dom.md)
- [JavaScript : les méthodes de tableau](fiches/javascript/tableaux.md)
- [Codes de réponse HTTP](fiches/reseau/codes-http.md)
- [HTTPS et TLS : ce qui se passe avant la page](fiches/reseau/https.md)
- [Les attaques web courantes](fiches/securite/attaques-web.md)
- [WordPress : custom post types et requêtes](fiches/wordpress/post-types-et-requetes.md)

### windows

- [WSL : ouvrir un fichier, franchir la frontière Windows](fiches/linux/wsl.md)
- [cmd : historique, redirections et raccourcis](fiches/windows/cmd.md)
- [dir : lister, trier et filtrer en cmd](fiches/windows/dir.md)
- [Windows : droits NTFS et icacls](fiches/windows/droits.md)
- [Windows : élévation (UAC) et édition d'un fichier protégé](fiches/windows/elevation.md)
- [Équivalences bash / cmd / PowerShell](fiches/windows/equivalences-bash.md)
- [Windows : créer, copier, renommer, supprimer](fiches/windows/fichiers.md)
- [findstr : le grep de cmd](fiches/windows/findstr.md)
- [PowerShell : objets, pipeline et repères](fiches/windows/powershell.md)
- [Windows : lister et arrêter un processus](fiches/windows/processus.md)
- [Windows : reconnaissance système en ligne de commande](fiches/windows/reconnaissance.md)

## Compteurs

| | |
| --- | --: |
| Fiches classées | 68 |
| Fiches en inbox | 0 |
| Brouillons | 13 |
| Tags utilisés | 20 |
| Tags déclarés | 21 |

<!-- INDEX:END -->
