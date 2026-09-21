---
title: "Journal des décisions : tracer les arbitrages"
tags: [gestion-de-projet, procedure]
created: 2026-09-21
updated: 2026-09-21
status: stable
---

## En bref

Un registre unique, tenu tout au long du projet, où chaque décision structurante
est consignée **avec sa raison** (*decision log*). Ce n'est pas un compte-rendu
de réunion : c'est le seul endroit où l'on retrouve, huit mois plus tard,
pourquoi le projet a pris ce chemin plutôt qu'un autre.

## Les colonnes

| Colonne | Contenu |
| --- | --- |
| **Id** | `DEC-014` — stable, jamais renuméroté |
| **Date** | date de la décision, pas de la saisie |
| **Sujet** | la question posée, en une ligne |
| **Options envisagées** | y compris celles écartées — c'est la moitié de la valeur |
| **Décision** | ce qui a été retenu |
| **Raison** | **la colonne irremplaçable** : pourquoi celle-là |
| **Décideur** | une personne nommée (le *A* du [RACI](matrice-raci.md)) |
| **Impacts** | délai, budget, périmètre, risque induit |
| **Statut** | en vigueur / révisée par `DEC-027` / caduque |

## Un exemple

| Id | Date | Sujet | Décision | Raison | Décideur | Statut |
| --- | --- | --- | --- | --- | --- | --- |
| DEC-012 | 2026-09-14 | Reprise de l'historique paie | Reprendre 3 ans, archiver le reste en PDF | Au-delà de 3 ans, aucune obligation légale et le coût de reprise triple | Sponsor (dir. RH) | en vigueur |

## Pourquoi c'est rentable

- **La raison ne se reconstitue pas.** La décision, on la retrouve dans le code
  ou dans le produit. Le contexte qui l'a motivée — la contrainte budgétaire de
  ce trimestre, l'indisponibilité d'un expert, l'arbitrage d'un comité — a
  disparu.
- **Il arrête les redébats.** La même question revient trois fois ; la
  troisième, on cite `DEC-012` et l'on passe à la suite. Sauf si le contexte a
  changé, et alors la décision est révisée — explicitement.
- **Il protège.** En cas de litige avec un prestataire ou de contrôle, une
  décision datée, motivée et nominative vaut mieux que la mémoire de chacun.
- **Il accélère les arrivées.** Un nouvel entrant lit le journal et comprend le
  projet plus vite que par la documentation fonctionnelle.

## Ce qu'on y met, et ce qu'on n'y met pas

**Oui** : tout ce qui est coûteux ou impossible à défaire — périmètre, choix
d'un progiciel ou d'une technologie, arbitrage entre deux parties prenantes,
dérogation à une règle, report d'un lot, acceptation d'un risque.

**Non** : l'opérationnel du quotidien, les actions à faire (elles vont dans le
plan d'actions), les risques (registre des risques). Un journal qui grossit de
dix lignes par semaine ne sera plus relu.

Le critère : **si quelqu'un peut demander « mais pourquoi on a fait comme ça ? »
dans un an, ça se consigne.**

## Voisins et variantes

| Outil | Différence |
| --- | --- |
| Relevé de décisions d'une réunion | attaché à *une* séance ; le journal est transversal et cumulatif |
| **ADR** (*Architecture Decision Record*) | la même idée côté technique : un fichier markdown par décision, versionné avec le code — contexte / décision / conséquences / statut |
| Registre des risques | ce qui **pourrait** arriver ; le journal, ce qui **a été tranché** |
| Registre des changements | les demandes d'évolution du périmètre et leur sort |

Sur un projet SI, le journal de projet et les ADR cohabitent très bien : l'un
côté gouvernance, l'autre dans le dépôt.

## Pièges

- **Noter la décision sans la raison.** Le piège n° 1, et il vide l'outil de son
  intérêt : une ligne sans *pourquoi* n'apprend rien qu'on ne puisse déduire du
  produit lui-même.
- **Ne pas écrire les options rejetées.** Un an plus tard, quelqu'un proposera
  l'option écartée comme une idée neuve, et rien ne permettra de dire qu'elle a
  déjà été examinée.
- **Un journal qui n'a pas de propriétaire.** S'il n'appartient à personne
  nommément (le chef de projet, en général), il s'arrête au bout de trois
  semaines.
- **Y mettre le décideur « le comité ».** Un collectif ne rend pas de comptes.
  Nommer la personne qui a tranché.
- **Ne jamais marquer une décision comme révisée.** Deux lignes contradictoires
  sans lien entre elles, et le journal devient moins fiable que la mémoire.
- **Le tenir dans un outil que le métier ne peut pas ouvrir.** S'il faut un
  compte et trois clics, il ne sera ni écrit ni lu.

## Voir aussi

- [Matrice RACI : qui fait quoi sur chaque tâche](matrice-raci.md)
- [Scope creep et gold plating : les dérives de périmètre](derives-de-perimetre.md)
- [Spécification progressive : préciser au fil de l'eau](specification-progressive.md)
- [Cartographier les parties prenantes d'un projet SI](parties-prenantes.md)
- <https://adr.github.io/>
