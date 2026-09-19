---
title: "Cartographier les parties prenantes d'un projet SI"
tags: [gestion-de-projet, recueil-du-besoin]
created: 2026-09-19
updated: 2026-09-19
status: stable
---

## En bref

Recenser **tous ceux qui impactent le projet ou que le projet impacte** (*stake\-
holders*), puis décider quoi faire de chacun. C'est le premier réflexe avant de
recueillir le besoin : on ne sait pas quoi demander tant qu'on ne sait pas à qui.
La carte sert à anticiper les résistances, sécuriser les appuis et calibrer la
communication.

## La démarche en quatre temps

1. **Recenser** — lister large : personnes, services, instances, externes.
2. **Qualifier** — pour chacun : son pouvoir sur le projet, son intérêt, son
   attitude (soutien / neutre / opposant), ce qu'il attend, ce qu'il craint.
3. **Positionner** — le placer sur la matrice pouvoir / intérêt.
4. **Décider une stratégie d'engagement** — que lui dire, à quelle fréquence, par
   qui.

La carte n'est jamais figée : elle se relit à chaque jalon, car pouvoir et
attitude bougent avec le projet.

## La matrice pouvoir / intérêt (Mendelow)

Deux axes, quatre stratégies — l'outil central.

| | **Intérêt faible** | **Intérêt fort** |
| --- | --- | --- |
| **Pouvoir fort** | Satisfaire (le garder content) | **Gérer de près** (acteur clé) |
| **Pouvoir faible** | Surveiller (effort minimal) | Tenir informé |

- **Gérer de près** : le sponsor, le métier décideur — réunions, arbitrages,
  co-construction.
- **Satisfaire** : direction, RSSI — attention à ne pas les négliger, ils
  peuvent bloquer sans s'intéresser au détail.
- **Tenir informé** : utilisateurs finaux, relais terrain — leur avis nourrit le
  besoin même s'ils décident peu.
- **Surveiller** : le reste — une veille légère suffit.

## Les parties prenantes typiques d'un projet SI

| Acteur | Rôle |
| --- | --- |
| **Commanditaire / sponsor (MOA)** | porte le besoin et le budget, arbitre — **son absence tue le projet** |
| Maîtrise d'œuvre (**MOE**) | réalise la solution (interne ou intégrateur) |
| **Utilisateurs finaux** | ceux qui se serviront de l'outil au quotidien |
| DSI / exploitation | héberge, maintient, exploite en production |
| **RSSI** | sécurité, conformité technique |
| **DPO** | protection des données (RGPD) dès qu'il y a du personnel |
| Métiers / experts | détiennent la connaissance du besoin réel |
| Fournisseurs / prestataires | briques externes, contrats, délais |

La distinction **MOA** (le *quoi* et le *pourquoi*, côté métier) / **MOE** (le
*comment*, côté technique) structure toute la gouvernance d'un projet SI.

## SIPOC : trouver les parties prenantes par le processus

Un cadrage d'une page qui décrit un processus de gauche à droite —
**S**uppliers → **I**nputs → **P**rocess → **O**utputs → **C**ustomers
(fournisseurs, entrées, processus, sorties, clients). Là où la matrice raisonne
par acteur, le SIPOC part du **flux** : ses colonnes *Fournisseurs* et *Clients*
révèlent des parties prenantes qu'on oublie en partant de l'organigramme — celui
qui alimente une donnée en amont, celui qui reçoit un livrable en aval.

Il se construit **du milieu vers les bords** : nommer le **processus** (3 à 7
étapes, verbe à l'infinitif), puis les **sorties** et leurs **clients**, enfin les
**entrées** et leurs **fournisseurs**.

| S — Fournisseurs | I — Entrées | P — Processus | O — Sorties | C — Clients |
| --- | --- | --- | --- | --- |
| RH, manager, service IT | fiche d'arrivée, profil de poste | 1. recueillir la demande → 2. créer les comptes → 3. attribuer les droits → 4. remettre le matériel | comptes actifs, poste configuré, accès applicatifs | nouvel arrivant, son manager, l'exploitation |

*(Exemple : ouverture des accès SI d'un nouveau collaborateur.)*

## Pièges

- **Le SIPOC reste macro.** C'est un cadrage d'une page (3 à 7 étapes), pas
  un logigramme détaillé : le détail du processus vient après, en atelier.
- **Oublier les opposants.** On cartographie volontiers ses alliés ; ce sont les
  réticents qu'il faut identifier tôt, car ils se manifestent au pire moment.
- **Confondre pouvoir et place dans l'organigramme.** Une assistante qui filtre
  l'agenda du directeur, un référent métier écouté de tous : pouvoir réel ≠
  pouvoir hiérarchique.
- **Négliger les « à satisfaire ».** Fort pouvoir mais peu d'intérêt = danger
  silencieux : ils ne suivent pas, puis bloquent d'un mot en comité.
- **Oublier les utilisateurs finaux au profit du management.** Le projet est
  validé en haut et rejeté en bas faute d'avoir écouté ceux qui l'utiliseront.
- **Une carte faite une fois pour toutes.** Un changement de direction ou de
  sponsor rebat les cartes ; la relire à chaque jalon.
- **Pas de sponsor identifié = pas de projet.** S'il n'y a personne pour porter
  le besoin et arbitrer, le recueil du besoin n'a pas d'autorité derrière lui.

## Voir aussi

- [Animer un atelier de recueil du besoin](ateliers-recueil-besoin.md)
- <https://www.mindtools.com/aol0rms/stakeholder-analysis>
