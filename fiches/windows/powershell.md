---
title: "PowerShell : objets, pipeline et repères"
tags: [windows, terminal]
created: 2026-09-03
updated: 2026-09-03
status: stable
---

## En bref

La différence tient en une phrase : **un pipe bash transporte du texte, un pipe
PowerShell transporte des objets.** Tout le reste en découle — on ne découpe
plus des colonnes, on accède à des propriétés.

## Se repérer

```powershell
$PSVersionTable                       # 5.1 = livre avec Windows, 7.x = installe a cote
Get-Command *service*                 # trouver une commande
Get-Command -Noun Process             # toutes les commandes qui manipulent des processus
Get-Help Get-ChildItem -Examples      # les exemples, ce qu'on veut vraiment
Get-Help Get-ChildItem -Online
Get-ChildItem | Get-Member            # LA commande cle : quelles proprietes existent
```

Les noms suivent tous `Verbe-Nom` au singulier : `Get-`, `Set-`, `New-`,
`Remove-`, `Start-`, `Stop-`, `Test-`. Connaître le verbe suffit souvent à
deviner la commande.

Deux versions coexistent : `powershell.exe` (5.1, présent partout) et
`pwsh.exe` (7.x, à installer). Le jour d'un examen ou sur une machine inconnue,
partir du principe qu'on est en **5.1**.

## Filtrer, trier, choisir

```powershell
Get-Process | Where-Object CPU -gt 100
Get-Process | Where-Object { $_.CPU -gt 100 -and $_.Name -like 'chrome*' }
Get-Process | Sort-Object CPU -Descending | Select-Object -First 10 Name, CPU, Id
Get-Service | Where-Object Status -eq 'Running' | Measure-Object
Get-ChildItem -Recurse -File | Measure-Object Length -Sum -Average -Maximum
Get-EventLog -LogName System -Newest 50 | Group-Object Source | Sort-Object Count -Descending
Get-Process | Select-Object -ExpandProperty Name        # la valeur brute, plus l'objet
```

| Commande | Rôle | Alias |
| --- | --- | --- |
| `Where-Object` | filtre les objets | `where`, `?` |
| `Select-Object` | choisit des propriétés / les N premiers | `select` |
| `Sort-Object` | trie | `sort` |
| `Measure-Object` | compte, somme, moyenne | `measure` |
| `Group-Object` | regroupe et compte par valeur | `group` |
| `ForEach-Object` | agit sur chaque objet | `foreach`, `%` |

## Les opérateurs de comparaison

Il n'y a **pas** de `>` ni de `<` : ce sont des redirections.

| Opérateur | Sens |
| --- | --- |
| `-eq` `-ne` | égal / différent |
| `-gt` `-ge` `-lt` `-le` | comparaisons numériques |
| `-like` `-notlike` | joker `*` et `?` |
| `-match` `-notmatch` | regex .NET, remplit `$Matches` |
| `-contains` `-in` | appartenance à une collection |
| `-not` `!` `-and` `-or` | logique |

Ils sont **insensibles à la casse** par défaut ; le préfixe `c` force la
sensibilité (`-ceq`, `-cmatch`).

## Sortir du pipeline

```powershell
... | Format-Table -AutoSize          # affichage large
... | Format-List *                   # toutes les proprietes, une par ligne
... | Out-GridView                    # tableau filtrable en fenetre
... | Export-Csv rapport.csv -NoTypeInformation -Encoding UTF8
... | ConvertTo-Json -Depth 3
... | Out-File sortie.txt -Encoding utf8
```

## Fichiers et texte

```powershell
Get-Content app.log -Tail 20 -Wait            # le tail -f de Windows
Get-Content app.log | Select-String 'erreur'
(Get-Content conf.ini) -replace 'ancien','nouveau' | Set-Content conf.ini
Test-Path C:\chemin\fichier.txt
New-Item -ItemType Directory -Path C:\nouveau
```

## Pièges

- **`Format-*` doit être la dernière commande du pipeline.** Elle ne renvoie
  plus vos objets mais des instructions de mise en page : tout ce qui suit
  (`Export-Csv`, `Where-Object`) reçoit du charabia. Règle : formater en
  dernier, exporter à la place de formater.
- **L'affichage ment.** Au-delà de quatre propriétés PowerShell bascule en
  liste, tronque les colonnes avec `…`, et n'affiche qu'un sous-ensemble des
  propriétés. Ce n'est pas ce que contient l'objet : `Get-Member` et
  `Format-List *` disent la vérité.
- **Les alias masquent les commandes Windows.** `where` est `Where-Object`, pas
  `where.exe` ; `sort` est `Sort-Object`, pas `sort.exe` ; en 5.1, `curl` et
  `wget` sont `Invoke-WebRequest`. Pour le vrai binaire, mettre l'extension :
  `where.exe python`, `curl.exe -I https://exemple.tld`.
- **`Where-Object` a deux syntaxes.** La forme courte
  (`Where-Object Length -gt 1MB`) n'accepte qu'**une seule** comparaison ; dès
  qu'il y a un `-and`, il faut le bloc `{ $_.Length -gt 1MB -and ... }`.
- **`Select-Object Name` renvoie un objet, pas une chaîne.** Pour la valeur
  brute — celle qu'on passe à une autre commande — c'est
  `-ExpandProperty Name`.
- **En 5.1, les redirections écrivent en UTF-16.** `commande > f.txt` produit un
  fichier que `findstr` ou un outil Unix ne savent pas lire. Toujours
  `Out-File -Encoding utf8` si le fichier doit ressortir de PowerShell.
- **`Get-WmiObject` n'existe plus en PowerShell 7** : son remplaçant est
  `Get-CimInstance`, à préférer partout.
- `Set-ExecutionPolicy` bloque l'exécution des `.ps1`, pas celle des commandes.
  Ce n'est **pas** une barrière de sécurité, seulement un garde-fou contre le
  double-clic accidentel.

## Voir aussi

- [Équivalences bash / cmd / PowerShell](equivalences-bash.md)
- [findstr : le grep de cmd](findstr.md)
- [dir : lister, trier et filtrer en cmd](dir.md)
- [Windows : reconnaissance système en ligne de commande](reconnaissance.md)
- <https://learn.microsoft.com/powershell/scripting/learn/ps101/00-introduction>
