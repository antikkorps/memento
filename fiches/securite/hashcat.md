---
title: "hashcat : casser des hachages sur GPU"
tags: [securite, terminal]
created: 2026-09-07
updated: 2026-09-09
status: stable
---

## En bref

Le même métier que [John the Ripper](john-the-ripper.md) — retrouver le mot de
passe derrière une empreinte (*hash*) — mais sur **carte graphique**, donc bien
plus vite sur les gros volumes. Le déroulé : **trouver le mode `-m` du hash →
choisir un mode d'attaque `-a` → lancer → afficher avec `--show`.**

La grande différence avec john : hashcat ne devine pas le format, il faut lui
donner un **numéro de mode**. Pour identifier le hash d'abord, voir
[Outils crypto en ligne](outils-crypto.md).

## L'essentiel

```sh
hashcat -m 0 -a 0 hash.txt rockyou.txt    # MD5, attaque par dictionnaire
hashcat -m 0 -a 0 hash.txt rockyou.txt --show   # reafficher un mot de passe deja casse
hashcat -m 1000 -a 0 hash.txt rockyou.txt -r /usr/share/hashcat/rules/best64.rule   # NTLM + regles
```

Deux réglages obligatoires : **`-m`** (le type de hash) et **`-a`** (comment on
attaque). Le reste — fichier de hashs, dictionnaire — suit sur la ligne.

## `-m` : le mode de hash

Le numéro *est* l'algorithme. En trouver un : `hashcat --help | grep -i sha256`,
ou identifier le hash sur hashes.com qui affiche directement le mode hashcat.

| `-m` | Hash |
| --- | --- |
| `0` | MD5 |
| `100` | SHA-1 |
| `1400` | SHA-256 |
| `1700` | SHA-512 |
| `1000` | NTLM (Windows) |
| `1800` | sha512crypt, les `$6$` de `/etc/shadow` |
| `3200` | bcrypt, les `$2y$` / `$2b$` |
| `22000` | WPA/WPA2 (poignée de main Wi-Fi) |

```sh
hashcat -m 1400 --example-hashes    # montre a quoi ressemble un hash de ce mode
hashcat --identify hash.txt          # propose les modes possibles (versions recentes)
```

## `-a` : le mode d'attaque

| `-a` | Attaque | Ce qu'on fournit |
| --- | --- | --- |
| `0` | dictionnaire | un fichier de mots (rockyou) |
| `3` | masque (*mask*) / force brute | un motif de caractères |
| `6` | hybride dico + masque | mot + suffixe |
| `7` | hybride masque + dico | préfixe + mot |

Le dictionnaire (`-a 0`) est toujours le premier réflexe ; le masque (`-a 3`)
sert quand on connaît la **forme** du mot de passe.

## Les masques (`-a 3`)

Un masque décrit la forme, un symbole par position :

| Symbole | Jeu de caractères |
| --- | --- |
| `?l` | minuscules `a-z` |
| `?u` | majuscules `A-Z` |
| `?d` | chiffres `0-9` |
| `?s` | symboles `!@#$…` |
| `?a` | tout ce qui précède |

```sh
hashcat -m 0 -a 3 hash.txt '?d?d?d?d'          # exactement 4 chiffres : 0000 a 9999
hashcat -m 0 -a 3 hash.txt '?u?l?l?l?l?d?d'     # Majus + 4 minus + 2 chiffres
hashcat -m 0 -a 3 hash.txt -i --increment-min 4 --increment-max 8 '?a?a?a?a?a?a?a?a'   # 4 a 8 caracteres, tout
```

Chaque position multiplie l'espace : `?a` sur 8 positions est déjà colossal.
Plus le masque est précis, plus l'attaque est courte.

## Reprendre et suivre

```sh
hashcat -m 0 -a 0 hash.txt rockyou.txt --session=nuit   # nommer la session
hashcat --session=nuit --restore                         # la reprendre
hashcat -m 0 hash.txt --show                             # ce qui est deja casse (lit le potfile)
```

Pendant qu'il tourne : **`s`** affiche l'état (*status*), **`p`** met en pause,
**`q`** quitte proprement en sauvegardant.

## Pièges

- **Mauvais `-m` = aucun résultat, sans erreur.** hashcat essaie un algorithme
  qui n'est pas le bon et ne trouve rien. Identifier le hash d'abord
  ([Outils crypto en ligne](outils-crypto.md)), et vérifier avec
  `--example-hashes`.
- **Fichier `/etc/shadow` : garder le hash seul, ou `--username`.** Les lignes
  `user:$6$…` contiennent le nom devant : soit on l'ôte à la main, soit on passe
  `--username` pour que hashcat l'ignore.
- **Sur une VM sans GPU, hashcat rame — et refuse parfois de démarrer.** Il faut
  alors `--force` (il tourne sur le CPU, avec un avertissement). Dans ce cas
  [john](john-the-ripper.md) est souvent le meilleur choix : c'est son terrain.
- **Le potfile masque les tests.** Un hash déjà cassé est dans
  `~/.hashcat/hashcat.potfile` ; hashcat le saute et affiche « All hashes found
  in potfile ». Pour rejouer, vider le fichier ou `--potfile-disable`.
- **`-a 3` attend un masque, pas un dictionnaire.** Lui passer `rockyou.txt` en
  `-a 3` le lit comme un masque littéral et ne trouve rien. Dictionnaire = `-a
  0`, masque = `-a 3`.
- **WPA, c'est `-m 22000` désormais**, pas les anciens `2500` / `16800`. Les
  vieux tutoriels donnent des modes périmés.
- **Cadre légal**, comme pour john et [metasploit](metasploit.md) : on ne casse
  que des hashs qu'on est autorisé à casser (CTF, labo, engagement signé).

## Voir aussi

- [John the Ripper : casser des hachages hors ligne](john-the-ripper.md)
- [Outils crypto en ligne : identifier, décoder, casser](outils-crypto.md)
- [Chiffrement, hachage et signature](chiffrement.md)
- <https://hashcat.net/wiki/doku.php?id=hashcat>
- <https://hashcat.net/wiki/doku.php?id=example_hashes>
