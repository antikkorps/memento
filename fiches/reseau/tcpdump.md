---
title: "tcpdump : capturer et lire le trafic réseau"
tags: [reseau, securite, terminal]
created: 2026-09-03
updated: 2026-09-03
status: stable
---

## En bref

[nmap](nmap.md) demande au réseau ce qu'il expose ; `tcpdump` écoute ce qui y
passe réellement. C'est l'outil de la question « le paquet part-il ? arrive-t-il ?
qu'est-ce qui répond ? » — donc autant du dépannage que de l'analyse.

## L'essentiel

```sh
tcpdump -D                                  # lister les interfaces capturables
sudo tcpdump -i eth0 -nn                    # capturer, sans resolution DNS ni de ports
sudo tcpdump -i any -nn port 443            # sur toutes les interfaces, HTTPS seulement
sudo tcpdump -i eth0 -nn -c 100 -w cap.pcap # 100 paquets, ecrits pour Wireshark
sudo tcpdump -nn -r cap.pcap 'host 10.0.0.5'   # relire, avec un filtre a la lecture
```

## Les options

| Option | Effet |
| --- | --- |
| `-i eth0` / `-i any` | interface ; `any` capture partout à la fois |
| `-n` | pas de résolution DNS |
| `-nn` | ni DNS, ni noms de services — **à mettre systématiquement** |
| `-c N` | s'arrête après N paquets |
| `-w f.pcap` | écrit le brut (pas d'affichage) |
| `-r f.pcap` | relit un fichier — pas besoin de root |
| `-v` `-vv` `-vvv` | verbosité (TTL, options IP, checksums) |
| `-A` | affiche la charge utile en ASCII |
| `-X` | hexadécimal **et** ASCII |
| `-e` | affiche l'en-tête de niveau 2 (adresses MAC) |
| `-t` `-tttt` | sans horodatage / horodatage lisible avec la date |
| `-s 0` | capture le paquet entier (par sécurité sur les vieux systèmes) |
| `-l` | sortie ligne par ligne — **obligatoire pour piper vers `grep`** |
| `-q` | sortie courte |
| `-Z user` | abandonne les privilèges root après ouverture de l'interface |
| `-G 3600 -w 'cap-%F-%H.pcap'` | rotation horaire |
| `-C 100 -W 5` | rotation à 100 Mo, 5 fichiers en rotation |

## Les filtres (syntaxe BPF)

```sh
host 10.0.0.5              tout ce qui vient de ou va vers cette IP
src host 10.0.0.5          seulement en provenance
dst host 10.0.0.5          seulement a destination
net 192.168.1.0/24         un sous-reseau
port 443                   source ou destination
dst port 53
portrange 8000-8100
tcp / udp / icmp / arp     par protocole
ether host aa:bb:cc:dd:ee:ff
greater 1000               paquets de plus de 1000 octets
```

Ils se combinent avec `and`, `or`, `not` (ou `&&`, `||`, `!`) et des
parenthèses — à mettre entre guillemets simples, le shell mangeant les
parenthèses :

```sh
sudo tcpdump -i eth0 -nn 'host 10.0.0.5 and (port 80 or port 443)'
sudo tcpdump -i eth0 -nn 'tcp and not port 22'
sudo tcpdump -i eth0 -nn 'tcp[tcpflags] & tcp-syn != 0 and tcp[tcpflags] & tcp-ack == 0'
```

Le dernier isole les **tentatives** de connexion : un SYN sans ACK. C'est la
signature d'un scan de ports vu depuis la cible.

## Recettes

```sh
# Est-ce que ma requete sort seulement ?
sudo tcpdump -i any -nn host api.exemple.tld

# Voir le contenu d'un echange HTTP en clair
sudo tcpdump -i eth0 -nn -A 'port 80'

# Qui interroge le DNS, et pour quoi ?
sudo tcpdump -i any -nn -s 0 port 53

# Un handshake TCP qui n'aboutit pas : SYN repete, jamais de SYN-ACK
sudo tcpdump -i eth0 -nn 'host 10.0.0.5 and tcp port 3306'

# Qui parle sur le reseau local (ARP)
sudo tcpdump -i eth0 -nn arp

# Capturer longtemps sans saturer le disque, pour analyse ulterieure
sudo tcpdump -i eth0 -nn -s 0 -G 3600 -W 24 -w '/var/log/cap-%F-%H.pcap' 'not port 22'

# Chercher un motif a la volee
sudo tcpdump -i eth0 -nn -l -A 'port 80' | grep -i 'user-agent'
```

## Lire ce que ça affiche

```
14:22:31.884 IP 10.0.0.4.51234 > 10.0.0.5.443: Flags [S], seq 12345, win 64240, length 0
```

`source.port > destination.port`, puis les drapeaux TCP : `[S]` SYN, `[S.]`
SYN-ACK, `[.]` ACK seul, `[P.]` PSH-ACK (des données), `[F.]` FIN, `[R]` RST.
Un `[R]` immédiat après un `[S]` = port fermé ; un `[S]` répété sans réponse =
paquet filtré ou perdu. Ces deux motifs répondent à eux seuls à la moitié des
questions.

## Pièges

- **Exclure sa propre session SSH.** Sans `not port 22`, chaque paquet affiché
  génère du trafic SSH, qui est capturé, qui est affiché… La capture s'emballe
  et sature le terminal. Réflexe : `'not port 22'` dès qu'on est connecté à
  distance.
- **`-l` est indispensable pour piper.** Sans lui la sortie est mise en tampon
  par blocs et `grep` ne voit rien pendant de longues secondes.
- **`-w` écrit du binaire.** Ne jamais le combiner avec `grep` ou `less` ; pour
  regarder et enregistrer à la fois, `-w f.pcap` puis `tcpdump -r f.pcap` dans
  un second terminal.
- **`-i any` ne donne pas les adresses MAC** : le type de lien devient « Linux
  cooked capture », les filtres `ether` ne s'appliquent plus et Wireshark
  affiche des en-têtes différents. Pour du niveau 2, capturer sur l'interface
  réelle.
- **Les filtres BPF ne sont pas les filtres d'affichage de Wireshark.**
  `ip.addr == 10.0.0.5` est du Wireshark et sera rejeté par tcpdump, qui veut
  `host 10.0.0.5`. Les deux syntaxes cohabitent dans toutes les documentations,
  c'est la confusion classique.
- **Le déchargement matériel ment.** Avec GRO/TSO/LRO activés, tcpdump affiche
  des paquets de 30 000 octets qui n'ont jamais circulé tels quels. Pour tout ce
  qui touche à la MTU ou à la fragmentation :
  `sudo ethtool -K eth0 gro off tso off lro off`.
- **tcpdump voit avant le pare-feu (*firewall*) en entrée, après en sortie.** Un paquet
  rejeté par `iptables INPUT` apparaît quand même dans la capture : le voir ne
  prouve pas que l'application l'a reçu.
- Capturer demande root ou `CAP_NET_RAW`. Quand on écrit un fichier en tant que
  root, `-Z <utilisateur>` évite de laisser un `.pcap` appartenant à root.
- **Une capture contient des données en clair** — identifiants HTTP, requêtes
  DNS, contenu de mails. Un `.pcap` se traite comme un secret, et ne se capture
  que sur un réseau qu'on a le droit d'écouter.

## Voir aussi

- [nmap : scan de ports et découverte réseau](nmap.md)
- [lsof : trouver ce qui occupe un port, un volume ou un fichier](../linux/lsof.md)
- [Lexique de l'évaluation de sécurité](../securite/lexique.md)
- <https://www.tcpdump.org/manpages/tcpdump.1.html>
