---
title: "dir : lister, trier et filtrer en cmd"
tags: [windows, terminal]
created: 2026-09-03
updated: 2026-09-03
status: stable
---

## En bref

`dir` trie et filtre **par attribut**, mais ne sait pas filtrer par date ni par
taille. C'est sa limite exacte : dès qu'on parle « modifié il y a plus de 7
jours » ou « plus gros que 100 Mo », c'est `forfiles` ou PowerShell.

## Trier : `/O`

Le `-` inverse l'ordre.

```bat
dir /O:D          par date, ancien -> recent
dir /O:-D         par date, recent -> ancien
dir /O:S          par taille croissante
dir /O:-S         par taille decroissante
dir /O:N          par nom (alphabetique)
dir /O:E          par extension
dir /O:G          dossiers d'abord
dir /O:GN         dossiers d'abord, puis tri par nom
```

Les lettres se cumulent dans l'ordre de priorité : `/O:G-D` = dossiers d'abord,
puis du plus récent au plus ancien.

## Filtrer : `/A`

```bat
dir /A            tout, y compris caches et systeme
dir /A:H          uniquement les fichiers caches
dir /A:D          uniquement les dossiers
dir /A:-D         uniquement les fichiers (pas les dossiers)
dir /A:S          fichiers systeme
dir /A:R          lecture seule
dir /A:L          points d'analyse : liens symboliques et jonctions
dir /A:HD         caches ET dossiers (les lettres se cumulent)
```

| Lettre | Attribut |
| --- | --- |
| `D` | dossier |
| `H` | caché |
| `S` | système |
| `R` | lecture seule |
| `A` | archive (bit « à sauvegarder ») |
| `I` | non indexé par la recherche |
| `L` | point d'analyse — lien symbolique, jonction, OneDrive à la demande |

## Les autres options utiles

```bat
dir /S            recursif dans les sous-dossiers
dir /B            format brut : juste les noms, sans en-tete ni resume
dir /B /S         chemins absolus, un par ligne -- la forme a piper
dir /T:C          affiche la date de creation
dir /T:A          affiche la date de dernier acces
dir /T:W          affiche la date de modification (defaut)
dir /Q            affiche le proprietaire de chaque fichier
dir /R            affiche les flux de donnees alternatifs (ADS)
dir /X            affiche les noms courts 8.3
dir /P            pagine
dir /W            affichage en colonnes
```

Ça se combine. Les trois formes que j'écris réellement :

```bat
dir /A:-D /O:-S /S            tous les fichiers, du plus gros au plus petit
dir /B /S *.log               tous les .log en chemins absolus
dir /A:D /B                   la liste des sous-dossiers, un par ligne
```

## Filtrer par date : `forfiles`

```bat
forfiles /P C:\chemin /S /M *.log /D -7 /C "cmd /c echo @path @fdate"
```

| Option | Effet |
| --- | --- |
| `/P` | dossier de départ (défaut : le dossier courant) |
| `/S` | récursif |
| `/M` | masque de nom (défaut : `*`) |
| `/D` | filtre sur la date de **dernière modification** |
| `/C` | commande à exécuter pour chaque fichier trouvé |

Variables utilisables dans le `/C` :

| Variable | Contenu |
| --- | --- |
| `@path` | chemin absolu |
| `@relpath` | chemin relatif au `/P` |
| `@file` | nom du fichier avec extension |
| `@fname` | nom sans extension |
| `@ext` | extension, sans le point |
| `@fsize` | taille en octets |
| `@fdate` `@ftime` | date et heure de modification |
| `@isdir` | `TRUE` si c'est un dossier |

Exemple courant — purger des logs, en testant d'abord avec `echo` :

```bat
forfiles /P C:\logs /S /M *.log /D -30 /C "cmd /c echo @path"
forfiles /P C:\logs /S /M *.log /D -30 /C "cmd /c del @path"
```

## Le même besoin en PowerShell

Beaucoup plus lisible dès qu'il y a un vrai filtre :

```powershell
Get-ChildItem -Force                                    # equivalent de dir /a
Get-ChildItem -Recurse -File | Sort-Object Length -Descending | Select-Object -First 10 FullName, Length
Get-ChildItem -Recurse -File | Where-Object LastWriteTime -lt (Get-Date).AddDays(-7)
Get-ChildItem -Recurse -File | Where-Object Length -gt 100MB
```

## Pièges

- **`/D -7` et `/D +7` ne sont pas symétriques.** `-7` = modifié il y a **plus**
  de 7 jours. `+7` = modifié à une date ≥ aujourd'hui + 7 jours, donc dans le
  futur : sur des fichiers normaux, ça ne renvoie rien. Pour « modifié depuis
  telle date », il faut une date explicite : `/D +01/09/2026`. Le format de
  date suit la **locale** de la machine (`jj/mm/aaaa` en français).
- **En PowerShell, `dir` est un alias de `Get-ChildItem`** : aucune de ces
  options ne marche, `dir /b` échoue avec « Impossible de trouver le chemin ».
  Soit on utilise l'équivalent PowerShell, soit on force le vrai `dir` avec
  `cmd /c dir /b`.
- **`dir /A:H` ne montre *que* les cachés**, alors que `dir /A` tout court
  montre **tout**. Le `:` change complètement le sens.
- `/B` supprime l'en-tête, les tailles et la ligne de résumé. C'est ce qui le
  rend pipe-able — et ce qui fait que `dir /B` seul n'affiche aucune taille,
  même avec `/O:-S` (le tri a bien lieu, il n'est juste pas visible).
- **`/T:A` est peu fiable** : la mise à jour de la date de dernier accès est
  souvent désactivée sur NTFS. Vérifier avec
  `fsutil behavior query DisableLastAccess`.
- `dir /S` sur une grosse arborescence crache des « Accès refusé » : les
  rediriger avec `2>nul`.
- La variable d'environnement `DIRCMD` injecte des options par défaut dans tous
  les `dir`. Si un `dir` se comporte bizarrement sur une machine, `set DIRCMD`
  est le premier réflexe.
- `forfiles` sort en `1` avec « ERROR: No files found » quand rien ne
  correspond — comme `grep`, donc à gérer dans un script.
- Dans le `/C`, `@path` et consorts sont renvoyées **entre guillemets**. Pour
  insérer un guillemet littéral dans la commande, utiliser `0x22`.

## Voir aussi

- [findstr : le grep de cmd](findstr.md)
- [cmd : historique, redirections et raccourcis](cmd.md)
- [PowerShell : objets, pipeline et repères](powershell.md)
- [Équivalences bash / cmd / PowerShell](equivalences-bash.md)
- <https://learn.microsoft.com/windows-server/administration/windows-commands/dir>
