# Vocabulaire de tags

Un tag ne vaut que s'il est réutilisé. Le rôle de ce fichier est d'empêcher la
dérive (`reseau`, `réseau`, `réseaux`, `network` cohabitant dans le dépôt), pas
de tout prévoir à l'avance.

## Règle de nommage

- minuscules uniquement ;
- **sans accent** : `reseau`, jamais `réseau` ;
- **au singulier** : `conteneur`, jamais `conteneurs` ;
- mots séparés par un tiret : `ligne-de-commande` ;
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
- `reseau` — TCP/IP, DNS, routage, pare-feu
- `conteneur` — Docker, Podman, images, compose
- `securite` — chiffrement, authentification, durcissement

## Outillage

- `git` — versionnement, remotes, workflows
- `ligne-de-commande` — shell, utilitaires POSIX, one-liners
- `editeur` — Vim, configuration d'éditeurs

## Développement

- `node` — Node.js, npm, écosystème JavaScript
- `ci` — intégration continue, Forgejo Actions, pipelines

## Méthode

- `procedure` — suite d'étapes à rejouer telle quelle
- `depannage` — symptôme observé et sa résolution
