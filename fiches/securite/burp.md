---
title: "Burp Suite : intercepter et manipuler le trafic web"
tags: [securite, web]
created: 2026-09-14
updated: 2026-09-14
status: brouillon
---

## En bref

Un proxy qui s'intercale entre le navigateur et le serveur : on **voit, arrête
et modifie** chaque requête HTTP avant qu'elle parte. L'outil central du test
web **manuel** — là où [gobuster](gobuster.md) découvre des chemins et sqlmap
automatise, Burp sert à comprendre puis bricoler une requête à la main.

## Mise en place (l'étape qu'on rate)

- Le proxy écoute sur `127.0.0.1:8080` par défaut.
- Pointer le navigateur vers ce proxy (extension FoxyProxy), ou utiliser le
  **navigateur intégré** de Burp (Proxy → Open Browser), qui est déjà configuré.
- **Pour le HTTPS : installer le certificat CA de Burp.** Proxy actif, aller sur
  `http://burp`, télécharger le certificat, l'importer dans le navigateur. Sans
  ça, chaque site en HTTPS lève une erreur TLS et rien ne passe.

## Les onglets qui comptent

| Onglet | À quoi il sert |
| --- | --- |
| **Proxy** | intercepter le trafic (Intercept on/off) ; **HTTP history** garde tout ce qui est passé |
| **Repeater** | rejouer et modifier une requête à la main, en boucle — l'onglet le plus utilisé |
| **Intruder** | automatiser des variations (fuzzing, bruteforce) — **bridé** en version Community |
| **Decoder** | encoder / décoder URL, Base64, hex |
| **Comparer** | diff entre deux réponses |

## Le flux type

1. **Intercept off**, naviguer normalement sur la cible.
2. Dans **HTTP history**, repérer la requête intéressante (login, panier, API).
3. Clic droit → **Send to Repeater** (`Ctrl+R`).
4. Dans **Repeater**, modifier un paramètre, **Send**, lire la réponse.
5. Itérer : c'est là qu'on teste une IDOR, un paramètre caché, une injection.

## Pièges

- **Intercept resté « on » fige toute la navigation** : chaque requête attend une
  action. Le laisser **off**, consulter HTTP history, envoyer au Repeater à la
  demande. C'est la confusion numéro un du débutant.
- **HTTPS sans le certificat CA = rien ne passe.** L'étape ratée la plus
  fréquente ; ce n'est pas Burp qui est cassé.
- **Intruder est throttlé en Community** (attente forcée entre essais) : pour du
  vrai bruteforce, [hydra](hydra.md) ou ffuf sont plus adaptés.
- **Définir le Scope** (Target → Scope) pour ne pas noyer l'historique sous le
  trafic parasite (télémétrie, CDN) du navigateur.
- **Cadre légal.** Uniquement sur une cible autorisée.

## Voir aussi

- [Quel outil pour quel objectif](quel-outil.md)
- [Les attaques web courantes](attaques-web.md)
- [gobuster : découverte de contenu web](gobuster.md)
- [Codes de réponse HTTP](../reseau/codes-http.md)
