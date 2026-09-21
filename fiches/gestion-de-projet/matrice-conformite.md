---
title: "La matrice de conformité croisée"
tags: [gestion-de-projet, procedure]
created: 2026-09-21
updated: 2026-09-21
status: stable
---

## En bref

Un tableau qui croise les **exigences** avec les **réponses** apportées pour
vérifier, d'un coup d'œil, que **rien n'est oublié**. Chaque exigence est une
ligne ; on statue en face : couverte, partielle, ou non. C'est l'outil du
dépouillement d'offres et du suivi de conformité (réglementaire ou technique).
À ne pas confondre avec la [matrice de cohérence](matrice-de-coherence.md)
(objectifs × exigences) ni la [RTM](matrice-de-tracabilite.md) (cycle de vie de
l'exigence) : ici on croise **exigences × réponses** pour statuer la conformité.

## À quoi elle sert

- **Comparer des offres** : exigences en lignes, fournisseurs en colonnes → qui
  couvre quoi, objectivement, plutôt qu'à l'impression.
- **Vérifier une conformité** : exigences d'un référentiel (RGPD, ISO 27001,
  CdCF) en lignes, mesures et **preuves** en colonnes.
- **Tracer** l'exigence de bout en bout : besoin → conception → test.

## Structure type

| ID | Exigence | Priorité | Conformité | Preuve / renvoi | Commentaire |
| --- | --- | --- | --- | --- | --- |
| EX-01 | Chiffrer les données au repos | Must | **C** | doc archi §4 | AES-256 |
| EX-02 | Export RGPD des données d'un usager | Must | **PC** | ticket #212 | manuel, à automatiser |
| EX-03 | SSO SAML | Could | **NC** | — | hors périmètre V1 |

Statuts usuels : **C** conforme, **PC** partiellement conforme, **NC** non
conforme. La priorité reprend souvent [MoSCoW](moscow.md)
(*Must / Should / Could / Won't*).

## Pièges

- **Exigences non atomiques.** « L'outil doit être sécurisé et rapide » ne peut
  pas se statuer d'un seul C/NC : la scinder en exigences vérifiables une par une.
- **Pas d'identifiant stable.** Sans `ID` fixe, la traçabilité se casse dès qu'on
  réordonne le tableau ; l'ID survit au renumérotage.
- **« Conforme » déclaratif.** Un statut sans colonne *preuve* ne vaut rien : la
  conformité s'atteste (document, test, capture), elle ne se proclame pas.
- **Oublier les exigences non fonctionnelles** (sécurité, performance, RGPD,
  accessibilité) : ce sont celles qu'on omet et qui coûtent le plus cher après.

## Voir aussi

- [Norme AFNOR NF X50-151 : le cahier des charges fonctionnel](afnor-nf-x50-151.md)
- [La grille SMART : rendre un objectif vérifiable](objectifs-smart.md)
- [Matrice de cohérence : relier objectifs, besoins et solutions](matrice-de-coherence.md)
- [RTM : tracer une exigence de l'origine au test](matrice-de-tracabilite.md)
- [Animer un atelier de recueil du besoin](ateliers-recueil-besoin.md)
- [User stories : exprimer le besoin côté utilisateur](user-stories.md)
