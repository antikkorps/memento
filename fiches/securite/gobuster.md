---
title: "gobuster : brute-force de chemins, DNS et vhosts"
tags: [securite, web, terminal]
created: 2026-09-19
updated: 2026-09-19
status: stable
---

## En bref

Trouver ce qui n'est lié nulle part : répertoires et fichiers cachés, sous-domaines,
hôtes virtuels. gobuster essaie chaque entrée d'une liste de mots (*wordlist*)
contre la cible et garde ce qui répond. C'est l'étape de **découverte de contenu**
(*content discovery*) juste après [nmap](../reseau/nmap.md), qui a trouvé le port
web mais pas ce qu'il y a derrière.

## Les trois modes

```sh
gobuster dir   -u http://10.10.10.5 -w liste.txt    # chemins d'un site
gobuster dns   -d exemple.tld       -w liste.txt    # sous-domaines
gobuster vhost -u http://exemple.tld -w liste.txt   # hotes virtuels (meme IP, en-tete Host)
```

`dns` et `vhost` cherchent la même chose — d'autres noms — mais autrement : `dns`
interroge la résolution DNS (le sous-domaine doit avoir un enregistrement), `vhost`
fait varier l'en-tête `Host` sur une IP connue (trouve les sites non publiés dans
le DNS).

## Mode `dir`, celui qu'on lance le plus

```sh
gobuster dir -u http://10.10.10.5 -w /usr/share/seclists/Discovery/Web-Content/directory-list-2.3-medium.txt \
  -x php,txt,html \                # tester aussi ces extensions sur chaque mot
  -t 50 \                          # 50 requetes en parallele
  -k \                             # ignorer un certificat TLS auto-signe
  -o gobuster-80.txt               # ecrire le resultat dans un fichier
```

| Option | Effet |
| --- | --- |
| `-x php,txt,html` | ajoute les extensions : teste `admin`, `admin.php`, `admin.txt`… |
| `-s "200,301,403"` | ne garder que ces codes de statut (*status codes*) |
| `-b "404,404"` | au contraire, masquer ces codes (liste noire) |
| `-t 50` | nombre de tâches parallèles |
| `-k` | ne pas vérifier le certificat (HTTPS de labo) |
| `-U` / `-P` | identifiants pour une authentification HTTP basique |

## Les wordlists, c'est 80 % du résultat

Sans bonne liste, gobuster ne trouve rien. Les incontournables, du paquet
`seclists` :

```sh
/usr/share/seclists/Discovery/Web-Content/common.txt                  # rapide, premier jet
/usr/share/seclists/Discovery/Web-Content/directory-list-2.3-medium.txt   # le classique
/usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt     # pour le mode dns
```

## Pièges

- **Lire les codes de statut, pas seulement les `200`.** Un `301` révèle un
  répertoire, un `403` prouve qu'un chemin **existe** mais est protégé (piste
  précieuse). Les masquer avec `-b`, c'est jeter l'information.
- **Les faux positifs des sites « attrape-tout ».** Une appli qui renvoie `200`
  sur *n'importe quelle* URL noie le résultat. Repérer la taille de réponse
  constante et la filtrer, ou tester une URL bidon d'abord pour voir le
  comportement.
- **Sans `-x`, on ne trouve que les répertoires.** Le fichier `backup.sql` ou
  `config.php` n'apparaît que si son extension est dans `-x`.
- **Trop de `-t` casse tout.** Au-delà de ce que le serveur encaisse, les
  réponses partent en *timeout* et des chemins réels passent pour absents.
  Baisser en cas d'erreurs.
- **`dir` ne suit pas les liens** : ce n'est pas un aspirateur de site, c'est du
  brute-force pur. Ce qui n'est pas dans la liste n'est pas trouvé — d'où
  l'importance de la wordlist.
- **Bruyant et journalisé**, comme tout brute-force. Labo ou périmètre autorisé
  uniquement.

## Voir aussi

- [Nikto : scanner de serveur web](nikto.md)
- [Hydra : brute-force d'authentification en ligne](hydra.md)
- [Méthodologie : de la reconnaissance au shell (web)](methodologie-pentest-web.md)
- [nmap : scan de ports et découverte réseau](../reseau/nmap.md)
- <https://github.com/OJ/gobuster>
