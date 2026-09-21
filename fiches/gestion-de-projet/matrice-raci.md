---
title: "Matrice RACI : qui fait quoi sur chaque tâche"
tags: [gestion-de-projet, reference]
created: 2026-09-21
updated: 2026-09-21
status: stable
---

## En bref

Un tableau qui croise les **activités ou livrables** (en lignes) et les
**acteurs** (en colonnes), et attribue à chaque intersection un rôle parmi
quatre. Son objet réel n'est pas de documenter l'organisation : c'est de faire
apparaître, au moment où on la remplit, les tâches dont **personne ne se croyait
chargé**.

## Les quatre lettres

| Lettre | Rôle | Ce que ça veut dire |
| --- | --- | --- |
| **R** | *Responsible* — **réalise** | fait le travail ; peut être plusieurs |
| **A** | *Accountable* — **rend des comptes** | décide, valide, assume — **un seul par ligne** |
| **C** | *Consulted* — **consulté** | donne un avis **avant**, dans un échange à double sens |
| **I** | *Informed* — **informé** | prévenu **après**, sens unique, pas de droit de veto |

La distinction qui compte est **C vs I** : le C bloque tant qu'il n'a pas
répondu, le I ne bloque rien. Chaque C ajouté est un délai supplémentaire
accepté sciemment.

En français on croise *Réalise / Approuve / Consulté / Informé*, qui conserve
l'acronyme.

## Un exemple

| Activité | Chef de projet | Sponsor (MOA) | Métier | MOE | RSSI |
| --- | :---: | :---: | :---: | :---: | :---: |
| Rédiger l'expression de besoin | **A** | I | **R** | C | I |
| Valider le cahier des charges | R | **A** | C | C | C |
| Choisir la solution | R | **A** | C | C | C |
| Développer | I | I | I | **RA** | I |
| Recetter | **A** | I | **R** | C | I |
| Autoriser la mise en production | R | **A** | I | C | **C** |

## Les règles d'or

1. **Exactement un A par ligne.** Deux A, et l'arbitrage n'a pas de propriétaire
   — c'est la règle qui donne sa valeur à l'exercice.
2. **Au moins un R par ligne.** Une ligne sans R est une tâche que personne ne
   fait.
3. **A et R peuvent être la même personne** (noté `RA`), mais ce sont deux
   choses différentes : faire et répondre de.
4. **Économiser les C.** Consulter tout le monde sur tout, c'est ne rien
   décider. En cas de doute : I.
5. **Rester au niveau du livrable.** Une bonne matrice tient sur une page, 10 à
   20 lignes. Au-delà, c'est une fiche de poste déguisée.

## Comment la lire

- **Par ligne** — pas de R : personne ne fait. Deux A : personne ne tranche.
  Que des I : la ligne n'existe pas vraiment.
- **Par colonne** — un acteur avec des R partout est le futur goulot
  d'étranglement. Un acteur qui n'a que des I : pourquoi est-il dans la
  matrice ? Un acteur avec tous les A : il ne délègue rien, le projet s'arrêtera
  à ses congés.

Elle se construit **avec les intéressés**, pas pour eux — sinon elle décrit une
organisation à laquelle personne n'a consenti, et elle ne sera pas appliquée.

## Les variantes

| Variante | Ajout |
| --- | --- |
| **RASCI** | **S**upport : apporte des moyens au R (différent du C qui donne un avis) |
| **RACI-VS** | **V**erifier (contrôle le livrable) et **S**ignatory (signe formellement) |
| **DACI** | orientée décision : *Driver, Approver, Contributor, Informed* |
| **RAPID** | idem, chez Bain : *Recommend, Agree, Perform, Input, Decide* |

Sur un projet SI courant, le RACI simple suffit. Les variantes se justifient
quand la validation formelle est séparée de la décision (marché public,
environnement réglementé).

## Pièges

- **Deux A sur une ligne.** Le défaut le plus fréquent, et celui qui coûte le
  plus : chacun attend que l'autre tranche, la décision n'arrive jamais.
- **Confondre le A et la hiérarchie.** Le A est celui qui rend des comptes sur
  *cette* activité, pas le plus gradé de la colonne. Un chef de projet peut être
  A là où son directeur est I.
- **Une matrice écrite par le chef de projet, seul, la veille du comité.** Elle
  sera présentée, approuvée d'un hochement de tête, et jamais suivie.
- **Trop de C.** Chaque consultation est un aller-retour ; six C sur une ligne,
  c'est trois semaines de délai que personne n'a chiffrées.
- **Trop fine.** Descendre à la tâche élémentaire produit une matrice de 80
  lignes que plus personne n'ouvre. Rester au livrable.
- **Jamais mise à jour.** Un changement de sponsor ou de prestataire la périme
  entièrement ; la relire à chaque jalon, comme la
  [carte des parties prenantes](parties-prenantes.md).
- **La prendre pour un contrat.** Elle clarifie les rôles ; elle ne remplace ni
  le dialogue ni le [journal des décisions](journal-des-decisions.md).

## Voir aussi

- [Cartographier les parties prenantes d'un projet SI](parties-prenantes.md)
- [Journal des décisions : tracer les arbitrages](journal-des-decisions.md)
- [Animer un atelier de recueil du besoin](ateliers-recueil-besoin.md)
- <https://www.mindtools.com/a7vyoa9/the-raci-matrix>
