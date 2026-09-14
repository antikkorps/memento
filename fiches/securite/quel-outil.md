---
title: "Quel outil pour quel objectif"
tags: [securite, procedure]
created: 2026-09-14
updated: 2026-09-14
status: brouillon
---

## En bref

On part d'une **intention** (« il faut que je trouve des identifiants SSH
valides »), jamais d'un nom d'outil. Cette fiche traduit *je veux faire ça →
l'outil*, dans l'ordre où se déroule un engagement. La colonne **« plutôt que »**
dit pourquoi celui-là et pas le voisin qui fait presque pareil : c'est là qu'on
perd le plus de temps le jour de l'examen.

Recherche : grep le mot métier (`m find ssh`, `m find "mot de passe"`,
`m find hash`) puis affine avec **`secu`** dans fzf — toutes les fiches
cybersécurité vivent dans `securite/`, donc `secu` retombe toujours ici.

## Le fil conducteur

L'ordre mental d'une attaque, chaque phase répondant à une question :

**reconnaissance** (qu'est-ce qui existe ?) → **énumération** (*enumeration* :
qu'y a-t-il derrière ce port ?) → **accès** (mots de passe ou exploit) →
**post-exploitation** puis **élévation de privilèges** (*privilege escalation*,
*privesc* : de simple utilisateur à root/admin).

Une intention se raccroche presque toujours à une seule phase. Trouver la phase,
c'est déjà réduire à deux ou trois outils.

## 1. Reconnaissance réseau — qu'est-ce qui existe

| Je veux… | Outil | Plutôt que |
| --- | --- | --- |
| Ports, services, versions d'une machine | **nmap** | masscan (rapide mais brut, pas de versions) |
| Découvrir les hôtes vivants d'un sous-réseau | **nmap -sn** | ping en boucle à la main |
| Voir ce qui **circule** sur le réseau (paquets) | **tcpdump** / Wireshark | nmap, qui sonde mais n'écoute pas |

nmap est le point de départ de presque tout : ce qu'il trouve (un port, une
version) désigne la phase et l'outil suivants.

## 2. Énumérer un service — creuser un port ouvert

| Sur… | Je veux… | Outil | Plutôt que |
| --- | --- | --- | --- |
| Web (80/443) | Chemins et fichiers cachés (*content discovery*) | **gobuster** / **ffuf** | nikto (cherche des vulns, pas des chemins) |
| Web (80/443) | Vulnérabilités connues, mauvaises configs | **nikto** | gobuster (ne juge rien, liste juste) |
| Web / WordPress | Version, plugins, users WP | **wpscan** | scan générique qui ignore le CMS |
| SMB (445/139) | Partages, comptes, politique de mot de passe | **enum4linux-ng** | nmap seul, qui voit le port mais pas le contenu |
| SMB | Lister / récupérer des fichiers d'un partage | **smbclient** | — |
| DNS (53) | Transfert de zone, sous-domaines | **dig** (`AXFR`), **dnsenum** | nmap |
| Tout service | Détail fin d'une version pour chercher un exploit | **nmap -sV -sC** | — |

## 3. Obtenir un accès

### a. Attaquer des mots de passe

Le partage se fait sur **en ligne vs hors ligne**, et c'est le piège classique.

