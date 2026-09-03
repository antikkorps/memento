---
title: "Linux : utilisateurs, groupes et mots de passe"
tags: [linux, securite, terminal]
created: 2026-09-03
updated: 2026-09-03
status: stable
---

## En bref

Créer un compte, le mettre dans les bons groupes, gérer son mot de passe. Un
seul piège compte vraiment, et il est en bas : **`usermod -G` sans `-a` efface
tous les groupes secondaires**.

## Créer un utilisateur

```sh
sudo adduser johndoe                            # Debian/Ubuntu : interactif, fait tout
sudo useradd -m -s /bin/bash johndoe            # portable : -m cree le home, -s le shell
sudo useradd -m -s /bin/bash -G sudo,docker johndoe
sudo useradd -r -s /usr/sbin/nologin appsvc     # compte de service : aucune connexion possible
```

`adduser` est un script Debian, interactif, qui crée le répertoire personnel, le
groupe éponyme et demande le mot de passe. `useradd` est la commande bas niveau,
présente partout, qui ne fait **que** ce qu'on lui demande.

## Mots de passe

```sh
passwd                          # changer le sien
sudo passwd johndoe             # changer celui de johndoe
sudo passwd -e johndoe          # forcer le changement a la prochaine connexion
sudo passwd -l johndoe          # verrouiller le mot de passe
sudo passwd -u johndoe          # deverrouiller
sudo chage -l johndoe           # voir la politique d'expiration
sudo chage -M 90 -W 7 johndoe   # expire a 90 jours, previent 7 jours avant
```

## Groupes

```sh
sudo groupadd equipe
sudo usermod -aG equipe johndoe  # AJOUTER a un groupe -- le -a n'est pas optionnel
sudo gpasswd -a johndoe equipe  # equivalent, plus explicite
sudo gpasswd -d johndoe equipe  # RETIRER d'un groupe
sudo groupdel equipe

id johndoe                      # UID, GID, tous les groupes
groups johndoe                  # juste les groupes
getent group equipe             # les membres d'un groupe
getent passwd johndoe           # la ligne du compte, LDAP compris
```

Le groupe qui donne `sudo` s'appelle `sudo` sur Debian et Ubuntu, `wheel` sur
RHEL, Fedora et Arch.

## Supprimer

```sh
sudo deluser johndoe                    # Debian : garde le repertoire personnel
sudo deluser --remove-home johndoe
sudo userdel -r johndoe                 # portable, -r supprime le home et le courrier
find / -xdev -uid 1001 2>/dev/null      # les fichiers restes orphelins, AVANT de supprimer
```

## Où c'est stocké

| Fichier | Contenu | Lisible par |
| --- | --- | --- |
| `/etc/passwd` | comptes, UID, shell, home — **pas de mot de passe** | tout le monde |
| `/etc/shadow` | les empreintes des mots de passe | root seul |
| `/etc/group` | les groupes et leurs membres | tout le monde |
| `/etc/skel/` | ce qui est copié dans un nouveau home | |
| `/etc/login.defs` | plages d'UID, politique par défaut | |
| `/etc/sudoers.d/` | droits `sudo`, un fichier par règle | root seul |

Toujours éditer les droits `sudo` avec `sudo visudo` (ou
`sudo visudo -f /etc/sudoers.d/johndoe`) : la commande vérifie la syntaxe avant
d'enregistrer. Un `/etc/sudoers` invalide rend `sudo` inutilisable, donc la
machine irrécupérable sans accès physique.

## Pièges

- **`usermod -G` sans `-a` remplace TOUS les groupes secondaires.** Un
  `sudo usermod -G docker johndoe` retire johndoe de `sudo`, `adm`, `dialout` et
  tout le reste — et l'on découvre en se reconnectant qu'on n'a plus les droits
  d'administration. C'est **toujours** `-aG`.
- **Un changement de groupe ne s'applique qu'à la session suivante.** Ajouter
  quelqu'un à `docker` puis lancer `docker ps` dans le même terminal donne
  « permission denied » : il faut se déconnecter/reconnecter, ou `newgrp docker`
  pour le shell courant. C'est la deuxième source de confusion.
- **`useradd` sans `-m` ne crée pas le répertoire personnel.** La connexion
  fonctionne mais atterrit dans `/`, avec des erreurs incompréhensibles au
  premier programme qui veut écrire dans `~`.
- **`adduser` n'est pas la même commande partout.** Script interactif complet sur
  Debian et Ubuntu, simple alias vers `useradd` sur RHEL — même nom,
  comportement radicalement différent. Dans un script, utiliser `useradd`.
- **`passwd -l` ne bloque pas l'accès par clé SSH.** Verrouiller le mot de passe
  laisse un compte pleinement utilisable si une clé est en place. Pour couper
  réellement : `usermod -s /usr/sbin/nologin`, retirer les
  `~/.ssh/authorized_keys`, et `chage -E 0`.
- **Les UID sont réutilisés.** Supprimer un compte puis en créer un autre lui
  donne souvent le même UID — et donc la propriété de tous les fichiers de
  l'ancien restés sur le disque. D'où le `find -uid` **avant** la suppression.
- Un compte de service n'a pas à pouvoir se connecter : `-r` et
  `/usr/sbin/nologin`. Un shell sur un compte applicatif est un rebond offert.
- `su johndoe` garde l'environnement courant, `su - johndoe` charge celui de
  johndoe. La différence explique la moitié des « pourtant ça marche en root ».

## Voir aussi

- [Linux : droits, propriétaire et umask](droits.md)
- [SSH : clés, configuration et tunnels](../reseau/ssh.md)
- [fail2ban : bannir les tentatives répétées](fail2ban.md)
- [ufw : le pare-feu simple](ufw.md)
