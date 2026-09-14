---
title: "hydra : bruteforce d'authentification en ligne"
tags: [securite, reseau, terminal]
created: 2026-09-14
updated: 2026-09-14
status: brouillon
---

## En bref

Deviner un couple identifiant / mot de passe en interrogeant **le service réel**
(SSH, FTP, RDP, formulaire web…). C'est l'attaque **en ligne** (*online*), par
opposition au cassage **hors ligne** d'un hash déjà récupéré
([hashcat](hashcat.md) / [john](john-the-ripper.md)). Le réflexe qui tranche :
ai-je un **service qui écoute** (→ hydra) ou un **hash en main** (→ hashcat) ?

En ligne = lent, bruyant, ça verrouille les comptes. Donc **liste courte et
ciblée**, jamais rockyou entier.

## L'essentiel

```sh
hydra -l root -P rockyou.txt ssh://10.10.10.5     # un login connu, une liste de mots de passe
hydra -L users.txt -P pass.txt ftp://10.10.10.5   # listes des deux cotes
hydra -l admin -P rockyou.txt -f -V ssh://10.10.10.5   # -f : stop au premier trouve, -V : montre chaque essai
```

Deux moitiés : **quoi essayer** (`-l`/`-L` pour le login, `-p`/`-P` pour le mot
de passe) et **contre quoi** (le service, en préfixe `ssh://` ou en dernier mot).

## Login et mot de passe

| Option | Sens |
| --- | --- |
| `-l nom` | un seul login |
| `-L fichier` | liste de logins |
| `-p motdepasse` | un seul mot de passe |
| `-P fichier` | liste de mots de passe (dictionnaire) |
| `-e nsr` | essais en plus : `n` = vide, `s` = login comme mot de passe, `r` = login inversé |
| `-C fichier` | couples `login:motdepasse` déjà formés (un par ligne) |

Minuscule = une valeur, MAJUSCULE = un fichier. C'est la seule chose à retenir.

## Services

| Service | Écriture |
| --- | --- |
| SSH | `ssh://10.10.10.5` |
| FTP | `ftp://10.10.10.5` |
| RDP | `rdp://10.10.10.5` |
| SMB | `smb://10.10.10.5` |
| Formulaire web | `http-post-form` (voir plus bas) |

```sh
hydra -L users.txt -P rockyou.txt -s 2222 ssh://10.10.10.5   # -s : port non standard
```

## Formulaire web : le cas qui pique

`http-post-form` prend **trois champs séparés par `:`** —
`chemin:corps-du-POST:condition`.

```sh
hydra -l admin -P rockyou.txt 10.10.10.5 http-post-form "/login:user=^USER^&pass=^PASS^:F=incorrect"
```

- `^USER^` et `^PASS^` (en **majuscules**) sont remplacés par les valeurs testées.
- `F=texte` : hydra considère l'essai raté si la réponse contient `texte`.
  `S=texte` fait l'inverse (succès si présent) — utile quand l'échec n'a pas de
  message stable.

La chaîne d'échec se lit dans la **vraie réponse** à un mauvais mot de passe
(« Invalid credentials », « incorrect »…). C'est ce qu'on se rate le plus.

## Débit et verbosité

| Option | Effet |
| --- | --- |
| `-t n` | tâches en parallèle (défaut 16 ; baisser si le service rame) |
| `-f` | s'arrêter au premier couple trouvé |
| `-V` / `-vV` | afficher chaque essai / très verbeux |
| `-s port` | port non standard |

## Pièges

- **En ligne = verrouillage.** rockyou entier sur un vrai service verrouille les
  comptes et prend des heures. Liste courte, ciblée sur le contexte.
- **hydra devine, il ne casse pas.** Face à un **hash**, il n'y a rien à
  interroger : c'est [hashcat](hashcat.md) / [john](john-the-ripper.md).
- **`http-post-form` : la condition `F=`/`S=` est l'erreur la plus fréquente.**
  Prendre le texte d'échec exact depuis la réponse réelle, pas au jugé.
- **`^USER^` / `^PASS^` en majuscules**, sinon rien n'est substitué et hydra teste
  la chaîne littérale.
- **Port non standard → `-s`**, sinon hydra tape le port par défaut et échoue en
  silence.
- **Cadre légal.** Uniquement sur une cible autorisée (labo, THM, engagement).

## Voir aussi

- [Quel outil pour quel objectif](quel-outil.md)
- [hashcat : casser des hachages sur GPU](hashcat.md)
- [John the Ripper : casser des hachages hors ligne](john-the-ripper.md)
- [nmap : scan de ports et découverte réseau](../reseau/nmap.md)
- [SSH : clés, tunnels et config](../reseau/ssh.md)
