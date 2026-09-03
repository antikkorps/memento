---
title: "Linux : droits, propriétaire et umask"
tags: [linux, terminal, securite]
created: 2026-09-03
updated: 2026-09-03
status: stable
---

## En bref

Changer les droits d'un fichier, savoir lire un `ls -l`, et comprendre pourquoi
`x` sur un dossier ne veut pas dire « exécutable ». Le pendant Windows est
[Windows : droits NTFS et icacls](../windows/droits.md).

## Lire un `ls -l`

```
-rwxr-xr--  1 johndoe www-data  4096 sep  3 14:22 script.sh
│└┬┘└┬┘└┬┘    └──┬─┘ └───┬──┘
│ │  │  │        │       └── groupe
│ │  │  │        └────────── proprietaire
│ │  │  └── autres  : r--
│ │  └───── groupe  : r-x
│ └──────── proprietaire : rwx
└────────── type : - fichier, d dossier, l lien, c/b peripherique
```

## Changer les droits (*permissions*)

```sh
chmod u+x script.sh           # ajouter x au proprietaire
chmod g-w fichier             # retirer w au groupe
chmod a+r fichier             # a = all (u + g + o)
chmod o= fichier              # retirer tout aux autres
chmod 644 fichier             # rw- r-- r--   fichier de donnees
chmod 755 script.sh           # rwx r-x r-x   script ou dossier
chmod 600 ~/.ssh/id_ed25519   # rw- --- ---   secret
chmod 700 ~/.ssh              # dossier prive
chmod -R a+rX dossier/        # voir les pieges : X majuscule
```

Octal : `r` = 4, `w` = 2, `x` = 1, additionnés par triplet.

```sh
chown johndoe fichier         # changer le proprietaire (root uniquement)
chown johndoe:www-data fichier  # proprietaire et groupe
chown -R johndoe: dossier/    # le groupe par defaut de johndoe
chgrp www-data fichier
```

## umask

```sh
umask                         # afficher (souvent 022)
umask 077                     # tout ce que je cree est prive
```

`umask` **retire** des droits aux valeurs par défaut : 666 pour un fichier, 777
pour un dossier. Avec `umask 022` on obtient donc 644 et 755 ; avec `umask 077`,
600 et 700. C'est un réglage par shell, à mettre dans `~/.profile` pour qu'il
tienne.

## Bits spéciaux

```sh
chmod u+s binaire             # setuid  : s'execute en tant que proprietaire
chmod g+s dossier/            # setgid  : tout ce qui y est cree herite du groupe
chmod +t /partage             # sticky  : seul le proprietaire peut supprimer
```

`ls -l` les affiche à la place du `x` : `rws` (setuid), `rwt` (sticky). Le
`drwxrwxrwt` de `/tmp` est le sticky bit — c'est lui qui empêche chacun d'y
effacer les fichiers des autres.

Chercher les binaires setuid est un réflexe d'audit :

```sh
find / -perm -4000 -type f 2>/dev/null
```

## Plus fin : ACL et attributs

```sh
getfacl fichier
setfacl -m u:alice:rw fichier  # donner un droit a UN utilisateur precis
setfacl -x u:alice fichier
setfacl -b fichier            # tout retirer

lsattr fichier
sudo chattr +i fichier        # immuable : meme root ne peut plus le modifier
sudo chattr -i fichier
```

Un `+` à la fin des droits dans `ls -l` (`-rw-r--r--+`) signale une ACL : sans
`getfacl`, on ne voit pas les droits réels.

## Pièges

- **Sur un dossier, `x` veut dire « traverser », pas « exécuter ».** Sans `x`,
  on ne peut pas entrer dans le dossier ni accéder à ce qu'il contient, même en
  connaissant le chemin exact. Et `r` sans `x` permet de lister les *noms* sans
  pouvoir lire les fichiers — état déroutant, souvent la cause d'un « Permission
  denied » incompréhensible.
- **Supprimer un fichier dépend du `w` sur le dossier, pas sur le fichier.**
  Un fichier en lecture seule dans un dossier accessible en écriture se supprime
  sans broncher. C'est contre-intuitif et c'est la règle.
- **`chmod -R 755` rend tous les fichiers exécutables.** Utiliser
  `chmod -R a+rX` : le `X` majuscule ne pose `x` que sur les dossiers et sur ce
  qui l'était déjà. C'est l'astuce à retenir de cette fiche.
- **`chmod 777` ne répare rien.** Quand ça « marche enfin » en 777, le vrai
  problème est un propriétaire ou un `x` manquant sur un dossier parent. Et sur
  un serveur web, c'est une porte ouverte.
- **SSH refuse une clé privée trop ouverte** : `0600` pour la clé, `0700` pour
  `~/.ssh`. Le message parle de « unprotected private key file » et la
  connexion échoue sans autre explication.
- **Seul root peut donner un fichier à quelqu'un d'autre.** Un utilisateur ne
  peut pas `chown` vers un autre compte, même sur ses propres fichiers.
- **Le setuid est ignoré sur les scripts** sous Linux : il ne fonctionne que sur
  des binaires. C'est une protection, pas un bug.
- **Les options de montage priment sur les droits.** Un système de fichiers
  monté `ro` ou `noexec` refusera l'écriture ou l'exécution quels que soient les
  droits affichés. `mount | grep ' / '` avant de chercher plus loin.
- Un `+` en fin de droits change tout : il y a une ACL, et `ls -l` ne montre
  alors qu'une approximation.

## Voir aussi

- [Windows : droits NTFS et icacls](../windows/droits.md)
- [Linux : créer, copier, renommer, supprimer](fichiers.md)
- [Générer des secrets, clés et mots de passe](../securite/generer-des-secrets.md)
