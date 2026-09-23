---
title: "Rust : conditions et valeurs absentes (Option)"
tags: [rust]
created: 2026-09-23
updated: 2026-09-23
status: stable
---

## En bref

**`if` exige un `bool`, et rien d'autre.** Pas de *truthiness* : une chaîne vide
n'est pas fausse, `0` n'est pas faux, et il n'y a pas de `null`. L'absence de
valeur se représente par une **`Option`**, qu'on ouvre avec `if let` ou `match`.

```rust
if !s.is_empty() { }                      // pas `if s`
if let Some(v) = map.get("cle") { }       // pas `if (v != null)`
```

## Traduire ses réflexes

| Dans un langage à truthiness | En Rust |
| --- | --- |
| `if (chaine)` | `if !s.is_empty()` |
| `if (tableau.length)` | `if !v.is_empty()` |
| `if (n)` | `if n != 0` |
| `if (x != null)` | `if opt.is_some()` |
| `if (x != null)` puis utiliser `x` | `if let Some(x) = opt { … }` |

La dernière ligne est la vraie réponse de Rust au problème. Ailleurs on teste,
puis on utilise, et rien ne garantit qu'on n'a pas oublié le test. `if let`
**teste et donne la valeur en même temps** : il n'existe aucun chemin où l'on
manipule une valeur absente.

## Option : ce que renvoie « ça peut ne pas exister »

```rust
let trouve = map.get("cle");        // Option<&String> : Some(...) ou None
```

Trois façons de l'ouvrir, par ordre d'usage :

```rust
// 1. je ne traite qu'un cas
if let Some(v) = map.get("cle") {
    println!("{v}");
}

// 2. je traite les deux, et le compilateur verifie que je n'en oublie aucun
match map.get("cle") {
    Some(v) => out.push_str(v),
    None => out.push_str("<cle>"),
}

// 3. j'ai une valeur de repli
let v = map.get("cle").cloned().unwrap_or_default();
```

`match` est **exhaustif** : oublier `None` ne compile pas. C'est la même idée
que l'ownership — l'erreur n'est pas détectée, elle est rendue inexprimable.

## Pièges

- **`unwrap()` fait planter le programme** si la valeur est absente. Pratique
  dans un test ou un prototype, à bannir partout où l'absence est possible.
  `expect("message")` plante pareil, mais dit pourquoi.
- **`return` quitte toute la fonction**, pas seulement la boucle ou le bloc
  courant. Dans une boucle qui construit un résultat, on écrit dans
  l'accumulateur et on continue ; `break` sort de la boucle, `continue` passe au
  tour suivant.
- **Une condition ne se convertit pas** : `if !ma_chaine` déclenche
  `cannot apply unary operator ! to type String`. C'est la truthiness qui
  revient par la fenêtre.
- **`Option` n'est pas une erreur.** Absence légitime = `Option` ; opération qui
  peut échouer = `Result`. Les confondre rend les messages d'erreur inutiles.

## Voir aussi

- [match et enums](match-et-enums.md) — `Option` n'est qu'un enum comme un autre.
- [Gestion des erreurs](gestion-des-erreurs.md) — `Result`, et quand le préférer.
- [str, &str et String](chaines.md)
