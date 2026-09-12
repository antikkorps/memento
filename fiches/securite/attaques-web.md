---
title: "Les attaques web courantes"
tags: [securite, web]
created: 2026-09-03
updated: 2026-09-03
status: stable
---

## En bref

Les familles qu'on retrouve dans tous les référentiels (OWASP en tête). Elles se
ramènent à deux causes : **des données d'utilisateur traitées comme du code**,
ou **un contrôle d'accès absent**.

## Injection SQL

L'entrée de l'utilisateur est concaténée dans une requête et devient de la
syntaxe SQL.

```php
// vulnerable
$q = "SELECT * FROM users WHERE nom = '" . $_GET['nom'] . "'";
// avec  nom = ' OR '1'='1   la condition est toujours vraie

// correct : requete preparee, la valeur ne peut plus devenir du code
$stmt = $pdo->prepare('SELECT * FROM users WHERE nom = ?');
$stmt->execute([$_GET['nom']]);
```

**La parade est la requête préparée**, pas l'échappement manuel. Variantes :
aveugle (*blind*), temporelle, `UNION`, seconde main.

## XSS — script injecté dans la page

Du HTML ou du JavaScript fourni par l'utilisateur est réaffiché sans échappement
et s'exécute dans le navigateur d'un autre.

| Type | Où vit la charge |
| --- | --- |
| **stocké** | en base, servi à tous les visiteurs — le plus grave |
| **réfléchi** | dans l'URL, il faut faire cliquer la victime |
| **DOM** | jamais côté serveur, tout se joue en JavaScript |

Parades : échapper **à la sortie**, selon le contexte (HTML, attribut, JS, URL) ;
`Content-Security-Policy` ; cookies `HttpOnly` pour qu'un script ne puisse pas
les lire.

## CSRF — action exécutée à l'insu de l'utilisateur

Un site tiers déclenche une requête vers l'application où la victime est déjà
connectée : le navigateur joint les cookies tout seul.

Parades : jeton anti-CSRF unique par formulaire, cookies en `SameSite=Lax` ou
`Strict`, et vérifier que les actions sensibles ne sont pas en `GET`.

## SSRF — le serveur va chercher l'URL qu'on lui donne

L'application récupère une URL fournie par l'utilisateur ; on lui fait viser son
propre réseau interne, ou le service de métadonnées d'un hébergeur
(`169.254.169.254`), qui livre des identifiants.

Parade : liste d'autorisation de destinations, jamais de liste d'interdiction.

## Contrôle d'accès cassé (IDOR)

```
/facture?id=1042      ma facture
/facture?id=1043      celle du voisin
```

Aucune technique, aucun outil : le contrôle n'a simplement pas été écrit. C'est
la faille **la plus répandue et la moins détectée par les scanners**, parce que
la requête est parfaitement valide.

## Les autres à connaître

| Attaque | Principe | Parade |
| --- | --- | --- |
| Traversée de chemin | `../../etc/passwd` dans un nom de fichier | normaliser puis vérifier le préfixe |
| Inclusion de fichier (LFI/RFI) | inclure un chemin fourni par l'utilisateur | ne jamais inclure une entrée |
| Téléversement non filtré | envoyer un `.php` au lieu d'une image | vérifier le type réel, stocker hors racine web |
| Injection de commande | `; rm -rf` dans un paramètre | ne pas passer par un shell |
| Désérialisation | objet forgé exécuté au chargement | formats de données, pas d'objets |
| Redirection ouverte | `?next=https://site-malveillant.tld` | liste d'autorisation |

## Pièges

- **L'échappement ne remplace pas la requête préparée.** Un `addslashes` bien
  intentionné laisse passer les injections numériques et les encodages
  alternatifs. La séparation code / données est structurelle, pas cosmétique.
- **La validation côté client ne sert à rien pour la sécurité.** Elle améliore
  le confort ; elle se contourne avec `curl`. Tout doit être revalidé côté
  serveur — c'est vrai pour chaque contrôle, sans exception.
- **Un WAF est une rustine, pas un correctif.** Il gagne du temps avant le
  déploiement du patch ; considérer une faille comme réglée parce que le WAF la
  bloque, c'est reporter le problème.
- **Une CSP avec `'unsafe-inline'` ne protège de presque rien** — or c'est la
  configuration par défaut de beaucoup de générateurs.
- **IDOR ne se détecte pas automatiquement** : il faut connaître le métier pour
  savoir que l'utilisateur A ne devrait pas voir l'objet de B. Aucun scanner ne
  le sait à ta place.
- **Chiffrer n'autorise pas.** Un identifiant chiffré ou haché dans l'URL reste
  un IDOR si le serveur ne vérifie pas à qui appartient la ressource.
- Les messages d'erreur détaillés en production servent surtout l'attaquant :
  version du serveur, chemin absolu, requête SQL complète.

## Voir aussi

- [Lexique de l'évaluation de sécurité](lexique.md)
- [Maliciels, attaques et vocabulaire des menaces](menaces.md)
- [Codes de réponse HTTP](../reseau/codes-http.md)
- [WordPress : custom post types et requêtes](../wordpress/post-types-et-requetes.md)
