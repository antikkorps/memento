---
title: "Rust : gestion des erreurs (Result, Option, ?)"
tags: [rust]
created: 2026-09-22
updated: 2026-09-22
status: stable
---

## En bref

Deux types pour l'absence et l'échec. `Option<T>` = une valeur **ou rien**
(`Some(v)` / `None`). `Result<T, E>` = **succès ou erreur** (`Ok(v)` / `Err(e)`).
Le réflexe : « ça peut manquer » → `Option` ; « ça peut échouer avec une
raison » → `Result`. L'opérateur `?` propage l'erreur (*error handling*) vers
l'appelant sans l'écrire à la main.

## Récupérer la valeur

```rust
let x: Option<i32> = Some(5);
x.unwrap();              // 5 — mais PANIQUE si None
x.expect("x manquant");  // idem, avec un message d'erreur
x.unwrap_or(0);          // 0 si None, sinon la valeur
x.unwrap_or_else(|| calcul_couteux());   // pareil, mais calcule seulement si None
x.unwrap_or_default();   // la valeur par defaut du type (0, "", vec vide...)
```

## L'opérateur `?` : propager l'erreur

```rust
use std::fs;

fn lire(chemin: &str) -> Result<String, std::io::Error> {
    let contenu = fs::read_to_string(chemin)?;   // si Err, return Err tout de suite
    Ok(contenu)
}
```

`?` sur un `Result` : `Ok(v)` donne `v` ; `Err(e)` fait `return Err(e)`. Il marche
aussi sur `Option` (un `None` fait `return None`). **La fonction doit renvoyer un
type compatible** — d'où le `-> Result<...>`. Dans `main`, écrire
`fn main() -> Result<(), Box<dyn std::error::Error>>`.

## Aiguiller avec match

```rust
match diviser(10, 2) {
    Ok(v)  => println!("= {v}"),
    Err(e) => eprintln!("erreur : {e}"),
}
```

## Convertir entre les deux

```rust
opt.ok_or("valeur absente")?;              // Option -> Result (avec l'erreur donnee)
res.map_err(|e| format!("echec : {e}"))?;  // changer le TYPE de l'erreur
res.ok();                                  // Result -> Option (jette l'erreur)
```

| Méthode | Effet |
| --- | --- |
| `map` | transforme la valeur de succès, laisse l'erreur |
| `and_then` | enchaîne une opération qui peut elle-même échouer |
| `unwrap_or` / `unwrap_or_else` | valeur par défaut |
| `ok_or` | `Option` → `Result` |
| `map_err` | transforme l'erreur (unifier plusieurs types) |
| `?` | propage l'erreur à l'appelant |

## Pièges

- **`unwrap` / `expect` PANIQUENT** sur `None` / `Err`. Acceptable en prototype
  ou pour un cas « logiquement impossible » ; à bannir du code qui doit tenir —
  utiliser `?` ou `match`.
- `?` **exige** que la fonction renvoie `Result` (ou `Option`) compatible. Sinon,
  erreur de compilation, pas de conversion magique.
- **Mélanger des types d'erreur** différents : les unifier via `map_err`, ou
  renvoyer `Box<dyn std::error::Error>`, ou une [enum d'erreur](match-et-enums.md).

## Voir aussi

- [Rust : match et enums (filtrage par motif)](match-et-enums.md)
- [Rust : ownership et emprunts](ownership-et-emprunts.md)
- <https://doc.rust-lang.org/book/ch09-00-error-handling.html>
