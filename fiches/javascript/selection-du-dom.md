---
title: "JavaScript : sélectionner dans le DOM (querySelector)"
tags: [javascript, web]
created: 2026-09-07
updated: 2026-09-07
status: stable
---

## En bref

Attraper un ou plusieurs éléments de la page pour les lire ou les modifier. La
question à trancher d'abord : **je veux UN élément (`querySelector`) ou
PLUSIEURS (`querySelectorAll`) ?** Le reste n'est que des sélecteurs CSS.

## Les deux méthodes à retenir

```js
document.querySelector('.carte');        // le PREMIER qui correspond, ou null
document.querySelectorAll('.carte');     // TOUS, dans une NodeList
```

Elles prennent **n'importe quel sélecteur CSS** — c'est tout l'intérêt : la même
syntaxe que dans une feuille de style.

```js
document.querySelector('#menu');                 // par id
document.querySelector('.actif');                // par classe
document.querySelector('input[name="email"]');   // par attribut
document.querySelector('nav > li');              // enfant direct
document.querySelector('.liste .item');          // descendant
document.querySelectorAll('a[href^="https"]');   // liens externes
```

## Les anciennes méthodes (encore partout)

| Méthode | Renvoie | Sélecteur |
| --- | --- | --- |
| `getElementById('menu')` | un élément ou `null` | id **seul**, sans `#` |
| `getElementsByClassName('actif')` | collection **vivante** | classe seule |
| `getElementsByTagName('li')` | collection **vivante** | balise seule |
| `querySelector(...)` | un élément ou `null` | **CSS complet** |
| `querySelectorAll(...)` | NodeList **figée** | **CSS complet** |

`getElementById` reste le plus rapide pour un id, mais `querySelector` fait tout
avec une seule syntaxe à retenir — c'est le choix par défaut.

## Boucler sur le résultat

`querySelectorAll` renvoie une **NodeList**, pas un tableau : `forEach` marche,
mais `map`/`filter` non. Pour les méthodes de tableau, convertir d'abord.

```js
document.querySelectorAll('.item').forEach(el => el.classList.add('vu'));   // OK direct
[...document.querySelectorAll('.item')].map(el => el.textContent);           // -> vrai tableau
Array.from(document.querySelectorAll('.item'), el => el.textContent);        // idem, en un temps
```

Voir [les méthodes de tableau](tableaux.md) pour la suite (`map`, `filter`…).

## Chercher dans un élément, pas dans toute la page

`querySelector` existe **sur n'importe quel élément**, pas seulement sur
`document`. On restreint ainsi la recherche à une sous-partie — plus rapide et
moins fragile.

```js
const carte = document.querySelector('.carte');
const titre = carte.querySelector('h2');         // cherche DANS carte uniquement
const boutons = carte.querySelectorAll('button');
```

## Ce qu'on fait juste après

```js
const el = document.querySelector('#msg');
el.textContent = 'Bonjour';              // le texte (sur, pas d'injection HTML)
el.innerHTML = '<b>Bonjour</b>';         // du HTML (risque XSS si non maitrise)
el.classList.add('actif');               // ajouter une classe
el.classList.toggle('ouvert');           // basculer
el.setAttribute('disabled', '');         // un attribut
el.value;                                // la valeur d'un champ de formulaire
el.addEventListener('click', () => {}); // ecouter un evenement
```

## Pièges

- **`querySelector` renvoie `null` si rien ne correspond**, et lire une propriété
  de `null` plante : `Cannot read properties of null`. Tester avant, ou utiliser
  l'optionnel : `document.querySelector('#x')?.classList.add('a')`.
- **Le script s'exécute avant que le HTML existe.** Un `<script>` dans le `<head>`
  ne trouve rien : placer la balise en fin de `<body>`, ou envelopper dans
  `document.addEventListener('DOMContentLoaded', () => { ... })`.
- **NodeList n'est pas un tableau.** `querySelectorAll(...).map(...)` échoue.
  `forEach` marche, le reste demande `[...nodeList]` ou `Array.from(...)`.
- **`querySelectorAll` est figée, `getElementsByClassName` est vivante.** La
  première est une photo à l'instant T ; la seconde se met à jour toute seule
  quand le DOM change — source de boucles surprenantes si on ajoute des éléments
  en la parcourant.
- **L'id passe sans `#` à `getElementById`, avec `#` à `querySelector`.**
  `getElementById('#menu')` cherche un id littéralement nommé `#menu` et ne
  trouve rien.
- **Un id avec un caractère spécial casse le sélecteur CSS.** Un id comme
  `user.42` doit être échappé (`#user\\.42`) ou pris par `getElementById`, qui
  ne l'interprète pas comme du CSS.
- **`innerHTML` avec des données utilisateur = faille XSS.** Pour du texte,
  toujours `textContent`. Voir [les attaques web courantes](../securite/attaques-web.md).

## Voir aussi

- [JavaScript : les méthodes de tableau](tableaux.md)
- [Les attaques web courantes](../securite/attaques-web.md)
- <https://developer.mozilla.org/fr/docs/Web/API/Document/querySelector>
