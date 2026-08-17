---
title: Libérer un volume ou un dossier occupé
tags: [linux, depannage]
created: 2026-08-17
updated: 2026-08-17
status: brouillon
---

## En bref

`umount` refuse de démonter en disant `target is busy` : trouver quel processus
tient le point de montage, puis le terminer.

## Commandes

```sh
lsof /mnt/mon-volume          # processus tenant le point de montage
lsof +D /mnt/mon-volume       # descente récursive dans l'arborescence — lent
fuser -vm /mnt/mon-volume     # même chose, souvent plus rapide

kill <PID>                    # demander l'arrêt
kill -9 <PID>                 # forcer, en dernier recours
fuser -km /mnt/mon-volume     # tuer d'un coup tout ce qui tient le volume
```

## Détails

`lsof` liste les fichiers ouverts — et sous Unix, un point de montage occupé
l'est toujours parce qu'un processus y a un descripteur ouvert, ou simplement
parce que son répertoire courant s'y trouve. Un simple shell dont le `cd` pointe
dans le volume suffit à bloquer le démontage.

Différence entre les deux formes : `lsof /point/de/montage` interroge le
montage, `lsof +D /chemin` parcourt **récursivement** toute l'arborescence et
ouvre chaque répertoire. Sur un gros volume, `+D` peut prendre plusieurs
minutes. Commencer par la forme simple, et par `fuser -vm` qui va droit au but.

Toujours essayer `kill` avant `kill -9` : le premier laisse le processus fermer
proprement ses fichiers, le second peut laisser un système de fichiers dans un
état sale.

Si rien ne se libère et que le volume doit partir maintenant :

```sh
umount -l /mnt/mon-volume     # démontage paresseux : détache tout de suite,
                              # libère réellement quand plus personne ne l'utilise
```

## Pièges

- **Le processus coupable, c'est souvent toi** : un terminal dont le répertoire
  courant est dans le volume. `cd ~` avant de chercher plus loin.
- `lsof` sans `sudo` ne voit que tes propres processus. Un montage tenu par un
  service tournant sous un autre utilisateur restera invisible.
- Sous macOS, les volumes sont sous `/Volumes/<nom>` et `fuser` n'existe pas —
  seul `lsof` est disponible.

<!-- À vérifier : la note d'origine visait /Volumes (macOS). Les commandes
ci-dessus sont adaptées à Linux. Repasser en status: stable après relecture. -->
