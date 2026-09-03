---
title: "JavaScript : les méthodes de tableau"
tags: [javascript, web]
created: 2026-09-03
updated: 2026-09-03
status: stable
---

## En bref

Les méthodes qu'on écrit dix fois par jour et qu'on désapprend à taper. La
question à se poser d'abord : **est-ce que je transforme, je filtre, je cherche,
ou je réduis à une seule valeur ?**

## Le tri en quatre réflexes

| Ce que je veux | La méthode | Renvoie |
| --- | --- | --- |
| transformer chaque élément | `map` | un tableau de même longueur |
| garder certains éléments | `filter` | un tableau plus court |
| trouver **un** élément | `find` / `findIndex` | l'élément / son index |
| réduire à une seule valeur | `reduce` | ce qu'on veut |
| savoir si ça existe | `some` / `every` / `includes` | un booléen |

```js
const users = [
  { nom: 'Ana', age: 34, actif: true },
  { nom: 'Bo', age: 17, actif: false },
  { nom: 'Cy', age: 52, actif: true },
];

users.map(u => u.nom);                       // ['Ana', 'Bo', 'Cy']
users.filter(u => u.actif);                  // les deux actifs
users.find(u => u.age > 40);                 // { nom: 'Cy', ... }
users.findIndex(u => u.nom === 'Bo');        // 1
users.some(u => u.age < 18);                 // true  -- au moins un
users.every(u => u.age < 18);                // false -- tous
users.reduce((total, u) => total + u.age, 0);       // 103
users.map(u => u.nom).join(', ');            // 'Ana, Bo, Cy'
```

## Le reste, par usage

```js
arr.forEach(x => console.log(x));    // effet de bord, ne renvoie RIEN
arr.includes('a');                   // presence d'une valeur
arr.indexOf('a');                    // sa position, -1 si absente
arr.at(-1);                          // le dernier element
arr.slice(1, 3);                     // une copie partielle -- ne modifie pas
arr.flat(2);                         // aplatit sur 2 niveaux
arr.flatMap(x => [x, x * 2]);        // map puis flat(1)
Array.from({ length: 5 }, (_, i) => i);      // [0, 1, 2, 3, 4]
[...new Set(arr)];                   // dedoublonner
Object.entries(obj).map(([k, v]) => `${k}=${v}`);
```

## Trier

```js
[10, 9, 1].sort();                   // [1, 10, 9]  -- tri ALPHABETIQUE
[10, 9, 1].sort((a, b) => a - b);    // [1, 9, 10]  croissant
[10, 9, 1].sort((a, b) => b - a);    // decroissant
users.sort((a, b) => a.nom.localeCompare(b.nom));   // chaines, avec accents

[...arr].sort();                     // trier une COPIE
arr.toSorted();                      // idem, depuis 2023
```

## Ce qui modifie, ce qui ne modifie pas

| Renvoie une copie | **Modifie le tableau** |
| --- | --- |
| `map` `filter` `slice` `concat` `flat` | `sort` `reverse` `splice` |
| `toSorted` `toReversed` `toSpliced` `with` | `push` `pop` `shift` `unshift` `fill` |

C'est la distinction qui provoque le plus de bugs silencieux : `sort()` trie sur
place **et** renvoie le tableau, donc un `const trie = liste.sort()` a aussi
trié `liste`.

## Pièges

- **`sort()` sans comparateur trie en texte.** `[1, 10, 2].sort()` donne
  `[1, 10, 2]` parce que `'10' < '2'`. Toujours `(a, b) => a - b` sur des
  nombres.
- **`sort` et `reverse` modifient l'original.** Copier d'abord (`[...arr]`) ou
  utiliser `toSorted` / `toReversed`.
- **Un `map` sans `return` renvoie un tableau de `undefined`.** L'accolade change
  tout : `x => ({ ...x })` renvoie un objet, `x => { ...x }` renvoie
  `undefined` — d'où les parenthèses autour de l'objet.
- **`forEach` ne peut pas être interrompu** : ni `break`, ni `return` global.
  Pour sortir tôt, c'est `for...of`, `some` ou `find`.
- **`forEach` n'attend pas `await`.** C'est le piège moderne le plus coûteux :

  ```js
  arr.forEach(async x => await save(x));         // ne marche PAS, on n'attend rien
  for (const x of arr) await save(x);            // sequentiel, correct
  await Promise.all(arr.map(x => save(x)));      // parallele, correct
  ```

- **`reduce` sans valeur initiale plante sur un tableau vide** et prend le
  premier élément comme accumulateur sinon. Mettre l'initiale (`, 0`, `, []`,
  `, {}`) systématiquement.
- `map` puis `filter` parcourt deux fois — sans importance sur cent éléments, et
  la lisibilité vaut mieux que l'optimisation prématurée.
- `find` renvoie `undefined` quand rien ne correspond, `findIndex` renvoie `-1`.
  Tester le bon des deux.
- Comparer avec `===`, jamais `==` : `0 == '0'` est vrai, `0 === '0'` est faux.

## Voir aussi

- [WordPress : custom post types et requêtes](../wordpress/post-types-et-requetes.md)
- <https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Array>
