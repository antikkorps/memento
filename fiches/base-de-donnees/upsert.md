---
title: "SQL : upsert (insérer ou mettre à jour)"
tags: [base-de-donnees]
created: 2026-09-22
updated: 2026-09-22
status: brouillon
---

## En bref

Insérer une ligne, mais **si la clé existe déjà, mettre à jour au lieu
d'échouer** : c'est l'*upsert* (*insert* + *update*). La syntaxe est
**totalement différente** entre les deux moteurs — d'où les deux blocs côte à
côte. Le déclencheur commun : un doublon sur une clé primaire ou unique.

## PostgreSQL — `ON CONFLICT`

```sql
-- inserer, ou additionner la quantite si le produit est deja en stock
INSERT INTO stock (produit_id, quantite)
VALUES (42, 10)
ON CONFLICT (produit_id)
DO UPDATE SET quantite = stock.quantite + EXCLUDED.quantite;

-- inserer, ou ne rien faire si deja present (cle unique / cle primaire en double)
INSERT INTO stock (produit_id, quantite) VALUES (42, 10)
ON CONFLICT (produit_id) DO NOTHING;
```

`EXCLUDED` désigne **la ligne qu'on tentait d'insérer**. La cible du conflit est
**explicite** : `ON CONFLICT (produit_id)` exige une contrainte unique ou une
clé primaire sur cette colonne.

## MySQL / MariaDB — `ON DUPLICATE KEY`

```sql
-- forme classique : VALUES(x) = la valeur qu'on tentait d'inserer
INSERT INTO stock (produit_id, quantite)
VALUES (42, 10)
ON DUPLICATE KEY UPDATE quantite = quantite + VALUES(quantite);

-- MySQL 8.0.19+ : alias de ligne, VALUES() etant deprecie
INSERT INTO stock (produit_id, quantite)
VALUES (42, 10) AS new
ON DUPLICATE KEY UPDATE quantite = quantite + new.quantite;

-- inserer, ou ignorer le doublon en silence
INSERT IGNORE INTO stock (produit_id, quantite) VALUES (42, 10);
```

La cible du conflit est **implicite** : ça se déclenche sur **n'importe quelle**
clé unique ou primaire en double.

## Correspondance

| Intention | PostgreSQL | MySQL / MariaDB |
| --- | --- | --- |
| Insérer ou mettre à jour | `ON CONFLICT (col) DO UPDATE` | `ON DUPLICATE KEY UPDATE` |
| Insérer ou ignorer | `ON CONFLICT ... DO NOTHING` | `INSERT IGNORE` |
| Référencer la valeur entrante | `EXCLUDED.col` | `VALUES(col)` ou `new.col` (8.0.19+) |
| Cible du conflit | explicite (`ON CONFLICT (col)`) | implicite (toute clé unique) |

## Pièges

- **Postgres** : `ON CONFLICT (col)` exige une contrainte unique / PK sur `col`,
  sinon erreur. On peut viser une contrainte nommée : `ON CONFLICT ON CONSTRAINT
  nom`.
- **MySQL** se déclenche sur **n'importe quelle** clé unique en double : surprise
  si la table a plusieurs contraintes uniques et que ce n'est pas celle attendue.
- `VALUES(col)` est **déprécié** (MySQL 8.0.20+) : préférer l'alias `AS new`.
- `INSERT IGNORE` avale **aussi d'autres erreurs** (conversions de type,
  troncatures), pas seulement les doublons — à utiliser en connaissance de cause.

## Voir aussi

- [SQL : jointures (JOIN, LEFT, anti-jointure)](jointures.md)
- [PostgreSQL : commandes courantes](postgres.md)
- [MySQL / MariaDB : commandes courantes](mysql.md)
