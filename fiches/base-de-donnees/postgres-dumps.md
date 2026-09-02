---
title: "PostgreSQL : dumps et restaurations"
tags: [base-de-donnees, sauvegarde, procedure]
created: 2026-09-02
updated: 2026-09-02
status: brouillon
---

## En bref

`pg_dump` pour sortir une base, `pg_restore` ou `psql` pour la remettre. Le
piège équivalent au `DEFINER` de MySQL s'appelle ici le **propriétaire** : c'est
`--no-owner` qui le règle.

## Exporter

```sh
pg_dump -U app ma_base > dump.sql                    # format texte, rejouable avec psql
pg_dump -U app -Fc ma_base > dump.dump               # format custom (recommandé)
pg_dump -U app -Fc --no-owner --no-acl ma_base > dump.dump
pg_dump -U app -s ma_base > schema.sql               # structure seule
pg_dump -U app -a ma_base > data.sql                 # données seules
pg_dump -U app -t users -t commandes ma_base > partiel.sql
pg_dump -U app -Fc ma_base | gzip > dump.dump.gz
```

Le format `-Fc` (custom) est compressé, et surtout **restaurable
sélectivement** : on peut en extraire une seule table, réordonner, paralléliser.
Le format texte, lui, ne se rejoue qu'entièrement et dans l'ordre. Prendre `-Fc`
par défaut, `-Fp` (texte) seulement quand on veut relire ou modifier le contenu
à la main.

`pg_dump` ne sauvegarde **qu'une base** : ni les rôles, ni les droits globaux,
ni les tablespaces. Ceux-là sont dans `pg_dumpall` :

```sh
pg_dumpall -U postgres --globals-only > roles.sql   # rôles et mots de passe
pg_dumpall -U postgres > tout.sql                   # tout le cluster, format texte
```

La sauvegarde complète d'un serveur, c'est donc **deux** fichiers : les globals,
plus un `pg_dump -Fc` par base.

## Restaurer

```sh
createdb -U postgres -O app ma_base

psql -U app -d ma_base -v ON_ERROR_STOP=1 -f dump.sql     # dump texte
pg_restore -U app -d ma_base dump.dump                    # dump custom
pg_restore -U app -d ma_base --no-owner --role=app -j 4 dump.dump
pg_restore -U postgres -C -d postgres dump.dump           # crée la base au passage
```

La base doit exister avant, sauf avec `-C` (qui se connecte alors à une **autre**
base, d'où le `-d postgres`).

Inspecter ou filtrer un dump custom sans le restaurer :

```sh
pg_restore -l dump.dump > contenu.txt   # la table des matières
pg_restore -L contenu.txt -d ma_base dump.dump   # après avoir commenté des lignes
pg_restore -f - dump.dump | less        # relire le SQL équivalent
```

## Un dump qui vient d'un autre serveur

Le pendant du `DEFINER` MySQL : un dump PostgreSQL contient des
`ALTER TABLE ... OWNER TO ancien_role` et des `GRANT` nommant des rôles qui
n'existent pas sur la machine d'arrivée.

```
ERROR:  role "ancien_role" does not exist
```

Deux façons de s'en sortir, dans cet ordre de préférence :

```sh
# 1. à la restauration : tout appartient au rôle qui restaure
pg_restore -U app -d ma_base --no-owner --no-acl dump.dump

# 2. dès le dump, si on le maîtrise
pg_dump -Fc --no-owner --no-acl ma_base > dump.dump
```

`--no-owner` ignore les changements de propriétaire, `--no-acl` (alias
`--no-privileges`) ignore les `GRANT`/`REVOKE`. Sur un dump **texte**, l'option
est à passer à `pg_dump`, pas à `psql` : un fichier `.sql` déjà produit se
nettoie au `sed`, comme un dump MySQL —

```sh
sed -e '/^ALTER .* OWNER TO /d' -e '/^GRANT /d' -e '/^REVOKE /d' \
    dump.sql > dump_clean.sql
```

— mais c'est le signe qu'il fallait dumper en `-Fc` : `pg_restore --no-owner`
fait la même chose proprement, sans toucher au fichier.

L'alternative, là encore, est de **créer le rôle manquant** avant de restaurer :

```sql
CREATE ROLE ancien_role;   -- sans LOGIN : il ne sert qu'à porter les objets
```

## Pièges

- **`psql -f` ne s'arrête pas aux erreurs** par défaut : il continue, et laisse
  une base à moitié restaurée dont rien ne signale qu'elle est incomplète.
  `-v ON_ERROR_STOP=1` n'est pas une option, c'est le comportement qu'on veut.
- `pg_restore` affiche des erreurs mais renvoie 0 dans certains cas : `-e`
  (`--exit-on-error`) pour qu'un échec en soit vraiment un.
- **Version du client** : `pg_dump` refuse un serveur plus récent que lui
  (`server version mismatch`). Dumper toujours avec un `pg_dump` de version
  ≥ celle du serveur — sur Debian, `/usr/lib/postgresql/<version>/bin/pg_dump`
  permet de choisir.
- Un dump restauré n'a pas de statistiques : lancer `ANALYZE;` derrière, sinon
  les premières requêtes seront lentes sans raison apparente.
- `-j` (parallélisation) ne marche qu'avec `pg_restore` sur un dump `-Fc` ou
  `-Fd`, jamais sur du texte.
- Les extensions (`CREATE EXTENSION`) doivent être installées côté système sur
  la machine d'arrivée : le dump les déclare, il ne les fournit pas.

## Voir aussi

- [PostgreSQL : commandes courantes](postgres.md)
- [MySQL : dumps et imports](mysql-dumps.md)
- <https://www.postgresql.org/docs/current/app-pgdump.html>
