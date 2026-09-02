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

Chercher un mot **dans** les fiches (`fzf` si le terminal est interactif, sortie
`grep` sinon) :

```sh
scripts/m find definer
```

Tout ce qui suit est généré par `scripts/index.js` : ne pas l'éditer à la main.

<!-- INDEX:START -->

## Fiches

### base-de-donnees

- [MySQL : dumps et imports](fiches/base-de-donnees/mysql-dumps.md)
- [MySQL / MariaDB : commandes courantes](fiches/base-de-donnees/mysql.md)
- [PostgreSQL : dumps et restaurations](fiches/base-de-donnees/postgres-dumps.md)
- [PostgreSQL : commandes courantes](fiches/base-de-donnees/postgres.md)

### docker

- [Docker : commandes courantes](fiches/docker/commandes-courantes.md)

### git

- [Remotes git et miroirs](fiches/git/remotes.md)
- [Ressources pour apprendre git](fiches/git/ressources.md)

### linux

- [lsof : trouver ce qui occupe un port, un volume ou un fichier](fiches/linux/lsof.md) — _brouillon_
- [Lister les paquets installés manuellement](fiches/linux/paquets-installes.md)
- [Ressources sur le shell et la ligne de commande](fiches/linux/ressources.md)

### reseau

- [nmap : scan de ports et découverte réseau](fiches/reseau/nmap.md) — _brouillon_

### securite

- [Générer des secrets, clés et mots de passe](fiches/securite/generer-des-secrets.md)
- [Lexique de l'évaluation de sécurité](fiches/securite/lexique.md)

### shell

- [awk : colonnes, filtres et calculs](fiches/shell/awk.md)
- [grep : chercher dans les fichiers](fiches/shell/grep.md)
- [sed ou awk : lequel choisir](fiches/shell/sed-ou-awk.md)
- [sed : substituer et éditer des lignes](fiches/shell/sed.md)

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

### conteneur

- [Docker : commandes courantes](fiches/docker/commandes-courantes.md)

### depannage

- [lsof : trouver ce qui occupe un port, un volume ou un fichier](fiches/linux/lsof.md)

### git

- [Remotes git et miroirs](fiches/git/remotes.md)
- [Ressources pour apprendre git](fiches/git/ressources.md)

### ligne-de-commande

- [MySQL / MariaDB : commandes courantes](fiches/base-de-donnees/mysql.md)
- [PostgreSQL : commandes courantes](fiches/base-de-donnees/postgres.md)
- [Ressources sur le shell et la ligne de commande](fiches/linux/ressources.md)
- [awk : colonnes, filtres et calculs](fiches/shell/awk.md)
- [grep : chercher dans les fichiers](fiches/shell/grep.md)
- [sed ou awk : lequel choisir](fiches/shell/sed-ou-awk.md)
- [sed : substituer et éditer des lignes](fiches/shell/sed.md)

### linux

- [lsof : trouver ce qui occupe un port, un volume ou un fichier](fiches/linux/lsof.md)
- [Lister les paquets installés manuellement](fiches/linux/paquets-installes.md)
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
- [nmap : scan de ports et découverte réseau](fiches/reseau/nmap.md)

### ressource

- [Ressources pour apprendre git](fiches/git/ressources.md)
- [Ressources sur le shell et la ligne de commande](fiches/linux/ressources.md)

### sauvegarde

- [MySQL : dumps et imports](fiches/base-de-donnees/mysql-dumps.md)
- [PostgreSQL : dumps et restaurations](fiches/base-de-donnees/postgres-dumps.md)

### securite

- [nmap : scan de ports et découverte réseau](fiches/reseau/nmap.md)
- [Générer des secrets, clés et mots de passe](fiches/securite/generer-des-secrets.md)
- [Lexique de l'évaluation de sécurité](fiches/securite/lexique.md)

### texte

- [awk : colonnes, filtres et calculs](fiches/shell/awk.md)
- [grep : chercher dans les fichiers](fiches/shell/grep.md)
- [sed ou awk : lequel choisir](fiches/shell/sed-ou-awk.md)
- [sed : substituer et éditer des lignes](fiches/shell/sed.md)

### web

- [WordPress : custom post types et requêtes](fiches/wordpress/post-types-et-requetes.md)

## Compteurs

| | |
| --- | --: |
| Fiches classées | 18 |
| Fiches en inbox | 0 |
| Brouillons | 3 |
| Tags utilisés | 14 |
| Tags déclarés | 17 |

<!-- INDEX:END -->
