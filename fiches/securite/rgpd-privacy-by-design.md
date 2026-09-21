---
title: "RGPD : privacy by design et AIPD"
tags: [securite, gestion-de-projet]
created: 2026-09-21
updated: 2026-09-21
status: stable
---

## En bref

Le RGPD impose de penser la protection des données **avant** de traiter, pas
après. Deux notions structurent un projet SI : la **protection dès la
conception** (privacy by design, art. 25) et l'**analyse d'impact** (AIPD),
menée **en amont** de la mise en œuvre du traitement — jamais en fin de projet
ni après un incident.

## Privacy by design & by default (art. 25)

- **Privacy by design** — intégrer la protection des données dès la conception du
  traitement : minimisation, pseudonymisation, sécurité, transparence pensées
  d'entrée. C'est le pendant « données personnelles » du
  [security by design](security-by-design.md).
- **Privacy by default** — par défaut, seules les données **nécessaires** à la
  finalité sont traitées, avec l'accès le plus restreint. L'utilisateur ne doit
  pas avoir à régler quoi que ce soit pour être protégé.

## L'AIPD : une étude *avant*, pas *après*

L'**Analyse d'Impact relative à la Protection des Données** (AIPD, ou *DPIA*) est
obligatoire **avant** de mettre en œuvre un traitement susceptible d'engendrer un
**risque élevé** pour les droits et libertés des personnes. La conduire en fin de
projet, c'est la vider de son sens : elle sert à corriger la conception tant
qu'elle est encore modifiable.

Elle est menée par le **responsable de traitement**, avec l'avis du **DPO**. Son
contenu minimal :

| Volet | Contenu |
| --- | --- |
| Description | le traitement, ses finalités, les données, les flux |
| Nécessité / proportionnalité | les données sont-elles minimales et justifiées ? |
| Risques | atteintes possibles (accès illégitime, modification, perte) |
| Mesures | ce qui réduit ces risques (techniques et organisationnelles) |

Cas typiques qui la déclenchent : traitement **à grande échelle** de données
**sensibles**, **surveillance systématique**, croisement de fichiers, données de
personnes vulnérables (liste de la CNIL).

## Les notions qui gravitent autour

- **Finalité** — un traitement a un but déterminé, explicite et légitime.
- **Base légale** — consentement, contrat, obligation légale, intérêt légitime…
- **Minimisation** — pas plus de données que nécessaire à la finalité.
- **DPO** (*Data Protection Officer*) — pilote la conformité, à impliquer tôt et
  à cartographier comme [partie prenante](../gestion-de-projet/parties-prenantes.md).
- **Registre des traitements** — l'inventaire tenu par le responsable.

## Pièges

- **L'AIPD faite à la fin.** Le point à ne pas rater : elle se conduit **avant**
  la mise en œuvre, pour peser sur la conception. Après, elle ne fait que
  constater.
- **Confondre sécurité et protection des données.** Chiffrer, c'est une *mesure* ;
  le RGPD couvre aussi finalité, base légale, durée de conservation, droits des
  personnes. La sécurité est nécessaire, pas suffisante.
- **« On verra la conformité plus tard. »** Privacy by design signifie
  précisément l'inverse : la conformité est une contrainte de conception, au même
  titre qu'une fonction du cahier des charges.
- **Oublier le DPO** jusqu'à la recette : son avis sur l'AIPD arrive alors trop
  tard pour changer quoi que ce soit.

## Voir aussi

- [Security by design : principes de conception sécurisée](security-by-design.md)
- [Cartographier les parties prenantes d'un projet SI](../gestion-de-projet/parties-prenantes.md)
- [La matrice de conformité croisée](../gestion-de-projet/matrice-conformite.md)
- [Lexique de l'évaluation de sécurité](lexique.md)
- <https://www.cnil.fr/fr/rgpd-passer-a-laction>
