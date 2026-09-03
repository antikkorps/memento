# Vocabulaire de tags

Un tag ne vaut que s'il est réutilisé. Le rôle de ce fichier est d'empêcher la
dérive (`reseau`, `réseau`, `réseaux`, `network` cohabitant dans le dépôt), pas
de tout prévoir à l'avance.

## Règle de nommage

- minuscules uniquement ;
- **sans accent** : `reseau`, jamais `réseau` ;
- **au singulier** : `conteneur`, jamais `conteneurs` ;
- mots séparés par un tiret : `base-de-donnees` ;
- expression régulière appliquée par l'indexeur : `^[a-z0-9]+(-[a-z0-9]+)*$`.

## Comment ajouter un tag

1. Vérifier qu'aucun tag existant ne couvre déjà le besoin.
2. Ajouter une ligne dans la section adéquate, au format exact :
   `` - `tag` — courte définition `` (l'indexeur ne lit que ce motif ; le reste
   du fichier est libre).
3. Lancer `npm run index`.

Un tag déclaré et jamais utilisé n'est pas une erreur — `npm run index` le
signale simplement, pour que tu puisses faire le ménage.

Un tag utilisé mais absent d'ici **est** une erreur : la CI échoue.

## Systèmes et infrastructure

- `linux` — distribution, systemd, filesystem, gestion de paquets
- `windows` — cmd, PowerShell, services, registre
- `reseau` — TCP/IP, DNS, routage, pare-feu
- `conteneur` — Docker, Podman, images, compose
- `securite` — chiffrement, authentification, durcissement

## Données

- `base-de-donnees` — SGBD, SQL, schémas, requêtes, administration
- `sauvegarde` — dumps, exports, restauration, archivage

## Outillage

- `git` — versionnement, remotes, workflows
- `terminal` — shell, utilitaires en ligne de commande, one-liners
- `texte` — recherche, filtrage et transformation de texte (grep, sed, awk, jq)
- `editeur` — Vim, configuration d'éditeurs

## Développement

- `javascript` — le langage : syntaxe, tableaux, objets, asynchrone
- `node` — Node.js, npm, écosystème JavaScript
- `php` — PHP, WordPress, écosystème serveur
- `web` — HTTP, front, CMS, API web
- `cicd` — intégration continue et déploiement, Forgejo Actions, pipelines

## Méthode

- `procedure` — suite d'étapes à rejouer telle quelle
- `depannage` — symptôme observé et sa résolution
- `ressource` — fiche qui pointe vers des lectures externes plutôt que de
  contenir la réponse
