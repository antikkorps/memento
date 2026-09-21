---
title: "Matrice de cohérence : relier objectifs, besoins et solutions"
tags: [gestion-de-projet, recueil-du-besoin]
created: 2026-09-21
updated: 2026-09-21
status: stable
---

## En bref

Un tableau croisé qui confronte deux niveaux du projet — typiquement les
**objectifs** en colonnes et les **exigences** en lignes — pour vérifier que
chacun justifie l'autre. Elle ne se lit pas case par case : elle se lit **par
ligne vide et par colonne vide**. Ce sont les trous qui parlent.

## La matrice

| Exigence | O1 Réduire la ressaisie | O2 Fiabiliser la paie | O3 Tracer les accès |
| --- | :---: | :---: | :---: |
| EXG-01 Export PDF des bulletins | ✕ | | |
| EXG-02 Contrôle de cohérence des taux | | ✕ | |
| EXG-03 Interface avec le SIRH | ✕ | ✕ | |
| EXG-04 Thème graphique personnalisable | | | |
| EXG-05 Journal des consultations | | | ✕ |

## Les deux lectures

- **Une ligne sans croix** : une exigence qui ne sert aucun objectif. Soit il
  manque un objectif au cadrage, soit c'est une fonction que personne n'a
  demandée — du [gold plating](derives-de-perimetre.md) attrapé avant d'avoir
  coûté quoi que ce soit. EXG-04 ci-dessus est le cas d'école.
- **Une colonne sans croix** : un objectif que rien ne couvre. C'est le trou
  qu'on découvre sinon en recette, quand le sponsor demande où est passé son
  enjeu.

Une croix se justifie en une phrase, sinon ce n'est pas une croix. L'exercice a
de la valeur **au moment où on le remplit**, pas une fois rempli : c'est là que
les désaccords sortent.

## Ce qu'on croise, selon le moment

| Lignes | Colonnes | Ce que ça contrôle |
| --- | --- | --- |
| Exigences | Objectifs métier | la justification de chaque exigence |
| Exigences | Processus ou acteurs | qui est impacté, qui a été oublié |
| Fonctions livrées | Exigences | la couverture du périmètre |
| Besoins | Solutions du marché | le choix d'un progiciel (grille de dépouillement) |

## Cohérence ou traçabilité ?

Les deux matrices se ressemblent et ne servent pas au même moment.

| | Matrice de cohérence | [RTM](matrice-de-tracabilite.md) |
| --- | --- | --- |
| Regarde | **vers l'amont** : le pourquoi | **vers l'aval** : le comment |
| Relie | exigence ↔ objectif, besoin ↔ enjeu | exigence ↔ conception ↔ test |
| Répond à | « à quoi ça sert ? » | « est-ce testé, qu'est-ce qui casse si je le change ? » |
| Moment | cadrage, fin de recueil du besoin | conception jusqu'à la recette |

En pratique, la matrice de cohérence devient souvent la **colonne de gauche** de
la RTM : l'objectif d'origine y reste attaché à l'exigence pour toute la vie du
projet.

## Pièges

- **Des croix partout.** Une matrice pleine ne discrimine rien : c'est le signe
  que les objectifs sont trop généraux (« améliorer le SI »). Si tout sert à
  tout, redécouper les objectifs.
- **La remplir seul, après coup, pour la faire valider.** Elle devient un
  exercice de justification et n'attrape plus rien. Elle se remplit en atelier,
  avec ceux qui ont exprimé le besoin.
- **Trop d'axes.** Au-delà d'une dizaine de colonnes, plus personne ne la lit.
  Croiser deux niveaux à la fois, quitte à faire deux matrices.
- **Ne pas la rejouer quand les objectifs changent.** Un changement de sponsor
  ou de stratégie rend des exigences orphelines : c'est exactement le moment de
  la relire, et l'occasion de supprimer du périmètre.
- **Confondre « couvert » et « bien couvert ».** La croix dit qu'un lien existe,
  pas qu'il est suffisant. La colonne O2 peut être cochée par une exigence
  marginale.

## Voir aussi

- [La matrice de conformité croisée](matrice-conformite.md)
- [RTM : tracer une exigence de l'origine au test](matrice-de-tracabilite.md)
- [Normes IEEE : le plan type d'une spécification d'exigences](normes-ieee.md)
- [La grille SMART : rendre un objectif vérifiable](objectifs-smart.md)
- [Scope creep et gold plating : les dérives de périmètre](derives-de-perimetre.md)
