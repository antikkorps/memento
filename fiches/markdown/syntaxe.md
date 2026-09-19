---
title: "Markdown : syntaxe et pièges de formatage"
tags: [markdown, redaction]
created: 2026-09-11
updated: 2026-09-11
status: brouillon
---

## En bref

L'aide-mémoire du formatage, pour les constructions qu'on retape assez rarement
pour les oublier — les liens en tête.

Le rendu de référence ici est celui de Forgejo et de GitHub, c'est-à-dire le
**GFM** (*GitHub Flavored Markdown*) : CommonMark, plus les tableaux, le barré,
les listes de tâches et les notes de bas de page. Ce qui est signalé « GFM »
ci-dessous ne marche pas dans tous les rendus.

## Liens et images

```md
[texte du lien](https://exemple.tld)
[texte du lien](https://exemple.tld "titre au survol")
[une autre fiche](../git/diff.md)
[une section de cette page](#pieges)
<https://exemple.tld>
![texte alternatif](../../assets/reseau/handshake.png)
[texte][cle]

[cle]: https://exemple.tld
```

Le moyen de ne plus hésiter sur l'ordre : **crochets = ce qu'on lit,
parenthèses = où ça mène.** Une image est le même motif avec un `!` devant, le
texte lisible devenant le texte alternatif.

- `<https://exemple.tld>` est un lien automatique (*autolink*) : les chevrons
  sont ce qui le rend cliquable. Une URL nue fonctionne en GFM, pas en
  CommonMark — les écrire évite d'avoir à savoir où l'on est.
- `[texte][cle]` avec sa définition plus bas est un lien de référence
  (*reference link*) : utile quand la même URL longue revient plusieurs fois, ou
  pour ne pas couper la lecture du paragraphe.
- L'ancre d'un titre se déduit du titre : minuscules, espaces remplacés par des
  tirets, ponctuation retirée, accents conservés. `## Liens et images` donne
  donc `#liens-et-images`. En cas de doute, copier le lien depuis le rendu.

## Emphase et code

```md
*italique* et _italique_ sont equivalents
**gras** et __gras__ aussi
***gras et italique***
~~barre~~ (GFM)
`code litteral`
``code contenant un ` backtick``
```

Un texte entre backticks n'est plus interprété du tout : c'est la solution à
tous les doutes d'échappement.

## Titres

```md
# Titre de niveau 1
## Titre de niveau 2
###### jusqu'au niveau 6
```

L'espace après les `#` est obligatoire. Un titre souligné de `===` ou de `---`
(*setext*) est une seconde syntaxe, limitée aux niveaux 1 et 2 — c'est la cause
du piège du séparateur, plus bas.

## Listes

```md
- puce
- autre puce
  - sous-puce, indentee de deux espaces

1. numerotee
1. la numerotation reelle est ignoree, tout `1.` marche

- [ ] tache a faire
- [x] tache faite
```

- `-`, `*` et `+` sont équivalents pour les puces ; s'en tenir à un seul par
  fichier.
- Une ligne vide **entre** les items rend la liste « lâche » (*loose*) : chaque
  item devient un paragraphe, ce qui aère le rendu. Sans ligne vide, la liste
  est compacte.
- Les listes de tâches (*task list*) sont du GFM.
- Toujours une ligne vide **avant** une liste : collée au paragraphe précédent,
  elle est absorbée dedans par une partie des rendus.

## Sauts de ligne

C'est l'oubli le plus courant : **un simple retour à la ligne ne se voit pas au
rendu.** Deux lignes consécutives forment un seul paragraphe.

```md
Une ligne vide separe deux paragraphes.

Deux espaces en fin de ligne forcent un retour a la ligne,  
comme ici.

Une contre-oblique en fin de ligne fait la meme chose,\
mais elle, au moins, se voit.
```

## Blocs de code

~~~md
```sh
echo bonjour
```
~~~

- Le mot après les trois backticks donne la coloration : `sh`, `md`, `json`,
  `text`, `diff`…
