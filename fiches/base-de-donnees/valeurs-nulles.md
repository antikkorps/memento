---
title: "SQL : valeurs nulles (COALESCE, IFNULL, NULLIF)"
tags: [base-de-donnees]
created: 2026-09-22
updated: 2026-09-22
status: brouillon
---

## En bref

Manipuler les valeurs nulles (*null*) : remplacer une valeur nulle par une
valeur par défaut, ou au contraire transformer une valeur en `NULL`. Le réflexe qui
tranche : **j'ai un `NULL` et je veux autre chose** → `COALESCE` ; **j'ai une
valeur et je veux la neutraliser en `NULL`** → `NULLIF`.

`COALESCE` est standard (*ANSI*) et marche partout — à préférer par défaut.
`IFNULL` est un raccourci MySQL à deux arguments ; Postgres ne l'a pas.

## Remplacer NULL par une valeur par défaut

```sql
SELECT COALESCE(remise, 0) FROM commande;              -- partout : premier non-NULL
SELECT COALESCE(surnom, prenom, 'Anonyme') FROM client; -- en cascade, gauche a droite
SELECT IFNULL(remise, 0) FROM commande;                -- MySQL seulement, deux arguments
```

`COALESCE(a, b, c)` renvoie **le premier argument non nul** de la liste ; si tous
sont `NULL`, le résultat est `NULL`. C'est l'outil du « valeur par défaut ».

## Neutraliser une valeur en NULL

```sql
SELECT NULLIF(total, 0) FROM facture;   -- renvoie NULL si total = 0, sinon total
SELECT montant / NULLIF(quantite, 0);   -- garde-fou anti division par zero
```

`NULLIF(a, b)` renvoie `NULL` si `a = b`, sinon `a`. Standard, identique MySQL et
Postgres. L'usage courant : éviter une division par zéro en transformant le `0`
du dénominateur en `NULL` (une division par `NULL` donne `NULL`, pas une erreur).

## Tester la nullité (WHERE)

```sql
WHERE remise IS NULL           -- jamais `= NULL`, qui est toujours faux
WHERE remise IS NOT NULL
```

**`= NULL` ne marche pas** : en SQL, `NULL` n'est égal à rien, pas même à
lui-même. La comparaison se fait toujours avec `IS NULL` / `IS NOT NULL`.

## MySQL vs PostgreSQL

| Besoin | MySQL / MariaDB | PostgreSQL |
| --- | --- | --- |
| Premier non-NULL | `COALESCE` **ou** `IFNULL(a, b)` | `COALESCE` |
| Valeur → NULL | `NULLIF` | `NULLIF` |
| Oracle-isme `NVL` | absent | absent (utiliser `COALESCE`) |

En clair : **`COALESCE` partout** ; `IFNULL` seulement si tu es sûr d'être sur
MySQL et que deux arguments te suffisent.

## Pièges

- `= NULL` et `!= NULL` sont toujours faux : utiliser `IS NULL` / `IS NOT NULL`.
- `COALESCE` s'arrête au premier non-nul : l'ordre des arguments compte.
- Une agrégation comme `SUM` **ignore** les `NULL` (elle ne les compte pas comme
  `0`) ; `COUNT(colonne)` idem, alors que `COUNT(*)` compte toutes les lignes.

## Voir aussi

- [PostgreSQL : commandes courantes](postgres.md)
- [MySQL / MariaDB : commandes courantes](mysql.md)
- <https://www.postgresql.org/docs/current/functions-conditional.html>
