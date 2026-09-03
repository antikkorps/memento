---
title: "Windows : lister et arrêter un processus"
tags: [windows, terminal, depannage]
created: 2026-09-03
updated: 2026-09-03
status: stable
---

## En bref

Trouver le PID, puis tuer le processus — en cmd avec `tasklist` / `taskkill`,
en PowerShell avec `Get-Process` / `Stop-Process`. Le pendant Linux est
[Linux : lister, inspecter et tuer un processus](../linux/processus.md).

## Trouver

```bat
tasklist                                    tous les processus
tasklist /svc                               quel service tourne dans quel processus
tasklist /v                                 avec le compte proprietaire
tasklist /fi "imagename eq chrome.exe"      filtrer par nom
tasklist /fi "pid eq 1234"                  filtrer par PID
tasklist | findstr /i node                  la methode rapide
```

```powershell
Get-Process
Get-Process node                                  # par nom, sans le .exe
Get-Process | Sort-Object CPU -Descending | Select-Object -First 10 Name, Id, CPU
Get-Process -Id 1234 | Format-List *

# La ligne de commande complete -- que Get-Process ne donne PAS
Get-CimInstance Win32_Process -Filter "Name='node.exe'" |
  Select-Object ProcessId, CommandLine
```

## Tuer

```bat
taskkill /PID 1234                fermeture propre : demande a la fenetre de se fermer
taskkill /PID 1234 /F             force
taskkill /IM node.exe /F          par nom -- TOUTES les instances
taskkill /PID 1234 /T /F          l'arbre : le processus et tous ses enfants
```

```powershell
Stop-Process -Id 1234                     # equivaut deja a un arret force
Stop-Process -Name node -WhatIf           # SIMULATION
Stop-Process -Name node -Force
Get-Process node | Stop-Process
```

| | cmd | PowerShell |
| --- | --- | --- |
| Demander | `taskkill /PID n` | — |
| Forcer | `taskkill /PID n /F` | `Stop-Process -Id n` |
| Par nom | `taskkill /IM x.exe /F` | `Stop-Process -Name x` |
| Avec les enfants | `taskkill /PID n /T /F` | (parcourir `ParentProcessId`) |
| Simuler | (faire un `tasklist` d'abord) | `-WhatIf` |

## Libérer un port occupé

La recette la plus utile du lot — « le port 3000 est déjà utilisé » :

```bat
netstat -ano | findstr :3000
tasklist /fi "pid eq 15872"
taskkill /PID 15872 /F
```

```powershell
Get-NetTCPConnection -LocalPort 3000 | Select-Object OwningProcess
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force
```

## Services et tâches planifiées (*scheduled tasks*)

```bat
sc query nom                      etat d'un service
sc stop nom  /  sc start nom
net stop nom /  net start nom
```

```powershell
Get-Service nom
Restart-Service nom
Stop-Service nom -Force           # -Force arrete aussi les services dependants
```

## Pièges

- **`taskkill` sans `/F` demande poliment**, en envoyant un message de
  fermeture que l'application peut ignorer — une fenêtre avec une boîte de
  dialogue « Enregistrer ? » ne se ferme jamais. `/F` termine sans négocier,
  comme un `kill -9`, avec les mêmes conséquences : rien n'est enregistré.
- **`Stop-Process` est déjà brutal.** Contrairement à `taskkill`, il n'a pas de
  mode poli : `-Force` ne sert qu'à passer outre la confirmation sur un
  processus qui n'est pas à toi. Ne pas croire que `Stop-Process` sans `-Force`
  est l'équivalent d'un `SIGTERM`.
- **Tuer un parent ne tue pas ses enfants.** `npm`, `node`, `python`, les
  serveurs de dev lancent des sous-processus qui survivent et gardent le port
  occupé. C'est à ça que sert `/T`.
- **`taskkill /IM` et `Stop-Process -Name` frappent toutes les instances.**
  `Stop-Process -Name chrome` ferme le navigateur entier, onglets non
  enregistrés compris. Passer par le PID dès qu'il y a plusieurs instances.
- **`Get-Process` ne montre pas la ligne de commande.** Impossible de
  distinguer trois `node.exe` sans `Get-CimInstance Win32_Process`, qui donne
  `CommandLine`.
- **Un service redémarre tout seul.** Windows a des actions de récupération
  configurées par service : tuer le processus le fait revenir avec un autre PID.
  Passer par `sc stop` ou `Stop-Service`.
- **« Accès refusé » même en administrateur** sur certains processus système :
  ce sont des *protected processes* (antivirus, LSA), le système les protège du
  compte administrateur lui-même.
- Les PID sont réutilisés : entre le `netstat` et le `taskkill`, le numéro peut
  avoir changé de propriétaire. Vérifier avec `tasklist /fi "pid eq …"` avant de
  tuer.
- Un fichier verrouillé par un processus qu'on n'identifie pas : le Moniteur de
  ressources (onglet **UC → Handles associés**) ou `handle.exe` de Sysinternals
  donnent le coupable.

## Voir aussi

- [Linux : lister, inspecter et tuer un processus](../linux/processus.md)
- [Windows : reconnaissance système en ligne de commande](reconnaissance.md)
- [Équivalences bash / cmd / PowerShell](equivalences-bash.md)
