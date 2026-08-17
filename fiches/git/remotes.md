---
title: Remotes git et miroirs
tags: [git, procedure]
created: 2026-08-17
updated: 2026-08-17
status: stable
---

## En bref

Rattacher un dépôt local à un serveur distant, en changer, et comprendre où se
configure un miroir quand on héberge son propre Forgejo.

## Commandes

```sh
git remote -v                       # lister les remotes et leurs URL
git remote add origin <url>         # rattacher un dépôt local tout neuf
git push -u origin main             # premier push, -u fixe la branche amont
git remote set-url origin <url>     # changer d'URL sans toucher au reste
git remote rename origin forgejo    # renommer
git remote remove <nom>             # détacher
```

## Détails

`origin` n'a rien de magique : c'est le nom par défaut du premier remote, rien
de plus. Un dépôt peut en avoir autant qu'on veut, et `git push <remote>` prend
le nom en argument.

`-u` (alias de `--set-upstream`) écrit `branch.main.remote` et
`branch.main.merge` dans `.git/config`. C'est ce qui permet aux `git push` et
`git pull` suivants de fonctionner sans argument. À ne faire qu'une fois par
branche.

Sur une URL SSH de la forme `ssh://git@hote/utilisateur/depot.git`, c'est la
configuration SSH qui décide de la clé utilisée — pas git. Un push qui demande
un mot de passe est un problème de `~/.ssh/config`, pas de remote.

## Miroirs

Un miroir se configure **côté serveur**, pas dans le dépôt local. Sur Forgejo :
*Paramètres du dépôt → Miroirs → Miroir poussé*, avec un jeton d'accès de la
destination. Le dépôt local ne pousse alors que vers Forgejo, qui répercute.

L'alternative locale — plusieurs URL de push sur un même remote — existe :

```sh
git remote set-url --add --push origin <url-1>
git remote set-url --add --push origin <url-2>
```

Mais elle place la synchronisation dans la copie de travail : elle ne se propage
pas aux autres clones et se désynchronise dès qu'un push part d'ailleurs. Le
miroir côté serveur est presque toujours le bon choix.

## Pièges

- `git remote add` sur un nom existant échoue avec `remote <nom> already
  exists` : utiliser `set-url` pour corriger une URL.
- Cloner puis ajouter `origin` à la main est inutile — `git clone` le crée déjà.
- Un miroir poussé est **unidirectionnel** : un commit fait directement sur la
  destination sera écrasé au prochain cycle.

## Voir aussi

- <https://forgejo.org/docs/latest/user/repo-mirror/>
- `git help remote`
