---
title: "TCP et UDP : quand et pourquoi"
tags: [reseau, securite]
created: 2026-09-03
updated: 2026-09-03
status: stable
---

## En bref

Les deux protocoles de la couche 4 (voir [le modèle OSI](modele-osi.md)). TCP
garantit la livraison et paie ce confort ; UDP envoie sans garantie et va vite.
Tout le reste en découle.

## La comparaison

| | TCP | UDP |
| --- | --- | --- |
| Connexion | oui, poignée de main (*handshake*) | non, on envoie |
| Ordre garanti | oui | non |
| Retransmission si perte | oui | non |
| Contrôle de flux et congestion | oui | non |
| Taille d'en-tête | 20 octets minimum | 8 octets |
| Diffusion (*broadcast*) | non | oui |
| Quand | fichier, page, base de données | voix, vidéo, DNS, journalisation |

La bonne question n'est pas « lequel est meilleur » mais **« qu'est-ce qui coûte
le plus cher : perdre un paquet, ou attendre sa retransmission ? »** Pour un
virement bancaire, perdre. Pour un appel vidéo, attendre.

## La poignée de main TCP

```
client                        serveur
  | ------- SYN ------------->|   « je veux ouvrir »
  | <----- SYN-ACK -----------|   « d'accord, moi aussi »
  | ------- ACK ------------->|   « c'est parti »
      ...  ESTABLISHED  ...
  | ------- FIN ------------->|   fermeture propre, dans les deux sens
```

Un port **fermé** répond `RST` immédiatement ; un port **filtré** ne répond
rien. C'est exactement cette différence que nmap exploite pour distinguer
`closed` de `filtered`.

| Drapeau | Sens |
| --- | --- |
| `SYN` | ouverture de connexion |
| `ACK` | accusé de réception |
| `FIN` | fin propre |
| `RST` | rejet brutal — « il n'y a rien ici » |
| `PSH` | livrer les données tout de suite |
| `URG` | données prioritaires (quasi inutilisé) |

## Les ports à connaître

| Port | Service | Protocole |
| --: | --- | --- |
| 20 / 21 | FTP (données / commandes) | TCP |
| 22 | SSH, SFTP | TCP |
| 23 | Telnet — **en clair** | TCP |
| 25 | SMTP | TCP |
| 53 | DNS | **UDP** et TCP |
| 67 / 68 | DHCP | UDP |
| 69 | TFTP | UDP |
| 80 | HTTP | TCP |
| 110 / 995 | POP3 / POP3S | TCP |
| 123 | NTP | UDP |
| 137-139 | NetBIOS | TCP/UDP |
| 143 / 993 | IMAP / IMAPS | TCP |
| 161 / 162 | SNMP | UDP |
| 389 / 636 | LDAP / LDAPS | TCP |
| 443 | HTTPS | TCP (et UDP en HTTP/3) |
| 445 | SMB | TCP |
| 587 | SMTP soumission | TCP |
| 3306 | MySQL | TCP |
| 3389 | RDP | TCP |
| 5432 | PostgreSQL | TCP |
| 5900 | VNC | TCP |

Les plages : **0-1023** réservés (root requis pour écouter), **1024-49151**
enregistrés, **49152-65535** éphémères, attribués aux clients.

## Voir l'état des connexions

```sh
ss -tuln                        ce qui ECOUTE (t=tcp u=udp l=listen n=numerique)
ss -tp                          les connexions etablies, avec le processus
netstat -ano                    l'equivalent Windows
```

| État | Sens |
| --- | --- |
| `LISTEN` | un service attend |
| `ESTABLISHED` | connexion en cours |
| `SYN_SENT` | on a demandé, rien reçu — port filtré ou hôte absent |
| `TIME_WAIT` | fermée, on garde le numéro quelques instants |
| `CLOSE_WAIT` | l'autre a fermé, **pas nous** |

## Pièges

- **`TIME_WAIT` en masse est normal**, ce n'est pas une fuite : le système garde
  le couple de ports quelques dizaines de secondes pour ne pas confondre avec
  une ancienne connexion. En revanche, des **`CLOSE_WAIT` qui s'accumulent sont
  un bug applicatif** : le pair a fermé et le code ne referme jamais sa socket.
  C'est le diagnostic le plus utile de cette fiche.
- **Le DNS n'est pas « que » de l'UDP.** Il bascule en TCP au-delà de 512 octets
  de réponse et pour les transferts de zone. Un pare-feu qui ne laisse passer
  que 53/UDP casse les grosses réponses de façon intermittente — panne pénible.
- **Le même numéro en TCP et en UDP désigne deux services différents.** 53/tcp
  et 53/udp sont deux entrées distinctes dans un pare-feu comme dans un scan.
- **« Le web, c'est TCP » est devenu faux** : HTTP/3 passe par QUIC, donc sur
  UDP/443. Un filtrage qui bloque l'UDP fait silencieusement retomber les
  navigateurs en HTTP/2.
- En UDP, l'absence de réponse ne prouve rien — d'où le `open|filtered` de nmap,
  qui n'est pas un échec mais une honnêteté.
- Un `RST` reçu au milieu d'un échange n'est pas toujours l'autre bout : un
  pare-feu ou un équipement intermédiaire peut en injecter pour couper la
  connexion.
- Écouter sur un port < 1024 demande root — d'où les applications qui tournent
  en 8080 derrière un proxy en 80.

## Voir aussi

- [Le modèle OSI en 7 couches](modele-osi.md)
- [HTTPS et TLS : ce qui se passe avant la page](https.md)
- [nmap : scan de ports et découverte réseau](nmap.md)
- [tcpdump : capturer et lire le trafic réseau](tcpdump.md)
