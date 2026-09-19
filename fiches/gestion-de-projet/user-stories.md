---
title: "User stories : exprimer le besoin côté utilisateur"
tags: [gestion-de-projet, recueil-du-besoin]
created: 2026-09-19
updated: 2026-09-19
status: stable
---

## En bref

Exprimer un besoin **du point de vue de celui qui s'en sert**, en une phrase
courte, testable, qui tient sur une carte. La *user story* ne décrit pas une
solution technique : elle dit **qui**, **quoi** et surtout **pourquoi**. C'est la
brique du *backlog* et le prolongement naturel des [personas](personas.md).

## Le gabarit

```text
En tant que <rôle>, je veux <action> afin de <bénéfice>.
```

```text
En tant que gestionnaire paie, je veux exporter les bulletins en PDF
afin de les archiver sans ressaisie.
```

Le **« afin de »** est le morceau qu'on oublie et qui compte le plus : il porte la
valeur. Sans lui, on ne sait pas *pourquoi* la fonction existe — donc ni la
prioriser, ni proposer mieux.

## Les 3 C : une story n'est pas une spec

Une user story est un **repère de conversation**, pas un cahier des charges :

- **Carte** (*Card*) — la phrase courte, volontairement incomplète.
- **Conversation** — l'échange qu'elle déclenche, où le détail se précise.
- **Confirmation** — les critères d'acceptation qui diront qu'elle est finie.

## Critères d'acceptation

Ce qui rend la story **vérifiable** — le contrat du « c'est fait ». Souvent au
format *Given / When / Then* :

```text
Étant donné une fiche de paie validée
Quand je clique sur « Exporter »
Alors un PDF conforme au modèle est téléchargé
```

## INVEST : une bonne story

| Lettre | Critère |
| --- | --- |
| **I**ndependent | découpable et livrable seule |
| **N**egotiable | ouverte à la discussion, pas gravée |
| **V**aluable | apporte une valeur à l'utilisateur |
| **E**stimable | l'équipe peut en évaluer l'effort |
| **S**mall | tient dans une itération (*sprint*) |
| **T**estable | on sait dire quand elle est terminée |

## Granularité : epic → story → tâche

Un besoin trop gros pour une itération est un **epic** ; on le découpe en
stories. La **tâche** est le travail technique interne (« créer la table »), elle
n'a pas la forme d'une story et ne s'exprime pas côté utilisateur.

## Pièges

- **Écrire une solution, pas un besoin.** « Je veux un bouton export » présume la
  réponse ; le besoin est « archiver sans ressaisie ». Toujours remonter au
  *afin de*.
- **Oublier le « afin de ».** Sans le pourquoi, impossible de prioriser ni de
  challenger — c'est l'erreur la plus fréquente.
- **La story sans critères d'acceptation** ne peut pas être déclarée finie :
  chacun a sa définition du « terminé ».
- **La story trop grosse** (un epic déguisé) ne rentre pas dans une itération et
  ne s'estime pas. La découper.
- **La prendre pour une spec exhaustive.** C'est un support de conversation (les
  3 C), pas un document contractuel figé.

## Voir aussi

- [Personas : incarner les utilisateurs cibles](personas.md)
- [Animer un atelier de recueil du besoin](ateliers-recueil-besoin.md)
- [Cartographier les parties prenantes d'un projet SI](parties-prenantes.md)
- <https://www.mountaingoatsoftware.com/agile/user-stories>
