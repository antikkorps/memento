---
title: Lexique de l'évaluation de sécurité
tags: [securite]
created: 2026-08-17
updated: 2026-08-17
status: stable
---

## En bref

Le vocabulaire de base d'une évaluation de sécurité : le triptyque qu'on cherche
à protéger, et les niveaux d'accès accordés à l'évaluateur.

## CIA

Les trois propriétés qu'un dispositif de sécurité cherche à garantir. Toute
vulnérabilité se ramène à l'atteinte d'au moins l'une des trois.

| | |
| --- | --- |
| **C**onfidentiality | l'information n'est lisible que par qui y a droit |
| **I**ntegrity | l'information n'est modifiable que par qui y a droit |
| **A**vailability | l'information reste accessible à qui y a droit |

## Black box

L'outil ou l'évaluateur interagit avec l'application **sans connaissance ni
accès particulier**, au même titre qu'un utilisateur ordinaire.

Sur une application web, cela signifie n'avoir accès qu'aux fonctions ouvertes à
un visiteur non authentifié. Les comptes utilisés sont ceux qu'on peut créer
soi-même par inscription : un compte qui exigerait la création par un
administrateur est hors périmètre, et tout ce qu'il débloque reste donc
invisible à l'évaluation.

## White box

L'évaluateur dispose d'un **accès complet** : code source, accès administrateur
à la plateforme qui héberge l'application, configuration.

Cela permet une revue exhaustive de toutes les fonctionnalités, y compris celles
qui ne sont atteignables par aucun chemin utilisateur. En contrepartie,
l'exercice ne simule **en rien** une activité malveillante réelle.

## Grey box

Tout ce qu'il y a entre les deux, et c'est le cas le plus fréquent en pratique.

## Choisir

Le niveau d'accès se déduit de l'objectif, pas de l'inverse.

- **Que se passerait-il en cas d'attaque externe ciblée ?** → black box, parce
  que c'est la seule qui reproduise la position réelle d'un attaquant.
- **Éliminer un maximum de failles en un temps donné ?** → white box, bien plus
  efficace à budget constant.

Formuler l'objectif avant de négocier le périmètre : c'est le seul ordre qui
évite de payer une simulation qui ne simule rien, ou un audit qui rate la moitié
du code.
