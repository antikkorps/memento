---
title: "SQL : jointures (JOIN, LEFT, anti-jointure)"
tags: [base-de-donnees]
created: 2026-09-22
updated: 2026-09-22
status: brouillon
---

## En bref

Combiner deux tables sur une clé commune. Le réflexe qui tranche : **je ne veux
que les lignes appariées des deux côtés** → `INNER JOIN` ; **je veux toutes
les lignes de gauche, appariées ou non** → `LEFT JOIN`. La syntaxe est standard
(*ANSI*) et identique MySQL / Postgres, sauf `FULL OUTER JOIN` (voir plus bas).

Exemples ci-dessous : `client (id, nom)` et `commande (id, client_id, montant)`.

## L'essentiel

```sql
-- INNER : seulement les clients qui ont au moins une commande
SELECT c.nom, o.montant
FROM client c
JOIN commande o ON o.client_id = c.id;

-- LEFT : TOUS les clients ; montant NULL si aucune commande
SELECT c.nom, o.montant
FROM client c
LEFT JOIN commande o ON o.client_id = c.id;
```

`JOIN` seul = `INNER JOIN` (le mot `INNER` est optionnel). L'alias de table
(`client c`) évite de répéter le nom et rend le `ON` lisible.

## Types de jointure

| Jointure | Ce qu'elle garde |
| --- | --- |
| `INNER JOIN` | seulement les lignes appariées des deux côtés |
| `LEFT JOIN` | toutes celles de gauche + appariées de droite (`NULL` sinon) |
| `RIGHT JOIN` | miroir de `LEFT` : toutes celles de droite |
| `FULL OUTER JOIN` | tout, des deux côtés (`NULL` là où ça n'apparie pas) |
| `CROSS JOIN` | produit cartésien : chaque ligne de A × chaque ligne de B |

## Anti-jointure : les lignes sans correspondance

```sql
-- les clients qui n'ont JAMAIS commande
SELECT c.nom
FROM client c
LEFT JOIN commande o ON o.client_id = c.id
WHERE o.id IS NULL;
```

Le motif **`LEFT JOIN` + `WHERE <droite> IS NULL`** : on garde tout à gauche,
puis on ne retient que les lignes où la droite est restée vide. C'est *l'anti-
jointure* (*anti-join*), la réponse à « ceux de A qui ne sont pas dans B ».

## Auto-jointure et USING

```sql
-- auto-jointure : rattacher chaque employe a son manager (meme table)
SELECT e.nom AS employe, m.nom AS manager
FROM employe e
LEFT JOIN employe m ON m.id = e.manager_id;

-- USING : raccourci quand la colonne porte le MEME nom des deux cotes
SELECT * FROM commande JOIN client USING (client_id);
```

## MySQL vs PostgreSQL

| Besoin | MySQL / MariaDB | PostgreSQL |
| --- | --- | --- |
| `INNER` / `LEFT` / `RIGHT` / `CROSS` | identique | identique |
| `FULL OUTER JOIN` | **absent** (à émuler, ci-dessous) | natif |
| forcer l'ordre de jointure | `STRAIGHT_JOIN` | pas d'équivalent (voir `EXPLAIN`) |

```sql
-- FULL OUTER JOIN en MySQL : union d'un LEFT et d'un RIGHT
SELECT c.nom, o.montant FROM client c LEFT JOIN commande o ON o.client_id = c.id
UNION
SELECT c.nom, o.montant FROM client c RIGHT JOIN commande o ON o.client_id = c.id;
```

## Pièges

- **Oublier le `ON`** (ou se tromper de colonne) transforme la requête en produit
  cartésien géant : chaque ligne de A multipliée par chaque ligne de B.
- **`LEFT JOIN` puis filtrer la table de droite dans le `WHERE`** annule le
  `LEFT` : la condition élimine les lignes où la droite est `NULL`. Mettre alors
  la condition **dans le `ON`**, pas dans le `WHERE`.
- `INNER JOIN` et `JOIN` sont strictement équivalents.

## Voir aussi

- [SQL : valeurs nulles (COALESCE, IFNULL, NULLIF)](valeurs-nulles.md)
- [PostgreSQL : commandes courantes](postgres.md)
- [MySQL / MariaDB : commandes courantes](mysql.md)
