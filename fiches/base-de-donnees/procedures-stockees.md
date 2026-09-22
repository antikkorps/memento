---
title: "SQL : procédures stockées et fonctions"
tags: [base-de-donnees]
created: 2026-09-22
updated: 2026-09-22
status: brouillon
---

## En bref

Un bloc de code SQL enregistré **côté serveur** et appelé par son nom. Deux
formes : la **fonction** (*function*) renvoie une valeur et s'appelle dans un
`SELECT` ; la **procédure stockée** (*stored procedure*) fait des effets de bord
et s'appelle avec `CALL`. C'est le cas SQL où **MySQL et Postgres divergent le
plus** — délimiteur et langage sont différents, d'où les deux blocs complets.

## PostgreSQL — dollar-quoting `$$`

```sql
-- fonction : renvoie une valeur, appelee dans un SELECT
CREATE OR REPLACE FUNCTION total_ttc(ht numeric)
RETURNS numeric
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN ht * 1.20;
END;
$$;

SELECT total_ttc(100);        -- 120

-- procedure stockee (PostgreSQL 11+) : effets de bord, appelee avec CALL
CREATE PROCEDURE archive_anciens()
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM log WHERE cree < now() - interval '1 year';
END;
$$;

CALL archive_anciens();
```

Le corps est encadré par `$$ ... $$` (*dollar-quoting*) : pas besoin de toucher
au délimiteur. `LANGUAGE plpgsql` est **explicite**.

## MySQL / MariaDB — `DELIMITER`

```sql
-- dans le client mysql : changer le delimiteur, car ; termine chaque instruction
DELIMITER //

CREATE FUNCTION total_ttc(ht DECIMAL(10,2))
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
  RETURN ht * 1.20;
END //

CREATE PROCEDURE archive_anciens()
BEGIN
  DELETE FROM log WHERE cree < NOW() - INTERVAL 1 YEAR;
END //

DELIMITER ;          -- restaurer le delimiteur habituel

CALL archive_anciens();
SELECT total_ttc(100);
```

Sans le changement de délimiteur, le client couperait la définition au **premier
`;` interne** au corps.

## Correspondance

| Point | MySQL / MariaDB | PostgreSQL |
| --- | --- | --- |
| Délimiteur du corps | `DELIMITER //` puis restaurer | `$$ ... $$` (dollar-quoting) |
| Langage | implicite | explicite (`LANGUAGE plpgsql`) |
| Variable locale | `DECLARE v INT;` | `DECLARE v int;` |
| Appeler une fonction | `SELECT total_ttc(100)` | `SELECT total_ttc(100)` |
| Appeler une procédure | `CALL archive_anciens()` | `CALL archive_anciens()` |
| Supprimer | `DROP FUNCTION nom` / `DROP PROCEDURE nom` | idem |

## Pièges

- **MySQL, le piège classique** : sans `DELIMITER //`, le client s'arrête au
  premier `;` du corps et renvoie une erreur de syntaxe. Réflexe : `DELIMITER //`
  avant, `DELIMITER ;` après — dans le client comme dans un fichier `.sql` chargé.
- **MySQL, fonctions** : souvent besoin de `DETERMINISTIC` (ou `READS SQL DATA`),
  sinon création refusée quand `log_bin_trust_function_creators` est désactivé.
- **Postgres** : seule la **procédure** (`CALL`) peut gérer une transaction
  (`COMMIT` / `ROLLBACK`) ; une fonction ne le peut pas.
- Le corps vit **dans la base**, pas dans le dépôt. Le versionner dans un fichier
  `.sql` du projet, sinon il n'existe qu'à un seul endroit — le serveur.

## Voir aussi

- [SQL : vues (VIEW, vue matérialisée)](vues.md)
- [PostgreSQL : commandes courantes](postgres.md)
- [MySQL / MariaDB : commandes courantes](mysql.md)
