---
title: "nmap : scan de ports et découverte réseau"
tags: [reseau, securite]
created: 2026-08-17
updated: 2026-08-17
status: brouillon
---

# Nmap

## À quoi ça sert

Nmap (_Network Mapper_) envoie des paquets à une machine ou à un réseau et déduit des réponses ce qui s'y trouve : quels hôtes sont allumés, quels ports sont ouverts, quel logiciel écoute derrière chaque port et dans quelle version, parfois quel système d'exploitation. C'est l'équivalent de faire le tour d'un bâtiment pour noter quelles portes existent, lesquelles sont ouvertes et ce qu'on aperçoit derrière.

C'est donc l'outil de la phase de **reconnaissance** : avant de savoir comment attaquer ou défendre une machine, il faut savoir ce qu'elle expose. Un port 445 ouvert avec une vieille version de Samba, un port 8080 oublié sur une application de test — c'est ce genre de trouvaille qui oriente toute la suite. Côté défense, on l'utilise exactement pareil : inventorier son propre réseau, vérifier qu'un pare-feu fait bien son travail, repérer un service qui n'aurait jamais dû être exposé.

À noter : nmap ne fait que du réseau. Il te dit qu'un serveur web tourne sur le port 80, mais pas ce qu'il y a dans ses répertoires — pour ça il faut passer à des outils de _content discovery_ comme gobuster ou ffuf.

## L'essentiel

```bash
nmap 10.10.10.5                    # scan de base, 1000 ports TCP courants
sudo nmap -sC -sV -Pn 10.10.10.5   # la commande "à tout faire" (CTF / THM)
nmap -p- 10.10.10.5                # les 65535 ports, plus lent
```

`sudo` change le comportement par défaut : sans lui nmap fait un _connect scan_ (`-sT`, three-way handshake complet), avec lui un _SYN scan_ (`-sS`), plus rapide et plus discret.

---

## Choix des cibles

| Syntaxe                 | Effet                   |
| ----------------------- | ----------------------- |
| `10.10.10.5`            | une IP                  |
| `10.10.10.5 10.10.10.7` | plusieurs IP            |
| `10.10.10.0/24`         | tout un sous-réseau     |
| `10.10.10.1-50`         | une plage               |
| `-iL cibles.txt`        | liste depuis un fichier |
| `--exclude 10.10.10.1`  | exclure une IP          |

---

## Découverte d'hôtes

| Option         | Effet                                                                                                                                                |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `-sn`          | ping scan seul, pas de scan de ports (« qui est vivant ? »)                                                                                          |
| `-Pn`          | **saute** la découverte, traite l'hôte comme vivant — indispensable quand le pare-feu bloque l'ICMP (cas fréquent sur THM et sur les cibles Windows) |
| `-PS22,80,443` | découverte par TCP SYN sur ces ports                                                                                                                 |
| `-PU53`        | découverte par UDP                                                                                                                                   |
| `-n`           | pas de résolution DNS (accélère nettement)                                                                                                           |

---

## Types de scan

| Option            | Type              | Notes                                               |
| ----------------- | ----------------- | --------------------------------------------------- |
| `-sS`             | SYN scan          | défaut en root, rapide, semi-ouvert                 |
| `-sT`             | Connect scan      | défaut sans root, plus bruyant                      |
| `-sU`             | UDP               | très lent, mais DNS/SNMP/TFTP n'apparaissent que là |
| `-sA`             | ACK scan          | cartographier les règles d'un pare-feu              |
| `-sN` `-sF` `-sX` | Null / FIN / Xmas | évasion, inefficace sur Windows                     |

---

## Sélection des ports

```bash
-p 80,443,8080      # ports précis
-p 1-1000           # plage
-p-                 # tous (1-65535)
-F                  # rapide : 100 ports les plus courants
--top-ports 20      # les N plus courants
```

---

## Détection

| Option                      | Effet                                                                               |
| --------------------------- | ----------------------------------------------------------------------------------- |
| `-sV`                       | **version des services** — c'est ça qui donne « Apache 2.4.41 » plutôt que « http » |
| `-sV --version-intensity 9` | insiste davantage (0 à 9)                                                           |
| `-O`                        | détection de l'OS (nécessite root)                                                  |
| `-A`                        | agressif = `-sV -O -sC --traceroute` d'un coup                                      |

---

## Scripts NSE

```bash
-sC                                  # scripts par défaut (= --script=default)
--script vuln                        # catégorie vulnérabilités
--script=http-title,http-headers     # scripts nommés
--script smb-enum-shares -p445       # cibler un service
--script-help "smb*"                 # doc d'un script
```

Catégories utiles : `default`, `safe`, `vuln`, `auth`, `discovery`, `brute`, `exploit`.
Les scripts vivent dans `/usr/share/nmap/scripts/`.

---

## Vitesse et discrétion

| Option              | Effet                                                                                        |
| ------------------- | -------------------------------------------------------------------------------------------- |
| `-T0` … `-T5`       | timing, de paranoïaque à insensé. `-T4` = bon défaut en lab, `-T2` si tu veux rester discret |
| `--min-rate 1000`   | force un débit minimum de paquets/s                                                          |
| `--host-timeout 5m` | abandonne un hôte trop lent                                                                  |
| `-f`                | fragmente les paquets                                                                        |
| `-D RND:10`         | leurres (decoys)                                                                             |
| `--source-port 53`  | usurpe un port source « légitime »                                                           |

---

## Sorties

```bash
-oN scan.txt     # lisible (normal)
-oG scan.gnmap   # greppable
-oX scan.xml     # XML
-oA scan         # les trois d'un coup → scan.nmap / .gnmap / .xml
-v  / -vv        # verbosité
--reason         # pourquoi nmap conclut qu'un port est ouvert
--open           # n'affiche que les ports ouverts
```

---

## Recettes

```bash
# Reco rapide au début d'une room
sudo nmap -sC -sV -Pn -T4 -oN nmap-initial.txt 10.10.10.5

# Ensuite, tous les ports en tâche de fond
sudo nmap -p- --min-rate 5000 -Pn -oN nmap-full.txt 10.10.10.5

# Puis approfondir uniquement les ports trouvés
sudo nmap -sC -sV -p 22,80,445,3306 -oN nmap-deep.txt 10.10.10.5

# Qui est présent sur le réseau local ?
sudo nmap -sn 192.168.1.0/24

# UDP, le top 20 seulement (sinon c'est interminable)
sudo nmap -sU --top-ports 20 10.10.10.5

# Recherche de vulnérabilités connues
sudo nmap --script vuln -p 80,443 10.10.10.5
```

---

## Pendant le scan

- `Espace` ou n'importe quelle touche → affiche l'avancement
- `v` / `V` → augmente / diminue la verbosité en direct
- `Ctrl+C` → interrompt

---

## États des ports

- **open** — un service écoute
- **closed** — l'hôte répond mais rien n'écoute
- **filtered** — un pare-feu bloque, nmap ne sait pas
- **open|filtered** — indécidable (typique en UDP)
- **unfiltered** — accessible mais état inconnu (ACK scan)

---

## Rappel

Ne scanne que des machines qui t'appartiennent ou pour lesquelles tu as une autorisation explicite. Les labs THM/HTB et `scanme.nmap.org` sont prévus pour ça.
