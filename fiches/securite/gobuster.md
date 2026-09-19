---
title: "gobuster : découverte de contenu web (chemins, DNS, vhosts)"
tags: [securite, web, terminal]
created: 2026-09-14
updated: 2026-09-19
status: stable
---

## En bref

Trouver ce qu'un serveur web n'affiche pas : répertoires, fichiers et
sous-domaines cachés (*content discovery*), par brute-force d'une liste de noms
probables. gobuster **liste** ce qui existe — pour juger si c'est *vulnérable*,
c'est [Nikto](nikto.md). Complément direct de [nmap](../reseau/nmap.md), qui, lui,
s'arrête à « un serveur web tourne sur le port 80 ».

## Les trois modes

```sh
gobuster dir   -u http://10.10.10.5 -w liste.txt    # chemins et fichiers d'un site
gobuster dns   -d exemple.tld        -w liste.txt    # sous-domaines (via resolution DNS)
gobuster vhost -u http://exemple.tld -w liste.txt    # hotes virtuels (meme IP, en-tete Host)
```

`dir` est celui qu'on lance 9 fois sur 10. `dns` et `vhost` cherchent la même
chose — d'autres noms — mais autrement : `dns` interroge la résolution (le
sous-domaine doit avoir un enregistrement), `vhost` fait varier l'en-tête `Host`
sur une IP connue (trouve les sites non publiés dans le DNS).

## Mode `dir`, celui qu'on lance le plus

```sh
gobuster dir -u http://10.10.10.5 -w /usr/share/wordlists/dirb/common.txt \
  -x php,txt,html \                # tester aussi ces extensions sur chaque mot
  -t 50 \                          # 50 requetes en parallele (defaut 10)
  -k \                             # ignorer un certificat TLS auto-signe
  -o gobuster-80.txt               # ecrire le resultat dans un fichier
```

| Option | Effet |
| --- | --- |
| `-w` | wordlist (**obligatoire**) |
| `-x php,txt` | extensions à tester : `admin` devient `admin`, `admin.php`, `admin.txt`… |
| `-t 50` | tâches parallèles (défaut 10) |
| `-s` / `-b` | codes de statut à **garder** / à **rejeter** |
| `-k` | ignorer un certificat TLS invalide (HTTPS de labo) |
| `-r` | suivre les redirections |
| `-U` / `-P` | identifiants pour une authentification HTTP basique |
| `-o fichier` | écrire le résultat |

## Lire la sortie : les codes de statut

| Code | Sens |
| --- | --- |
| `200` | le chemin existe et répond |
| `301` / `302` | redirection — souvent un **dossier** (réessayer avec `/`) |
| `403` | existe mais **interdit** — intéressant, il y a quelque chose là |
| `401` | authentification requise |

Un `403` n'est pas un échec : il **confirme que le chemin existe**. Les masquer
avec `-b`, c'est jeter l'information.

## Les wordlists, c'est 80 % du résultat

Sans bonne liste, gobuster ne trouve rien. La progression : dégrossir vite, puis
insister.

```sh
/usr/share/wordlists/dirb/common.txt                                  # premier jet, rapide
/usr/share/seclists/Discovery/Web-Content/directory-list-2.3-medium.txt   # le classique
/usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt     # pour le mode dns
```

## Pièges

- **La wordlist fait tout le résultat.** `common.txt` pour dégrossir, une liste
  plus grosse (`directory-list-2.3-medium`) ensuite. Rien trouvé = souvent la
  mauvaise liste, pas un site vide.
- **`-x` oublié = on rate `index.php`, `backup.txt`, `config.old`.** Toujours
  passer les extensions du service (une appli PHP → `-x php`).
- **Les faux positifs des sites « attrape-tout ».** Une appli qui renvoie `200`
  sur *n'importe quelle* URL noie le résultat : repérer la taille de réponse
  constante et la filtrer (`--exclude-length`), ou tester une URL bidon d'abord.
- **`-t` trop haut sur un serveur qui rame** génère des faux négatifs
  (*timeouts*). Baisser si les résultats sont instables.
- **gobuster vs ffuf** : ffuf est plus souple (fuzz de paramètres, de vhosts,
  filtrage par taille de réponse `-fs`). gobuster va droit au but pour lister des
  dossiers.
- **Bruyant et journalisé**, comme tout brute-force. Labo ou périmètre autorisé
  uniquement.

## Voir aussi

- [Quel outil pour quel objectif](quel-outil.md)
- [Méthodologie : de la reconnaissance au shell (web)](methodologie-pentest-web.md)
- [Nikto : scanner de serveur web](nikto.md)
- [Hydra : brute-force d'authentification en ligne](hydra.md)
- [nmap : scan de ports et découverte réseau](../reseau/nmap.md)
- [Les attaques web courantes](attaques-web.md)
- <https://github.com/OJ/gobuster>
