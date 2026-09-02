---
title: "MySQL : dumps et imports"
tags: [base-de-donnees, sauvegarde, procedure]
created: 2026-09-02
updated: 2026-09-02
status: stable
---

## En bref

Sortir une base, la remettre ailleurs, et surtout réparer les dumps qui refusent
de s'importer — le `DEFINER` en tête de liste.

## Exporter

```sh
mysqldump -u root -p ma_base > dump.sql
mysqldump -u root -p --single-transaction --quick ma_base > dump.sql
mysqldump -u root -p ma_base users commandes > partiel.sql
mysqldump -u root -p --no-data ma_base > schema.sql      # structure seule
mysqldump -u root -p --no-create-info ma_base > data.sql # données seules
mysqldump -u root -p --all-databases > tout.sql
mysqldump -u root -p ma_base | gzip > dump.sql.gz
```

| Option | Pourquoi |
| --- | --- |
| `--single-transaction` | dump cohérent en InnoDB **sans verrouiller** les tables — le réflexe sur une base en production |
| `--quick` | ligne à ligne au lieu de tout charger en RAM, sur les grosses tables |
| `--routines --triggers --events` | embarque procédures, triggers et events ; **pas inclus par défaut** pour les routines et events |
| `--no-tablespaces` | évite l'erreur `Access denied ... PROCESS privilege` sur MySQL 8 quand l'utilisateur n'est pas root |
| `--column-statistics=0` | à mettre quand un client 8.0 dumpe un serveur 5.7 (`Unknown table 'COLUMN_STATISTICS'`) |
| `--set-gtid-purged=OFF` | évite un dump qui refuse de s'importer ailleurs à cause du GTID |
| `--default-character-set=utf8mb4` | force l'encodage, contre les accents cassés |

`--single-transaction` ne protège que les tables InnoDB : une table MyISAM au
milieu du dump est lue sans garantie de cohérence.

## Importer

```sh
mysql -u root -p ma_base < dump.sql
gunzip < dump.sql.gz | mysql -u root -p ma_base
pv dump.sql | mysql -u root -p ma_base        # avec barre de progression
```

La base doit **exister avant** l'import : un dump d'une seule base ne contient
ni `CREATE DATABASE` ni `USE` (sauf `--databases` ou `--all-databases`).

```sh
mysql -u root -p -e "CREATE DATABASE ma_base CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -p ma_base < dump.sql
```

Sur un gros dump, désactiver les vérifications accélère beaucoup :

```sh
{ echo "SET autocommit=0; SET unique_checks=0; SET foreign_key_checks=0;"
  cat dump.sql
  echo "COMMIT;"; } | mysql -u root -p ma_base
```

## Un dump qui contient un DEFINER

Le symptôme, à l'import :

```
ERROR 1227 (42000): Access denied; you need (at least one of) the SUPER privilege(s)
ERROR 1449 (HY000): The user specified as a definer ('root'@'%') does not exist
```

Les vues, triggers, procédures stockées et events portent tous une clause
`DEFINER=` qui nomme l'utilisateur du serveur d'origine. Sur la machine
d'arrivée, cet utilisateur n'existe pas — ou l'utilisateur qui importe n'a pas
le droit de créer un objet au nom d'un autre.

La façon la plus courte, sur le fichier :

```sh
sed 's/DEFINER=[^ ]*//g' Dump20251008.sql > Dump_clean.sql
mysql -u app -p ma_base < Dump_clean.sql
```

Sans écrire de second fichier, en passant directement au client :

```sh
sed 's/DEFINER=[^ ]*//g' Dump20251008.sql | mysql -u app -p ma_base
gunzip < dump.sql.gz | sed 's/DEFINER=[^ ]*//g' | mysql -u app -p ma_base
```

Retirer le `DEFINER` fait tomber l'objet sur un défaut sûr : il est créé au nom
de l'utilisateur qui importe. Pour les vues et les procédures, ajouter en plus
le passage en `INVOKER` — les droits sont alors ceux de l'appelant, pas ceux du
créateur :

```sh
sed -e 's/DEFINER=[^ ]*//g' -e 's/SQL SECURITY DEFINER/SQL SECURITY INVOKER/g' \
    dump.sql > dump_clean.sql
```

Attention à l'ordre des deux motifs : `DEFINER=` avec le signe égal ne touche
que la clause du propriétaire, jamais le `SQL SECURITY DEFINER` — c'est pour ça
que les deux `-e` cohabitent sans se marcher dessus.

L'alternative, quand on garde la main sur le serveur : **créer l'utilisateur
manquant** plutôt que réécrire le dump.

```sql
CREATE USER 'root'@'%' IDENTIFIED BY 'motdepasse';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%';
```

À réserver aux cas où ce compte a une raison d'exister : recréer un `'root'@'%'`
pour faire passer un import, c'est ouvrir root depuis n'importe quelle IP.

Le mieux reste de **ne pas les mettre dans le dump** : `mysqlpump --skip-definer`
produit directement un dump sans clause `DEFINER` (`mysqlpump` est déprécié
depuis MySQL 8.0.34, mais toujours livré ; `mysqldump` n'a pas d'équivalent).

## Pièges

- Le `sed` ci-dessus s'appuie sur le fait qu'un `DEFINER=` produit par
  mysqldump est toujours suivi d'une espace (la forme exacte étant
  ``DEFINER=`root`@`localhost` ``). Un nom d'utilisateur **contenant une
  espace** casserait le motif ; c'est rarissime, mais si le dump refuse
  toujours, c'est la première chose à regarder.
- Vérifier ce qu'on s'apprête à retirer avant de le retirer :
  `grep -c 'DEFINER=' dump.sql` puis `grep -o 'DEFINER=[^ ]*' dump.sql | sort -u`.
- Un import n'écrase pas ce qui existe déjà : les `CREATE TABLE` échouent sur
  une base non vide. Pour rejouer proprement, dumper avec `--add-drop-table`
  (actif par défaut) ou repartir d'une base fraîchement créée.
- `mysql < dump.sql` **s'arrête à la première erreur** ; `--force` continue et
  laisse une base à moitié importée. Sans `--force`, lire le numéro de ligne de
  l'erreur et l'ouvrir avec `sed -n '12340,12350p' dump.sql`.
- Un dump n'est pas une sauvegarde tant qu'il n'a pas été réimporté au moins une
  fois ailleurs.

## Voir aussi

- [MySQL / MariaDB : commandes courantes](mysql.md)
- [PostgreSQL : dumps et restaurations](postgres-dumps.md)
- <https://dev.mysql.com/doc/refman/8.0/en/mysqldump.html>
