---
title: "Rust : propriété (*ownership*) et emprunts (*borrowing*)"
tags: [rust, depannage]
created: 2026-09-08
updated: 2026-09-08
status: brouillon
---

## En bref

Rust n'a ni ramasse-miettes (*garbage collector*) ni `free()` à écrire soi-même.
À la place : **chaque valeur a un propriétaire unique, et elle est libérée quand
ce propriétaire sort de portée.** Tout le reste — déplacement (*move*), emprunt
(*borrow*), durées de vie (*lifetimes*) — n'est que la conséquence de cette
règle.

Devant une erreur du compilateur, la seule question à se poser :
**est-ce que je *donne* cette valeur, ou est-ce que je la *prête* ?**

## Les règles, en entier

Propriété :

1. Chaque valeur a **exactement un** propriétaire.
2. L'affectation ou le passage à une fonction **transfère** la propriété (*move*).
3. Quand le propriétaire sort de portée, la valeur est libérée (`drop`).

Emprunt — à un instant donné, pour une même valeur :

4. Soit **plusieurs** emprunts partagés `&T` (lecture), soit **un seul** emprunt
   mutable `&mut T` (écriture). **Jamais les deux en même temps.**

La règle 4 est celle qui bloque tout le monde pendant deux semaines. Elle
n'existe pas pour embêter : c'est elle qui rend les data races impossibles à la
compilation.

## Déplacement (*move*) ou copie (*copy*)

```rust
let a = String::from("bonjour");
let b = a;                       // MOVE : a ne possede plus rien
println!("{a}");                 // erreur E0382 : borrow of moved value
```

```rust
let x = 5;
let y = x;                       // COPY : le type est petit et duplicable
println!("{x}");                 // OK, x est toujours valide
```

| Se copie (trait `Copy`) | Se déplace |
| --- | --- |
| `i32`, `u8`, `f64`, `bool`, `char` | `String`, `Vec<T>`, `Box<T>`, `HashMap` |
| `&T` (une référence partagée) | `&mut T` |
| un tuple dont **tous** les membres sont `Copy` | toute `struct` qui ne dérive pas `Copy` |

Le raccourci mental qui marche : **ce qui tient entièrement dans la pile
(*stack*) est copié ; ce qui possède de la mémoire sur le tas (*heap*) est
déplacé.**

## Emprunter plutôt que donner

```rust
fn longueur(s: &String) -> usize { s.len() }     // emprunt partage : lecture seule
```

```rust
let s = String::from("bonjour");
let n = longueur(&s);            // on prete
println!("{s} fait {n}");        // s est toujours a nous
```

Pour modifier, il faut `mut` **deux fois** : sur la variable *et* sur l'emprunt.

```rust
fn ajoute(s: &mut String) { s.push_str(" !"); }
```

```rust
let mut s = String::from("bonjour");     // 1. la variable est mutable
ajoute(&mut s);                          // 2. on prete en ecriture
```

Oublier l'un des deux donne `E0596 : cannot borrow as mutable`.

## La règle 4 en pratique

```rust
let mut s = String::from("x");
let r1 = &s;
let r2 = &s;                     // OK : autant de lecteurs qu'on veut
let r3 = &mut s;                 // erreur E0502 : un ecrivain pendant des lecteurs
println!("{r1} {r3}");
```

Mais ceci **compile**, et c'est le point que personne ne devine :

```rust
let mut s = String::from("x");
let r1 = &s;
println!("{r1}");                // dernier usage de r1 -> l'emprunt meurt ICI
let r3 = &mut s;                 // OK, plus aucun lecteur vivant
r3.push('y');
```

