---
title: "Windows : créer, copier, renommer, supprimer"
tags: [windows, terminal]
created: 2026-09-03
updated: 2026-09-03
status: stable
---

## En bref

Les commandes de base sur les fichiers et les dossiers, en cmd et en
PowerShell. Deux choses à retenir avant tout le reste : **rien ne passe par la
corbeille**, et PowerShell sait simuler une suppression avec `-WhatIf`.

## Créer

```bat
md dossier                      creer un dossier
md a\b\c                        cree toute l'arborescence, comme mkdir -p
type nul > fichier.txt          creer un fichier vide
copy nul fichier.txt            idem
echo texte > fichier.txt        creer avec du contenu
```

```powershell
New-Item -ItemType Directory a\b\c -Force      # -Force : ne rale pas si ca existe
New-Item -ItemType File fichier.txt
Set-Content fichier.txt 'texte'
```

## Copier

```bat
copy source.txt destination.txt        un fichier
copy *.txt C:\sauvegarde\              plusieurs fichiers, pas de dossier
xcopy /E /I source dest                une arborescence (ancien)
robocopy source dest /E                une arborescence (le bon outil)
robocopy source dest /MIR              miroir : supprime dans dest ce qui n'est plus dans source
robocopy source dest /E /L             SIMULATION : n'ecrit rien, montre ce qui se passerait
```

```powershell
Copy-Item source.txt destination.txt
Copy-Item source dest -Recurse
Copy-Item *.log C:\sauvegarde\ -WhatIf         # simulation
```

`copy` ne copie que des fichiers. Dès qu'il y a une arborescence, c'est
`robocopy` : il reprend après coupure, réessaie, garde les horodatages, gère les
chemins de plus de 260 caractères et affiche un vrai résumé.

| Option `robocopy` | Effet |
| --- | --- |
| `/E` | sous-dossiers, y compris vides |
| `/MIR` | miroir exact — **supprime** dans la destination |
| `/L` | simulation, n'écrit rien |
| `/XD dossier` `/XF fichier` | exclure |
| `/R:2 /W:5` | 2 réessais, 5 s d'attente (défaut : **un million** de réessais) |
| `/Z` | mode reprise, pour un réseau instable |
| `/LOG:f.txt` | journal dans un fichier |

## Renommer et déplacer

```bat
ren ancien.txt nouveau.txt      renomme sur place -- pas de chemin a droite
move a.txt C:\ailleurs\         deplace
move a.txt b.txt                renomme aussi
move dossier1 dossier2          deplace un dossier entier
```

```powershell
Rename-Item ancien.txt nouveau.txt
Move-Item a.txt C:\ailleurs\
Get-ChildItem *.jpeg | Rename-Item -NewName { $_.Name -replace '\.jpeg$','.jpg' }
```

## Supprimer

C'est la section qu'on vient chercher — *delete*, effacer, vider.

```bat
del fichier.txt                 supprimer un fichier
del *.tmp                       par joker (wildcard)
del /s *.tmp                    recursivement, dans tous les sous-dossiers
del /f fichier.txt              forcer, meme en lecture seule
del /q *.tmp                    sans demander confirmation
del /a:h *.tmp                  y compris les fichiers caches
del /f /s /q C:\temp\*          vider un dossier sans le supprimer

rd dossier                      supprimer un dossier VIDE
rd /s dossier                   avec tout son contenu (demande confirmation)
rd /s /q dossier                sans confirmation -- l'equivalent de rm -rf
rmdir                           strictement identique a rd
```

```powershell
Remove-Item fichier.txt
Remove-Item *.tmp -WhatIf                          # SIMULATION, rien n'est supprime
Remove-Item dossier -Recurse -Force                # l'equivalent de rm -rf
Remove-Item *.tmp -Confirm                         # demande pour chaque fichier
Get-ChildItem -Recurse -Filter *.tmp | Remove-Item -WhatIf
Clear-Content journal.log                          # vide le fichier sans le supprimer

# Supprimer ce qui date de plus de 30 jours
Get-ChildItem C:\logs -Recurse -File |
  Where-Object LastWriteTime -lt (Get-Date).AddDays(-30) |
  Remove-Item -WhatIf
```

