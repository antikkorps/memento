---
title: "MoSCoW : prioriser ce qui sera livré"
tags: [gestion-de-projet, recueil-du-besoin]
created: 2026-09-21
updated: 2026-09-21
status: stable
---

## En bref

Quatre niveaux de priorité pour trancher ce qui entre dans une livraison donnée.
Issue de la méthode **DSDM**, MoSCoW répond à une question précise : *si le temps
manque, qu'est-ce qu'on abandonne ?* — et elle y répond **avant** que le temps
manque. Les deux `o` ne servent qu'à la prononciation.

## Les quatre niveaux

| Niveau | Sens | Test |
| --- | --- | --- |
| **M**ust have | sans quoi la livraison n'a **aucun sens** | que se passe-t-il si on ne le fait pas ? Si la réponse est « on ne livre pas », c'est un *Must*. |
| **S**hould have | important, mais il existe un contournement acceptable | douloureux, pas bloquant |
| **C**ould have | souhaitable, abandonné sans drame | c'est la **marge de manœuvre** |
| **W**on't have *this time* | explicitement **hors périmètre** de cette livraison | « pas cette fois », jamais « jamais » |

Le vrai discriminant est le *Must* : il doit se lire comme **« la livraison est
inutilisable sans »**, et non « le métier y tient beaucoup ». Un contournement
manuel acceptable pendant trois mois suffit à rétrograder une exigence en
*Should*.

## La règle d'effort : 60 / 20 / 20

DSDM fixe un garde-fou chiffré, et c'est lui qui rend la méthode opérante :

```text
Must    ≤ 60 % de l'effort total de la livraison
Should  ≈ 20 %
Could   ≈ 20 %   <- la marge sacrifiable sans toucher au contrat
```

Les 20 % de *Could* sont un **amortisseur de risque** : ils absorbent les aléas
sans décaler la date. Au-delà de 60 % de *Must*, le projet n'a plus de marge et
n'est plus pilotable — c'est un signal, pas une contrainte administrative.

## Les conditions pour que ça marche

- **Une échéance de référence.** Une priorité n'existe que rapportée à une
  livraison datée. « Prioriser le backlog » dans l'absolu ne veut rien dire.
- **Le sponsor dans la salle.** L'arbitrage appartient à celui qui porte le
  budget ; l'équipe projet ne peut que proposer.
- **Une granularité homogène.** Comparer « l'authentification » et « le libellé
  du bouton » dans la même liste fausse tout le classement.
- **Un reclassement à chaque jalon.** Un *Could* reporté deux fois est un
  *Won't* qui n'ose pas dire son nom.

## Le W est le niveau le plus utile

C'est le plus souvent oublié, et c'est celui qui rapporte : écrire noir sur
blanc ce qui **ne sera pas** livré est la parade la plus efficace au
[scope creep](derives-de-perimetre.md). Un *Won't* documenté transforme une
future dispute en rappel de décision.

Il a aussi une fonction politique : il permet à une partie prenante de voir que
sa demande **a été entendue et datée**, plutôt que perdue. Refuser en classant
vaut mieux que refuser en silence.

## Les alternatives

| Méthode | Principe | Quand |
| --- | --- | --- |
| Valeur / effort | matrice 2×2, on attaque le fort-valeur/faible-effort | tri rapide d'un backlog |
| **WSJF** | (valeur + urgence + réduction de risque) ÷ taille | portefeuille, SAFe |
| Achat à budget fixe | chaque partie prenante répartit 100 points | quand tout est « prioritaire » |
| Kano | obligatoire / proportionnel / attractif | [exigences implicites](exigences-implicites.md) |

## Pièges

- **Tout en Must.** Le symptôme classique : la priorisation n'a pas eu lieu, on
  a juste recopié la liste. Si plus de 60 % de l'effort est en *Must*, forcer le
  reclassement, au besoin en imposant un quota.
- **Prioriser entre gens de la DSI.** Le classement fait sans le métier sera
  contesté au premier arbitrage, et il aura raison de l'être.
- **Ne pas écrire les *Won't*.** Sans liste du hors-périmètre, chacun suppose
  que sa demande est « quelque part dans le backlog ».
- **Lire le W comme un refus définitif.** C'est *Won't have **this time*** — la
  demande revient candidate à la livraison suivante. L'expliquer, sinon les
  parties prenantes cessent d'exprimer leurs besoins.
- **Un classement figé.** Ce qui était *Should* devient *Must* quand la
  réglementation change. Rejouer à chaque jalon.
- **Prioriser sans estimer.** Les 60 % se calculent sur l'**effort**, pas sur le
  nombre de lignes : dix *Could* minuscules ne pèsent pas un *Must* de trois
  semaines.

## Voir aussi

- [Scope creep et gold plating : les dérives de périmètre](derives-de-perimetre.md)
- [Animer un atelier de recueil du besoin](ateliers-recueil-besoin.md)
- [User stories : exprimer le besoin côté utilisateur](user-stories.md)
- [RTM : tracer une exigence de l'origine au test](matrice-de-tracabilite.md)
- [Chaos Report : pourquoi les projets SI échouent](chaos-report.md)
- <https://www.volkerdon.com/pages/moscow-prioritisation>