Un emprunt vit **jusqu'à sa dernière utilisation**, pas jusqu'à la fin du bloc
(c'est le *non-lexical lifetime*, NLL). Réflexe quand ça coince : rapprocher
l'usage de la déclaration, ou isoler le lecteur dans un bloc `{ }`.

## Boucler sans tout perdre

Le piège le plus fréquent des premiers jours :

```rust
let v = vec![1, 2, 3];
for n in v { }                   // MOVE : v est consomme par la boucle
println!("{v:?}");               // erreur E0382
```

```rust
let v = vec![1, 2, 3];
for n in &v { }                  // emprunt : v survit
for n in v.iter() { }            // identique, ecrit autrement
println!("{v:?}");               // OK
```

```rust
let mut v = vec![1, 2, 3];
for n in &mut v { *n *= 2; }     // emprunt mutable : on modifie sur place
```

## Signatures : prendre `&str`, rendre du possédé

Deux habitudes qui suppriment la moitié des erreurs avant qu'elles n'arrivent.

```rust
fn saluer(nom: &str) { }         // accepte &String ET &str ET un litteral
fn saluer(nom: &String) { }      // n'accepte que &String : inutilement restrictif
```

```rust
fn construire() -> String {      // rendre une valeur POSSEDEE
    String::from("bonjour")
}
fn construire() -> &str {        // erreur E0106 : reference vers quoi ?
    &String::from("bonjour")     // la valeur meurt a la fin de la fonction
}
```

Règle de pouce : **emprunter en entrée, posséder en sortie.**

## Décoder les erreurs du compilateur

C'est la table à rouvrir en vrai. Le code `E0xxx` est stable, `rustc --explain
E0382` en donne le détail hors ligne.

| Code | Message abrégé | Ce qui s'est passé | Réflexe |
| --- | --- | --- | --- |
| `E0382` | use of moved value | valeur donnée puis réutilisée | passer `&s` au lieu de `s`, sinon `.clone()` |
| `E0502` | cannot borrow as mutable, also borrowed as immutable | un lecteur est encore vivant | réordonner, ou enfermer le lecteur dans `{ }` |
| `E0499` | cannot borrow as mutable more than once | deux `&mut` simultanés | n'en garder qu'un vivant à la fois |
| `E0596` | cannot borrow as mutable | la variable n'est pas `mut` | `let mut s = …` |
| `E0106` | missing lifetime specifier | on renvoie une référence sans source | renvoyer une valeur possédée (`String`, `Vec`) |
| `E0507` | cannot move out of borrowed content | on sort une valeur d'un emprunt | `.clone()`, `.to_owned()`, ou `std::mem::take` |
| `E0505` | cannot move out of `s` because it is borrowed | on déplace pendant qu'on prête | déplacer après le dernier usage de l'emprunt |

Le compilateur propose presque toujours la correction sous `help:` — la lire
avant de chercher ailleurs, elle est juste dans 90 % des cas.

## Les échappatoires, assumées

```rust
let b = a.clone();               // copie profonde explicite : couteux mais franc
let s: String = "x".to_owned();  // &str -> String, meme idee
```

`.clone()` n'est pas une défaite. En début d'apprentissage, cloner pour avancer
puis revenir optimiser est une stratégie parfaitement raisonnable — le coût est
visible dans le code, ce qui est exactement le contrat de Rust.

Quand un seul propriétaire ne suffit vraiment pas (graphes, structures
partagées) : `Rc<T>` pour plusieurs propriétaires en lecture,
`RefCell<T>` pour déplacer la vérification d'emprunt à l'exécution,
`Rc<RefCell<T>>` pour les deux. À n'ouvrir qu'après avoir compris le reste : ces
outils déplacent l'erreur de la compilation vers un `panic!` en production.

## Pièges

- **`mut` sur la variable et `&mut` sur l'emprunt sont deux choses différentes.**
  `let mut s` dit « je peux réassigner ou muter s » ; `&mut s` dit « je prête le
  droit de muter ». Il faut les deux pour modifier via une fonction.
- **`for n in v` consomme `v`.** Sur un `Vec`, écrire `&v` par défaut ; ne
  consommer que quand on veut réellement se débarrasser du vecteur.
- **Une erreur signalée ligne 40 vient souvent de la ligne 12** — l'endroit où
  la valeur a été déplacée. Le compilateur affiche les deux ; lire la première
  annotation, pas la dernière.
- **`&String` en paramètre** ferme la porte aux littéraux `"..."`. Prendre
  `&str`, toujours, sauf besoin explicite de la `String` elle-même.
- **Un emprunt meurt à sa dernière utilisation.** Beaucoup d'erreurs
  disparaissent en déplaçant simplement un `println!` de trois lignes.
- **Le clone d'un `Vec<String>` clone chaque `String`.** Peu grave sur dix
  éléments, à surveiller sur cent mille.

## Voir aussi

- <https://doc.rust-lang.org/book/ch04-00-understanding-ownership.html> — le
  chapitre 4 du *Rust Book*, la source de vérité ; à lire en entier une fois.
- <https://jimskapt.github.io/rust-book-fr/ch04-00-understanding-ownership.html>
  — la traduction française du même chapitre.
- <https://doc.rust-lang.org/rust-by-example/scope.html> — *Rust by Example*, la
  même chose en code exécutable dans le navigateur.
- <https://github.com/rust-lang/rustlings> — exercices courts et corrigés ; la
  série `move_semantics` porte exactement sur cette fiche.