**`-WhatIf` est le réflexe à prendre.** Il fonctionne sur toutes les commandes
qui modifient quelque chose (`Remove-Item`, `Move-Item`, `Stop-Process`,
`Set-Content`…) et affiche ce qui *serait* fait. On l'enlève une fois la sortie
vérifiée. En cmd, l'équivalent est de commencer par `dir` avec les mêmes jokers.

## Attributs et droits

```bat
attrib fichier.txt              voir les attributs
attrib -h -s -r fichier.txt     enlever cache / systeme / lecture seule
takeown /f dossier /r           s'approprier un dossier (admin)
icacls dossier /grant %USERNAME%:F /t
```

C'est la séquence pour un dossier qui refuse de disparaître : `takeown`, puis
`icacls`, puis `rd /s /q`.

## Pièges

- **Rien ne va à la corbeille** (*recycle bin*)**.** Ni `del`, ni `rd`, ni `Remove-Item` : la
  suppression est définitive et immédiate. La corbeille est une fonction de
  l'explorateur, pas du système de fichiers.
- **`del dossier` ne supprime pas le dossier**, il supprime son *contenu* après
  confirmation. Pour le dossier lui-même, c'est `rd`. Deux commandes
  différentes pour ce que `rm -rf` fait d'un coup.
- **`robocopy /MIR` supprime dans la destination.** Une inversion source /
  destination vide le dossier qu'on voulait sauvegarder. Toujours lancer une
  première fois avec `/L`.
- **Les codes de retour de `robocopy` ne sont pas ceux des autres commandes** :
  `0` = rien à copier, `1` = fichiers copiés, jusqu'à `7` — tout ça est un
  **succès**. L'échec commence à `8`. Un script qui teste `if errorlevel 1`
  ou un `robocopy && ...` échoue donc sur une copie réussie ; il faut
  `if %ERRORLEVEL% GEQ 8`.
- **`/R` vaut un million par défaut.** Sur un fichier verrouillé, `robocopy`
  réessaie pendant des heures sans qu'on comprenne pourquoi il ne rend pas la
  main. Mettre `/R:2 /W:5` systématiquement.
- **`ren` ne prend pas de chemin dans la cible.** `ren a.txt C:\autre\b.txt`
  échoue : renommer, c'est `ren` ; changer de dossier, c'est `move`.
- **Les jokers de cmd ne sont pas ceux du shell.** `del *.txt` est développé par
  `del` lui-même, pas par le terminal, et `*.*` ne veut pas dire « tout » mais
  « tout ce qui a un point ». `del *` supprime tout dans le dossier courant.
- **En PowerShell, `Remove-Item -Recurse` sur une jonction ou un lien
  symbolique a longtemps suivi le lien** et supprimé la cible en 5.1. Sur un
  lien, préférer `rd lien` (cmd), qui ne retire que le lien.
- **Chemins de plus de 260 caractères** : `del` et l'explorateur échouent,
  `robocopy` passe. Le contournement générique est le préfixe `\\?\` devant le
  chemin absolu.
- Un fichier ouvert par un processus refuse d'être supprimé — sans dire lequel.
  `handle.exe` (Sysinternals) ou le Moniteur de ressources donnent le coupable.

## Voir aussi

- [dir : lister, trier et filtrer en cmd](dir.md)
- [cmd : historique, redirections et raccourcis](cmd.md)
- [PowerShell : objets, pipeline et repères](powershell.md)
- [Équivalences bash / cmd / PowerShell](equivalences-bash.md)
- [Linux : créer, copier, renommer, supprimer](../linux/fichiers.md)
