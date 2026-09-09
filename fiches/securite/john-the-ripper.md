---
title: "John the Ripper : casser des hachages hors ligne"
tags: [securite, terminal]
created: 2026-09-07
updated: 2026-09-07
status: stable
---

## En bref

On a récupéré une empreinte (*hash*) et on veut retrouver le mot de passe qui la
produit. John essaie des candidats, les hache avec le bon algorithme, et compare.
Le déroulé qui ne rate jamais : **identifier le format → préparer le fichier →
lancer une attaque par dictionnaire → afficher le résultat.**

Voir [Outils crypto en ligne](outils-crypto.md) pour identifier un hash, et
[Chiffrement, hachage et signature](chiffrement.md) pour comprendre *pourquoi*
un mot de passe se hache avec bcrypt et pas SHA-256.

## L'essentiel

```sh
john --wordlist=/usr/share/wordlists/rockyou.txt hash.txt   # attaque par dictionnaire
john --show hash.txt                                         # reafficher un mot de passe deja casse
john hash.txt                                                # mode par defaut : dico puis force brute
```

Le premier réflexe est toujours **rockyou.txt** : sous Kali il est dans
`/usr/share/wordlists/`, parfois compressé (`gunzip rockyou.txt.gz` une fois).

## Préparer le fichier : la famille `*2john`

John ne casse pas un fichier protégé directement — on en **extrait d'abord le
hash** avec l'outil `<truc>2john`, puis on donne ce hash à john.

```sh
unshadow /etc/passwd /etc/shadow > hash.txt   # fusionne passwd + shadow (comptes Linux)
ssh2john id_rsa > hash.txt                     # cle privee SSH protegee par phrase
zip2john secret.zip > hash.txt                 # archive ZIP chiffree
rar2john secret.rar > hash.txt
office2john document.docx > hash.txt           # fichiers Office
```

Sur certaines installations c'est `ssh2john.py`, `zip2john.py`, etc. — les
scripts sont dans `/usr/share/john/` ou `locate 2john`.

## Choisir le bon format

John devine le format, se trompe parfois, et refuse d'avancer sur un hash
ambigu. On force alors avec `--format` :

```sh
john --list=formats | tr ',' '\n' | grep -i sha   # chercher un format supporte
john --format=raw-md5 hash.txt                     # md5 nu
john --format=sha512crypt hash.txt                 # $6$ des /etc/shadow modernes
john --format=NT hash.txt                          # hash Windows (extrait de la SAM)
```

Repères pour reconnaître un `/etc/shadow` : le préfixe donne l'algorithme.

| Préfixe | Algorithme | `--format` |
| --- | --- | --- |
| `$1$` | MD5 | `md5crypt` |
| `$5$` | SHA-256 | `sha256crypt` |
| `$6$` | SHA-512 | `sha512crypt` |
| `$2b$` / `$2y$` | bcrypt | `bcrypt` |
| `$y$` | yescrypt | `crypt` |

## Les trois modes d'attaque

| Mode | Ce qu'il fait | Quand |
| --- | --- | --- |
| **dictionnaire** (`--wordlist`) | teste une liste de mots | toujours en premier |
| **règles** (`--rules`) | dérive chaque mot (`admin` → `Admin1!`) | après un dico qui échoue |
| **incrémental** (`--incremental`) | force brute, toutes les combinaisons | dernier recours, très lent |

```sh
john --wordlist=rockyou.txt --rules hash.txt   # dico + mutations (majuscule, chiffres, l33t)
john --wordlist=rockyou.txt --rules=Jumbo hash.txt   # jeu de regles plus agressif
john --incremental hash.txt                    # force brute pure, a lancer et laisser tourner
```

## Reprendre une session

Une attaque longue s'interrompt (Ctrl-C) et se reprend sans tout recommencer :
John enregistre son état en continu.

```sh
john --session=nuit --wordlist=rockyou.txt --rules hash.txt   # nommer la session
john --restore=nuit                                            # la reprendre apres coup
```

Pendant qu'il tourne, **une touche** affiche l'avancement (`Space` sur les
versions récentes, n'importe quelle touche sinon).

## Pièges

- **`john --show` puis « No password hashes left to crack ».** Le mot de passe
  est déjà cassé : il est stocké dans `~/.john/john.pot`. `--show` le relit de
  là. Pour tout rejouer à zéro, vider ce fichier (`> ~/.john/john.pot`).
- **rockyou.txt encore compressé.** `gunzip` une fois, sinon john lit du binaire
  gzip comme des mots de passe et ne trouve rien.
- **Mauvais format deviné.** Si john « casse » instantanément des dizaines de
  hashs différents ou n'avance pas du tout, forcer `--format=` : le
  chiffre-clé est le préfixe (`$6$`, `$2y$`…).
- **Ne pas confondre john et [hashcat](hashcat.md).** John est **CPU** et
  polyvalent (il gère les `*2john`) ; hashcat est **GPU** et bien plus rapide sur
  les gros volumes. Sur une VM THM sans carte graphique, john est souvent le bon
  choix.
- **`unshadow` prend passwd ET shadow**, dans cet ordre. Le seul `shadow` ne
  suffit pas : le nom d'utilisateur vient de `passwd`.
- **Un hash salé ne se cherche pas dans une table en ligne.** CrackStation et
  hashes.com ne trouvent que les hashs **non salés** déjà connus ; un `$6$…`
  salé se casse forcément avec john ou hashcat. Voir
  [Outils crypto en ligne](outils-crypto.md).
- **Ne jamais lancer john sur un système qui n'est pas à toi** sans autorisation
  écrite. Casser des mots de passe est une activité de test d'intrusion, pas un
  jeu — le cadre légal est le même que pour [nmap](../reseau/nmap.md).

## Voir aussi

- [hashcat : casser des hachages sur GPU](hashcat.md)
- [Outils crypto en ligne : identifier, décoder, casser](outils-crypto.md)
- [Chiffrement, hachage et signature](chiffrement.md)
- [Cryptographie : les algorithmes et leurs calculs](cryptographie-calculs.md)
- [Metasploit : le framework d'exploitation](metasploit.md)
- <https://www.openwall.com/john/doc/>
