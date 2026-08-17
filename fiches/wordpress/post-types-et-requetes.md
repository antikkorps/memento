---
title: "WordPress : custom post types et requêtes"
tags: [web, php]
created: 2026-08-17
updated: 2026-08-17
status: brouillon
---

## En bref

Déclarer un type de contenu personnalisé, interroger la base sans casser la
boucle principale, et afficher un extrait proprement.

## Custom post type

```php
<?php

function university_post_types() {
  register_post_type('event', array(
    'public' => true,
    'show_in_rest' => true,
    'labels' => array(
      'name' => 'Events',
      'add_new_item' => 'Add New Event',
      'edit_item' => 'Edit Event',
      'all_items' => 'All Events',
      'singular_name' => 'Event'
    ),
    'menu_icon' => 'dashicons-calendar'
  ));
}

add_action('init', 'university_post_types');
```

`show_in_rest => true` n'est pas optionnel en pratique : sans lui, le type de
contenu s'édite avec **l'ancien éditeur classique** au lieu de l'éditeur de
blocs. La propriété expose le type dans l'API REST, et c'est cette exposition
dont Gutenberg dépend.

`menu_icon` accepte les [dashicons](https://developer.wordpress.org/resource/dashicons/),
préfixés `dashicons-`.

## Custom query

Toujours refermer une requête personnalisée :

```php
$events = new WP_Query(array('post_type' => 'event'));

while ($events->have_posts()) {
  $events->the_post();
  // ...
}

wp_reset_postdata();
```

`wp_reset_postdata()` restaure la variable globale `$post` que la boucle a
écrasée. Sans lui, tout ce qui suit sur la page — la boucle principale, une
sidebar, un widget — travaille sur le dernier post de ta requête au lieu du
sien. Le bug est silencieux et se manifeste loin de sa cause : c'est ce qui le
rend pénible.

## Extrait : mieux que `the_excerpt()`

```php
<?php echo wp_trim_words(get_the_content(), 18); ?>
```

`the_excerpt()` impose la longueur définie par le thème, ajoute ses propres
points de suspension et applique des filtres qu'on ne contrôle pas.
`wp_trim_words()` prend un nombre de mots explicite et rend une chaîne — donc
tu décides du rendu.

`get_the_content()` plutôt que `the_content()` : le premier **retourne**, le
second **affiche**. Le préfixe `get_` marque cette distinction dans toute l'API
WordPress, et l'oublier produit du texte qui apparaît là où on ne l'attend pas.

## Voir aussi

- [Codex WordPress (fr)](https://codex.wordpress.org/fr:Accueil) — ancien, mais
  encore utile pour les fonctions de thème
- [WordPress Developer Resources](https://developer.wordpress.org/) — la
  référence à jour, celle à privilégier
