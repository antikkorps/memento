---
title: "Spécification progressive : préciser au fil de l'eau"
tags: [gestion-de-projet, recueil-du-besoin]
created: 2026-09-21
updated: 2026-09-21
status: stable
---

## En bref

Détailler chaque partie du projet **au moment où l'information existe**, plutôt
que de tout spécifier au départ avec les connaissances du premier jour
(*progressive elaboration*, PMBOK). Le périmètre reste le même : c'est le
**niveau de détail** qui augmente, par vagues.

## Pourquoi : le cône d'incertitude

Au lancement, une estimation est juste à un facteur 4 près ; elle ne se resserre
qu'à mesure que le projet produit de l'information. Spécifier au dernier détail
un lot qui démarre dans dix mois, c'est écrire aujourd'hui des décisions qui
seront fausses — et qu'il faudra défaire.

```text
Cadrage        estimation ×0,25 à ×4     spécifier : les grandes lignes
Conception     ×0,5 à ×2                 spécifier : le lot en cours, en détail
Réalisation    ×0,8 à ×1,25              préciser : les cas limites
```

## Le planning par vagues (*rolling wave planning*)

La déclinaison de la même idée côté planification :

| Horizon | Niveau de détail |
| --- | --- |
| Vague en cours (4 à 8 semaines) | tâches détaillées, charges, affectations nominatives |
| Vague suivante | lots identifiés, charge estimée en ordre de grandeur |
| Au-delà | jalons et livrables seulement |

À chaque fin de vague, la suivante est détaillée avec ce que le projet a appris.
Le planning global existe dès le départ — il est juste **grossier au loin**, et
c'est volontaire.

## Comment on s'y prend

1. **Figer ce qui structure** : objectifs, périmètre, contraintes réglementaires,
   architecture générale. Ce socle ne bouge pas.
2. **Prioriser** ce qui sera détaillé en premier ([MoSCoW](moscow.md)) : les
   *Must* se spécifient tôt, les *Could* attendent.
3. **Détailler juste avant de faire** — assez tôt pour que l'équipe puisse
   travailler, assez tard pour profiter du retour du lot précédent. En agile,
   c'est le raffinement du *backlog*.
4. **Tracer chaque précision** au [journal des décisions](journal-des-decisions.md)
   et dans la [RTM](matrice-de-tracabilite.md) : sinon, six mois plus tard,
   personne ne sait si telle règle vient d'un arbitrage ou d'une interprétation.

## Précision ou dérive ?

La confusion avec le [scope creep](derives-de-perimetre.md) est permanente, et le
critère est simple :

```text
Précision : « le champ SIRET est-il obligatoire ? » → détaille une exigence connue
Dérive    : « et si on gérait aussi les sous-traitants ? » → ajoute une exigence
```

Si la réponse fait apparaître un besoin qui n'était pas dans le périmètre, ce
n'est plus de la spécification progressive : ça passe par l'arbitrage.

## Le point de friction : le forfait

Un marché **au forfait** exige un périmètre et un prix fermes au départ — ce qui
est à l'opposé du principe. Les montages qui tiennent :

- forfait sur un **socle bien connu**, tranches optionnelles pour le reste ;
- **marché à bons de commande** ou régie encadrée pour la partie incertaine ;
- forfait **à périmètre ajustable à budget constant** : le budget et la date
  sont fermes, le contenu s'arbitre par MoSCoW à chaque jalon.

C'est une question à traiter au cadrage, avec les achats. Découverte en cours de
route, elle se règle par avenants, c'est-à-dire mal.

## Pièges

- **Confondre progressif et flou.** Ne pas avoir cadré n'est pas une méthode.
  Sans objectifs ni périmètre figés, il n'y a rien à préciser progressivement —
  juste un projet qui ne sait pas où il va.
- **La spécification perpétuelle.** Chaque lot doit avoir un moment où l'on
  arrête d'affiner et où l'on construit. Sans point de gel, l'équipe attend.
- **Détailler trop tôt « pour avancer ».** Le travail de spécification fait six
  mois à l'avance est jeté ou, pire, appliqué alors qu'il est périmé.
- **Ne pas tracer les précisions.** Les décisions de détail prises à l'oral, en
  vague 3, contredisent celles de la vague 1 et personne ne peut le voir.
- **Le contrat au forfait signé sur des exigences volontairement grossières.**
  Le désaccord est programmé : chacun lira la phrase vague dans son sens.
- **Oublier de re-chiffrer.** Chaque vague détaillée change l'estimation
  globale. Si le budget affiché reste celui du jour 1, le projet ment.

## Voir aussi

- [Scope creep et gold plating : les dérives de périmètre](derives-de-perimetre.md)
- [MoSCoW : prioriser ce qui sera livré](moscow.md)
- [Journal des décisions : tracer les arbitrages](journal-des-decisions.md)
- [Normes IEEE : le plan type d'une spécification d'exigences](normes-ieee.md)
- [Chaos Report : pourquoi les projets SI échouent](chaos-report.md)