- Pour montrer un bloc **dans** un bloc, délimiter l'extérieur par `~~~` : les
  deux marqueurs sont équivalents et ne se ferment pas l'un l'autre. C'est
  exactement ce que fait le bloc ci-dessus.
- Quatre espaces d'indentation forment aussi un bloc de code, sans marqueur.
  C'est utile à savoir surtout pour comprendre le piège de la sous-liste trop
  indentée.

## Tableaux (GFM)

```md
| Colonne | Alignee a droite | Centree |
| --- | ---: | :---: |
| a | 1 | oui |
```

- La ligne de tirets est **obligatoire** : sans elle, il n'y a pas de tableau du
  tout, juste des lignes avec des barres verticales.
- L'alignement se règle par la position des `:` dans cette ligne.
- Les colonnes n'ont pas besoin d'être alignées dans la source ; c'est du
  confort de lecture, pas de la syntaxe.
- Un `|` dans une cellule doit être échappé en `\|`, **y compris à l'intérieur
  de backticks**.
- Pas de retour à la ligne dans une cellule : `<br>`, ou rien.

## Citations, séparateurs, notes

```md
> une citation
>> une citation imbriquee

---

Une affirmation qui demande une source[^1].

[^1]: la source, en bas de page.
```

`---`, `***` et `___` seuls sur leur ligne donnent tous les trois un filet
horizontal (*horizontal rule*). Les notes de bas de page (*footnote*) sont du
GFM.

## HTML

```md
Appuyer sur <kbd>Ctrl</kbd> + <kbd>C</kbd>.

<details>
<summary>Replie par defaut</summary>

Du markdown *interprete*, grace a la ligne vide au-dessus.

</details>
```

## Échapper un caractère

Une contre-oblique devant le caractère le rend littéral. Les caractères
échappables sont ceux qui ont un sens en markdown :

```md
\\ \` \* \_ \{ \} \[ \] \( \) \# \+ \- \. \! \| \~
```

## Pièges

- **`---` juste sous une ligne de texte transforme cette ligne en titre.**
  C'est la syntaxe *setext*, et elle l'emporte sur le séparateur. Toujours une
  ligne vide avant un filet horizontal. Le même mécanisme explique qu'un
  frontmatter mal fermé fasse apparaître un gros titre en haut de la fiche.
- **Les deux espaces de fin de ligne sont invisibles et fragiles.** La plupart
  des éditeurs et des formateurs suppriment les blancs de fin à
  l'enregistrement, ce qui casse le retour à la ligne sans rien signaler.
  Préférer `\`, ou un vrai paragraphe.
- **`_` ne coupe pas un mot, `*` si.** `nom_de_variable` traverse le rendu
  intact, mais `a*b*c` produit un `b` en italique. Dans le doute, backticks.
- **Sur-indenter transforme une liste en bloc de code.** Quatre espaces sous un
  paragraphe, c'est du code ; pour imbriquer une sous-liste, deux espaces
  suffisent et sont plus sûrs.
- **Le markdown dans un bloc HTML n'est pas interprété sans ligne vide.**
  Un `*mot*` collé sous un `<summary>` ou un `<div>` ressort tel quel, astérisques
  comprises.
- **Une URL contenant un espace ou une parenthèse casse le lien.** L'encadrer de
  chevrons — `[doc](<mon fichier (1).pdf>)` — ou encoder les caractères (`%20`).
- **`[[wikilink]]` n'est pas du markdown.** C'est une extension d'outil, qui ne
  s'affiche nulle part ailleurs ; ce dépôt l'interdit explicitement au profit
  des liens relatifs.

## Voir aussi

- [Conventions du dépôt](../../CONVENTIONS.md) — les règles de forme propres aux
  fiches : liens relatifs vérifiés par la CI, lignes de code collables.
- <https://commonmark.org/help/> — la référence courte, avec un tutoriel
  interactif de dix minutes.
- <https://github.github.com/gfm/> — la spécification GFM, pour trancher un cas
  limite (tableaux, barré, notes).
