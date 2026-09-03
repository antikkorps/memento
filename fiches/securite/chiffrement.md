---
title: "Chiffrement, hachage et signature"
tags: [securite, terminal]
created: 2026-09-03
updated: 2026-09-03
status: stable
---

## En bref

Trois opérations qu'on confond en permanence : **encoder** n'est pas
**chiffrer**, et **hacher** n'est pas **chiffrer** non plus. La distinction
tient en une colonne — est-ce réversible, et avec quoi ?

| | Réversible ? | Avec quoi | Pour quoi |
| --- | --- | --- | --- |
| Encodage (Base64, URL) | oui, par tout le monde | rien | transporter |
| Hachage (SHA-256) | **non** | — | vérifier, comparer |
| Chiffrement (AES, RSA) | oui, avec la clé | une clé | garder secret |
| Signature | vérifiable | clé privée / publique | prouver l'origine |

## Symétrique et asymétrique

**Symétrique** — une seule clé, qui chiffre et déchiffre. Rapide, adapté aux
gros volumes. Son problème est entier : comment transmettre la clé ?

- AES-256, ChaCha20. C'est ce qui chiffre un disque ou une archive.

**Asymétrique** — une paire : une clé **publique** qu'on diffuse, une clé
**privée** qu'on garde. Lent, réservé aux petites quantités.

- RSA, ECDSA, Ed25519.
- **Chiffrer** avec la clé *publique* du destinataire → lui seul peut lire.
- **Signer** avec sa clé *privée* → tout le monde peut vérifier que c'est bien
  de soi.

C'est le sens qui compte, et il s'inverse selon l'objectif : confidentialité
avec la publique, authenticité avec la privée.

**En pratique on combine les deux.** TLS utilise l'asymétrique le temps de se
mettre d'accord sur une clé symétrique, puis passe en symétrique pour tout
l'échange — voir [HTTPS et TLS](../reseau/https.md). Même principe pour SSH et
GPG.

## Hachage

Une empreinte de taille fixe, à sens unique, où un bit changé bouleverse tout
le résultat (effet d'avalanche).

```sh
sha256sum fichier.iso                # verifier une empreinte
openssl dgst -sha256 fichier.iso
echo -n 'texte' | sha256sum
```

| Algorithme | État |
| --- | --- |
| MD5, SHA-1 | **cassés** — collisions réalisables, plus aucun usage de sécurité |
| SHA-256, SHA-512 | bons pour l'intégrité |
| bcrypt, scrypt, **Argon2** | pour les **mots de passe**, et eux seuls |

## Les mots de passe, cas à part

On ne hache **pas** un mot de passe avec SHA-256 : il est trop rapide, une carte
graphique en teste des milliards par seconde. Il faut un algorithme
**délibérément lent** et paramétrable : bcrypt, scrypt, Argon2id.

- Le **sel** (*salt*) est une valeur aléatoire, **unique par utilisateur**,
  stockée en clair à côté de l'empreinte. Il n'est pas secret : son rôle est
  d'empêcher les tables précalculées (*rainbow tables*) et de rendre deux mots
  de passe identiques indiscernables.
- Le **poivre** (*pepper*) est un secret global, stocké ailleurs que la base.

## HMAC et signature

- **HMAC** = hachage + clé partagée. Prouve que le message n'a pas bougé **et**
  qu'il vient de quelqu'un qui connaît la clé. C'est ce que signent les webhooks.
- **Signature** = empreinte du message chiffrée avec la clé privée. Même
  garantie, sans clé partagée — et non répudiable.

```sh
ssh-keygen -t ed25519 -C 'franck@machine'    # generer une paire
gpg --detach-sign --armor fichier            # signer
gpg --verify fichier.asc fichier             # verifier
age -p fichier > fichier.age                 # chiffrer simplement, avec un mot de passe
openssl rand -base64 32                      # une cle aleatoire
```

## Pièges

- **Base64 n'est pas du chiffrement.** C'est un encodage réversible par
  n'importe qui, sans clé. Un secret « encodé en base64 » dans un fichier de
  configuration est un secret en clair — c'est la confusion la plus répandue,
  et elle tombe en examen.
- **Ne jamais hacher un mot de passe avec SHA-256 seul.** La vitesse, qualité
  pour l'intégrité, est un défaut mortel ici.
- **Le sel n'est pas un secret**, et il doit être **unique par utilisateur**. Un
  sel global n'apporte presque rien.
- **Chiffrer n'authentifie pas.** AES en mode CBC sans contrôle d'intégrité est
  modifiable par un attaquant qui ne peut pourtant pas le lire. Utiliser un mode
  authentifié (*AEAD*) : AES-GCM, ChaCha20-Poly1305.
- **MD5 reste acceptable pour un checksum non adversarial** (vérifier qu'un
  téléchargement n'est pas tronqué) et inacceptable partout ailleurs. Distinguer
  les deux usages évite un faux débat.
- **Ne jamais écrire son propre algorithme**, ni son propre protocole. La règle
  n'est pas de la modestie : les failles sont dans les détails d'implémentation,
  pas dans les mathématiques.
- **Le chiffrement au repos ne protège pas d'une application compromise** : si
  le service peut lire la base, un attaquant qui contrôle le service aussi. Ça
  protège du vol du disque, pas de l'intrusion.
- Une clé privée protégée par phrase de passe reste une clé privée : la phrase
  ralentit un voleur, elle ne l'arrête pas indéfiniment.

## Voir aussi

- [HTTPS et TLS : ce qui se passe avant la page](../reseau/https.md)
- [Générer des secrets, clés et mots de passe](generer-des-secrets.md)
- [Lexique de l'évaluation de sécurité](lexique.md)
- [Maliciels, attaques et vocabulaire des menaces](menaces.md)
