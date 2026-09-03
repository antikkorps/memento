---
title: "DNS : résolution et enregistrements"
tags: [reseau, terminal, depannage]
created: 2026-09-03
updated: 2026-09-03
status: stable
---

## En bref

Traduire un nom en adresse. Ce qu'il faut vraiment comprendre, c'est le
**cache** : la moitié des problèmes DNS ne sont pas des problèmes DNS, ce sont
des réponses périmées quelque part.

## Le trajet d'une résolution

```
navigateur -> cache du systeme -> resolveur (FAI, 1.1.1.1)
                                     |
                       racine (.) -> TLD (.fr) -> serveur faisant autorite
```

Chaque étage garde la réponse pendant la durée du **TTL**. Le serveur *faisant
autorité* est le seul à détenir la vérité ; tous les autres répètent une copie
datée.

## Les enregistrements

| Type | Contient | Exemple |
| --- | --- | --- |
| `A` | une adresse IPv4 | `exemple.tld → 203.0.113.10` |
| `AAAA` | une adresse IPv6 | |
| `CNAME` | un alias vers **un autre nom** | `www → exemple.tld` |
| `MX` | les serveurs de courrier, avec priorité | `10 mail.exemple.tld` |
| `TXT` | du texte libre — SPF, DKIM, DMARC, validations | |
| `NS` | les serveurs faisant autorité pour la zone | |
| `SOA` | paramètres de la zone : série, TTL négatif | |
| `PTR` | l'inverse : d'une IP vers un nom | |
| `SRV` | un service, son hôte et son port | |
| `CAA` | quelles autorités peuvent émettre un certificat | |

## Interroger

```sh
dig exemple.tld                      # la reponse complete
dig +short exemple.tld               # juste l'adresse
dig MX exemple.tld +short
dig TXT exemple.tld +short
dig NS exemple.tld +short
dig @1.1.1.1 exemple.tld             # forcer un resolveur precis
dig +trace exemple.tld               # tout le chemin depuis la racine
dig -x 203.0.113.10                  # resolution inverse
host exemple.tld                     # plus court, moins detaille
resolvectl status                    # quel resolveur utilise ce systeme
```

```powershell
Resolve-DnsName exemple.tld
Resolve-DnsName exemple.tld -Type MX
nslookup exemple.tld 1.1.1.1
ipconfig /flushdns          # vider le cache
ipconfig /displaydns
```

## Vider les caches

```sh
sudo resolvectl flush-caches        # systemd-resolved
sudo systemctl restart nscd         # si nscd est en place
```

Et ne pas oublier le navigateur, qui a **son propre cache**, indépendant de
celui du système : `chrome://net-internals/#dns`.

## Pièges

- **La « propagation DNS » n'existe pas.** Rien ne se propage : les caches
  expirent. La conséquence est pratique et contre-intuitive — il faut
  **abaisser le TTL avant** le changement (24 h avant, à 300 s), pas après. Une
  fois le changement fait, il est trop tard : c'est l'ancien TTL qui court.
- **Un `CNAME` ne cohabite avec aucun autre enregistrement** sur le même nom, et
  jamais à la racine du domaine (`exemple.tld` tout court). Pour la racine, il
  faut un `A`, ou un `ALIAS`/`ANAME` propriétaire à l'hébergeur.
- **`dig` sans `@` interroge ton résolveur**, donc potentiellement son cache.
  Pour savoir ce que dit vraiment la zone : `dig @<serveur NS> …` ou
  `dig +trace`. Beaucoup de « ça ne marche pas » sont des lectures de cache.
- **`/etc/hosts` gagne toujours.** Une ligne oubliée là-dedans provoque des
  heures de débogage sur un DNS parfaitement sain. C'est le premier fichier à
  regarder quand une seule machine se comporte différemment.
- **Les réponses négatives sont mises en cache aussi.** Interroger un nom
  *avant* de l'avoir créé fait mémoriser le `NXDOMAIN` pour la durée du champ
  minimum du `SOA` — d'où l'impression que la création « ne prend pas ».
- **Priorité `MX` : le plus petit nombre est le plus prioritaire.** L'inverse de
  l'intuition.
- **Un seul enregistrement SPF par domaine**, et pas plus de dix résolutions DNS
  à l'intérieur. Deux SPF invalident la vérification au lieu de l'additionner.
- **Le `PTR` ne s'écrit pas dans ta zone** : la résolution inverse est déléguée
  au propriétaire de la plage d'adresses, donc à l'hébergeur. Impossible de la
  corriger soi-même.
- **DNS bascule en TCP au-delà de 512 octets de réponse**, et pour les
  transferts de zone. Un pare-feu qui ne laisse passer que 53/UDP casse les
  grosses réponses par intermittence — voir [TCP et UDP](tcp-udp.md).
- Le DNS classique circule **en clair** : il révèle tous les sites visités, et
  sert de canal d'exfiltration discret. DoH et DoT chiffrent le transport, sans
  rendre les réponses plus fiables pour autant.

## Voir aussi

- [TCP et UDP : quand et pourquoi](tcp-udp.md)
- [HTTPS et TLS : ce qui se passe avant la page](https.md)
- [Adressage IP, masques et sous-réseaux](adressage-ip.md)
- [SSH : clés, configuration et tunnels](ssh.md)
