---
title: "Le modèle OSI en 7 couches"
tags: [reseau, securite]
created: 2026-09-03
updated: 2026-09-03
status: stable
---

## En bref

Sept couches empilées, de la prise murale à l'application. L'intérêt n'est pas
de les réciter, c'est de savoir **à quelle couche se situe le problème** — et
donc quel outil sortir.

## Le tableau

De haut en bas, comme on les lit :

| N° | Couche | Anglais | Unité (*PDU*) | Exemples | Où ça casse |
| --: | --- | --- | --- | --- | --- |
| 7 | Application | Application | donnée | HTTP, DNS, SSH, SMTP | erreur 500, mauvaise requête |
| 6 | Présentation | Presentation | donnée | TLS, encodage, compression | certificat expiré, charset |
| 5 | Session | Session | donnée | RPC, NetBIOS, reprise TLS | session qui tombe |
| 4 | Transport | Transport | segment (TCP) / datagramme (UDP) | TCP, UDP, ports | port fermé ou filtré |
| 3 | Réseau | Network | paquet (*packet*) | IP, ICMP, routage | pas de route, mauvais masque |
| 2 | Liaison | Data Link | trame (*frame*) | Ethernet, MAC, ARP, VLAN | mauvais VLAN, ARP faux |
| 1 | Physique | Physical | bit | câble, fibre, RJ45, Wi-Fi | câble débranché, port mort |

**Moyen mnémotechnique**, de 1 vers 7 : *Pour Le Réseau, Tout Se Passe
Automatiquement* — Physique, Liaison, Réseau, Transport, Session,
Présentation, Application. En anglais, de 7 vers 1 : *All People Seem To Need
Data Processing*.

## Quel outil à quelle couche

| Couche | Équipement | Ce qu'on tape |
| --- | --- | --- |
| 1 | câble, hub, transceiver | `ip link`, `ethtool eth0` |
| 2 | switch, carte réseau | `ip neigh`, `arp -a`, `tcpdump -e` |
| 3 | routeur, pare-feu IP | `ping`, `traceroute`, `ip route` |
| 4 | pare-feu à états, répartiteur | `ss -tuln`, `netstat -ano`, [nmap](nmap.md) |
| 7 | proxy, WAF | `curl -v`, `dig`, les logs applicatifs |

Le diagnostic se fait **du bas vers le haut** : inutile de déboguer une requête
HTTP si le `ping` ne passe pas. C'est le seul usage vraiment utile du modèle.

## Le modèle TCP/IP, celui qui existe vraiment

OSI est un modèle de **référence** ; la pile réellement implémentée est TCP/IP,
en quatre couches :

| TCP/IP | Couches OSI correspondantes |
| --- | --- |
| Application | 5, 6, 7 |
| Transport | 4 |
| Internet | 3 |
| Accès réseau | 1, 2 |

## Vu de la sécurité

Chaque couche a ses attaques — c'est la grille de lecture attendue en
certification :

| Couche | Attaque typique | Parade |
| --- | --- | --- |
| 2 | ARP spoofing, MAC flooding, VLAN hopping | port security, 802.1X, DAI |
| 3 | IP spoofing, ICMP flood | filtrage anti-usurpation, ACL |
| 4 | SYN flood, scan de ports | SYN cookies, limitation de débit |
| 6 | TLS obsolète, certificat falsifié | TLS 1.2+, épinglage, HSTS |
| 7 | XSS, injection SQL, traversée de chemin | validation des entrées, WAF |

Un pare-feu « de couche 4 » filtre sur IP et ports ; un WAF est « de couche 7 »
et lit le contenu HTTP. Les deux ne voient pas la même chose : le second
comprend la requête, le premier ne voit que l'enveloppe.

## Pièges

- **OSI est un modèle, pas une implémentation.** Les couches 5 et 6 ne
  correspondent à presque rien dans la pile réelle — beaucoup de protocoles les
  ignorent ou les fusionnent dans l'application.
- **TLS n'a pas de couche propre.** On le classe en 6 par convention, il tourne
  en pratique entre 4 et 7. Une question d'examen le placera en 6 ; une
  discussion d'ingénierie dira « au-dessus de TCP ».
- **Switch = couche 2, routeur = couche 3** — mais un « switch de niveau 3 »
  fait du routage, et un pare-feu moderne travaille de 3 à 7. Les équipements
  ne respectent pas les frontières du modèle.
- L'encapsulation ajoute un en-tête à chaque descente de couche et l'enlève à
  la remontée : c'est pour ça qu'un `tcpdump` montre les en-têtes Ethernet, IP
  **et** TCP empilés sur le même paquet.
- La « couche 8 », c'est l'utilisateur. C'est une blague de métier, et souvent
  la bonne réponse.

## Voir aussi

- [TCP et UDP : quand et pourquoi](tcp-udp.md)
- [HTTPS et TLS : ce qui se passe avant la page](https.md)
- [tcpdump : capturer et lire le trafic réseau](tcpdump.md)
- [nmap : scan de ports et découverte réseau](nmap.md)
