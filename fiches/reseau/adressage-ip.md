---
title: "Adressage IP, masques et sous-réseaux"
tags: [reseau, securite]
created: 2026-09-03
updated: 2026-09-03
status: stable
---

## En bref

Une adresse IPv4 fait 32 bits. Le masque dit **où s'arrête le réseau et où
commence la machine**. Tout le calcul de sous-réseaux se ramène à ça, et ça se
fait de tête avec une seule astuce.

## La notation CIDR

`192.168.1.10/24` : les **24 premiers bits** identifient le réseau, les 8
restants la machine.

| CIDR | Masque | Adresses | Machines utilisables |
| --- | --- | --: | --: |
| `/24` | 255.255.255.0 | 256 | 254 |
| `/25` | 255.255.255.128 | 128 | 126 |
| `/26` | 255.255.255.192 | 64 | 62 |
| `/27` | 255.255.255.224 | 32 | 30 |
| `/28` | 255.255.255.240 | 16 | 14 |
| `/29` | 255.255.255.248 | 8 | 6 |
| `/30` | 255.255.255.252 | 4 | 2 |
| `/31` | 255.255.255.254 | 2 | 2 (liaison point à point) |
| `/32` | 255.255.255.255 | 1 | 1 (une seule machine) |

Deux adresses sont toujours confisquées : la **première** identifie le réseau,
la **dernière** est le *broadcast*. D'où le « moins 2 ».

Formule : `2^(32 - n)` adresses, `2^(32 - n) - 2` utilisables.

## L'astuce de calcul

**Taille du bloc = 256 − dernier octet du masque.**

Pour `/26` → masque `255.255.255.192` → `256 − 192 = 64`. Les sous-réseaux
tombent donc tous les 64 :

```
192.168.1.0   → .63     reseau .0    broadcast .63    utilisables .1  à .62
192.168.1.64  → .127    reseau .64   broadcast .127   utilisables .65 à .126
192.168.1.128 → .191
192.168.1.192 → .255
```

Pour situer une adresse, on cherche dans quel bloc elle tombe :
`192.168.1.100/26` → entre 64 et 127 → réseau `192.168.1.64`, broadcast
`192.168.1.127`.

## Les plages à connaître par cœur

| Plage | CIDR | Rôle |
| --- | --- | --- |
| 10.0.0.0 – 10.255.255.255 | `10.0.0.0/8` | privée (RFC 1918) |
| 172.**16**.0.0 – 172.**31**.255.255 | `172.16.0.0/12` | privée |
| 192.168.0.0 – 192.168.255.255 | `192.168.0.0/16` | privée |
| 127.0.0.0/8 | | boucle locale (*loopback*) |
| 169.254.0.0/16 | | lien local — **échec DHCP** |
| 224.0.0.0/4 | | multidiffusion |
| 0.0.0.0 | | « toutes les interfaces » |

Les adresses privées ne sont pas routables sur Internet : c'est le NAT du
routeur qui les traduit vers l'adresse publique.

## Les commandes

```sh
ip -br a                        les adresses, en une ligne par interface
ip route                        la table de routage, `default via` = la passerelle
ipcalc 192.168.1.100/26         tout le calcul, si l'outil est installe
```

```powershell
Get-NetIPConfiguration
ipconfig /all
```

## IPv6, l'essentiel

128 bits, notés en hexadécimal. `::` remplace **une seule** suite de zéros.
`::1` est la boucle locale, `fe80::/10` le lien local, et un réseau local fait
presque toujours `/64`. Pas de broadcast, pas de NAT nécessaire.

## Pièges

- **La plage privée en 172 va de 172.16 à 172.31**, pas de 172.0 à 172.255.
  C'est l'erreur la plus fréquente en examen, et `172.16.0.0/12` ne le dit pas
  au premier regard.
- **`169.254.x.x` est un diagnostic, pas une configuration.** La machine n'a pas
  obtenu de bail DHCP et s'est attribué une adresse toute seule : elle ne parlera
  à personne hors du lien. Voir cette adresse, c'est chercher le serveur DHCP.
- **Un masque différent des deux côtés casse la communication** sans message
  d'erreur : chaque machine calcule un réseau différent et croit que l'autre est
  distante. Deux machines sur le même câble peuvent ne pas se voir.
- **`/31` est une exception** (RFC 3021) : sur une liaison point à point, les
  deux adresses sont utilisables, il n'y a ni réseau ni broadcast.
- **Les classes A, B, C sont obsolètes depuis 1993** — remplacées par CIDR. Elles
  tombent quand même en certification : A = `/8`, B = `/16`, C = `/24`.
- Un `/24` n'offre pas 256 machines mais 254. L'oubli du « moins 2 » est la
  faute de calcul classique.
- `0.0.0.0/0` en table de routage signifie « tout le reste » : c'est la route par
  défaut, pas une adresse.

## Voir aussi

- [Le modèle OSI en 7 couches](modele-osi.md)
- [TCP et UDP : quand et pourquoi](tcp-udp.md)
- [nmap : scan de ports et découverte réseau](nmap.md)
