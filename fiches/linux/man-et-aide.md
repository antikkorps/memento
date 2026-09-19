---
title: "Lire man et --help : trouver une option vite"
tags: [linux, terminal, procedure]
created: 2026-09-19
updated: 2026-09-19
status: stable
---

## En bref

Retrouver la syntaxe ou une option d'un outil en secondes, sans quitter le
terminal ni ouvrir un navigateur. Le réflexe qui fait gagner du temps :
**chercher dans la doc au lieu de la lire.** `--help` pour un rappel, `man` pour
le détail, `apropos` pour « quel outil pour… ».

## Les quatre réflexes

```sh
outil --help        # ou -h : rappel court, souvent suffisant
man outil           # le manuel complet
tldr outil          # exemples concrets, droit au but (si installe)
apropos mot         # "quel outil pour...": cherche dans TOUS les manuels
```

## Chercher DANS un man — le vrai gain de temps

`man` ouvre le pager `less`. On ne lit pas, on cherche :

```text
/motif      chercher vers le bas (ex: /--timeout ou /^\s*-o)
n  /  N     occurrence suivante / precedente
?motif      chercher vers le haut
g  /  G     debut / fin du manuel
q           quitter
```

Pour une option précise, `/--output` ou `/^\s*-o` tombe directement sur sa
description ; les options vivent dans les sections `OPTIONS` et `DESCRIPTION`.

## Trouver la bonne page, ou le bon outil

```sh
apropos http        # toutes les pages dont la description parle de http
man -k http         # identique (-k = apropos)
whatis nmap         # la description en une ligne
```

## Les sections du manuel — le piège classique

Un même nom peut exister dans **plusieurs sections** : `passwd` est une commande
(section 1) *et* un fichier (section 5).

| Section | Contenu |
| --- | --- |
| 1 | commandes utilisateur |
| 5 | formats de fichiers (`/etc/passwd`, `crontab`) |
| 8 | commandes d'administration (`systemd`, `iptables`) |

```sh
man passwd          # ouvre la section 1 par defaut
man 5 passwd        # le FICHIER /etc/passwd, pas la commande
man -f passwd       # = whatis : dans quelles sections 'passwd' existe
```

## `--help` vs `man` vs `tldr` : lequel, quand

- **`--help`** — je connais l'outil, je veux juste le nom exact d'un drapeau
  (*flag*). Le plus rapide.
- **`tldr`** — je veux un exemple qui marche, tout de suite. (Pas installé
  partout.)
- **`man`** — je cherche un comportement précis, une valeur par défaut, la
  sémantique exacte d'une option.

## Autres raccourcis utiles

```sh
type -a python              # quel binaire est appele (alias et fonctions inclus)
help cd                     # aide des BUILTINS du shell (cd, export... : pas de man a eux)
outil --help | grep -i time # filtrer une aide trop longue
```

## Pièges

- **`man` ouvre `less`, pas un éditeur.** On cherche avec `/`, on quitte avec
  `q`. Scroller à la main est la perte de temps numéro un.
- **Les builtins du shell (`cd`, `export`, `for`) n'ont pas de man à eux** :
  c'est `help cd`, ou `man bash` puis `/^\s*cd`.
- **Une même page existe en plusieurs sections.** `man crontab` donne la
  commande ; le *format du fichier* est `man 5 crontab`. Dans le doute,
  `man -f nom` liste les sections.
- **`--help` n'est pas universel** : certains outils veulent `-h`, d'autres
  `-?`, quelques vieux BSD rien du tout (→ `man`). En cas d'échec, essayer
  l'autre.
- **`apropos` répond « rien d'approprié » si la base n'est pas indexée** :
  `sudo mandb` une fois construit l'index.
- **`tldr` n'est pas garanti présent.** En examen chronométré, ne pas compter
  dessus : `--help` et `man` sont toujours là.

## Voir aussi

- [grep : chercher dans les fichiers](../shell/grep.md)
- [Méthodologie : de la reconnaissance au shell (web)](../securite/methodologie-pentest-web.md)
- [nmap : scan de ports et découverte réseau](../reseau/nmap.md)
- <https://man7.org/linux/man-pages/>
