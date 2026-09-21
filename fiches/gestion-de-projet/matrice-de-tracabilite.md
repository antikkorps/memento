---
title: "RTM : tracer une exigence de l'origine au test"
tags: [gestion-de-projet, recueil-du-besoin]
created: 2026-09-21
updated: 2026-09-21
status: stable
---

## En bref

La **matrice de traçabilité des exigences** (*RTM — Requirements Traceability
Matrix*) relie chaque exigence à sa source en amont et à ce qui la réalise en
aval : conception, développement, cas de test, livraison. Elle répond à trois
questions qu'on ne sait pas trancher autrement — **est-ce testé ? d'où ça
vient ? qu'est-ce qui casse si je le change ?**

## Les colonnes

| Colonne | Contenu |
| --- | --- |
| **Id** | `EXG-014` — **stable**, jamais réattribué |
| Description | l'exigence, une phrase, un seul verbe |
| **Source** | qui l'a demandée, dans quel atelier, à quelle date |
| Objectif | l'objectif métier servi ([matrice de cohérence](matrice-de-coherence.md)) |
| Priorité | [MoSCoW](moscow.md) |
| Exigences liées | dépendances, exigences parentes ou dérivées |
| Élément de conception | module, écran, service concerné |
| **Cas de test** | `TST-031`, `TST-032` — la colonne qui fait la recette |
| Statut | à spécifier / spécifiée / développée / testée / recettée |
| Livraison | le lot dans lequel elle part |

Toutes ne sont pas obligatoires : sur un petit projet, **Id, description,
source, priorité, cas de test, statut** suffisent — et c'est déjà beaucoup plus
que ce que la plupart des projets tiennent.

## Les deux sens de traçabilité

```text
amont   objectif métier → besoin exprimé → exigence
                                            │
aval                                        ├→ élément de conception
                                            ├→ développement / livrable
                                            └→ cas de test → PV de recette
```

- **Amont** : à quoi sert cette exigence ? Une exigence sans source remontante
  est une exigence que personne n'a demandée — du
  [gold plating](derives-de-perimetre.md) ou un
  [implicite](exigences-implicites.md) mal rangé.
- **Aval** : est-elle réalisée et prouvée ? Une exigence sans cas de test ne
  sera pas recettée : elle passera en production sans que personne n'ait vérifié
  qu'elle fonctionne.

## Les trois usages réels

1. **Couverture** — avant la recette, filtrer la colonne « cas de test » sur les
   cases vides. Ce sont les trous du plan de test, et ils se trouvent en trente
   secondes.
2. **Analyse d'impact** — « le métier veut changer la règle de calcul » : la
   matrice donne immédiatement les exigences liées, les écrans et les tests à
   rejouer. Sans elle, l'estimation du changement est une conjecture.
3. **Justification** — en fin de projet, elle prouve ligne à ligne que le
   périmètre contractuel est livré. C'est la pièce qui clôt une recette
   contestée.

## L'identifiant stable est la clé de voûte

Tout repose sur lui. Un identifiant ne se réutilise jamais, ne se renumérote
jamais, et ne se déduit **jamais** d'un numéro de ligne du tableur : la première
insertion au milieu casserait tous les liens en silence. Une exigence supprimée
garde son identifiant, avec le statut « abandonnée » — c'est la trace de la
décision.

## Où la tenir

Un tableur suffit et reste le plus courant. Il tient tant que le projet est
petit et qu'**une personne nommée** en a la charge ; au-delà de quelques
centaines d'exigences ou de plusieurs contributeurs simultanés, un outil de
gestion des exigences ou un suivi de tickets avec liens explicites évite les
copies divergentes. Le choix importe moins que la règle : **un seul exemplaire
fait foi.**

## Pièges

- **La remplir en fin de projet.** C'est l'échec classique : elle devient un
  document de conformité produit après coup, qui n'a rien attrapé. Elle se
  remplit au fil de l'eau, dès la première exigence écrite.
- **Renuméroter les identifiants.** Un tri de colonne, une insertion, et toutes
  les références croisées mentent. Voir ci-dessus.
- **Trente colonnes.** Une matrice trop riche n'est plus maintenue, donc fausse,
  donc pire qu'absente. Commencer minimal, ajouter une colonne quand elle
  manque réellement.
- **Pas de propriétaire.** Comme le
  [journal des décisions](journal-des-decisions.md), elle meurt sans une
  personne responsable de sa mise à jour.
- **Confondre avec la [matrice de cohérence](matrice-de-coherence.md).** La
  cohérence regarde vers le haut (à quoi ça sert), la traçabilité vers le bas
  (est-ce fait et prouvé). En pratique la première devient une colonne de la
  seconde.
- **Une exigence, plusieurs comportements.** Une exigence qui contient « et »
  ne se trace pas proprement : son cas de test sera partiellement vert. La
  scinder au moment de l'écrire ([normes IEEE](normes-ieee.md)).

## Voir aussi

- [Normes IEEE : le plan type d'une spécification d'exigences](normes-ieee.md)
- [Matrice de cohérence : relier objectifs, besoins et solutions](matrice-de-coherence.md)
- [MoSCoW : prioriser ce qui sera livré](moscow.md)
- [Exigences implicites : ce que le client ne dit pas](exigences-implicites.md)
- [User stories : exprimer le besoin côté utilisateur](user-stories.md)
