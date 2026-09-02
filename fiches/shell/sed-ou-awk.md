---
title: "sed ou awk : lequel choisir"
tags: [ligne-de-commande, texte]
created: 2026-09-02
updated: 2026-09-02
status: stable
---

## En bref

La question revient à chaque fois, alors autant poser la règle en une ligne :
**grep filtre, sed transforme, awk calcule.**

## Le tri en cinq réflexes

| Ce que je pense | L'outil |
| --- | --- |
| « garder / exclure les lignes qui contiennent… » | [grep](grep.md) |
| « remplacer / supprimer / insérer » | [sed](sed.md) — la ligne est une chaîne |
| « colonne 3, somme, si tel champ » | [awk](awk.md) — la ligne est un tableau de champs |
| « j'ai besoin de mémoire entre les lignes » | `awk` : compteurs, tableaux, bloc `END` |
| « position fixe, découpage simple » | `cut`, plus rapide à écrire que les deux |

Et le garde-fou : **au-delà de trois lignes d'awk, passer à Python.** Ce sera
plus lisible dans six mois, et c'est le seul critère qui compte.

## Le même besoin dans les trois outils

Extraire la deuxième colonne des lignes contenant `erreur` :

```sh
grep erreur f | cut -d' ' -f2      # si le separateur est fiable
sed -n '/erreur/s/^\S* \(\S*\).*/\1/p' f   # possible, mais illisible
awk '/erreur/ {print $2}' f        # ce que ca devrait etre
```

Le troisième est le bon. Quand la version `sed` demande de compter des groupes
de capture, c'est que le problème était un problème de **champs**, pas de
chaîne — donc `awk` depuis le début.

Inversement, remplacer un motif partout dans un fichier :

```sh
sed -i 's/ancien/nouveau/g' f      # une evidence
awk '{gsub(/ancien/,"nouveau"); print}' f > tmp && mv tmp f   # possible, penible
```

`awk` sait substituer (`gsub`), mais il ne sait pas écrire en place : il faut un
fichier temporaire. C'est le signal qu'on est du mauvais côté de la frontière.

## Pièges

- Chaîner `grep | sed | awk` n'est pas une faute — c'est même souvent la forme
  la plus lisible. Le pipeline inutile, c'est `cat f | grep`, jamais
  `grep | awk`.
- `awk` sait tout faire de ce que fait `grep` (`awk '/motif/'`), et `sed` sait
  filtrer (`sed -n '/motif/p'`). Ce n'est pas une raison pour les utiliser :
  l'outil qui nomme l'intention est celui qu'on relira.

## Voir aussi

- [grep : chercher dans les fichiers](grep.md)
- [sed : substituer et éditer des lignes](sed.md)
- [awk : colonnes, filtres et calculs](awk.md)
