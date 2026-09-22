---
title: "Rust : match et enums (filtrage par motif)"
tags: [rust]
created: 2026-09-22
updated: 2026-09-22
status: stable
---

## En bref

Un `enum` est un type qui prend **une forme parmi plusieurs**. `match` filtre par
motif (*pattern matching*) et il est **exhaustif** : le compilateur exige que
tous les cas soient traités. Le réflexe : « une valeur qui est soit A, soit B,
soit C » → un `enum` + un `match`.

## Déclarer un enum

```rust
enum Feu { Rouge, Orange, Vert }

enum Message {                    // les variantes peuvent porter des donnees
    Quitter,
    Ecrire(String),              // une variante-tuple
    Deplacer { x: i32, y: i32 }, // une variante-structure
}
```

## match : filtrer et extraire

```rust
let action = match feu {
    Feu::Rouge  => "stop",
    Feu::Orange => "ralentis",
    Feu::Vert   => "roule",
};                                // exhaustif : tous les cas, ou `_`

match msg {
    Message::Quitter            => return,
    Message::Ecrire(texte)      => println!("{texte}"),  // lie la donnee interne
    Message::Deplacer { x, y }  => deplacer(x, y),
}
```

## if let / while let : un seul cas compte

```rust
if let Some(v) = option {         // au lieu d'un match a deux branches
    println!("{v}");
}

while let Some(x) = pile.pop() {  // repeter TANT QUE ca correspond
    traiter(x);
}
```

## Motifs et gardes

```rust
match n {
    0        => "zero",
    1..=9    => "un chiffre",     // un intervalle
    x if x < 0 => "negatif",      // une garde : condition en plus du motif
    _        => "grand",          // le joker : tout le reste
}
```

| Motif | Ce qu'il capture |
| --- | --- |
| `_` | n'importe quoi (le reste), sans lier |
| `1..=9` | un intervalle de valeurs |
| `Some(x)` / `Ok(v)` | le cas **et** lie la valeur interne |
| `x if cond` | le motif seulement si la garde est vraie |
| `A \| B` | plusieurs motifs pour une même branche |

## Pièges

- **`match` est exhaustif** : oublier un cas est une **erreur de compilation** —
  c'est une garantie, pas une contrainte. `_` capture le reste quand c'est voulu.
- **`if let` jette silencieusement** les autres cas : pratique, mais on perd
  l'exhaustivité. À réserver au cas où une seule variante t'intéresse.
- Un `enum` **à données** (comme `Message`) remplace avantageusement un « type +
  champs parfois nuls » : chaque variante ne porte que ce qui la concerne.

## Voir aussi

- [Rust : gestion des erreurs (Result, Option, ?)](gestion-des-erreurs.md)
- [Rust : ownership et emprunts](ownership-et-emprunts.md)
- <https://doc.rust-lang.org/book/ch06-00-enums.html>
