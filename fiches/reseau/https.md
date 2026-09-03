---
title: "HTTPS et TLS : ce qui se passe avant la page"
tags: [reseau, securite, web]
created: 2026-09-03
updated: 2026-09-03
status: stable
---

## En bref

HTTPS, c'est HTTP transporté dans TLS. TLS apporte trois choses et **trois
seulement** : le chiffrement, l'intégrité, et l'authentification **du serveur**.
Pas l'honnêteté du site — c'est la nuance qui tombe en examen.

## Ce que TLS garantit, et ce qu'il ne garantit pas

| Garanti | Pas garanti |
| --- | --- |
| Personne ne lit l'échange (confidentialité) | Que le site soit honnête |
| Personne ne le modifie (intégrité) | Que le serveur soit bien administré |
| Le serveur est bien celui du nom demandé | L'identité de l'entreprise derrière |

Un site d'hameçonnage obtient un certificat Let's Encrypt gratuit en dix
minutes. **Le cadenas dit « chiffré », jamais « fiable ».**

## La poignée de main, en bref

```
client                                    serveur
  |--- ClientHello (versions, chiffrements, SNI) --->|
  |<-- ServerHello + certificat ---------------------|
  |    verification : nom, dates, chaine de confiance
  |--- echange de cles ----------------------------->|
  |<== canal chiffre, puis requete HTTP ============>|
```

En TLS 1.3, tout ça tient en un aller-retour au lieu de deux — c'est la
principale raison de sa vitesse.

La **chaîne de confiance** : le certificat du serveur est signé par une
autorité intermédiaire, elle-même signée par une racine que le système
d'exploitation et le navigateur connaissent d'avance. Un maillon manquant casse
la vérification.

## Les commandes

```sh
curl -vI https://exemple.tld                 en-tetes + details TLS
curl -w '%{http_code} %{ssl_verify_result}\n' -o /dev/null -s https://exemple.tld

openssl s_client -connect exemple.tld:443 -servername exemple.tld </dev/null
openssl s_client -connect exemple.tld:443 -servername exemple.tld </dev/null 2>/dev/null \
  | openssl x509 -noout -subject -issuer -dates

openssl x509 -in cert.pem -noout -text        lire un certificat local
openssl s_client -connect exemple.tld:443 -showcerts   toute la chaine
```

`-servername` n'est pas optionnel : sans lui, `openssl` n'envoie pas le SNI et
un serveur mutualisé renvoie le certificat d'un autre site.

## Lire un certificat

| Champ | Ce qu'on regarde |
| --- | --- |
| `Subject` / CN | le nom principal — **plus utilisé seul aujourd'hui** |
| `Subject Alternative Name` | la vraie liste des noms couverts |
| `Issuer` | qui l'a signé |
| `Not Before` / `Not After` | validité — la cause n° 1 des pannes |
| Algorithme | RSA 2048+ ou ECDSA ; SHA-1 est mort |

## Pièges

- **Le cadenas ne dit rien de la confiance.** C'est le contresens le plus
  répandu, et la question piège classique : HTTPS authentifie le **nom de
  domaine**, pas l'intention de celui qui le possède.
- **La chaîne incomplète, panne n° 1 du monde réel.** Le serveur oublie
  d'envoyer le certificat intermédiaire : ça marche dans le navigateur (qui l'a
  en cache d'une visite précédente) et ça casse dans `curl`, dans Java, dans un
  script CI. Tester avec `openssl s_client -showcerts` sur une machine neuve,
  jamais dans son propre navigateur.
- **Un certificat expiré ne prévient pas.** Il fonctionne parfaitement jusqu'à
  la seconde près, puis tout tombe d'un coup. Surveiller `Not After`, ou
  automatiser le renouvellement.
- **Erreur de nom** : le certificat couvre `exemple.tld` mais pas
  `www.exemple.tld`. C'est le SAN qui compte, plus le CN — un certificat sans
  SAN est rejeté par les navigateurs modernes.
- **`curl -k` désactive toute vérification.** Pratique en test, catastrophique
  ailleurs : la connexion reste chiffrée mais n'importe qui peut se faire passer
  pour le serveur. Un `-k` dans un script de production est une vulnérabilité,
  pas un contournement.
- **Auto-signé ≠ non chiffré.** Le chiffrement est identique ; ce qui manque,
  c'est l'authentification. Acceptable en interne avec sa propre autorité,
  jamais en public.
- **Le SNI circule en clair** : un observateur du réseau voit *quel* site vous
  visitez, même en HTTPS, tant qu'ECH n'est pas déployé. Le contenu est
  protégé, pas la destination.
- **Une horloge décalée casse TLS.** Sur une machine dont la date est fausse,
  tous les certificats semblent expirés ou pas encore valides — vérifier `date`
  avant de chercher plus loin.
- TLS 1.0 et 1.1 sont dépréciés, SSL v2/v3 sont morts. « SSL » reste le mot
  courant, mais ce qu'on utilise s'appelle TLS depuis 1999.
- HTTP en clair sur le port 80 reste souvent ouvert pour rediriger vers 443 :
  c'est HSTS qui empêche le premier aller-retour non chiffré.

## Voir aussi

- [Le modèle OSI en 7 couches](modele-osi.md)
- [TCP et UDP : quand et pourquoi](tcp-udp.md)
- [Lexique de l'évaluation de sécurité](../securite/lexique.md)
- [Générer des secrets, clés et mots de passe](../securite/generer-des-secrets.md)
