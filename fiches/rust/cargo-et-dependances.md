---
title: "Rust : cargo et gestion des dépendances"
tags: [rust]
created: 2026-09-22
updated: 2026-09-22
status: stable
---

## En bref

`cargo` est le couteau suisse : il compile, lance, teste et gère les
dépendances. **Reprendre un projet après une pause** tient en un réflexe :
`cargo check` pour vérifier que tout compile (le plus rapide), puis `cargo run`
ou `cargo test`. Ajouter une dépendance = `cargo add`, **jamais éditer
`Cargo.toml` à la main**.

## Reprendre un projet (la séquence)

```sh
cargo check              # compile deps + ton code SANS produire le binaire : le + rapide pour « ca compile ? »
cargo run                # compile et lance
cargo test               # lance les tests
cargo build              # binaire de debug dans target/debug/
cargo build --release    # binaire optimise dans target/release/ (compile lent, execute vite)
```

Après un `git clone`, `cargo check` **récupère les dépendances tout seul** (cache
dans `~/.cargo`) : pas d'étape « install » séparée. `check` ne produit pas de
binaire → bien plus rapide que `build` pour la boucle « est-ce que ça compile ».

## Gérer les dépendances

```sh
# gestion des dependances : ajouter, retirer, mettre a jour, inspecter
cargo add serde --features derive   # ajoute a Cargo.toml ET resout la version
cargo add tokio@1.35                 # epingler une version precise
cargo remove serde
cargo update                         # rafraichit Cargo.lock dans les bornes de Cargo.toml
cargo tree                           # arbre des dependances : qui tire quoi
```

`cargo add` (intégré depuis Rust 1.62) écrit la bonne ligne pour toi et devine la
dernière version compatible — plus fiable que l'éditer à la main.

## Anatomie de `Cargo.toml`

```toml
[package]
name = "projet"
version = "0.1.0"
edition = "2024"        # l'edition du langage (2015 / 2018 / 2021 / 2024)

[dependencies]
serde = { version = "1.0", features = ["derive"] }
anyhow = "1.0"          # forme courte quand il n'y a pas de features

[dev-dependencies]      # uniquement pour les tests et benchmarks, pas dans le binaire final
```

| Écriture de version | Sens |
| --- | --- |
| `"1.0"` (= `"^1.0"`) | compatible : `>=1.0.0` et `<2.0.0` — **le défaut** |
| `"=1.0.5"` | exactement cette version |
| `"~1.0"` | `>=1.0.0` et `<1.1.0` |
| `"*"` | n'importe laquelle — à éviter |

## `Cargo.toml` vs `Cargo.lock`

- **`Cargo.toml`** : ce que **tu demandes** (les bornes). Édité, via `cargo add`.
- **`Cargo.lock`** : les versions **exactes** résolues. Généré au premier build,
  rafraîchi par `cargo update`.
- **À committer** : oui pour une appli / un binaire (build reproductible) ;
  aujourd'hui recommandé de le committer aussi pour une bibliothèque (*library*).

## Structure d'un projet

```
Cargo.toml     le manifeste — tu l'edites via cargo add
Cargo.lock     versions exactes — genere au premier build
src/main.rs    un binaire  (ou src/lib.rs pour une bibliotheque)
target/        artefacts de compilation — dans .gitignore, JAMAIS commite
```

## Pièges

- **`target/`** est énorme et entièrement régénérable : jamais commité
  (`cargo new` l'ajoute d'office à `.gitignore`).
- **`cargo check` ≠ `cargo build`** : `check` s'arrête à l'analyse, ne produit
  pas d'exécutable. C'est lui, la boucle rapide.
- **`cargo update`** ne franchit pas les bornes de `Cargo.toml` : pour passer à
  une version majeure, il faut d'abord changer la borne (ou `cargo add crate@2`).
- Une **caisse** (*crate*) = une dépendance publiée sur `crates.io` ; le mot
  désigne aussi ton propre paquet compilé.

## Voir aussi

- [Rust : gestion des erreurs (Result, Option, ?)](gestion-des-erreurs.md)
- [Rust : ownership et emprunts](ownership-et-emprunts.md)
- <https://doc.rust-lang.org/cargo/>
