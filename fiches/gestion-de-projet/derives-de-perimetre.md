---
title: "Scope creep et gold plating : les dérives de périmètre"
tags: [gestion-de-projet, recueil-du-besoin]
created: 2026-09-21
updated: 2026-09-21
status: stable
---

## En bref

Deux façons pour un projet de grossir sans que personne ne l'ait décidé. Le
**scope creep** (dérive du périmètre) vient de **l'extérieur** : le client
ajoute, l'équipe accepte, rien n'est replanifié. Le **gold plating** (dorure sur
tranche) vient de **l'intérieur** : l'équipe livre plus que demandé, en croyant
bien faire. Le résultat est le même — du délai et du budget consommés hors de
tout arbitrage.

## Les deux faces

| | **Scope creep** | **Gold plating** |
| --- | --- | --- |
| Origine | client, métier, parties prenantes | l'équipe projet elle-même |
| Motif | « c'est juste un petit ajout » | montrer son savoir-faire, anticiper |
| Ce qui manque | un processus de gestion des changements | une exigence qui le justifie |
| Signe | un périmètre qui n'est écrit nulle part | une fonction sans ligne dans la [matrice de cohérence](matrice-de-coherence.md) |
| Parade | tracer, chiffrer, faire arbitrer | ne livrer que l'exigence, proposer le reste |

On croise aussi le **feature creep** : l'accumulation de fonctions au fil des
versions, qui finit par rendre le produit illisible. C'est du scope creep vu à
l'échelle du produit plutôt que du projet.

## Dérive ou évolution maîtrisée ?

Un changement n'est pas une dérive. **Ce qui fait la dérive, c'est l'absence de
décision explicite**, pas le changement lui-même.

```text
Évolution maîtrisée : demande écrite → impact chiffré (délai, coût, risque)
                      → arbitrage du sponsor → périmètre de référence mis à jour
Dérive              : demande orale → « ça va, c'est 10 minutes » → livré
                      → jamais replanifié → le retard apparaît à la fin
```

Le point de bascule est le **périmètre de référence** (*baseline*) : un périmètre
figé, daté, validé. Sans lui, il n'y a aucune dérive possible — au sens où rien
ne permet de la mesurer.

## Les parades, dans l'ordre d'efficacité

1. **Écrire le hors-périmètre.** La liste des *Won't have* de
   [MoSCoW](moscow.md) vaut plus que la liste des *Must*. « Le projet ne traite
   pas la mobilité » écrit dans la note de cadrage désamorce trois mois de
   malentendu.
2. **Un processus de demande de changement**, même léger : une demande écrite,
   un chiffrage, une décision tracée au
   [journal des décisions](journal-des-decisions.md).
3. **Répondre « oui, et voici ce que ça décale »**, jamais « non » sec. Le
   refus braque ; l'arbitrage rendu visible déplace la décision chez celui qui
   paie.
4. **Des livraisons courtes.** Un cycle d'un mois offre un point d'entrée
   légitime pour les nouvelles demandes : elles vont dans le lot suivant au lieu
   de s'infiltrer dans celui en cours.

## Pièges

- **« C'est juste cinq minutes. »** La dérive n'arrive jamais par un gros
  ajout, toujours par vingt petits dont aucun ne méritait un arbitrage.
- **L'effet cliquet.** Accepter un ajout sans replanifier crée un précédent : la
  demande suivante s'appuie dessus. Le premier « oui » gratuit est le plus cher.
- **Le gold plating passe pour de la générosité.** Une fonction non demandée se
  teste, se documente, se maintient et se corrige — pendant des années, sur un
  budget que personne n'a voté. Elle ajoute aussi de la surface d'attaque et de
  la complexité d'usage.
- **Prendre la [spécification progressive](specification-progressive.md) pour du
  scope creep.** Préciser le détail d'une exigence connue n'est pas l'élargir.
  Le périmètre est stable, la définition s'affine.
- **Le hors-périmètre non écrit.** Ce qui n'est pas explicitement exclu est
  supposé inclus par le client — et il a raison de le supposer.
- **La dérive du commanditaire lui-même.** Quand c'est le sponsor qui ajoute,
  personne n'ose tracer. C'est pourtant là que le chiffrage écrit sert le plus :
  il le protège aussi.

## Voir aussi

- [MoSCoW : prioriser ce qui sera livré](moscow.md)
- [Journal des décisions : tracer les arbitrages](journal-des-decisions.md)
- [Spécification progressive : préciser au fil de l'eau](specification-progressive.md)
- [Chaos Report : pourquoi les projets SI échouent](chaos-report.md)
- [Matrice de cohérence : relier objectifs, besoins et solutions](matrice-de-coherence.md)
