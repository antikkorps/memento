---
title: "Les 5 pourquoi : remonter à la cause racine"
tags: [gestion-de-projet, recueil-du-besoin, procedure]
created: 2026-09-21
updated: 2026-09-21
status: stable
---

## En bref

Technique d'analyse (*5 Whys*) issue du système de production Toyota (Sakichi
Toyoda, puis Taiichi Ohno) : on répète « pourquoi ? » sur un problème jusqu'à
atteindre sa **cause racine** (*root cause*), celle sur laquelle agir empêche la
réapparition. Sert aussi bien au retour d'expérience après un incident qu'en
atelier de recueil du besoin, pour remonter d'une solution demandée au besoin
réel.

## La démarche

1. **Énoncer le problème factuellement** : ce qui est observé, où, quand,
   combien. Pas de cause ni de coupable dans l'énoncé.
2. **Demander pourquoi**, noter la réponse — un **fait vérifiable**, pas une
   hypothèse.
3. **Reprendre la réponse comme nouveau problème** et redemander pourquoi.
4. **S'arrêter** quand la cause trouvée est actionnable et qu'agir dessus
   empêcherait toute la chaîne de se reproduire. Cinq est un ordre de grandeur,
   pas une règle : trois suffisent parfois, sept sont parfois nécessaires.
5. **Remonter la chaîne à l'envers** avec « donc » pour vérifier qu'elle tient :
   chaque cause doit produire l'effet du dessus.
6. **Décider une action** sur la cause racine, avec un porteur et une échéance
   (voir la grille [SMART](objectifs-smart.md)).

## Exemple : incident de production

```text
Problème : l'application de paie a été indisponible 4 h le 3 du mois.
Pourquoi ? Le disque du serveur de base de données était plein.
Pourquoi ? Les journaux de transactions n'étaient plus purgés.
Pourquoi ? Le job de sauvegarde, qui les purge, échouait depuis trois semaines.
Pourquoi ? Le mot de passe du compte de service avait expiré.
Pourquoi ? Aucune alerte ne surveille l'échec du job, ni l'expiration du compte.
Action : superviser le job de sauvegarde et l'expiration des comptes de service.
```

Relu à l'envers : pas d'alerte, **donc** mot de passe expiré sans que personne
le voie, **donc** sauvegarde en échec, **donc** journaux non purgés, **donc**
disque plein. La chaîne tient.

S'arrêter au premier pourquoi aurait donné « agrandir le disque » : l'incident
se serait reproduit un mois plus tard.

## Exemple : recueil du besoin

```text
Demande  : « il nous faut un export Excel de la liste des dossiers ».
Pourquoi ? Pour la retravailler chaque lundi.
Pourquoi ? Pour trier les dossiers en retard par gestionnaire.
Pourquoi ? Le chef de service répartit la charge en réunion hebdomadaire.
Besoin   : une vue des dossiers en retard par gestionnaire, à jour le lundi.
```

L'export était une **solution** proposée par le client, pas le besoin. Le vrai
besoin se satisfait mieux par un tableau de bord filtré — ou par l'export, mais
en le sachant. C'est la même logique que la partie « afin de » d'une
[user story](user-stories.md).

## Pièges

- **Chercher un coupable.** « Pourquoi ? Parce que Paul a oublié » arrête
  l'analyse sur une personne. Demander plutôt pourquoi le système a permis
  l'oubli : absence de contrôle, de check-list, d'alerte.
- **Répondre par une hypothèse.** Chaque réponse doit être constatée (journal,
  mesure, témoignage). Sur une supposition, la chaîne entière est fausse.
- **Une seule branche pour un problème à plusieurs causes.** Les 5 pourquoi
  suivent un fil ; quand plusieurs causes contribuent, ouvrir une branche par
  cause, ou passer à un diagramme d'Ishikawa (*fishbone*, les 5M : matière,
  matériel, méthode, main-d'œuvre, milieu).
- **S'arrêter trop tôt**, sur un symptôme : si l'action ne fait que réparer,
  c'est qu'il reste au moins un pourquoi.
- **Aller trop loin**, jusqu'à « le budget est insuffisant » ou « c'est la
  culture de l'entreprise » : vrai, mais hors de portée de l'équipe. S'arrêter
  à la dernière cause sur laquelle on a la main.
- **Le faire seul.** L'analyse vaut ce que valent les faits ; réunir ceux qui
  connaissent le processus, pas seulement ceux qui ont constaté l'incident.
- **En atelier, l'effet interrogatoire.** Cinq « pourquoi ? » d'affilée mettent
  l'interlocuteur sur la défensive. Varier : « qu'est-ce que ça vous permet de
  faire ? », « que se passe-t-il si vous ne l'avez pas ? ».

## Voir aussi

- [Animer un atelier de recueil du besoin](ateliers-recueil-besoin.md)
- [Exigences implicites : ce que le client ne dit pas](exigences-implicites.md)
- [Journal des décisions : tracer les arbitrages](journal-des-decisions.md)
- [La grille SMART : rendre un objectif vérifiable](objectifs-smart.md)
- <https://fr.wikipedia.org/wiki/Cinq_pourquoi>
