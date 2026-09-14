---
title: "gobuster : découverte de contenu web"
tags: [securite, web, terminal]
created: 2026-09-14
updated: 2026-09-14
status: brouillon
---

## En bref

Trouver ce qu'un serveur web n'affiche pas : répertoires, fichiers et
sous-domaines cachés (*content discovery*), en testant une liste de noms
probables. Il **liste** ce qui existe — pour juger si c'est *vulnérable*, c'est
nikto. Complément direct de [nmap](../reseau/nmap.md), qui, lui, s'arrête à
« un serveur web tourne sur le port 80 ».

## L'essentiel

```sh
gobuster dir -u http://10.10.10.5 -w /usr/share/wordlists/dirb/common.txt   # repertoires et fichiers
gobuster dir -u http://10.10.10.5 -w common.txt -x php,txt,html             # + extensions a essayer
gobuster dns -d exemple.tld -w subdomains.txt                               # sous-domaines
gobuster vhost -u http://10.10.10.5 -w subdomains.txt                       # hotes virtuels (meme IP)
```

Trois modes : **`dir`** (chemins), **`dns`** (sous-domaines), **`vhost`** (virtual
hosts). `dir` est celui qu'on lance 9 fois sur 10.

## Options utiles

| Option | Effet |
| --- | --- |
| `-w` | wordlist (**obligatoire**) |
| `-x php,txt` | extensions à tester sur chaque mot |
| `-t 50` | threads (défaut 10) |
| `-s` / `-b` | codes de statut à **garder** / à **rejeter** |
| `-k` | ignorer un certificat TLS invalide (HTTPS de labo) |
| `-r` | suivre les redirections |
| `-o fichier` | écrire le résultat dans un fichier |

## Lire la sortie : les codes de statut

| Code | Sens |
| --- | --- |
| `200` | le chemin existe et répond |
| `301` / `302` | redirection — souvent un **dossier** (réessayer avec `/`) |
| `403` | existe mais **interdit** — intéressant, il y a quelque chose là |
| `401` | authentification requise |

Un `403` n'est pas un échec : il confirme que le chemin **existe**.

## Pièges

- **La wordlist fait tout le résultat.** `common.txt` pour dégrossir vite, une
  liste plus grosse (`directory-list-2.3-medium`) ensuite. Rien trouvé = souvent
  la mauvaise liste, pas un site vide.
- **`-x` oublié = on rate `index.php`, `backup.txt`, `config.old`.** Toujours
  passer les extensions du service (une appli PHP → `-x php`).
- **`-t` trop haut sur un serveur qui rame** génère des faux négatifs (timeouts).
  Baisser si les résultats sont instables.
- **gobuster vs ffuf** : ffuf est plus souple (fuzz de paramètres, de vhosts,
  filtrage par taille de réponse `-fs`). gobuster va droit au but pour lister des
  dossiers.
- **Cadre légal.** Uniquement sur une cible autorisée.

## Voir aussi

- [Quel outil pour quel objectif](quel-outil.md)
- [Les attaques web courantes](attaques-web.md)
- [Codes de réponse HTTP](../reseau/codes-http.md)
- [nmap : scan de ports et découverte réseau](../reseau/nmap.md)
