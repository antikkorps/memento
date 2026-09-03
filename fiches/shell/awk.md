---
title: "awk : colonnes, filtres et calculs"
tags: [terminal, texte]
created: 2026-09-02
updated: 2026-09-02
status: stable
---

## En bref

Pour `awk`, une ligne est un **tableau de champs**. Dès qu'on pense « colonne
3 », « somme », « compter par clé », c'est lui — et pas [sed](sed.md).

## La structure

```sh
awk 'BEGIN {...} {...} END {...}' fichier
```

Trois temps : avant la première ligne, pour chaque ligne, après la dernière.
Tout le reste en découle. Les variables se retiennent en quatre lignes :

| Variable | Sens |
| --- | --- |
| `$0` | la ligne entière |
| `$1`, `$2`… | les champs |
| `$NF` | le **dernier** champ (`$(NF-1)` : l'avant-dernier) |
| `NF` | le **nombre** de champs de la ligne |
| `NR` | le numéro de la ligne courante |
| `FS` / `OFS` | séparateur d'entrée / de sortie |

## Colonnes

```sh
awk '{print $1, $3}' f                    # champs 1 et 3
awk -F: '{print $1}' /etc/passwd          # choisir le separateur d'entree
awk -F'\t' -v OFS=, '{print $1,$2}' f     # TSV vers CSV
awk '{printf "%-20s %6.2f\n", $1, $2}' f  # mise en forme en colonnes
awk '{print NF}' f                        # nombre de champs par ligne
```

La virgule dans `print $1, $3` insère `OFS` ; sans elle, les champs sont collés.

## Filtrer

```sh
awk 'NR==1 {next} {print}' f       # sauter la ligne d'entete
awk 'NR>=10 && NR<=20' f           # plage de lignes
awk '$3 > 100' f                   # filtrer sur une valeur numerique
awk '/erreur/ {print $2}' f        # filtrer par motif, puis extraire
awk -F: '$3>=1000 {print $1}' /etc/passwd   # les utilisateurs humains
awk 'NF==0' f                      # les lignes vides
awk 'length > 80' f                # les lignes trop longues
awk -v seuil=100 '$2 > seuil' f    # passer une variable du shell a awk
```

Un motif sans bloc `{...}` sous-entend `{print}` : `awk '$3 > 100' f` suffit.

## Calculer

```sh
awk '{s+=$2} END {print s}' f              # somme d'une colonne
awk '{s+=$1} END {print s/NR}' f           # moyenne
awk '{a[$1]++} END {for (k in a) print a[k], k}' f | sort -rn   # compter par cle
awk '!vu[$0]++' f                          # dedoublonner SANS trier (garde l'ordre)
```

Les tableaux associatifs sont ce qui distingue vraiment `awk` du reste : c'est
la mémoire entre les lignes. `!vu[$0]++` est l'idiome à connaître — la première
occurrence d'une ligne donne `vu=0` (donc vrai après négation, donc affichée),
les suivantes sont muettes.

## En bout de pipe

C'est là qu'il sert le plus souvent :

```sh
ss -tulpn | awk 'NR>1 {print $5}'          # les adresses en ecoute
du -s * | awk '$1 > 1e6 {print $2}'        # ce qui depasse ~1 Go
node scripts/index.js --tag reseau | awk '{print $1}'
```

## Pièges

- **`NF` et `NR` se confondent** : `NF` = nombre de champs (largeur), `NR` =
  numéro de ligne (hauteur).
- **Guillemets** : le programme `awk` va entre **apostrophes simples**. Avec des
  guillemets doubles, le shell remplace `$1` par un argument du script avant
  qu'`awk` ne le voie. Pour injecter une valeur, `-v nom=valeur`, jamais
  l'interpolation.
- Par défaut, le séparateur est « une suite d'espaces ou de tabulations », et
  les champs vides d'un CSV **ne comptent pas**. Pour du CSV réel (virgules,
  guillemets, champs vides), utiliser un vrai parseur — `awk -F,` ment dès
  qu'un champ contient une virgule.
- `$1` non numérique vaut `0` dans une comparaison numérique : une ligne
  d'en-tête fausse silencieusement une somme. D'où le `NR==1 {next}`.
- **Au-delà de trois lignes d'awk, passer à Python.** Le seuil n'est pas la
  difficulté, c'est la relecture dans six mois.

## Voir aussi

- [sed ou awk : lequel choisir](sed-ou-awk.md)
- [sed : substituer et éditer des lignes](sed.md)
- [grep : chercher dans les fichiers](grep.md)
- <https://www.gnu.org/software/gawk/manual/gawk.html>
