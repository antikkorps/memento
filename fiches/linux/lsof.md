---
title: "lsof : trouver ce qui occupe un port, un volume ou un fichier"
tags: [linux, depannage]
created: 2026-08-17
updated: 2026-08-17
status: brouillon
---

## En bref

`Address already in use`, `target is busy` : trouver quel processus tient la
ressource, puis le terminer. Même réflexe dans les trois cas.

## Un port occupé

```sh
lsof -ti :3000        # PID uniquement, rien d'autre
kill $(lsof -ti :3000)
```

`-t` (*terse*) ne sort que le PID, `-i` filtre sur les sockets réseau. C'est la
combinaison qui rend le résultat directement utilisable par `kill`, sans passer
par les yeux.

Pour voir *qui* c'est avant de tuer :

```sh
lsof -i :3000         # commande, PID, utilisateur, état
```

## Un volume ou un dossier occupé

```sh
lsof /mnt/mon-volume          # processus tenant le point de montage
lsof +D /mnt/mon-volume       # descente récursive — lent sur un gros volume
fuser -vm /mnt/mon-volume     # même chose, souvent plus rapide
```

Différence entre les deux formes de `lsof` : `lsof /point/de/montage` interroge
le montage, `lsof +D /chemin` parcourt **récursivement** toute l'arborescence et
ouvre chaque répertoire. Commencer par la forme simple, ou par `fuser -vm` qui
va droit au but.

## Tuer

```sh
kill <PID>                    # demander l'arrêt
kill -9 <PID>                 # forcer, en dernier recours
fuser -km /mnt/mon-volume     # tuer d'un coup tout ce qui tient le volume
umount -l /mnt/mon-volume     # démontage paresseux : détache tout de suite,
                              # libère quand plus personne ne l'utilise
```

Toujours `kill` avant `kill -9` : le premier laisse le processus fermer
proprement ses fichiers, le second peut laisser un système de fichiers sale.

## Détails

Sous Unix, une ressource occupée l'est toujours parce qu'un processus détient un
descripteur de fichier dessus — ou simplement parce que son répertoire courant
s'y trouve. C'est le même mécanisme pour un socket en écoute, un fichier ouvert
et un point de montage, d'où le même outil pour les trois.

## Pièges

- **Le processus coupable, c'est souvent toi** : un terminal dont le répertoire
  courant est dans le volume. `cd ~` avant de chercher plus loin.
- `lsof` sans `sudo` ne voit que tes propres processus. Un port tenu par un
  service tournant sous un autre utilisateur restera invisible.
- Sous macOS les volumes sont sous `/Volumes/<nom>`, et `fuser` n'existe pas —
  seul `lsof` est disponible.
- `kill $(lsof -ti :3000)` échoue bruyamment si rien n'écoute : `lsof` ne
  renvoie rien et `kill` râle sur son absence d'argument. Sans gravité.

<!-- À vérifier : la partie volume vient d'une note visant /Volumes (macOS),
adaptée à Linux. Repasser en status: stable après relecture. -->
