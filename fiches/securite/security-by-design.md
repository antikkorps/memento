---
title: "Security by design : principes de conception sécurisée"
tags: [securite, gestion-de-projet]
created: 2026-09-21
updated: 2026-09-21
status: stable
---

## En bref

Intégrer la sécurité **dès la conception**, comme une exigence de départ, pas
comme une rustine ajoutée à la fin. La sécurité rapportée après coup coûte plus
cher, couvre moins, et laisse des trous structurels. Trois principes reviennent
partout ; les autres en découlent.

## Les trois principes à retenir

- **Défense en profondeur** (*defense in depth*) — empiler plusieurs couches de
  contrôles indépendants plutôt que miser sur un seul rempart. Pare-feu **et**
  authentification **et** chiffrement **et** journalisation : si une couche cède,
  les suivantes tiennent.
- **Moindre privilège** (*least privilege*) — chaque compte, service ou processus
  reçoit **exactement** les droits nécessaires, rien de plus, et pour la durée
  utile seulement. Un service web n'a pas à tourner en root.
- **Réduction de la surface d'attaque** (*attack surface reduction*) — moins on
  expose (ports, services, endpoints, code, dépendances), moins il y a à
  défendre. Désactiver ce qui ne sert pas est une mesure de sécurité à part
  entière.

## Les corollaires utiles

| Principe | Idée |
| --- | --- |
| Sécurité par défaut (*secure defaults*) | l'état livré est le plus sûr ; l'ouverture est un choix explicite |
| Échouer en sécurité (*fail securely*) | en cas d'erreur, refuser l'accès plutôt que l'accorder |
| Séparation des privilèges | plusieurs conditions/rôles pour une action sensible |
| Minimisation | ne collecter et ne garder que le strict nécessaire (rejoint le RGPD) |
| Ne jamais faire confiance au client | tout contrôle est refait côté serveur |
| Zero trust | ne rien accorder sur la seule base de la position réseau |

## Pièges

- **La sécurité ajoutée à la fin.** Traitée comme une phase de recette, elle
  devient coûteuse et incomplète : les choix d'architecture sont figés. Elle est
  une exigence du [cahier des charges](../gestion-de-projet/afnor-nf-x50-151.md),
  pas une option.
- **Un seul rempart.** « On a un pare-feu » n'est pas une stratégie : sans
  défense en profondeur, sa chute ouvre tout.
- **Les privilèges « pour que ça marche ».** Droits élargis en phase de test puis
  jamais réduits : c'est la dérive la plus commune du moindre privilège.
- **La sécurité par l'obscurité.** Cacher un port ou renommer un chemin n'est pas
  un contrôle ; ça ne remplace aucun des trois principes.
- **Confondre avec le RGPD.** Security by design protège le *système* ; privacy
  by design protège les *données personnelles*. Complémentaires, pas
  interchangeables.

## Voir aussi

- [RGPD : privacy by design et AIPD](rgpd-privacy-by-design.md)
- [Les attaques web courantes](attaques-web.md)
- [Maliciels, attaques et vocabulaire des menaces](menaces.md)
- [Lexique de l'évaluation de sécurité](lexique.md)
- <https://owasp.org/www-project-proactive-controls/>
