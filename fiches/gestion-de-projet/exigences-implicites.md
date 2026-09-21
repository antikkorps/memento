---
title: "Exigences implicites : ce que le client ne dit pas"
tags: [gestion-de-projet, recueil-du-besoin]
created: 2026-09-21
updated: 2026-09-21
status: stable
---

## En bref

Un besoin réel que personne n'exprime parce qu'il va de soi — pour le métier.
L'exigence implicite ne se voit pas quand elle est satisfaite, et rend le
livrable inacceptable quand elle ne l'est pas. C'est la première cause de
recette refusée sur un produit pourtant conforme au cahier des charges.

## Les trois niveaux de besoin (modèle de Kano)

| Niveau | Si présent | Si absent |
| --- | --- | --- |
| **Obligatoire** (*must-be*) — l'implicite | rien, c'est normal | rejet du produit |
| **Proportionnel** (*performance*) — l'exprimé | satisfaction croissante | insatisfaction |
| **Attractif** (*delighter*) — le non-attendu | enchantement | rien, personne ne le réclame |

La leçon pratique tient en une phrase : **l'effort mis sur l'attractif ne
compense jamais un obligatoire manquant.** Un portail élégant qui perd les
données à 18 h est un portail refusé.

Deuxième leçon, plus perverse : l'attractif **se banalise**. Ce qui enchantait
il y a trois ans (la recherche instantanée, le mode sombre) est aujourd'hui
implicite. Le seuil monte tout seul.

## Où elles se cachent : la checklist non fonctionnelle

La quasi-totalité des implicites sont des exigences **non fonctionnelles**. Les
passer en revue une par une, à voix haute, avec le métier :

| Famille | Question à poser |
| --- | --- |
| Performance | combien d'utilisateurs simultanés, quel temps de réponse acceptable ? |
| Volumétrie | combien d'enregistrements aujourd'hui, dans cinq ans ? |
| Disponibilité | quelles plages d'ouverture, quelle coupure tolérable ? |
| Sauvegarde | quelle perte de données acceptable, quel délai de remise en service ? |
| Sécurité | qui voit quoi, que trace-t-on, combien de temps ? |
| Conformité | données personnelles (RGPD), archivage légal, accessibilité (RGAA) ? |
| Interopérabilité | quelles applications en amont et en aval, quels formats ? |
| Exploitation | qui l'installe, le supervise, le met à jour ? |
| Reprise | que fait-on de l'historique de l'ancien outil ? |
| Support | qui répond aux utilisateurs, dans quel délai ? |
| Poste de travail | quels navigateurs, quelle version, mobile ou non ? |

La **reprise de données** et l'**exploitabilité** sont les deux plus souvent
oubliées, et les deux plus chères à rattraper après coup.

## Comment les faire sortir

- **La question négative.** Pas « de quoi avez-vous besoin ? » mais « que se
  passe-t-il si l'application est indisponible un mardi matin ? ». L'implicite
  sort par la conséquence, jamais par la demande.
- **L'observation terrain.** Regarder travailler quelqu'un pendant une heure
  révèle les contournements, les post-it sur l'écran, le second fichier Excel
  tenu à côté. Personne ne les mentionne en réunion : ils font partie du décor.
- **Le prototype.** Une maquette fausse fait réagir là où un document
  fait acquiescer. « Non, mais là il faut pouvoir revenir en arrière » est une
  exigence implicite qui vient de tomber.
- **La reformulation systématique** en
  [atelier](ateliers-recueil-besoin.md) : « si je comprends bien, vous aurez
  besoin de… ». La moitié des implicites se lèvent là.
- **Les [personas](personas.md)** : dérouler une journée type fait apparaître le
  contexte d'usage (mobile, bruit, gants, interruptions) que personne ne pense à
  énoncer.

Une fois sortie, l'exigence implicite **cesse de l'être** : elle s'écrit dans la
spécification comme les autres ([normes IEEE](normes-ieee.md), partie 3), avec
son critère vérifiable.

## Pièges

- **« Ça va de soi. »** Jamais. C'est la formule qui signale exactement
  l'endroit où il faut écrire une ligne.
- **Le silence du client vaut validation.** Il ne relit pas ce qu'il ne
  soupçonne pas : il lit ce qu'il a demandé. L'absence de remarque sur la
  sauvegarde ne dit rien de ses attentes.
- **L'implicite du prestataire.** L'inverse existe : l'équipe suppose un
  environnement, une version, une compétence côté client. Les « hypothèses et
  dépendances » du SRS sont faites pour ça.
- **Découvrir les implicites en recette.** À ce moment, le budget est consommé
  et l'exigence coûte dix fois plus cher. La checklist ci-dessus se passe au
  cadrage, pas à la fin.
- **Confondre implicite et [gold plating](derives-de-perimetre.md).** L'implicite
  est attendu par le client même s'il ne l'a pas dit ; le gold plating n'est
  attendu par personne. La différence se vérifie en demandant — pas en
  supposant.

## Voir aussi

- [Animer un atelier de recueil du besoin](ateliers-recueil-besoin.md)
- [Normes IEEE : le plan type d'une spécification d'exigences](normes-ieee.md)
- [Personas : incarner les utilisateurs cibles](personas.md)
- [Spécification progressive : préciser au fil de l'eau](specification-progressive.md)
- <https://en.wikipedia.org/wiki/Kano_model>
