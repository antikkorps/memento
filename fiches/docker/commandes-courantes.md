---
title: "Docker : commandes courantes"
tags: [conteneur, reseau]
created: 2026-08-17
updated: 2026-08-17
status: stable
---

## En bref

Lancer, inspecter et connecter des conteneurs au quotidien. Les options qu'on
retape sans arrêt, et celles dont le comportement réel diffère de ce qu'on croit.

## Lancer un conteneur

```sh
docker run -p 8055:8055 -ti <image>
```

| Option | Effet |
| --- | --- |
| `-p <hôte>:<conteneur>` | publie un port |
| `-e CLE=valeur` | variable d'environnement |
| `-d` | détaché, rend la main |
| `-ti` | terminal interactif |
| `--name <nom>` | nomme le conteneur, sinon Docker en invente un |
| `--rm` | supprime le conteneur à son arrêt |
| `-v <nom>:<chemin>` | monte un volume nommé, qui survit au conteneur |

## Volumes nommés

Un volume nommé est la façon de séparer ce qui doit survivre — les données — de
ce qui doit rester jetable : le conteneur. C'est ce qui permet de détruire et
recréer le conteneur à chaque mise à jour de l'image sans rien perdre.

```sh
docker run -d -p 80:8055 --name directus \
  -v database:/directus/database \
  -v uploads:/directus/uploads \
  -v extensions:/directus/extensions \
  -e KEY="<uuid-a-generer>" \
  -e SECRET="<uuid-a-generer>" \
  -e ADMIN_EMAIL="admin@exemple.tld" \
  -e ADMIN_PASSWORD="<mot-de-passe>" \
  directus/directus
```

Générer les secrets plutôt que les recopier :
voir [Générer des secrets, clés et mots de passe](../securite/generer-des-secrets.md).

```sh
docker volume ls                  # lister
docker volume inspect database    # où il vit réellement sur l'hôte
```

## Inspecter

```sh
docker container ls          # conteneurs actifs
docker container ls -a       # y compris les arrêtés
docker logs -f <conteneur>   # suivre la sortie
docker container exec -ti <conteneur> sh   # ouvrir un shell dedans
```

`sh` plutôt que `bash` : beaucoup d'images (Alpine notamment) n'embarquent pas
bash.

## Communication

**Conteneur → hôte** : remplacer `localhost` par `host.docker.internal`.
Disponible d'office avec Docker Desktop (macOS, Windows, WSL2). Sur un Docker
natif Linux, il faut l'ajouter explicitement :

```sh
docker run --add-host=host.docker.internal:host-gateway ...
```

**Conteneur → conteneur** : contrairement aux volumes, Docker ne crée pas le
réseau tout seul.

```sh
docker network create mon-reseau
docker run --network mon-reseau --name api ...
docker run --network mon-reseau --name front ...
```

Les conteneurs d'un même réseau se joignent **par leur nom** : depuis `front`,
l'API est à `http://api:3000`. C'est le nom qui compte, pas l'IP.

Récupérer l'IP via `docker inspect` fonctionne, mais elle change à chaque
redémarrage : à éviter en dehors d'un dépannage ponctuel.

## Nettoyer

```sh
docker image prune -a    # toutes les images non utilisées par un conteneur
docker system prune -a   # images, conteneurs arrêtés, réseaux et cache
```

## Pièges

- **`--rm` ne supprime pas les volumes nommés**, et c'est heureux : il ne
  supprime que le conteneur et ses volumes *anonymes*. Un volume nommé survit,
  c'est tout l'intérêt.
- `-d` et `-ti` ensemble n'ont pas de sens : `-d` rend la main, `-ti` attache un
  terminal. Choisir.
- La syntaxe est `-e CLE=valeur`, **sans deux-points**. Le `CLE: valeur` est
  celle de `docker-compose.yml`, elle ne marche pas dans `docker run`.
- Ne jamais mettre de secret en clair dans un `docker run` conservé quelque
  part : il finit dans l'historique du shell, et dans le dépôt si tu le notes.
  Passer par `--env-file` avec un fichier ignoré par git.
- `sudo docker` partout est évitable : `sudo usermod -aG docker $USER`, puis
  rouvrir la session.

## Voir aussi

- [lsof : trouver ce qui occupe un port, un volume ou un fichier](../linux/lsof.md)
- <https://docs.docker.com/reference/cli/docker/container/run/>
