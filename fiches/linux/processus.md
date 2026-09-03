---
title: "Linux : lister, inspecter et tuer un processus"
tags: [linux, terminal, depannage]
created: 2026-09-03
updated: 2026-09-03
status: stable
---

## En bref

Trouver le PID, comprendre ce que fait le processus, puis l'arrêter — dans cet
ordre. Le pendant Windows est
[Windows : lister et arrêter un processus](../windows/processus.md).

## Trouver

```sh
ps aux                        # tous les processus, format BSD
ps -ef                        # idem, format System V
ps aux | grep -i nginx        # la methode qui marche partout
pgrep -a nginx                # mieux : le PID et la ligne de commande
pgrep -u franck -a node       # filtre par utilisateur
pstree -p                     # l'arbre, avec les PID
top                           # en direct ; `htop` si installe, bien plus lisible

ps -eo pid,ppid,user,%cpu,%mem,etime,cmd --sort=-%cpu | head
```

La dernière est celle qui répond à « qu'est-ce qui mange le CPU depuis
quand » : `etime` donne le temps écoulé depuis le démarrage du processus.

## Inspecter avant de tuer

```sh
ls -l /proc/1234/cwd          # depuis quel repertoire il tourne
ls -l /proc/1234/exe          # quel binaire exactement
tr '\0' ' ' < /proc/1234/cmdline  # la ligne de commande complete
lsof -p 1234                  # ce qu'il a ouvert : fichiers, sockets
ls -l /proc/1234/fd           # idem, sans lsof
cat /proc/1234/status         # etat, memoire, UID reel et effectif
```

## Tuer

```sh
kill 1234                     # SIGTERM : demande poliment de s'arreter
kill -15 1234                 # strictement identique
kill -HUP 1234                # recharge la configuration, ne tue pas
kill -9 1234                  # SIGKILL : le noyau tue, sans negociation
kill -l                       # la liste des signaux

pkill -f 'node.*serveur.js'   # par motif sur la ligne de commande complete
pgrep -af 'node.*serveur.js'  # LE MEME motif, en simulation -- a faire d'abord
killall nginx                 # par nom exact de binaire
kill -- -4242                 # tout le groupe de processus (PGID 4242)
```

| Signal | N° | Effet |
| --- | --- | --- |
| `TERM` | 15 | demande d'arrêt propre — **le défaut, et le bon** |
| `KILL` | 9 | terminaison immédiate par le noyau, non interceptable |
| `HUP` | 1 | historiquement « recharge ta conf » |
| `INT` | 2 | ce que fait `Ctrl+C` |
| `QUIT` | 3 | arrêt avec vidage mémoire |
| `STOP` / `CONT` | 19 / 18 | met en pause / reprend (`Ctrl+Z` envoie `TSTP`) |

## Services et tâches de fond

```sh
systemctl status nginx        # etat, PID principal, dernieres lignes de log
systemctl restart nginx
systemctl stop nginx
journalctl -u nginx -f        # suivre les logs du service

commande &                    # lancer en tache de fond
jobs                          # les taches du shell courant
fg %1 / bg %1                 # ramener au premier plan / relancer en fond
Ctrl+Z                        # suspendre la tache courante
nohup commande &              # survit a la fermeture du terminal
disown %1                     # detache une tache deja lancee
timeout 30 commande           # tue la commande au bout de 30 s
```

## Pièges

- **`kill -9` ne laisse rien nettoyer.** Pas de vidage des tampons, pas de
  fermeture des connexions, pas de suppression des fichiers temporaires, et les
  verrous restent posés — une base de données tuée en `-9` peut demander une
  réparation au démarrage. Toujours `kill` seul d'abord, `-9` seulement si rien
  ne bouge après quelques secondes.
- **Un processus en état `D` ne peut pas être tué, même en `-9`.** `D` =
  *uninterruptible sleep*, il attend une entrée/sortie (disque, NFS bloqué). Le
  signal est mis en attente et ne sera traité qu'au retour de l'I/O : c'est le
  stockage qu'il faut débloquer, pas le processus.
- **Un zombie (`Z`) est déjà mort.** Il n'occupe qu'une ligne dans la table des
  processus, en attendant que son parent lise son code de retour. Le tuer n'a
  aucun effet ; c'est le **parent** qu'il faut relancer ou corriger.
- **`pkill -f` matche la ligne de commande entière**, y compris celle d'autres
  outils qui contiennent le motif — et parfois la sienne. Le réflexe :
  `pgrep -af 'motif'` d'abord, on regarde la liste, et seulement ensuite on
  remplace `pgrep` par `pkill`.
- **Un service systemd avec `Restart=always` redémarre aussitôt.** Tuer son PID
  ne sert à rien, il faut `systemctl stop`. Si le processus revient
  inlassablement avec un PID différent, c'est ça.
- `kill` n'est pas toujours fatal : `kill -HUP` recharge, `kill -USR1` déclenche
  une rotation de logs sur beaucoup de démons. « kill » nomme l'envoi d'un
  signal, pas la mise à mort.
- On ne signale que ses propres processus ; ceux d'un autre utilisateur
  demandent `sudo`, sans quoi c'est un `Operation not permitted` silencieux dans
  un script.
- **Les PID sont réutilisés.** Entre le `ps` et le `kill`, un processus peut
  être mort et son numéro réattribué. Sur un système chargé, préférer `pkill`
  par motif ou `systemctl`.
- Fermer le terminal envoie `SIGHUP` aux tâches lancées depuis ce shell : d'où
  `nohup`, `disown`, ou mieux, `tmux`.

## Voir aussi

- [Windows : lister et arrêter un processus](../windows/processus.md)
- [lsof : trouver ce qui occupe un port, un volume ou un fichier](lsof.md)
- [Linux : créer, copier, renommer, supprimer](fichiers.md)
