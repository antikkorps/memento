# memento

Base de connaissance personnelle : des fiches markdown, une hiérarchie peu
profonde pour ranger, des tags pour croiser.

Les conventions sont dans [CONVENTIONS.md](CONVENTIONS.md), le vocabulaire de
tags dans [TAGS.md](TAGS.md), le modèle de fiche dans
[templates/fiche.md](templates/fiche.md).

Régénérer l'index après avoir ajouté ou modifié une fiche :

```sh
npm run index
```

Chercher les fiches portant un tag (`--tag` seul liste le vocabulaire) :

```sh
node scripts/index.js --tag reseau
```

Chercher **dans** le corps des fiches (`fzf` si le terminal est interactif,
sortie `grep` sinon). Le motif est littéral et peut tenir en plusieurs mots, les
guillemets étant facultatifs :

```sh
scripts/m find definer
scripts/m find supprimer un fichier
```

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

- [Remotes git et miroirs](fiches/git/remotes.md)
- [Ressources pour apprendre git](fiches/git/ressources.md)

### javascript

- [JavaScript : les méthodes de tableau](fiches/javascript/tableaux.md)

### linux

- [Linux : droits, propriétaire et umask](fiches/linux/droits.md)
- [Linux : créer, copier, renommer, supprimer](fiches/linux/fichiers.md)
- [lsof : trouver ce qui occupe un port, un volume ou un fichier](fiches/linux/lsof.md) — _brouillon_
- [Lister les paquets installés manuellement](fiches/linux/paquets-installes.md)
- [Linux : lister, inspecter et tuer un processus](fiches/linux/processus.md)
- [Ressources sur le shell et la ligne de commande](fiches/linux/ressources.md)

### nvim

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

### securite

