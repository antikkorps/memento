---
title: "Outils crypto en ligne : identifier, décoder, casser"
tags: [securite, ressource]
created: 2026-09-07
updated: 2026-09-09
status: stable
---

## En bref

On tombe sur une chaîne bizarre — un hash, un texte encodé, un chiffrement
classique — et il faut savoir **quel outil ouvrir** au lieu de tâtonner. Le
réflexe en quatre temps : **identifier ce que c'est → décoder si c'est juste un
encodage → chercher si le hash est connu → casser sinon.**

C'est le pendant « outils » de [Cryptographie : les algorithmes et leurs
calculs](cryptographie-calculs.md), qui explique *comment ça compte*, et de
[John the Ripper](john-the-ripper.md), qui casse **hors ligne** ce que ces sites
ne trouvent pas.

## 1. Identifier

| Outil | Où | Ce qu'il fait |
| --- | --- | --- |
| **hashes.com** (Identify) | en ligne | colle le hash, il propose l'algorithme probable |
| **CyberChef → Magic** | en ligne / local | détecte encodage *et* chiffrement, en cascade |
| `hashid` / `hash-identifier` | hors ligne (CLI) | même chose sans réseau, sur la VM |

```sh
hashid '5f4dcc3b5aa765d61d8327deb882cf99'   # -> propose MD5, NTLM, etc.
echo -n '5f4dcc...' | hash-identifier         # menu interactif, meme idee
```

Reconnaître à l'œil, avant même l'outil — la **longueur** trahit l'algorithme :

| Longueur (hex) | Algorithme probable |
| --- | --- |
| 32 | MD5 ou NTLM |
| 40 | SHA-1 |
| 64 | SHA-256 |
| 128 | SHA-512 |
| commence par `$2y$` / `$2b$` | bcrypt (salé, incassable en ligne) |
| commence par `$6$` | SHA-512 crypt d'un `/etc/shadow` (salé) |

## 2. Décoder (ce n'est peut-être pas du chiffrement)

Avant de crier au hash, vérifier que ce n'est pas un simple **encodage**
réversible sans clé — Base64, hex, URL, ROT13.

| Outil | Bon pour |
| --- | --- |
| **CyberChef** | tout enchaîner : `From Base64` → `From Hex` → `Magic`, glisser-déposer |
| **cryptii.com** | interface visuelle claire pour un seul passage (Base64, César, Morse…) |
| **dcode.fr** | les chiffrements **classiques** : César, Vigenère, substitution, avec cassage auto |

```sh
echo 'c2VjcmV0' | base64 -d                    # From Base64, en local
echo -n 'secret' | xxd -p                       # To Hex
python3 -c 'print("Uryyb".encode().decode())'   # rot13 : voir la fiche crypto-calculs
```

**dcode.fr** est le pont direct avec la fiche crypto : il casse un César ou un
Vigenère par analyse de fréquences que tu ferais à la main.

## 3. Chercher un hash déjà connu

Pour un hash **non salé** (MD5, SHA-1, NTLM), inutile de le casser : quelqu'un
l'a peut-être déjà fait. Ces sites cherchent dans d'immenses tables
précalculées (*rainbow tables*).

| Outil | Note |
| --- | --- |
| **CrackStation** | le plus rapide sur MD5/SHA-1/NTLM non salés ; muet sur le reste |
| **hashes.com** (Decrypt) | lookup + service payant ; garde un historique |

Si le site répond « not found » ou que le hash est **salé**, on passe au
cassage hors ligne — c'est le boulot de [john](john-the-ripper.md) ou
[hashcat](hashcat.md).

## 4. Cas particuliers utiles en THM

- **factordb.com** — factorise un `n` de RSA à petits nombres en `p × q`. Le
  pont direct avec la section RSA de
  [cryptographie-calculs](cryptographie-calculs.md) : une fois `p` et `q`
  connus, la clé privée se recalcule.
- **CyberChef en local** — le télécharger (une seule page HTML) et l'ouvrir hors
  ligne : aucune donnée ne quitte la machine, et il marche sur une VM isolée.

## Pièges

- **Ne jamais coller un vrai secret sur un site tiers.** CrackStation, hashes.com
  et cryptii envoient la chaîne sur **leur** serveur : elle peut y être
  journalisée ou indexée. Pour un hash issu d'un système réel, c'est john/hashcat
  **en local**, jamais un site. La règle ne vaut que pour les CTF et labos.
- **Base64 n'est pas du chiffrement.** C'est un encodage réversible sans clé —
  la confusion la plus fréquente. Un « secret en base64 » est un secret en clair.
- **Un hash salé ne se cherche pas dans une table.** `$2y$…` (bcrypt), `$6$…`
  (SHA-512 crypt) portent un sel unique : aucune table précalculée ne les
  contient, seul un cassage par dictionnaire fonctionne.
- **La longueur oriente mais ne prouve pas.** MD5 et NTLM font tous deux 32
  caractères hex : hashes.com / hashid tranchent, le contexte (Windows ?) aussi.
- **CyberChef « Magic » propose, il ne certifie pas.** Il donne des pistes
  classées par vraisemblance ; à toi de reconnaître le résultat lisible.

## Voir aussi

- [Cryptographie : les algorithmes et leurs calculs](cryptographie-calculs.md)
- [Chiffrement, hachage et signature](chiffrement.md)
- [John the Ripper : casser des hachages hors ligne](john-the-ripper.md)
- [hashcat : casser des hachages sur GPU](hashcat.md)
- <https://gchq.github.io/CyberChef/>
- <https://crackstation.net/>
- <https://hashes.com/en/tools/hash_identifier>
- <https://www.dcode.fr/>
- <http://factordb.com/>
