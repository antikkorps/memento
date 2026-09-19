---
title: "Burp Suite Community : le proxy d'interception web"
tags: [securite, web]
created: 2026-09-14
updated: 2026-09-19
status: stable
---

## En bref

Le couteau suisse du test d'application web : un proxy qui s'intercale entre le
navigateur et le serveur pour **voir, modifier et rejouer** chaque requête
HTTP(S). L'édition **Community** est gratuite et largement suffisante pour
apprendre ; ses limites sont volontaires (pas de scanner automatique, Intruder
bridé), pas des bugs.

## Mettre en place le proxy

Burp écoute par défaut sur `127.0.0.1:8080`. Deux façons d'y envoyer le trafic :

- **le navigateur intégré** (onglet *Proxy → Intercept → Open Browser*) : rien à
  configurer, le certificat est déjà accepté — le plus simple pour démarrer ;
- **son propre navigateur** : le faire pointer vers le proxy `127.0.0.1:8080`
  (extension FoxyProxy), puis **installer l'autorité de certification de Burp**,
  sinon tout le HTTPS casse.

```text
http://burp        # dans le navigateur proxifie : telecharger le certificat CA
                   # puis l'importer dans les autorites de confiance du navigateur
```

## Les outils, onglet par onglet

| Onglet | À quoi il sert |
| --- | --- |
| **Proxy** | intercepter la requête en vol (*Intercept*) ; **HTTP history** garde tout ce qui est passé |
| **Repeater** | rejouer **une** requête à la main, la modifier, observer la réponse — l'outil qu'on utilise le plus |
| **Intruder** | automatiser des variantes (fuzzing, brute-force) — **bridé** en Community |
| **Target** | l'arborescence du site (*site map*) et la définition du **scope** |
| **Decoder** | encoder/décoder (URL, Base64, HTML…) |
| **Comparer** | diff entre deux réponses |
| **Sequencer** | mesurer l'aléa de jetons de session |

Le flux de base : dans **HTTP history**, clic droit sur une requête → **Send to
Repeater** (`Ctrl+R`) → passer sur l'onglet Repeater → bricoler un paramètre →
**Send** → lire la réponse. On boucle sans jamais retoucher au navigateur ; c'est
là qu'on teste une IDOR, un paramètre caché, une injection.

## Community vs Pro vs Enterprise

Ce que les éditions payantes ajoutent — et donc ce qu'il faut faire **à la main**
en Community :

| | Community | Pro | Enterprise |
| --- | --- | --- | --- |
| Proxy / Repeater / Decoder | ✅ | ✅ | — |
| **Intruder** | bridé (temporisé) | plein débit | — |
| **Scanner de vulnérabilités** auto | ❌ | ✅ actif + passif | ✅ à l'échelle |
| Intégration CI/CD, scan continu | ❌ | ❌ | ✅ |
| **Burp Collaborator** (OOB, SSRF/XXE aveugles) | limité | ✅ | ✅ |
| Extensions **BApp** nécessitant l'API Pro | ❌ | ✅ | ✅ |
| **Sauvegarde du projet** sur disque | ❌ (en mémoire) | ✅ | ✅ |

En clair : sans le scanner, on **cherche les failles à la main** au Repeater ;
sans Intruder rapide, on temporise ou on sort un outil dédié (ffuf, `hydra`) ;
et on **ne quitte pas Burp sans avoir exporté** ce qu'on veut garder, la session
Community ne se sauvegarde pas.

## S'intégrer à la chaîne

Burp est le pivot manuel autour des outils automatiques :

```text
Send to Repeater      bricoler une requete a la main
clic droit -> Copy to file   exporter une requete pour  sqlmap -r requete.txt
Proxy 127.0.0.1:8080  passer  nikto -useproxy  ou un navigateur a travers Burp
```

Repérer un formulaire de connexion dans HTTP history donne aussi les noms exacts
des champs pour monter la commande [Hydra](hydra.md) `http-post-form`.

## Pièges

- **Intercept resté sur ON = navigateur figé.** Chaque requête attend une action
  dans Burp. Le blocage le plus fréquent des débutants : repasser *Intercept*
  sur **Off**, l'historique continue de tout capturer.
- **Certificat CA non installé = HTTPS cassé** dans le navigateur proxifié. Passer
  par le navigateur intégré, ou importer le certificat depuis `http://burp`.
- **Intruder est volontairement lent en Community.** Ce n'est pas une panne : une
  temporisation est imposée. Pour du brute-force sérieux, `hydra` ou `ffuf`.
- **Sans *scope* défini, Burp capture tout le web** que le navigateur touche
  (télémétrie, CDN, mises à jour). Définir le domaine cible dans *Target → Scope*
  et filtrer l'historique dessus.
- **Rien n'est sauvegardé.** La Community n'écrit pas de fichier projet : à la
  fermeture, l'historique disparaît. Exporter les requêtes utiles au fil de l'eau.
- **Cadre légal.** Intercepter et rejouer des requêtes est une attaque active :
  labo, THM/HTB ou périmètre autorisé uniquement.

## Voir aussi

- [Quel outil pour quel objectif](quel-outil.md)
- [Méthodologie : de la reconnaissance au shell (web)](methodologie-pentest-web.md)
- [sqlmap : automatiser l'injection SQL](sqlmap.md)
- [Nikto : scanner de serveur web](nikto.md)
- [Hydra : brute-force d'authentification en ligne](hydra.md)
- [Les attaques web courantes](attaques-web.md)
- [Codes de réponse HTTP](../reseau/codes-http.md)
- <https://portswigger.net/burp/documentation/desktop>
