---
title: "systemctl : éteindre, redémarrer, piloter les services"
tags: [linux, terminal]
created: 2026-09-12
updated: 2026-09-12
status: stable
---

## En bref

`systemctl` pilote systemd : l'arrêt de la machine et le cycle de vie des
services. Le verbe pour éteindre est **`poweroff`**, pas `shutdown` — l'erreur
qu'on refait à chaque fois.

## Éteindre, redémarrer, veille

```sh
systemctl poweroff      # eteindre
systemctl reboot        # redemarrer
systemctl suspend       # veille en RAM, reveil immediat
systemctl hibernate     # hibernation sur disque, la machine est vraiment eteinte
systemctl hybrid-sleep  # les deux : RAM + disque
```

`systemctl shutdown` n'existe pas :

```
Unknown command verb 'shutdown', did you mean 'show'?
```

La commande historique, elle, existe toujours, et reste la seule à savoir
différer un arrêt :

```sh
shutdown -h now                # equivalent de poweroff
shutdown -h +10 "maintenance"  # dans 10 min, avec un message aux sessions ouvertes
shutdown -r +5                 # redemarrage differe
shutdown -c                    # annule un arret programme
```

Depuis une session graphique locale, **aucun `sudo` n'est nécessaire** : polkit
autorise l'utilisateur connecté. En SSH, `systemctl poweroff` demande le mot de
passe, et refuse si une autre session est ouverte.

## Services : le quotidien

```sh
systemctl status nginx      # etat, derniers logs, PID -- la commande a reflexe
systemctl start nginx
systemctl stop nginx
systemctl restart nginx
systemctl reload nginx      # relit la conf SANS couper les connexions, si le service sait le faire
systemctl enable nginx      # demarrage automatique au boot
systemctl disable nginx
systemctl enable --now nginx  # active ET demarre, en une fois
```

`enable` et `start` sont deux choses différentes, et c'est la confusion la plus
fréquente : `start` démarre **maintenant**, `enable` décide de ce qui se passe
**au prochain démarrage**. Un service peut tourner sans être activé, et
inversement.

## Inspecter

```sh
systemctl list-units --type=service          # ce qui tourne
systemctl --failed                           # ce qui a echoue -- a regarder en premier
systemctl is-active nginx                    # reponse en un mot, scriptable
systemctl is-enabled nginx
systemctl cat nginx                          # le fichier d'unite complet, sans le chercher
systemctl show nginx                         # toutes les proprietes, verbeux
systemctl list-timers                        # les taches planifiees version systemd
```

## Les journaux

```sh
journalctl -u nginx              # les logs de ce service
journalctl -u nginx -f           # en continu, comme `tail -f`
journalctl -u nginx -n 50        # les 50 dernieres lignes
journalctl -b                    # depuis le demarrage courant
journalctl -b -1                 # le demarrage precedent : pour comprendre un plantage
journalctl --since "1 hour ago"
journalctl -p err -b             # seulement les erreurs
```

## Modifier un service

```sh
systemctl edit nginx         # surcharge (drop-in), preservee par les mises a jour
systemctl edit --full nginx  # remplace l'unite entiere
systemctl daemon-reload      # OBLIGATOIRE apres avoir edite un fichier a la main
systemctl restart nginx
```

`systemctl edit` crée un fichier dans `/etc/systemd/system/<service>.d/` et
lance le `daemon-reload` tout seul. Éditer directement dans
`/lib/systemd/system/` est une mauvaise idée : la prochaine mise à jour du
paquet écrase le fichier.

## Services utilisateur

Tout ce qui précède existe en version « utilisateur », sans `sudo`, pour les
services qui n'ont pas à tourner en tant que root :

```sh
systemctl --user status         # etat de la session
systemctl --user list-units
loginctl enable-linger franck   # les services utilisateur survivent a la deconnexion
```

## Pièges

- **`systemctl shutdown` n'existe pas.** C'est `poweroff`. La confusion vient de
  la commande `shutdown` traditionnelle, qui est un binaire à part.
- **`enable` ne démarre rien tout de suite**, et `start` ne survit pas au
  redémarrage. `enable --now` fait les deux.
- **Éditer un fichier d'unité sans `daemon-reload`** : systemd continue d'obéir
  à l'ancienne version, et on cherche pendant dix minutes pourquoi la
  modification n'a aucun effet. `systemctl edit` évite le problème en le faisant
  lui-même.
- **`restart` coupe les connexions en cours, `reload` non** — quand le service
  sait recharger sa configuration. Sur un serveur en production, la différence
  n'est pas cosmétique.
- **`status` tronque les lignes longues.** Pour la vraie trace, passer à
  `journalctl -u <service> -n 50`.
- **Le nom du service n'est pas toujours celui du paquet** : `apache2` et non
  `apache`, `ssh` et non `sshd` sur Debian. `systemctl list-units --type=service`
  ou la complétion tranchent.

## Voir aussi

- [i3 : raccourcis par défaut et configuration](i3.md) — le mode « système » pour
  éteindre au clavier
- [rofi : lanceur, sélecteur de fenêtres et menus](rofi.md) — le même menu, en
  graphique
- [i3 : l'écran gris de i3lock, et sortir d'un verrouillage](verrouillage-ecran.md)
