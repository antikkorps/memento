---
title: "Par où commencer une room : les premières minutes"
tags: [securite, procedure]
created: 2026-10-09
updated: 2026-10-09
status: stable
---

## En bref

Le point d'entrée quand une room démarre **sans indication** : j'ai mon lab, mon
attackbox, une cible — et aucune piste. Trois réflexes dans l'ordre : **vérifier
qu'on touche la cible**, **comprendre de quel genre de room il s'agit**, **lancer
le scan qui désigne la suite.** Cette fiche n'attaque rien elle-même : elle
aiguille vers [la méthodo web](methodologie-pentest-web.md) (attaque) ou vers
[quel outil](quel-outil.md) §5-9 (analyse), selon ce que le premier coup d'œil
révèle.

## 1 — Est-ce que je touche la cible

Avant tout scan, s'assurer que le réseau est là. L'erreur qui coûte le plus de
temps en début de room : fouiller une cible qu'on n'atteint pas.

```sh
# attackbox THM/HTB : le VPN est déjà monté. Depuis sa propre Kali :
sudo openvpn fichier.ovpn &     # puis verifier l'interface tun0
ip addr show tun0               # une IP ici = VPN up

# la cible repond-elle ?
ping -c 3 10.10.10.5
```

- **Pas de réponse au ping ≠ cible morte.** Beaucoup de machines (Windows
  surtout) bloquent l'ICMP. On ne conclut rien : on passe nmap en `-Pn` (« pas de
  découverte d'hôte, scanne quand même »).
- **L'IP de la cible** est sur la page de la room, pas à deviner. La noter tout
  de suite, c'est elle qu'on répète partout.

## 2 — C'est quoi, cette room

La question qui tranche tout le reste. On ne lance pas les mêmes outils selon ce
qu'on a entre les mains.

| Ce que la room me donne… | C'est de la… | Je file vers… |
| --- | --- | --- |
| Une **IP / une machine** à prendre | attaque (recon → shell) | [méthodo web](methodologie-pentest-web.md), [quel outil](quel-outil.md) §1-4 |
| Un **fichier à comprendre** : `.pcap`, dump mémoire, binaire, `.exe`, image disque, doc Office | analyse / forensique | [quel outil](quel-outil.md) §5-9 |
| Les **deux** (on prend la machine, on y trouve un artefact) | attaque *puis* analyse | on boucle de l'une à l'autre |

Le réflexe côté analyse, quand on ne sait pas ce qu'est le fichier :
`file artefact` puis `strings artefact | less` — le type de fichier désigne la
famille d'outils (voir [quel outil](quel-outil.md) §5).

## 3 — Le premier nmap, qui désigne la suite

Sur une cible à attaquer, tout part de là : sans savoir quels ports répondent et
quelles versions tournent, il n'y a rien à viser.

```sh
# scan de depart : scripts par defaut + versions, sans dependre du ping
sudo nmap -sC -sV -Pn -oN nmap-initial.txt 10.10.10.5

# en parallele, le scan complet des 65535 ports en tache de fond
sudo nmap -p- -oN nmap-full.txt 10.10.10.5 &
```

Ce que le résultat ouvre :

| Port / service vu | Phase suivante | Fiche |
| --- | --- | --- |
| 80 / 443 (web) | découverte de contenu, puis vulns | [méthodo web](methodologie-pentest-web.md) |
| 22 (SSH), 21 (FTP), 3389 (RDP) | auth en ligne si on a un login | [Hydra](hydra.md) |
| 445 / 139 (SMB) | énumérer partages et comptes | [quel outil](quel-outil.md) §2 |
| Une **version précise** d'un service | chercher un exploit public | [quel outil](quel-outil.md) §3b |

À partir d'ici, on est dans l'enchaînement de [la méthodo web](methodologie-pentest-web.md)
(recon → énum → accès → privesc) ; cette fiche a fait son travail.

## Pièges

- **Conclure « cible morte » sur un ping muet.** L'ICMP est souvent bloqué.
  `-Pn` d'abord, on tranche après.
- **Sauter l'étape 2.** Lancer nmap sur une room de forensique, c'est viser une
  cible qui n'existe pas : l'artefact est déjà sur le disque, il n'y a pas de
  machine à scanner.
- **Attendre le `-p-` pour commencer.** Le scan complet prend des minutes ; on ne
  reste pas à le regarder. On travaille sur les ports du `-sC -sV` pendant qu'il
  tourne en fond, et on revient dès qu'il rend un port oublié.
- **Ne rien noter.** IP, ports, versions, chemins, identifiants : tout se
  consigne au fil de l'eau. Une trouvaille non écrite est une piste perdue deux
  étapes plus loin.
- **Cadre légal.** Tout ceci ne se pointe que sur une cible autorisée — labo,
  THM/HTB, engagement signé. Jamais une machine tierce.

## Voir aussi

- [Méthodologie : de la reconnaissance au shell (web)](methodologie-pentest-web.md)
- [Quel outil pour quel objectif](quel-outil.md)
- [nmap : scan de ports et découverte réseau](../reseau/nmap.md)
- [Lexique de l'évaluation de sécurité](lexique.md)
