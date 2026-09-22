---
title: "SQL : vues (VIEW, vue matérialisée)"
tags: [base-de-donnees]
created: 2026-09-22
updated: 2026-09-22
status: brouillon
---

## En bref

Une vue (*view*) est une requête `SELECT` enregistrée sous un nom, qu'on
interroge **comme une table**. Elle ne stocke rien : elle est **recalculée à
chaque appel**. Le réflexe : un `SELECT` compliqué que tu réutilises → une vue
pour ne plus le réécrire. Syntaxe standard et identique MySQL / Postgres, sauf
la **vue matérialisée** (voir plus bas).

## L'essentiel

```sql
CREATE VIEW client_actif AS
SELECT id, nom, email FROM client WHERE actif = true;

SELECT * FROM client_actif;              -- s'interroge comme une table

CREATE OR REPLACE VIEW client_actif AS   -- redefinir sans DROP prealable
SELECT id, nom FROM client WHERE actif = true;

DROP VIEW client_actif;
```

## Vue matérialisée (la divergence)

Une vue **matérialisée** stocke réellement le résultat sur disque : rapide à
lire, mais figée jusqu'au prochain rafraîchissement.

```sql
-- vue materialisee : PostgreSQL uniquement
CREATE MATERIALIZED VIEW ventes_mois AS
SELECT mois, SUM(montant) FROM commande GROUP BY mois;

REFRESH MATERIALIZED VIEW ventes_mois;   -- recalculer a la demande
```

**MySQL / MariaDB n'ont pas de vue matérialisée.** On l'émule avec une **vraie
table** qu'on repeuple périodiquement (tâche planifiée, ou `TRUNCATE` +
`INSERT ... SELECT`).

| Besoin | MySQL / MariaDB | PostgreSQL |
| --- | --- | --- |
| Vue simple | `CREATE VIEW` | `CREATE VIEW` |
| `CREATE OR REPLACE VIEW` | oui | oui |
| Vue matérialisée | **absente** (table + rafraîchissement manuel) | `MATERIALIZED VIEW` + `REFRESH` |

## Pièges

- Une vue simple **ne stocke rien** : elle rejoue son `SELECT` à chaque lecture.
  Une vue posée sur une requête lourde reste lourde — elle range, elle
  n'accélère pas.
- Vue **matérialisée** Postgres : les données sont **périmées** entre deux
  `REFRESH`. À rafraîchir explicitement après chaque mise à jour des sources.
- **Écrire à travers une vue** (`INSERT`/`UPDATE` sur la vue) n'est possible que
  si elle est simple : une seule table, sans `GROUP BY`, `DISTINCT` ni agrégat.

## Voir aussi

- [SQL : jointures (JOIN, LEFT, anti-jointure)](jointures.md)
- [SQL : procédures stockées et fonctions](procedures-stockees.md)
- [PostgreSQL : commandes courantes](postgres.md)
- [MySQL / MariaDB : commandes courantes](mysql.md)
