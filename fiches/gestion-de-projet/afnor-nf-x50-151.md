---
title: "Norme AFNOR NF X50-151 : le cahier des charges fonctionnel"
tags: [gestion-de-projet, recueil-du-besoin]
created: 2026-09-21
updated: 2026-09-21
status: stable
---

## En bref

La norme qui cadre le **cahier des charges fonctionnel** (CdCF) : exprimer le
besoin en termes de **fonctions attendues** — *ce que* le produit doit faire —
sans préjuger *comment* il le fera. On décrit des services rendus, pas des
solutions : la conception reste libre, et le document sert de base contractuelle
et de grille d'évaluation des offres. Son pendant côté génie logiciel est la
*SRS* des [normes IEEE](normes-ieee.md).

## Le principe : fonction, pas solution

Le CdCF est le livrable de l'**analyse fonctionnelle du besoin**. On raisonne en
**fonctions**, chacune reliant le produit à un élément de son environnement (le
*milieu extérieur*).

| Type de fonction | Ce que c'est |
| --- | --- |
| **Fonction principale** (FP) | la raison d'être : relie deux éléments du milieu extérieur *via* le produit |
| **Fonction contrainte** (FC) | une limite imposée par un élément du milieu (norme, coût, sécurité, RGPD…) |

## Caractériser chaque fonction

Une fonction non chiffrée n'est pas vérifiable. La norme impose trois attributs :

- **Critère** — ce sur quoi on juge (temps de réponse, disponibilité…).
- **Niveau** — la valeur attendue (« < 2 s », « 99,9 % »).
- **Flexibilité** — la tolérance autour du niveau, en classes **F0** (impératif,
  aucune marge) à **F3** (très négociable).

## Les outils de l'analyse fonctionnelle

- **Bête à cornes** — cadre le besoin : *à qui/quoi le produit rend-il service ?
  sur quoi agit-il ? dans quel but ?*
- **Diagramme pieuvre** — place le produit au centre, les éléments du milieu
  autour ; chaque lien traduit une fonction (FP ou FC).
- **Diagramme FAST** — décompose une fonction en sous-fonctions, du *pourquoi*
  vers le *comment*.

## Pièges

- **Écrire une solution au lieu d'un besoin.** « un serveur Nginx redondé » est
  une réponse ; le besoin est « rester disponible à 99,9 % ». Le CdCF dit le
  *quoi*, jamais le *comment* — sinon on bride le concepteur et on ferme la porte
  à une meilleure idée.
- **Une fonction non caractérisée** (sans critère / niveau / flexibilité) est
  invérifiable : personne ne pourra dire si l'offre y répond.
- **CdCF ≠ cahier des charges technique.** Le CdCF (côté MOA, le besoin) précède
  le cahier des charges technique (côté MOE, la solution). Les confondre fait
  sauter l'étape où l'on choisit *entre* des solutions.
- **Oublier les fonctions contraintes** (réglementaires, sécurité, RGPD) : ce
  sont elles qui disqualifient une offre séduisante mais non conforme.

## Voir aussi

- [La grille SMART : rendre un objectif vérifiable](objectifs-smart.md)
- [Normes IEEE : le plan type d'une spécification d'exigences](normes-ieee.md)
- [La matrice de conformité croisée](matrice-conformite.md)
- [Animer un atelier de recueil du besoin](ateliers-recueil-besoin.md)
- [User stories : exprimer le besoin côté utilisateur](user-stories.md)
- [Cartographier les parties prenantes d'un projet SI](parties-prenantes.md)
