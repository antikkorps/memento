---
title: Générer des secrets, clés et mots de passe
tags: [securite, procedure]
created: 2026-08-17
updated: 2026-08-17
status: stable
---

## En bref

Produire une valeur qu'on ne peut pas deviner, depuis le terminal, sans réfléchir
à chaque fois. Vaut pour une clé d'API, un secret de session, un mot de passe de
service — jamais pour un mot de passe que tu dois retenir.

## Commandes

```sh
openssl rand -hex 32       # 256 bits en 64 caractères hexadécimaux
openssl rand -base64 32    # 256 bits, plus compact, 44 caractères
uuidgen                    # UUID v4 : 122 bits, format imposé
head -c 32 /dev/urandom | base64   # sans openssl
```

## Laquelle choisir

**`openssl rand -hex`** par défaut. La sortie ne contient que `0-9a-f` : elle
traverse sans dommage un fichier `.env`, une URL, un YAML, une ligne de commande.
C'est le format qui ne te posera jamais de problème d'échappement.

**`openssl rand -base64`** quand la longueur gêne. Attention : la sortie contient
`+`, `/` et `=`, qui cassent certaines URL et certains parseurs de configuration.
À quoter systématiquement, ou à convertir :

```sh
openssl rand -base64 32 | tr '+/' '-_' | tr -d '='
```

**`uuidgen`** uniquement quand l'application **exige** le format UUID — c'est le
cas du `KEY` de Directus, par exemple. Il n'offre que 122 bits et sa forme est
reconnaissable, donc il ne remplace pas `openssl rand` pour un secret libre.

## Combien de bits

- **128 bits** (`-hex 16`) : plancher pour tout ce qui est éphémère.
- **256 bits** (`-hex 32`) : par défaut, pour tout ce qui vit longtemps — clé de
  signature, secret de session, jeton de service.

Au-delà, c'est du folklore : rien ne casse un secret de 256 bits par force brute.

## Détails

`/dev/urandom` est la bonne source sur tout Linux moderne, et `openssl rand` s'en
sert. Le vieux conseil « utiliser `/dev/random` pour les vrais secrets » est
périmé : `/dev/random` bloque sans rien apporter une fois le pool initialisé.

Ce qui n'est **jamais** une source valable : `$RANDOM` du shell, un horodatage,
un hash de quelque chose de connu, ou un mot de passe choisi de tête. Tous sont
prédictibles à des degrés divers.

## Pièges

- **Un secret généré ne se recopie pas d'un environnement à l'autre.** Un secret
  partagé entre dev et prod fait de la fuite du premier une compromission du
  second.
- Il finit dans l'historique du shell dès qu'il apparaît dans une commande.
  Écrire directement dans un fichier ignoré par git :

  ```sh
  printf 'SECRET=%s\n' "$(openssl rand -hex 32)" >> .env
  ```

- Ne pas confondre avec un mot de passe **humain**, celui que tu dois taper ou
  retenir : là, c'est un gestionnaire de mots de passe, pas `openssl`.
- Un secret compromis se **régénère**, il ne se répare pas. Et il reste dans
  l'historique git s'il y a été committé une fois, même supprimé depuis.

## Voir aussi

- [Docker : commandes courantes](../docker/commandes-courantes.md)
- [Generating random bytes with the OpenSSL CLI](https://www.jvt.me/posts/2020/06/27/generating-random-bytes-openssl-cli/)
  — pourquoi les méthodes approximatives ne valent rien
