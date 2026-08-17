---
title: Lister les paquets installés manuellement
tags: [linux, procedure]
created: 2026-08-17
updated: 2026-08-17
status: stable
---

## En bref

Capturer la liste des paquets que **tu** as installés, pour pouvoir refaire la
machine à l'identique après une réinstallation.

## Commandes

```sh
apt-mark showmanual > ~/paquets-kali.txt      # sauvegarde
xargs -a ~/paquets-kali.txt sudo apt install  # restauration
```

## Détails

`apt-mark showmanual` ne liste que les paquets marqués comme installés
**manuellement**, par opposition à ceux tirés automatiquement comme dépendances.
C'est ce qui rend la liste exploitable : `dpkg -l` en renverrait plusieurs
milliers, dont l'immense majorité serait réinstallée toute seule.

Sur une Kali fraîche, la liste contient déjà les métapaquets de la distribution
(`kali-linux-default` et consorts). Ce n'est pas gênant pour une restauration
sur Kali, mais si tu veux isoler *tes* ajouts, compare avec la liste d'une
installation neuve :

```sh
comm -13 paquets-kali-neuve.txt paquets-kali.txt
```

## Pièges

- La liste ne contient **pas** les versions : la restauration prend ce que le
  dépôt propose au moment où tu la joues. Pour une reproductibilité stricte, il
  faut autre chose (image, conteneur).
- Rien de ce qui a été installé hors apt n'y figure : `pip`, `cargo`, `go
  install`, binaires déposés à la main. À sauvegarder séparément.
- Versionner ce fichier est tentant, mais il change à chaque `apt install` — le
  garder dans le dépôt le rendrait périmé en permanence. Le régénérer avant une
  réinstallation vaut mieux que le suivre.
