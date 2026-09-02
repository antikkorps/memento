---
title: "PostgreSQL : commandes courantes"
tags: [base-de-donnees, ligne-de-commande, procedure]
created: 2026-09-02
updated: 2026-09-02
status: brouillon
---

## En bref

Se connecter à `psql`, explorer une base avec les méta-commandes `\d`, créer une
base et un rôle. Les dumps sont dans [PostgreSQL : dumps et
restaurations](postgres-dumps.md).

## Se connecter

```sh
sudo -u postgres psql                        # sur le serveur, sans mot de passe (auth peer)
psql -h 127.0.0.1 -p 5432 -U app -d ma_base
psql "postgresql://app:secret@localhost:5432/ma_base"
psql -U postgres -l                          # liste les bases et sort
```

Sans `-d`, psql essaie de se connecter à une base **portant le nom de
l'utilisateur** : `psql -U app` échoue avec `database "app" does not exist` tant
qu'on n'a pas précisé la base.

Pour ne plus taper le mot de passe, `~/.pgpass` (obligatoirement en `chmod 600`,
sinon il est ignoré sans un mot) :

```
# hôte:port:base:utilisateur:motdepasse   — le joker * est accepté
127.0.0.1:5432:*:app:secret
```

## Méta-commandes psql

Ce sont elles qui remplacent le `SHOW` de MySQL. Elles commencent par `\` et ne
prennent pas de point-virgule.

| Commande | Effet |
| --- | --- |
| `\l` | liste les bases |
| `\c ma_base` | se connecte à une autre base |
| `\dt` | tables du schéma courant (`\dt *.*` pour tous les schémas) |
| `\d ma_table` | colonnes, index, contraintes, séquences |
| `\d+ ma_table` | idem, plus la taille et les commentaires |
| `\du` | rôles et leurs attributs |
| `\dn` | schémas |
| `\df` | fonctions |
| `\dv` | vues |
| `\x` | bascule l'affichage étendu (une ligne par champ) |
| `\timing` | affiche la durée de chaque requête |
| `\e` | ouvre la requête courante dans `$EDITOR` |
| `\i fichier.sql` | exécute un fichier |
| `\?` / `\h CREATE TABLE` | aide sur les méta-commandes / sur une commande SQL |
| `\q` | quitter |

Tailles, quand une partition se remplit :

```sql
SELECT pg_size_pretty(pg_database_size('ma_base'));
SELECT relname, pg_size_pretty(pg_total_relation_size(relid)) AS taille
FROM pg_catalog.pg_statio_user_tables
ORDER BY pg_total_relation_size(relid) DESC
LIMIT 20;
```

## Sans entrer dans le client

```sh
psql -U app -d ma_base -c "SELECT count(*) FROM users;"
psql -U app -d ma_base -f requetes.sql
psql -U app -d ma_base -At -F',' -c "SELECT id, email FROM users;" > export.csv
psql -U app -d ma_base -c "\copy (SELECT * FROM users) TO 'users.csv' CSV HEADER"
```

`-A` supprime l'alignement, `-t` les en-têtes et le pied, `-F` choisit le
séparateur. `\copy` s'exécute **côté client** — contrairement à `COPY`, qui
écrit sur le disque du serveur et demande d'être superutilisateur.

## Créer une base et un rôle

```sql
CREATE ROLE app WITH LOGIN PASSWORD 'motdepasse';
CREATE DATABASE ma_base OWNER app ENCODING 'UTF8';
GRANT ALL PRIVILEGES ON DATABASE ma_base TO app;

\c ma_base
GRANT ALL ON SCHEMA public TO app;
```

En ligne de commande, les mêmes choses ont des raccourcis :

```sh
sudo -u postgres createuser --interactive --pwprompt app
sudo -u postgres createdb -O app ma_base
sudo -u postgres dropdb ma_base
```

Ménage et modifications :

```sql
ALTER ROLE app WITH PASSWORD 'nouveau';
ALTER ROLE app WITH SUPERUSER;      -- ALTER ROLE app WITH NOSUPERUSER pour retirer
ALTER DATABASE ma_base OWNER TO app;
DROP ROLE app;
```

Fermer les connexions qui empêchent un `DROP DATABASE` :

```sql
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'ma_base' AND pid <> pg_backend_pid();
```

## Pièges

- **Depuis PostgreSQL 15**, le schéma `public` n'accorde plus le droit de créer
  à tout le monde. Un rôle qui se connecte bien mais tombe sur
  `permission denied for schema public` au premier `CREATE TABLE` a juste besoin
  de `GRANT ALL ON SCHEMA public TO app;` — exécuté **dans la base concernée**,
  pas dans `postgres`.
- `CREATE ROLE` sans `LOGIN` crée un rôle qui ne peut pas se connecter.
  `CREATE USER` est exactement `CREATE ROLE ... LOGIN`.
- Un `GRANT` sur la base ne donne aucun droit sur les tables existantes :
  il faut `GRANT ALL ON ALL TABLES IN SCHEMA public TO app;` et, pour les tables
  futures, `ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO app;`.
- Les identifiants non quotés sont ramenés en minuscules. Une table créée en
  `"MaTable"` devra être citée entre guillemets **à chaque requête** — d'où la
  convention du `snake_case` partout.
- `psql -c` n'ouvre pas de transaction commune : plusieurs `-c` sont autant de
  transactions séparées. Pour un tout-ou-rien, passer par `-f` avec un
  `BEGIN`/`COMMIT`, ou `--single-transaction`.
- Authentification : `peer` (socket Unix, l'utilisateur système doit porter le
  nom du rôle) et `scram-sha-256` (TCP) sont deux mondes différents. Un
  `psql -U app` qui échoue en local mais marche en `-h 127.0.0.1` vient de
  `pg_hba.conf`, jamais du mot de passe.

## Voir aussi

- [PostgreSQL : dumps et restaurations](postgres-dumps.md)
- [MySQL / MariaDB : commandes courantes](mysql.md)
- <https://www.postgresql.org/docs/current/app-psql.html>
