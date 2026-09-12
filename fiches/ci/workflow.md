---
title: "Forgejo Actions : anatomie d'un workflow"
tags: [cicd, git]
created: 2026-09-03
updated: 2026-09-03
status: stable
---

## En bref

Un fichier YAML dans `.forgejo/workflows/`, déclenché par un événement git, qui
lance un ou plusieurs jobs sur un runner. La syntaxe est celle de GitHub
Actions — ce qu'on lit sur GitHub s'applique à 90 %, les écarts sont dans les
pièges en bas.

## Le squelette

```yaml
name: check                    # nom affiche dans l'onglet Actions

on:                            # QUAND
  push:
  pull_request:

jobs:                          # QUOI
  check:                       # identifiant du job
    runs-on: docker            # OU : un label declare par le runner
    container:
      image: node:22-alpine
    steps:
      - uses: actions/checkout@v4
      - run: npm run check
```

C'est exactement le workflow de ce dépôt
([.forgejo/workflows/check.yml](../../.forgejo/workflows/check.yml)) : le plus
petit qui fasse quelque chose d'utile.

## Les déclencheurs

```yaml
on:
  push:
    branches: [main]
    paths: ['fiches/**', 'scripts/**']    # ne se declenche que si ca change
    tags: ['v*']
  pull_request:
    types: [opened, synchronize, reopened]
  schedule:
    - cron: '0 4 * * 1'                   # tous les lundis a 4h UTC
  workflow_dispatch:                       # bouton « lancer » dans l'interface
```

`workflow_dispatch` est le plus sous-estimé : il transforme un workflow en
bouton, avec des paramètres optionnels.

```yaml
on:
  workflow_dispatch:
    inputs:
      environnement:
        type: choice
        options: [staging, production]
```

## Les étapes

```yaml
steps:
  - uses: actions/checkout@v4          # une action reutilisable
    with:
      fetch-depth: 0                   # tout l'historique (defaut : 1 seul commit)

  - name: Installer les dependances    # un nom lisible dans l'interface
    run: npm ci

  - name: Verifier
    run: |
      npm run check
      npm run index
    env:
      NODE_ENV: test

  - name: Publier
    if: github.ref == 'refs/heads/main'
    run: ./deploy.sh
    env:
      TOKEN: ${{ secrets.DEPLOY_TOKEN }}
```

| Clé | Rôle |
| --- | --- |
| `uses` | réutilise une action publiée |
| `run` | exécute du shell (`\|` pour plusieurs lignes) |
| `name` | libellé dans l'interface — en mettre un dès que `run` fait plus d'une ligne |
| `with` | paramètres d'une action `uses` |
| `env` | variables, cumulables aux niveaux workflow / job / step |
| `if` | condition ; le `${{ }}` est implicite ici |
| `working-directory` | répertoire d'exécution du `run` |
| `continue-on-error` | l'échec n'arrête pas le job |
| `timeout-minutes` | garde-fou contre le job qui pend |

## Secrets et variables

Définis dans **Paramètres → Actions → Secrets** du dépôt (ou de l'organisation).

```yaml
- run: curl -H "Authorization: Bearer $TOKEN" https://api.exemple.tld
  env:
    TOKEN: ${{ secrets.API_TOKEN }}
```

Toujours passer un secret par `env`, jamais directement dans la ligne de
commande : la ligne apparaît telle quelle dans les logs, `env` non. Forgejo
masque les valeurs connues des secrets dans la sortie, mais un secret
reconstruit (concaténation, encodage) échappe au masquage.

`${{ secrets.GITHUB_TOKEN }}` est fourni automatiquement et permet d'agir sur le
dépôt lui-même (commenter une PR, pousser un tag).

## Communiquer entre étapes

```yaml
- id: version
  run: echo "num=$(node -p "require('./package.json').version")" >> $GITHUB_OUTPUT

- run: echo "on publie la ${{ steps.version.outputs.num }}"
```

| Fichier spécial | Effet |
| --- | --- |
| `$GITHUB_OUTPUT` | sortie nommée, lisible par les étapes suivantes |
| `$GITHUB_ENV` | variable d'environnement pour les étapes suivantes |
| `$GITHUB_STEP_SUMMARY` | markdown affiché en résumé du job |
| `$GITHUB_PATH` | ajoute un répertoire au `PATH` |

## Pièges

- **`runs-on` doit correspondre à un label déclaré par le runner.** C'est
  l'erreur numéro un : le workflow apparaît dans l'interface et n'est jamais
  ramassé, sans message. Les labels se déclarent à l'enregistrement du runner,
  dans son `config.yml`, section `runner.labels` (`docker`, `ubuntu-latest`,
  `self-hosted`…). Un `runs-on: ubuntu-latest` copié de GitHub ne marche que si
  ce label existe **chez toi**.
- **Les actions `uses:` sont téléchargées depuis l'extérieur.** Forgejo les
  résout via `[actions] DEFAULT_ACTIONS_URL` (`code.forgejo.org` ou GitHub) :
  sur une instance sans accès Internet, `actions/checkout@v4` échoue. Le repli
  est de tout faire en `run:` — un `git clone` explicite coûte trois lignes.
- **Épingler les actions par version.** `@v4` est un tag mobile ; pour un
  workflow qui touche à des secrets, épingler le SHA complet.
- **`actions/upload-artifact@v4` n'est pas supporté par toutes les versions de
  Forgejo** : rester en `@v3` tant que l'instance n'est pas à jour, et vérifier
  que le stockage d'artefacts est activé côté instance.
- Les secrets ne sont **pas** exposés aux workflows déclenchés par une PR
  venant d'un fork. C'est voulu, et ça fait échouer les workflows de
  publication sur les contributions externes.
- `on: push` sans filtre se déclenche aussi sur les branches et les tags. Ajouter
  `branches:` dès qu'un job fait quelque chose d'irréversible.
- Le YAML est sensible à l'indentation et `on:` est interprété comme le booléen
  `true` par certains linters YAML — c'est cosmétique, Forgejo lit bien la clé.
- Les Actions doivent être activées **deux fois** : au niveau de l'instance
  (`[actions] ENABLED`) et dans **Paramètres → Unités** du dépôt.

## Voir aussi

- [Plusieurs jobs dans un seul workflow](jobs.md)
- [Remotes git et miroirs](../git/remotes.md)
- <https://forgejo.org/docs/latest/user/actions/>
- <https://docs.github.com/actions/reference/workflow-syntax-for-github-actions>
