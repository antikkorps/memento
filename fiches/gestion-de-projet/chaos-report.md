---
title: "Chaos Report : pourquoi les projets SI échouent"
tags: [gestion-de-projet, reference]
created: 2026-09-21
updated: 2026-09-21
status: stable
---

## En bref

Étude publiée par le **Standish Group** depuis **1994**, qui classe des milliers
de projets informatiques en trois catégories et en tire les facteurs de succès
récurrents. C'est le chiffre qu'on cite pour justifier le cadrage, la
priorisation et les livraisons courtes — à condition de savoir ce qu'il mesure
vraiment.

## Les trois issues

| Catégorie | Définition |
| --- | --- |
| **Succès** (*successful*) | livré **dans les délais, dans le budget et au périmètre prévu** |
| **Mitigé** (*challenged*) | livré et utilisé, mais en retard, en dépassement ou amputé |
| **Échec** (*failed*) | abandonné en cours de route ou jamais mis en service |

## Les ordres de grandeur

| Édition | Succès | Mitigés | Échecs |
| --- | :---: | :---: | :---: |
| 1994 — le rapport fondateur | 16 % | 53 % | 31 % |
| Années 2000-2010 | ≈ 30 % | ≈ 50 % | ≈ 20 % |
| Éditions récentes | ≈ 30 % | ≈ 50 % | ≈ 20 % |

Retenir **les ordres de grandeur et la tendance**, pas la décimale : environ un
projet sur trois réussit au sens strict, un sur cinq échoue complètement.
L'amélioration depuis 1994 est réelle, mais moins spectaculaire qu'annoncé.

Le second chiffre célèbre vient de l'édition 2002 : **≈ 45 % des fonctionnalités
livrées ne sont jamais utilisées**, et environ 20 % le sont souvent ou toujours.
C'est l'argument massue pour [MoSCoW](moscow.md) et pour le découpage en
livraisons courtes.

## Ce que l'étude attribue au succès

Année après année, les mêmes facteurs reviennent en tête :

1. **Implication des utilisateurs** — la constante n° 1 de toutes les éditions.
2. **Soutien effectif de la direction** — un sponsor qui arbitre, pas qui
   patronne.
3. **Expression claire des exigences** et objectifs métier explicites.
4. **Petits projets, petites livraisons** : le facteur le plus discriminant de
   tous. Un projet découpé en lots de quelques mois réussit plusieurs fois plus
   souvent qu'un projet de plusieurs années à livraison unique.
5. **Compétence de l'équipe et maturité émotionnelle** des parties prenantes.

Et symétriquement, les causes d'échec : besoin incomplet ou mal exprimé,
changements de périmètre non maîtrisés, utilisateurs absents, pas de sponsor,
planning irréaliste.

**Aucun de ces facteurs n'est technique.** C'est le véritable enseignement du
rapport, et il n'a pas changé en trente ans.

## À citer avec précaution

Le rapport est très contesté dans la littérature académique, pour trois raisons
qu'il vaut mieux connaître avant de s'appuyer dessus :

- **La définition du succès est la triple contrainte** (délai, coût, périmètre).
  Un projet livré avec six mois de retard et devenu indispensable est compté
  « mitigé » ; un projet livré à l'heure et jamais utilisé est un « succès ». La
  **valeur produite** n'entre pas dans le calcul.
- **L'échantillon et la méthode ne sont pas publics**, et le recrutement est
  orienté vers les organisations qui déclarent des difficultés — ce qui pousse
  les taux d'échec vers le haut (critique de Jørgensen et Moløkken, 2006).
- **Les définitions ont changé** d'une édition à l'autre, ce qui rend les
  comparaisons dans le temps fragiles.

La bonne posture : s'en servir pour les **facteurs de succès**, qui sont
convergents avec le reste de la littérature, et rester prudent sur les
pourcentages.

## Pièges

- **Citer « 16 % de succès » comme un chiffre d'aujourd'hui.** C'est le chiffre
  de 1994, et il traîne encore dans les supports de formation.
- **Le lire comme un procès de la technique.** Les causes listées sont du
  cadrage, de la gouvernance et de la communication.
- **En conclure que l'agile règle le problème.** Le rapport corrèle le succès à
  la **taille du projet** bien plus qu'à la méthode ; un petit projet en cycle
  en V réussit mieux qu'un gros projet agile.
- **Oublier la catégorie « mitigé ».** C'est la moitié des projets, et celle où
  l'on se trouve réellement. Le sujet n'est pas d'éviter l'échec, c'est de
  décider **ce qu'on ampute** quand le délai se tend — d'où la priorisation.

## Voir aussi

- [MoSCoW : prioriser ce qui sera livré](moscow.md)
- [Scope creep et gold plating : les dérives de périmètre](derives-de-perimetre.md)
- [Cartographier les parties prenantes d'un projet SI](parties-prenantes.md)
- [Spécification progressive : préciser au fil de l'eau](specification-progressive.md)
- <https://www.standishgroup.com/>