| Je veux… | Outil | Plutôt que |
| --- | --- | --- |
| Deviner un login/mot de passe **en ligne** (SSH, FTP, RDP, HTTP form) | **hydra** | metasploit (surdimensionné pour du bruteforce d'auth) |
| Casser (*crack*) un **hash hors ligne**, sur GPU | **hashcat** | john (plus lent sur gros volumes) |
| Casser un hash hors ligne, machine sans GPU / formats exotiques | **john** (John the Ripper) | hashcat (exige un mode `-m` explicite) |
| Tester un même couple sur **beaucoup d'hôtes** (SMB/WinRM) | **crackmapexec** / **netexec** | hydra, moins pratique en parc Windows |
| Identifier un hash inconnu avant de le casser | **hashid** / hashes.com | deviner |

- **En ligne** = on frappe le service réel, lent, bruyant, verrouille les comptes
  → force brute (*brute force*) ou dictionnaire ciblé, jamais rockyou entier.
- **Hors ligne** = on a déjà le hash (via une faille, un dump), on tape aussi vite
  que le matériel le permet → hashcat/john, rockyou et règles à volonté.

### b. Exploiter une vulnérabilité

| Je veux… | Outil | Plutôt que |
| --- | --- | --- |
| Vérifier s'il existe un exploit public pour une version | **searchsploit** | Google à l'aveugle |
| Lancer un exploit connu, gérer la session, une CVE au scan | **metasploit** | recompiler un PoC à la main |
| Fabriquer une charge autonome (`.exe`, `.elf`, `.php`) | **msfvenom** | — |
| Un shell d'écoute simple, sans framework | **netcat** (`nc -lvnp 4444`) | metasploit pour un simple reverse shell |
| Manipuler/rejouer des requêtes web, intercepter | **Burp Suite** | curl pour l'exploratoire lourd |
| Automatiser une injection SQL | **sqlmap** | injection manuelle une fois le point confirmé |

## 4. Une fois dedans — post-exploitation & privesc

| Je veux… | Outil | Plutôt que |
| --- | --- | --- |
| Lister les vecteurs de privesc **Linux** | **linpeas** | énumération manuelle (utile mais lente) |
| Idem sous **Windows** | **winpeas** | — |
| Une session riche (fichiers, hashs, pivot) | **meterpreter** | un shell netcat brut |
| Extraire les hashs de comptes une fois admin | `hashdump` (meterpreter), **mimikatz** | — |
| Reconnaître le terrain sur une cible Windows | commandes natives | uploader un outil (voir [reconnaissance Windows](../windows/reconnaissance.md)) |

## Outil vs outil : les vrais dilemmes

Le classement par phase ci-dessus tranche 90 % des cas. Restent les paires qui
se ressemblent — c'est ici qu'on hésite.

- **hydra vs metasploit** — hydra pour deviner une auth **en ligne** (c'est son
  seul métier, il le fait vite). metasploit quand tu as une **vulnérabilité** à
  exploiter, pas un mot de passe à deviner. « bruteforce SSH » → hydra, toujours.
- **hashcat vs john** — même métier (casser un hash **hors ligne**). hashcat si
  GPU (bien plus rapide, mais exige le numéro de mode `-m`). john s'il n'y a pas
  de GPU, ou pour un format bizarre qu'il devine tout seul.
- **hydra (en ligne) vs hashcat/john (hors ligne)** — la vraie ligne de partage
  des mots de passe : as-tu le **hash** en main, ou seulement le **service** qui
  écoute ? Hash → hors ligne. Service → en ligne.
- **gobuster vs ffuf vs nikto** — gobuster/ffuf **listent** des chemins cachés
  (ffuf plus souple : fuzz de paramètres, de vhosts). nikto **juge** : il
  cherche des vulns et des configs connues. Découvrir l'arborescence → gobuster ;
  savoir si le serveur est vulnérable → nikto.
- **nmap -sV vs enum4linux vs smbclient** — nmap voit *que* le port 445 est
  ouvert ; enum4linux-ng creuse *ce qu'il y a derrière* (partages, users) ;
  smbclient s'y **connecte** pour lister et récupérer.
- **searchsploit vs metasploit** — searchsploit *cherche* si un exploit existe
  (base locale, hors ligne). metasploit le *lance* et gère la suite. On commence
  souvent par searchsploit pour savoir quoi chercher dans metasploit.
- **netcat vs meterpreter** — netcat pour un shell jetable, universel, sans rien
  installer côté cible. meterpreter quand tu veux rester : commandes riches,
  hashdump, pivot, tout en mémoire.

## Pièges

- **Partir de l'outil, pas de l'objectif.** « je lance metasploit » n'est pas un
  plan. « je dois exploiter cette version de vsftpd » → *là* metasploit devient
  le bon choix. L'intention d'abord, l'outil ensuite.
- **Confondre en ligne et hors ligne pour les mots de passe.** L'erreur qui coûte
  le plus de temps : lancer hydra sur un hash (il n'y a rien à interroger), ou
  hashcat sur un service SSH (il ne parle pas au réseau). Hash → hashcat/john ;
  service qui écoute → hydra.
- **Sauter l'énumération.** Vouloir exploiter avant d'avoir énuméré, c'est
  chercher un exploit pour un service dont on ignore la version. La version
  précise (nmap `-sV`) est ce qui rend searchsploit utile.
- **Le gros dictionnaire en ligne.** rockyou entier via hydra sur un vrai service
  verrouille les comptes et prend des heures. En ligne = liste courte et ciblée ;
  rockyou, c'est pour le hors ligne.
- **Un outil qui « ne trouve rien » a souvent la mauvaise cible ou le mauvais
  wordlist**, pas un service invulnérable. Vérifier la commande avant de conclure.
- **Cadre légal.** Tout ce qui précède ne se pointe que sur une cible autorisée
  (labo, THM, engagement signé).

## Voir aussi

- [nmap : scan de ports et découverte réseau](../reseau/nmap.md)
- [Metasploit : le framework d'exploitation](metasploit.md)
- [hydra : bruteforce d'authentification en ligne](hydra.md)
- [hashcat : casser des hachages sur GPU](hashcat.md)
- [John the Ripper : casser des hachages hors ligne](john-the-ripper.md)
- [gobuster : découverte de contenu web](gobuster.md)
- [Burp Suite : intercepter et manipuler le trafic web](burp.md)
- [linpeas : énumération de privesc Linux](linpeas.md)
- [Les attaques web courantes](attaques-web.md)
- [Maliciels, attaques et vocabulaire des menaces](menaces.md)
- [Lexique de l'évaluation de sécurité](lexique.md)
- [Windows : reconnaissance système en ligne de commande](../windows/reconnaissance.md)
