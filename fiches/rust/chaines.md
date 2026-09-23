---
title: "Rust : str, &str et String"
tags: [rust, depannage]
created: 2026-09-23
updated: 2026-09-23
status: stable
---

## En bref

Il y a trois formes de texte en Rust, et on n'en écrit jamais qu'une seule
directement : **`str` nu ne s'utilise pas**. On manipule soit `&str` (une vue
empruntée), soit `String` (du texte possédé).

| Type | Ce que c'est | Quand |
| --- | --- | --- |
| `str` | du texte de **taille inconnue** à la compilation | jamais seul |
| `&str` | une **vue** sur du texte appartenant à quelqu'un d'autre | paramètres de fonction, littéraux |
| `String` | du texte **possédé**, allouable et modifiable | champs de struct, valeurs qu'on garde |

```rust
// literal = &str ; to_string() alloue une String qui s'appartient
let vue: &str = "bonjour";
let possede: String = vue.to_string();
```

## Le message d'erreur qui envoie ici

```text
error[E0277]: the size for values of type `str` cannot be known at compilation time
  = help: the trait `Sized` is not implemented for `str`
```

Traduction : tu as écrit `str` tout court, par exemple comme champ de struct.
Rust doit savoir combien de place réserver, il refuse. Les deux sorties :

```rust
struct Hole { name: String }        // possede : simple, une allocation
struct Hole<'a> { name: &'a str }   // emprunte : zero copie, mais duree de vie
```

**Choisir `String` par défaut**, sauf besoin de performance mesuré : `&str` dans
une struct force à déclarer une durée de vie (*lifetime*) et à la propager
partout où la struct circule. C'est un concept à aborder pour lui-même, pas en
passant.

## Convertir

| Depuis | Vers | Comment |
| --- | --- | --- |
| `&str` | `String` | `s.to_string()` ou `String::from(s)` |
| `String` | `&str` | `&s` ou `s.as_str()` |
| plusieurs morceaux | `String` | `format!("{a}/{b}")` |

## Construire une chaîne morceau par morceau

```rust
let mut out = String::new();
out.push_str("sed 's/");    // ajoute un &str
out.push('/');              // ajoute UN caractere
```

C'est la forme à privilégier quand on assemble : on écrit dans une chaîne neuve
au lieu de retoucher l'originale — et ce qu'on vient d'écrire n'est jamais
relu.

## Découper

```rust
let bout = &texte[3..10];   // les OCTETS 3 a 9, pas les caracteres
```

Trois choses à savoir, et elles surprennent toutes les trois :

- les indices sont des **octets**, pas des caractères ;
- leur type est **`usize`** — celui que renvoient `len()` et `find()`, et le
  seul qu'accepte le découpage. Pas `u16`, pas `i32` ;
- **couper au milieu d'un caractère UTF-8 fait paniquer** le programme à
  l'exécution. Sur de l'ASCII on ne le voit jamais ; sur « é » (deux octets),
  si.

Pour raisonner en caractères : `texte.chars()` — et `texte.chars().count()`
pour les compter, `len()` donnant un nombre d'octets.

## Pièges

- **`s.len()` compte des octets.** `"été".len()` vaut 5, pas 3.
- **`==` compare le contenu**, pas l'adresse : `String == &str` fonctionne, il
  n'y a pas d'`equals()` à chercher.
- **Une `String` ne s'utilise pas comme condition** : `if s` n'existe pas, voir
  [conditions et valeurs absentes](conditions-et-valeurs-absentes.md).
- **Un index négatif n'existe pas** (`usize` n'est pas signé). Le dernier
  caractère, c'est `s.chars().last()`.

## Voir aussi

- [Propriété (*ownership*) et emprunts](ownership-et-emprunts.md) — pourquoi
  `&str` implique une durée de vie et pas `String`.
