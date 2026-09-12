---
title: "Plusieurs jobs dans un seul workflow"
tags: [cicd, git]
created: 2026-09-03
updated: 2026-09-03
status: stable
---

## En bref

Un workflow peut lancer autant de jobs qu'on veut. **Ils tournent en parallèle
par défaut, chacun sur un runner neuf** — c'est le point qui surprend : deux
jobs ne partagent ni fichiers, ni variables, ni dépôt cloné.

## Plusieurs jobs, en parallèle

```yaml
name: qualite

on: [push, pull_request]

jobs:
  lint:
    runs-on: docker
    container: { image: node:22-alpine }
    steps:
      - uses: actions/checkout@v4
      - run: npm run lint

  test:
    runs-on: docker
    container: { image: node:22-alpine }
    steps:
      - uses: actions/checkout@v4
      - run: npm test
```

`lint` et `test` démarrent en même temps. Chacun refait son `checkout` : ce
n'est pas une redondance à supprimer, c'est obligatoire.

## Enchaîner : `needs`

```yaml
jobs:
  lint:
    runs-on: docker
    steps: [...]

  test:
    runs-on: docker
    steps: [...]

  deploy:
    needs: [lint, test]           # attend que les DEUX aient reussi
    if: github.ref == 'refs/heads/main'
    runs-on: docker
    steps:
      - run: ./deploy.sh
```

`needs` construit le graphe : ce qui n'est pas lié tourne en parallèle, ce qui
est lié attend. Un job dont un `needs` échoue est **annulé**, pas exécuté.

Pour qu'un job tourne quand même après un échec — publier un rapport, nettoyer :

```yaml
  rapport:
    needs: [lint, test]
    if: always()                  # sinon le job est annule des qu'un needs echoue
    runs-on: docker
    steps:
      - run: echo "resultat lint : ${{ needs.lint.result }}"
```

`always()`, `success()`, `failure()`, `cancelled()` sont les quatre fonctions à
connaître.

## Passer une valeur d'un job à l'autre : `outputs`

```yaml
jobs:
  version:
    runs-on: docker
    outputs:
      num: ${{ steps.lire.outputs.num }}
    steps:
      - uses: actions/checkout@v4
      - id: lire
        run: echo "num=$(cat VERSION)" >> $GITHUB_OUTPUT

  publier:
    needs: version
    runs-on: docker
    steps:
      - run: echo "publication de la ${{ needs.version.outputs.num }}"
```

Deux niveaux à ne pas confondre : `steps.<id>.outputs.<nom>` **dans** un job,
`needs.<job>.outputs.<nom>` **entre** jobs — et il faut déclarer le second dans
le bloc `outputs:` du job producteur, sinon rien ne sort.

## Passer un fichier d'un job à l'autre : artefacts

Les `outputs` ne transportent que des chaînes. Pour un binaire compilé, un
rapport de couverture, un dump :

```yaml
  build:
    steps:
      - run: npm run build
      - uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist/

  deploy:
    needs: build
    steps:
      - uses: actions/download-artifact@v3
        with:
          name: dist
          path: dist/
      - run: ./deploy.sh
```

## Le même job sur plusieurs valeurs : `matrix`

```yaml
  test:
    runs-on: docker
    strategy:
      fail-fast: false            # ne pas tuer les autres au premier echec
      max-parallel: 2
      matrix:
        node: [18, 20, 22]
    container:
      image: node:${{ matrix.node }}-alpine
    steps:
      - uses: actions/checkout@v4
      - run: npm test
```

Trois jobs sont générés automatiquement, nommés `test (18)`, `test (20)`,
`test (22)`.

## Un fichier ou plusieurs ?

| | Plusieurs jobs, un fichier | Plusieurs fichiers |
| --- | --- | --- |
| Déclencheurs | communs à tous les jobs | indépendants par workflow |
| Dépendances (`needs`) | possibles | impossibles entre fichiers |
| Affichage | une exécution, plusieurs jobs | une exécution par workflow |
| Lisibilité | tout le pipeline d'un coup d'œil | fichiers courts et ciblés |

La règle qui marche : **un fichier par déclencheur.** Tout ce qui part sur
`push` va dans un fichier avec plusieurs jobs ; le workflow nocturne
(`schedule`) et le workflow manuel (`workflow_dispatch`) ont chacun le leur.

## Pièges

- **Chaque job repart de zéro.** Pas de `node_modules` hérité, pas de dépôt
  cloné, pas de `$GITHUB_ENV` transmis, pas de fichier écrit par le job
  précédent. Tout ce qui doit traverser passe par `outputs` (chaînes) ou par un
  artefact (fichiers). C'est l'erreur la plus fréquente en découvrant `needs` :
  on croit avoir enchaîné des étapes, on a enchaîné des machines.
- **Un job avec `needs` est annulé, pas échoué**, quand sa dépendance casse : il
  faut `if: always()` pour qu'il tourne quand même.
- `if:` au niveau du job est évalué **avant** le job ; au niveau d'un step,
  avant ce step. Un `if` de step ne dispense pas le job de démarrer un runner.
- **`fail-fast: true` est le défaut d'une matrice** : le premier échec annule
  les autres combinaisons, donc on ne voit qu'une erreur sur trois. Le passer à
  `false` quand on cherche à savoir *quelles* versions cassent.
- Les jobs consomment tous un runner : trois jobs parallèles sur un runner à
  une seule place s'exécutent en fait en série, et un `needs` circulaire ou
  mal posé les fait s'attendre indéfiniment.
- `runs-on` est à redéclarer dans **chaque** job — il n'y a pas de valeur par
  défaut au niveau du workflow.

## Voir aussi

- [Forgejo Actions : anatomie d'un workflow](workflow.md)
- <https://forgejo.org/docs/latest/user/actions/>
