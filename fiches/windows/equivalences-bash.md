---
title: "Équivalences bash / cmd / PowerShell"
tags: [windows, terminal]
created: 2026-09-03
updated: 2026-09-03
status: stable
---

## En bref

La table à ouvrir quand on arrive sur une machine Windows avec des réflexes
Unix. Colonne PowerShell : la commande complète, les alias étant souvent des
faux amis (voir les pièges).

## Fichiers et navigation

| bash | cmd | PowerShell |
| --- | --- | --- |
| `ls` | `dir` | `Get-ChildItem` |
| `ls -la` | `dir /a` | `Get-ChildItem -Force` |
| `cat f` | `type f` | `Get-Content f` |
| `head -n 20 f` | — | `Get-Content f -TotalCount 20` |
| `tail -n 20 f` | — | `Get-Content f -Tail 20` |
| `tail -f f` | — | `Get-Content f -Tail 10 -Wait` |
| `cp a b` | `copy a b` | `Copy-Item a b` |
| `cp -r a b` | `xcopy /e /i a b` | `Copy-Item a b -Recurse` |
| `mv a b` | `move a b` | `Move-Item a b` |
| `rm f` | `del f` | `Remove-Item f` |
| `rm -rf d` | `rd /s /q d` | `Remove-Item d -Recurse -Force` |
| `mkdir -p d` | `md d` | `New-Item -ItemType Directory d` |
| `touch f` | `type nul > f` | `New-Item -ItemType File f` |
| `pwd` | `cd` | `Get-Location` |
| `find . -name '*.log'` | `dir /b /s *.log` | `Get-ChildItem -Recurse -Filter *.log` |
| `du -sh .` | — | `Get-ChildItem -Recurse \| Measure-Object Length -Sum` |
| `df -h` | `wmic logicaldisk get size,freespace,caption` | `Get-PSDrive -PSProvider FileSystem` |

## Texte

| bash | cmd | PowerShell |
| --- | --- | --- |
| `grep motif f` | `findstr motif f` | `Select-String motif f` |
| `grep -ri motif .` | `findstr /s /i motif *` | `Get-ChildItem -Recurse \| Select-String motif` |
| `grep -v motif f` | `findstr /v motif f` | `Select-String motif f -NotMatch` |
| `wc -l f` | `find /c /v "" f` | `(Get-Content f).Count` |
| `sort f` | `sort f` | `Get-Content f \| Sort-Object` |
| `sort -u f` | — | `Get-Content f \| Sort-Object -Unique` |
| `sed 's/a/b/g' f` | — | `(Get-Content f) -replace 'a','b'` |
| `less f` | `more f` | `Get-Content f \| Out-Host -Paging` |
| `diff a b` | `fc a b` | `Compare-Object (gc a) (gc b)` |
| `xargs` | `for /f` | `ForEach-Object` |

## Processus et services

| bash | cmd | PowerShell |
| --- | --- | --- |
| `ps aux` | `tasklist` | `Get-Process` |
| `ps aux \| grep x` | `tasklist \| findstr x` | `Get-Process x` |
| `top` | `tasklist` puis `taskmgr` | `Get-Process \| Sort-Object CPU -Desc` |
| `kill 1234` | `taskkill /pid 1234` | `Stop-Process -Id 1234` |
| `kill -9 1234` | `taskkill /pid 1234 /f` | `Stop-Process -Id 1234 -Force` |
| `systemctl status x` | `sc query x` | `Get-Service x` |
| `systemctl start x` | `net start x` | `Start-Service x` |
| `crontab -l` | `schtasks /query` | `Get-ScheduledTask` |

## Système et réseau

| bash | cmd | PowerShell |
| --- | --- | --- |
| `uname -a` | `systeminfo` | `Get-ComputerInfo` |
| `whoami` | `whoami` | `whoami` |
| `id` | `whoami /all` | `Get-LocalUser`, `whoami /all` |
| `env` | `set` | `Get-ChildItem Env:` |
| `export A=b` | `set A=b` | `$env:A = 'b'` |
| `which x` | `where x` | `Get-Command x` |
| `ifconfig` / `ip a` | `ipconfig /all` | `Get-NetIPConfiguration` |
| `netstat -tulpn` | `netstat -ano` | `Get-NetTCPConnection -State Listen` |
| `ping` | `ping` | `Test-NetConnection` |
| `dig x` | `nslookup x` | `Resolve-DnsName x` |
| `curl -I url` | `curl.exe -I url` | `Invoke-WebRequest url -Method Head` |
| `sudo cmd` | `runas /user:Administrateur cmd` | `Start-Process pwsh -Verb RunAs` |
| `chmod` / `getfacl` | `icacls f` | `Get-Acl f` |
| `man x` | `x /?` | `Get-Help x -Examples` |
| `clear` | `cls` | `Clear-Host` |
| `history` | `doskey /history` | `Get-History` |

## Pièges

- **Les alias PowerShell ne prennent pas les options Unix.** `ls -l`, `rm -rf`,
  `cat -n` échouent : `-l` est interprété comme le début d'un paramètre
  PowerShell. L'alias donne la commande, pas la syntaxe.
- **`where` change de sens selon le shell.** En cmd c'est `which` ; en
  PowerShell c'est `Where-Object`. `where python` en PowerShell attend une
  condition et ne fait pas ce qu'on croit — écrire `where.exe python` ou
  `Get-Command python`.
- Même piège pour `sort`, `find`, `echo`, `curl`, `wget`, `more` : ajouter
  `.exe` (ou `.com` pour `more`) force le binaire Windows.
- **`find` sous Windows n'est pas `find` sous Unix.** C'est un filtre de texte
  primitif, pas un parcours d'arborescence. L'équivalent de `find`, c'est
  `dir /b /s` ou `Get-ChildItem -Recurse`.
- **Les chemins prennent des `\`**, mais PowerShell accepte aussi `/`. Les
  scripts portables gagnent à utiliser `Join-Path`.
- `wmic` est **déprécié** et absent des Windows récents : basculer sur
  `Get-CimInstance` dès qu'il n'y a pas de contrainte de compatibilité.
- La complétion `Tab` existe dans les trois shells, mais seul PowerShell
  complète aussi les **noms de paramètres** — `Get-ChildItem -Re<Tab>`.

## Voir aussi

- [Windows : créer, copier, renommer, supprimer](fichiers.md)

- [PowerShell : objets, pipeline et repères](powershell.md)
- [cmd : historique, redirections et raccourcis](cmd.md)
- [findstr : le grep de cmd](findstr.md)
- [grep : chercher dans les fichiers](../shell/grep.md)
