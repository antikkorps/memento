---
title: "Normes IEEE : le plan type d'une spécification d'exigences"
tags: [gestion-de-projet, recueil-du-besoin, reference]
created: 2026-09-21
updated: 2026-09-21
status: stable
---

## En bref

**IEEE 830** donne le plan type et les critères de qualité d'un document de
spécification des exigences logicielles (*SRS — Software Requirements
Specification*), c'est-à-dire d'un cahier des charges fonctionnel. Elle est
formellement remplacée par **ISO/IEC/IEEE 29148**, mais c'est son plan en trois
parties qui reste enseigné et repris dans les modèles de documents.

## Les normes qu'on croise sur un projet SI

| Norme | Objet |
| --- | --- |
| **IEEE 830-1998** | spécification des exigences (*SRS*) — la plus citée |
| ISO/IEC/IEEE **29148**:2018 | la remplaçante : ingénierie des exigences, cycle complet |
| IEEE 1016 | description de la conception logicielle (*SDD*) |
| IEEE 829 / ISO 29119 | documentation de test (plan, cas, rapport) |
| IEEE 1058 | plan de management de projet logiciel |
| ISO/IEC 25010 | qualité logicielle : les caractéristiques non fonctionnelles |

## Le plan type IEEE 830

```text
1. Introduction
   1.1 Objet du document      1.4 Références
   1.2 Portée du produit      1.5 Vue d'ensemble du document
   1.3 Définitions, acronymes
2. Description générale
   2.1 Contexte et place du produit dans le SI existant
   2.2 Grandes fonctions      2.4 Contraintes générales
   2.3 Profils utilisateurs   2.5 Hypothèses et dépendances
3. Exigences spécifiques
   3.1 Interfaces externes (utilisateur, matériel, logiciel, communication)
   3.2 Exigences fonctionnelles
   3.3 Exigences de performance
   3.4 Contraintes de conception
   3.5 Attributs qualité (fiabilité, disponibilité, sécurité, maintenabilité)
```

La partie **2 est descriptive** (le contexte, lisible par tous), la **partie 3
est contractuelle** (ce sur quoi on recettera). C'est la seule distinction à
retenir si l'on ne retient qu'une chose.

## Les huit qualités d'une bonne exigence

| Qualité | Ce qu'elle interdit |
| --- | --- |
| **Correcte** | une exigence que personne n'a demandée |
| **Non ambiguë** | une seule lecture possible — pas « rapide », « convivial » |
| **Complète** | pas de « à définir », pas de cas d'erreur oublié |
| **Cohérente** | aucune exigence n'en contredit une autre |
| **Priorisée** | chacune porte son importance ([MoSCoW](moscow.md)) |
| **Vérifiable** | on sait écrire le test qui prouve qu'elle est tenue |
| **Modifiable** | structure et identifiants stables, pas de redite |
| **Traçable** | on remonte à son origine et on descend à son test ([RTM](matrice-de-tracabilite.md)) |

## Le vocabulaire normatif : doit / devrait / peut

L'anglais des normes distingue trois niveaux, à reproduire tels quels en
français — un mot flou ici, et la force juridique de l'exigence disparaît.

| Anglais | Français | Sens |
| --- | --- | --- |
| *shall* | **doit** | exigence obligatoire, opposable |
| *should* | **devrait** | recommandation, écart à justifier |
| *may* | **peut** | option, laissée au fournisseur |

## Fonctionnel et non fonctionnel

- **Exigence fonctionnelle** : ce que le système *fait*. « Le système doit
  exporter les bulletins au format PDF. »
- **Exigence non fonctionnelle** : *comment* il le fait — performance, sécurité,
  disponibilité, ergonomie, exploitabilité. C'est le gisement des
  [exigences implicites](exigences-implicites.md), et la cause la plus fréquente
  de refus en recette.

Une exigence, un identifiant stable, une phrase : `EXG-014 — Le système doit …`.
Deux verbes dans la même exigence, c'est deux exigences.

## Pièges

- **L'adjectif non mesurable.** « Rapide », « ergonomique », « robuste » ne sont
  pas des exigences : elles ne se testent pas. Chiffrer, ou supprimer — c'est
  la [grille SMART](objectifs-smart.md) appliquée à l'exigence.
- **« etc. », « le cas échéant », « si nécessaire ».** Chacun de ces mots est un
  litige de recette en puissance.
- **Décrire la solution au lieu du besoin.** « Une table `export_log` » est une
  décision de conception, elle n'a rien à faire dans le SRS.
- **Le SRS écrit une fois et jamais rouvert.** Un document non maintenu est pire
  que pas de document : on s'y fie et il ment. Voir la
  [spécification progressive](specification-progressive.md).
- **Aucune priorité.** Sans priorisation, l'arbitrage se fera en fin de projet,
  dans l'urgence, par celui qui parle le plus fort.
- **Le plan pris au pied de la lettre.** Les 3 parties sont un cadre à adapter,
  pas un formulaire : un SRS de 80 pages pour un projet de 20 jours ne sera lu
  par personne.

## Voir aussi

- [Norme AFNOR NF X50-151 : le cahier des charges fonctionnel](afnor-nf-x50-151.md)
- [RTM : tracer une exigence de l'origine au test](matrice-de-tracabilite.md)
- [Matrice de cohérence : relier objectifs, besoins et solutions](matrice-de-coherence.md)
- [Exigences implicites : ce que le client ne dit pas](exigences-implicites.md)
- [MoSCoW : prioriser ce qui sera livré](moscow.md)
- [User stories : exprimer le besoin côté utilisateur](user-stories.md)
- <https://standards.ieee.org/ieee/29148/6937/>
