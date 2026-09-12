---
title: "fail2ban : bannir les tentatives répétées"
tags: [linux, securite, reseau]
created: 2026-09-03
updated: 2026-09-03
status: stable
---

## En bref

Il lit des journaux, repère les échecs répétés depuis une même adresse et la
bannit temporairement au pare-feu. Deux règles avant tout : **configurer dans
`jail.local`**, et **se mettre soi-même dans `ignoreip`**.

## Voir ce qui se passe

```sh
sudo systemctl status fail2ban
sudo fail2ban-client status                 # les jails actives
sudo fail2ban-client status sshd            # detail : echecs, bannis en cours
sudo tail -f /var/log/fail2ban.log
```

## Bannir et débannir à la main

```sh
sudo fail2ban-client set sshd banip 203.0.113.5
sudo fail2ban-client set sshd unbanip 203.0.113.5
sudo fail2ban-client unban --all
sudo fail2ban-client reload                 # recharger la configuration
sudo fail2ban-client reload sshd            # une seule jail
```

## Configurer

Ne **jamais** modifier `/etc/fail2ban/jail.conf` : il est écrasé à chaque mise à
jour. Tout se met dans `/etc/fail2ban/jail.local`, qui le surcharge.

```ini
[DEFAULT]
bantime  = 1h
findtime = 10m
maxretry = 5
ignoreip = 127.0.0.1/8 ::1 192.168.1.0/24 203.0.113.7
backend  = systemd

[sshd]
enabled = true
port    = 2222

[nginx-http-auth]
enabled = true
```

| Réglage | Sens |
| --- | --- |
| `maxretry` | nombre d'échecs tolérés |
| `findtime` | fenêtre dans laquelle on les compte |
| `bantime` | durée du bannissement (`-1` = permanent) |
| `ignoreip` | jamais bannies — **y mettre son IP** |
| `backend` | où lire les journaux : `systemd` ou fichier |

## Diagnostiquer une jail qui ne bannit rien

```sh
sudo fail2ban-regex /var/log/auth.log /etc/fail2ban/filter.d/sshd.conf
sudo fail2ban-regex systemd-journal /etc/fail2ban/filter.d/sshd.conf
```

Cette commande dit combien de lignes le filtre reconnaît. Zéro correspondance
sur un journal plein de tentatives = le filtre ou le backend est en cause, pas
l'absence d'attaques.

## Pièges

- **Se bannir soi-même est le passage obligé si l'on n'y pense pas.** Mettre son
  adresse fixe dans `ignoreip` avant tout test, et garder une session SSH
  ouverte — elle survit au bannissement, qui ne coupe que les **nouvelles**
  connexions.
- **Modifier `jail.conf` ne sert à rien durablement** : la prochaine mise à jour
  du paquet écrase le fichier et la configuration disparaît sans avertissement.
  `jail.local`, toujours.
- **Une jail active qui ne bannit jamais est le cas le plus fréquent**, et le
  plus silencieux. Presque toujours le `backend` : sur une distribution où SSH
  ne journalise que dans `journald`, un backend pointant vers
  `/var/log/auth.log` ne lit qu'un fichier vide. `backend = systemd` règle le
  cas. `fail2ban-regex` le confirme en dix secondes.
- **Changer le port SSH sans le dire à fail2ban** rend la jail inopérante : le
  `port` de la jail sert à construire la règle de blocage.
- **fail2ban n'est pas une protection, c'est une réduction de bruit.** Contre le
  balayage automatisé d'Internet, il est efficace ; contre un attaquant décidé,
  il ne fait que ralentir. Ce qui protège réellement SSH, c'est
  `PasswordAuthentication no`. Avec l'authentification par clé seule, fail2ban
  sert surtout à alléger les journaux.
- **Il agit après coup.** Avec `maxretry = 5`, cinq tentatives passent toujours —
  ce qui suffit à un mot de passe faible.
- **Les bannissements sont perdus au redémarrage** sauf base persistante
  configurée. Un `bantime` très long donne donc une fausse impression de
  permanence.
- IPv4 et IPv6 sont bannies séparément : vérifier que l'action choisie couvre
  les deux.

## Voir aussi

- [ufw : le pare-feu simple](ufw.md)
- [SSH : clés, configuration et tunnels](../reseau/ssh.md)
- [Linux : utilisateurs, groupes et mots de passe](utilisateurs.md)
- [Maliciels, attaques et vocabulaire des menaces](../securite/menaces.md)
