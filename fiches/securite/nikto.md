---
title: "Nikto : scanner de serveur web"
tags: [securite, web, terminal]
created: 2026-09-19
updated: 2026-09-19
status: stable
---

## En bref

Passer un serveur web au crible en une commande : fichiers et scripts dangereux,
versions périmées, en-têtes manquants, méthodes HTTP ouvertes, répertoires
connus. C'est un scanner de **triage** — bruyant, rapide, à lancer dès qu'un port
web apparaît au scan de ports.

Nikto vient donc après [nmap](../reseau/nmap.md), qui a dit *qu'un* serveur web
tourne ; Nikto dit *ce qu'il expose*.

## L'essentiel

```sh
nikto -h http://10.10.10.5              # scan de base
nikto -h 10.10.10.5 -p 80,443,8080      # plusieurs ports d'un coup
nikto -h https://10.10.10.5 -ssl        # forcer TLS
nikto -h http://10.10.10.5 -o rapport.html -Format htm   # rapport dans un fichier
```

Chaque ligne de résultat préfixée par `+` est une trouvaille. Les plus utiles :
la **version du serveur** et de ses modules (à croiser avec une base de CVE), les
**fichiers oubliés** (`/admin`, `/backup`, `config.old`), les **méthodes**
autorisées (`PUT`, `TRACE`) et les **en-têtes de sécurité absents**.

## Options utiles

| Option | Effet |
| --- | --- |
| `-Tuning 2` | limiter aux catégories de tests voulues (ex. `2` = fichiers mal placés) |
| `-id johndoe:motdepasse` | authentification HTTP basique |
| `-useproxy http://127.0.0.1:8080` | passer par Burp pour voir/rejouer les requêtes |
| `-vhost site.exemple.tld` | viser un hôte virtuel précis derrière l'IP |
| `-maxtime 60s` | plafonner la durée du scan |
| `-Display V` | sortie verbeuse (montre chaque requête) |

Les catégories de `-Tuning` vont de `0` (redirections) à `9` (injection SQL), plus
`x` pour tout inverser. Utile pour raccourcir un scan quand on ne cherche qu'une
chose.

## Pièges

- **Nikto est tout sauf discret.** Il envoie des milliers de requêtes signées
  d'un `User-Agent` reconnaissable ; il finit dans les journaux et déclenche les
  IDS. À réserver au labo ou à un périmètre autorisé.
- **Beaucoup de faux positifs.** Il conclut souvent d'une bannière de version,
  or Debian/RHEL rétroportent les correctifs sans changer le numéro affiché — le
  même piège que `-sV` sous nmap. Une trouvaille Nikto est une **piste**, pas une
  preuve.
- **Il scanne un seul hôte virtuel.** Sur une IP qui héberge plusieurs sites,
  sans `-vhost` il ne voit que le site par défaut et rate tout le reste.
- **Ce n'est pas de la découverte de contenu.** Nikto teste une liste de chemins
  *connus* ; pour brute-forcer des répertoires propres à l'appli, c'est
  [gobuster](gobuster.md).
- **Ce n'est pas un scanner de vulnérabilités complet.** Il repère le connu et le
  mal configuré ; il ne remplace ni la revue manuelle ni un outil dédié.

## Voir aussi

- [gobuster : brute-force de chemins, DNS et vhosts](gobuster.md)
- [Burp Suite Community : le proxy d'interception web](burp.md)
- [Méthodologie : de la reconnaissance au shell (web)](methodologie-pentest-web.md)
- [nmap : scan de ports et découverte réseau](../reseau/nmap.md)
- [Les attaques web courantes](attaques-web.md)
- <https://github.com/sullo/nikto/wiki>
