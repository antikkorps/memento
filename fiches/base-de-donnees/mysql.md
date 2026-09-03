---
title: "MySQL / MariaDB : commandes courantes"
tags: [base-de-donnees, terminal, procedure]
created: 2026-09-02
updated: 2026-09-02
status: stable
---

## En bref

Se connecter, regarder ce qu'il y a dans une base, créer une base et un
utilisateur. Tout ce qui touche aux dumps est dans une fiche à part :
[MySQL : dumps et imports](mysql-dumps.md).

## Se connecter

```sh
mysql -u root -p                            # demande le mot de passe (à préférer)
mysql -h 127.0.0.1 -P 3306 -u app -p ma_base
mysql --defaults-extra-file=~/.my.cnf ma_base
sudo mysql                                  # Debian/Ubuntu : root en auth_socket, sans mot de passe
```

Le mot de passe se colle à `-p` : `-p'secret'`, jamais `-p secret` — avec une
espace, MySQL lit `secret` comme le nom de la base et redemande le mot de passe.
Et de toute façon un mot de passe sur la ligne de commande finit dans
l'historique et dans `ps`. La bonne façon, c'est un fichier :

```ini
# ~/.my.cnf — chmod 600
[client]
user = app
password = secret
host = 127.0.0.1
```

Lu automatiquement par `mysql`, `mysqldump` et `mysqladmin` : plus aucun
identifiant à taper ni à passer en argument.

## Explorer

```sql
SHOW DATABASES;
USE ma_base;
SHOW TABLES;
SHOW TABLE STATUS;              -- moteur, nombre de lignes approx., taille
DESCRIBE ma_table;              -- colonnes, types, NULL, clés, défauts
SHOW CREATE TABLE ma_table\G    -- le DDL réel, avec index et contraintes
SHOW INDEX FROM ma_table;
SELECT VERSION();
SHOW PROCESSLIST;               -- ce qui tourne en ce moment
```

Terminer par `\G` au lieu de `;` affiche une ligne par champ, à la verticale.
Indispensable dès qu'une table a plus de six colonnes ou un `SHOW CREATE TABLE`.

Poids des bases, du plus gros au plus petit :

```sql
SELECT table_schema,
       ROUND(SUM(data_length + index_length) / 1024 / 1024) AS mb
FROM information_schema.tables
GROUP BY table_schema
ORDER BY mb DESC;
```

## Sans entrer dans le client

```sh
mysql -u root -p -e "SHOW DATABASES;"
mysql -u root -p ma_base -e "SELECT id, name FROM users LIMIT 10;"
mysql -u root -p --batch --raw ma_base -e "SELECT ..." > sortie.tsv
mysql -u root -p ma_base < requetes.sql
```

`-e` exécute et rend la main. `--batch` supprime le cadre ASCII et sort du TSV
exploitable par `cut` ou `awk` ; `--raw` désactive l'échappement des valeurs.
Ajouter `-N` pour supprimer aussi la ligne d'en-têtes.

## Créer une base et un utilisateur

```sql
CREATE DATABASE ma_base CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE USER 'app'@'localhost' IDENTIFIED BY 'motdepasse';
GRANT ALL PRIVILEGES ON ma_base.* TO 'app'@'localhost';
FLUSH PRIVILEGES;

SHOW GRANTS FOR 'app'@'localhost';
```

`utf8mb4` et pas `utf8` : dans MySQL, `utf8` est un alias historique d'un UTF-8
tronqué à trois octets, qui ne sait pas stocker les emoji ni certains
idéogrammes. `utf8mb4` est le vrai UTF-8.

Droits plus fins, et ménage :

```sql
GRANT SELECT, INSERT, UPDATE, DELETE ON ma_base.* TO 'app'@'localhost';
REVOKE ALL PRIVILEGES ON ma_base.* FROM 'app'@'localhost';
ALTER USER 'app'@'localhost' IDENTIFIED BY 'nouveau';
DROP USER 'app'@'localhost';
DROP DATABASE ma_base;
```

## Pièges

- **`'app'@'localhost'` et `'app'@'%'` sont deux utilisateurs différents**, avec
  des droits séparés. Un utilisateur qui « ne marche que sur le serveur » est
  presque toujours ça.
- **`localhost` n'est pas `127.0.0.1`** pour le client MySQL : `localhost`
  passe par la socket Unix, `127.0.0.1` force le TCP. Un `Access denied` qui
  disparaît en changeant l'un pour l'autre vient de là.
- `FLUSH PRIVILEGES` n'est nécessaire qu'après modification directe des tables
  système (`UPDATE mysql.user ...`). Après `GRANT` ou `CREATE USER`, il ne sert
  à rien — mais il ne coûte rien non plus.
- `DROP DATABASE` ne demande aucune confirmation et n'est pas annulable. La
  seule protection, c'est un dump récent.
- Sur MariaDB comme sur MySQL 8, `root` est souvent en `auth_socket` /
  `unix_socket` : le mot de passe n'existe pas, il faut `sudo mysql`. Chercher un
  mot de passe root qui n'existe pas est une perte de temps classique.

## Voir aussi

- [MySQL : dumps et imports](mysql-dumps.md)
- [PostgreSQL : commandes courantes](postgres.md)
- <https://dev.mysql.com/doc/refman/8.0/en/mysql.html>
