---
title: "findstr : le grep de cmd"
tags: [windows, terminal, texte]
created: 2026-09-03
updated: 2026-09-03
status: stable
---

## En bref

Le seul chercheur de texte disponible partout sous Windows, sans rien installer.
Il fait 80 % de [grep](../shell/grep.md) avec une syntaxe différente et des
regex volontairement pauvres. En PowerShell, l'équivalent moderne est
`Select-String`.

## Les cas de tous les jours

```bat
findstr /S /I /N "erreur" *.log            recursif, insensible a la casse, avec numeros
findstr /C:"connexion refusee" app.log     une phrase exacte, espaces compris
findstr /S /I /M /C:"password" *.config    ne lister que les fichiers concernes
findstr /V "^#" fichier.conf               exclure les lignes qui commencent par #
findstr /B /C:"OS Name" systeminfo.txt     debut de ligne seulement
ipconfig /all | findstr /I "adresse dns"   filtrer la sortie d'une commande
```

| Option | Effet |
| --- | --- |
| `/I` | insensible à la casse |
| `/S` | récursif dans les sous-dossiers |
| `/N` | numéro de ligne |
| `/M` | n'affiche que le nom des fichiers qui matchent |
| `/V` | inverse : les lignes qui **ne** matchent pas |
| `/C:"..."` | traite l'argument comme **une seule chaîne littérale** (*literal*) |
| `/L` | toutes les chaînes en littéral |
| `/R` | toutes les chaînes en regex (comportement par défaut) |
| `/B` `/E` | le motif doit être en début / fin de ligne |
| `/X` | la ligne entière doit correspondre |
| `/G:fichier` | lit les motifs dans un fichier, un par ligne |
| `/F:fichier` | lit la liste des fichiers à fouiller dans un fichier |
| `/P` | saute les fichiers contenant des caractères non imprimables |

## Les regex de findstr

Le jeu est minuscule, et c'est la principale source de surprise :

| Supporté | Sens |
| --- | --- |
| `.` | un caractère quelconque |
| `*` | zéro ou plus du caractère précédent |
| `^` `$` | début / fin de ligne |
| `[abc]` `[^abc]` `[a-z]` | classe de caractères |
| `\<` `\>` | début / fin de mot |
| `\x` | échappe le caractère `x` |

**Pas de `+`, pas de `?`, pas de `|`, pas de `()`, pas de `{n,m}`.** L'union se
fait autrement : plusieurs mots séparés par des espaces valent un OU.

```bat
findstr /I "erreur echec timeout" app.log     lignes contenant l'un des trois
findstr /I /C:"erreur fatale" app.log         la phrase exacte
```

## L'équivalent PowerShell

```powershell
Select-String -Pattern 'erreur' -Path *.log                    # avec chemin et numero de ligne
Select-String -Pattern 'erreur' -Path *.log -Context 2,2       # contexte avant/apres (le -C de grep)
Select-String -Pattern 'erreur' -Path *.log -SimpleMatch       # litteral, pas de regex
Get-ChildItem -Recurse -Filter *.config | Select-String 'password'
```

`Select-String` parle des **vraies** regex .NET (`+`, `|`, groupes, quantifieurs)
et renvoie des objets : `$_.Filename`, `$_.LineNumber`, `$_.Line`, `$_.Matches`.

## Pièges

- **Plusieurs mots entre guillemets = un OU, pas une phrase.**
  `findstr "erreur fatale"` cherche les lignes contenant `erreur` **ou**
  `fatale`. Pour la phrase, `/C:"erreur fatale"`. C'est l'erreur numéro un.
- **findstr ne lit pas l'UTF-16.** Or les redirections de PowerShell 5.1
  (`commande > sortie.txt`) écrivent en UTF-16 : `findstr` ne trouve alors
  strictement rien, sans le moindre message. Écrire avec
  `Out-File -Encoding utf8`, ou rester dans PowerShell avec `Select-String`.
- **Le motif est traité en regex par défaut.** Un chemin, une version, une IP
  contiennent des `.` et des `\` : utiliser `/C:` ou `/L` pour éviter les faux
  positifs silencieux.
- Sortie `0` si trouvé, `1` sinon, `2` en cas d'erreur — comme `grep`.
- Ne pas confondre avec **`find`**, plus ancien et plus pauvre : sensible à la
  casse par défaut, pas de regex, pas de récursif. Il garde une utilité, le
  compte de lignes :

  ```bat
  find /c /v "" fichier.txt          equivalent de wc -l
  ```

- `findstr /S` part du **dossier courant** : penser à s'y placer, ou passer un
  chemin dans le masque (`findstr /S "x" C:\app\*.log`).
- En PowerShell, `findstr` fonctionne toujours (c'est un vrai `.exe`), mais
  reçoit du texte déjà mis en forme pour l'affichage — colonnes tronquées
  comprises. Filtrer **avant** le formatage avec `Where-Object`.

## Voir aussi

- [grep : chercher dans les fichiers](../shell/grep.md)
- [dir : lister, trier et filtrer en cmd](dir.md)
- [PowerShell : objets, pipeline et repères](powershell.md)
- [Windows : reconnaissance système en ligne de commande](reconnaissance.md)
- <https://learn.microsoft.com/windows-server/administration/windows-commands/findstr>