- [Les attaques web courantes](fiches/securite/attaques-web.md)
- [Chiffrement, hachage et signature](fiches/securite/chiffrement.md)
- [Générer des secrets, clés et mots de passe](fiches/securite/generer-des-secrets.md)
- [Lexique de l'évaluation de sécurité](fiches/securite/lexique.md)
- [Maliciels, attaques et vocabulaire des menaces](fiches/securite/menaces.md)

### shell

- [awk : colonnes, filtres et calculs](fiches/shell/awk.md)
- [grep : chercher dans les fichiers](fiches/shell/grep.md)
- [sed ou awk : lequel choisir](fiches/shell/sed-ou-awk.md)
- [sed : substituer et éditer des lignes](fiches/shell/sed.md)

### windows

- [cmd : historique, redirections et raccourcis](fiches/windows/cmd.md)
- [dir : lister, trier et filtrer en cmd](fiches/windows/dir.md)
- [Windows : droits NTFS et icacls](fiches/windows/droits.md)
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

### cicd

- [Plusieurs jobs dans un seul workflow](fiches/ci/jobs.md)
- [Forgejo Actions : anatomie d'un workflow](fiches/ci/workflow.md)

### conteneur

- [Docker : commandes courantes](fiches/docker/commandes-courantes.md)

### depannage

- [lsof : trouver ce qui occupe un port, un volume ou un fichier](fiches/linux/lsof.md)
- [Linux : lister, inspecter et tuer un processus](fiches/linux/processus.md)
- [DNS : résolution et enregistrements](fiches/reseau/dns.md)
- [Windows : lister et arrêter un processus](fiches/windows/processus.md)

### editeur

- [Neovim : copier une commande vers le presse-papiers](fiches/nvim/presse-papiers.md)

### git

- [Plusieurs jobs dans un seul workflow](fiches/ci/jobs.md)
- [Forgejo Actions : anatomie d'un workflow](fiches/ci/workflow.md)
- [Remotes git et miroirs](fiches/git/remotes.md)
- [Ressources pour apprendre git](fiches/git/ressources.md)

### javascript

- [JavaScript : les méthodes de tableau](fiches/javascript/tableaux.md)

### linux

- [Linux : droits, propriétaire et umask](fiches/linux/droits.md)
- [Linux : créer, copier, renommer, supprimer](fiches/linux/fichiers.md)
- [lsof : trouver ce qui occupe un port, un volume ou un fichier](fiches/linux/lsof.md)
- [Lister les paquets installés manuellement](fiches/linux/paquets-installes.md)
- [Linux : lister, inspecter et tuer un processus](fiches/linux/processus.md)
- [Ressources sur le shell et la ligne de commande](fiches/linux/ressources.md)

### php

- [WordPress : custom post types et requêtes](fiches/wordpress/post-types-et-requetes.md)

### procedure

- [MySQL : dumps et imports](fiches/base-de-donnees/mysql-dumps.md)
- [MySQL / MariaDB : commandes courantes](fiches/base-de-donnees/mysql.md)
- [PostgreSQL : dumps et restaurations](fiches/base-de-donnees/postgres-dumps.md)
- [PostgreSQL : commandes courantes](fiches/base-de-donnees/postgres.md)
- [Remotes git et miroirs](fiches/git/remotes.md)
- [Lister les paquets installés manuellement](fiches/linux/paquets-installes.md)
- [Générer des secrets, clés et mots de passe](fiches/securite/generer-des-secrets.md)

### reseau

- [Docker : commandes courantes](fiches/docker/commandes-courantes.md)
- [Adressage IP, masques et sous-réseaux](fiches/reseau/adressage-ip.md)
- [Codes de réponse HTTP](fiches/reseau/codes-http.md)
- [DNS : résolution et enregistrements](fiches/reseau/dns.md)
- [HTTPS et TLS : ce qui se passe avant la page](fiches/reseau/https.md)
- [Le modèle OSI en 7 couches](fiches/reseau/modele-osi.md)
- [nmap : scan de ports et découverte réseau](fiches/reseau/nmap.md)
- [SSH : clés, configuration et tunnels](fiches/reseau/ssh.md)
- [TCP et UDP : quand et pourquoi](fiches/reseau/tcp-udp.md)
- [tcpdump : capturer et lire le trafic réseau](fiches/reseau/tcpdump.md)

### ressource

- [Ressources pour apprendre git](fiches/git/ressources.md)
- [Ressources sur le shell et la ligne de commande](fiches/linux/ressources.md)

### sauvegarde

- [MySQL : dumps et imports](fiches/base-de-donnees/mysql-dumps.md)
- [PostgreSQL : dumps et restaurations](fiches/base-de-donnees/postgres-dumps.md)

### securite

- [Linux : droits, propriétaire et umask](fiches/linux/droits.md)
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
- [Générer des secrets, clés et mots de passe](fiches/securite/generer-des-secrets.md)
- [Lexique de l'évaluation de sécurité](fiches/securite/lexique.md)
- [Maliciels, attaques et vocabulaire des menaces](fiches/securite/menaces.md)
- [Windows : droits NTFS et icacls](fiches/windows/droits.md)
- [Windows : reconnaissance système en ligne de commande](fiches/windows/reconnaissance.md)

### terminal

- [MySQL / MariaDB : commandes courantes](fiches/base-de-donnees/mysql.md)
- [PostgreSQL : commandes courantes](fiches/base-de-donnees/postgres.md)
- [Linux : droits, propriétaire et umask](fiches/linux/droits.md)
- [Linux : créer, copier, renommer, supprimer](fiches/linux/fichiers.md)
- [Linux : lister, inspecter et tuer un processus](fiches/linux/processus.md)
- [Ressources sur le shell et la ligne de commande](fiches/linux/ressources.md)
- [Neovim : copier une commande vers le presse-papiers](fiches/nvim/presse-papiers.md)
- [DNS : résolution et enregistrements](fiches/reseau/dns.md)
- [nmap : scan de ports et découverte réseau](fiches/reseau/nmap.md)
- [SSH : clés, configuration et tunnels](fiches/reseau/ssh.md)
- [tcpdump : capturer et lire le trafic réseau](fiches/reseau/tcpdump.md)
- [Chiffrement, hachage et signature](fiches/securite/chiffrement.md)
- [awk : colonnes, filtres et calculs](fiches/shell/awk.md)
- [grep : chercher dans les fichiers](fiches/shell/grep.md)
- [sed ou awk : lequel choisir](fiches/shell/sed-ou-awk.md)
- [sed : substituer et éditer des lignes](fiches/shell/sed.md)
- [cmd : historique, redirections et raccourcis](fiches/windows/cmd.md)
- [dir : lister, trier et filtrer en cmd](fiches/windows/dir.md)
- [Windows : droits NTFS et icacls](fiches/windows/droits.md)
- [Équivalences bash / cmd / PowerShell](fiches/windows/equivalences-bash.md)
- [Windows : créer, copier, renommer, supprimer](fiches/windows/fichiers.md)
- [findstr : le grep de cmd](fiches/windows/findstr.md)
- [PowerShell : objets, pipeline et repères](fiches/windows/powershell.md)
- [Windows : lister et arrêter un processus](fiches/windows/processus.md)
- [Windows : reconnaissance système en ligne de commande](fiches/windows/reconnaissance.md)

### texte

- [awk : colonnes, filtres et calculs](fiches/shell/awk.md)
- [grep : chercher dans les fichiers](fiches/shell/grep.md)
- [sed ou awk : lequel choisir](fiches/shell/sed-ou-awk.md)
- [sed : substituer et éditer des lignes](fiches/shell/sed.md)
- [findstr : le grep de cmd](fiches/windows/findstr.md)

### web

- [JavaScript : les méthodes de tableau](fiches/javascript/tableaux.md)
- [Codes de réponse HTTP](fiches/reseau/codes-http.md)
- [HTTPS et TLS : ce qui se passe avant la page](fiches/reseau/https.md)
- [Les attaques web courantes](fiches/securite/attaques-web.md)
- [WordPress : custom post types et requêtes](fiches/wordpress/post-types-et-requetes.md)

### windows

- [cmd : historique, redirections et raccourcis](fiches/windows/cmd.md)
- [dir : lister, trier et filtrer en cmd](fiches/windows/dir.md)
- [Windows : droits NTFS et icacls](fiches/windows/droits.md)
- [Équivalences bash / cmd / PowerShell](fiches/windows/equivalences-bash.md)
- [Windows : créer, copier, renommer, supprimer](fiches/windows/fichiers.md)
- [findstr : le grep de cmd](fiches/windows/findstr.md)
- [PowerShell : objets, pipeline et repères](fiches/windows/powershell.md)
- [Windows : lister et arrêter un processus](fiches/windows/processus.md)
- [Windows : reconnaissance système en ligne de commande](fiches/windows/reconnaissance.md)

## Compteurs

| | |
| --- | --: |
| Fiches classées | 45 |
| Fiches en inbox | 0 |
| Brouillons | 3 |
| Tags utilisés | 18 |
| Tags déclarés | 19 |

<!-- INDEX:END -->
