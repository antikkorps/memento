---
title: "Windows : reconnaissance système en ligne de commande"
tags: [windows, securite, terminal]
created: 2026-09-03
updated: 2026-09-03
status: brouillon
---

## En bref

Ce qu'on tape sur une machine Windows dont on ne sait rien : qui suis-je, où
suis-je, qu'est-ce qui tourne, qu'est-ce qui écoute. Utile en audit comme en
dépannage. Les commandes marquées **(admin)** demandent un terminal élevé.

## Identité et privilèges

```bat
whoami                     domaine\utilisateur
whoami /all                SID, groupes ET privileges -- la commande la plus dense
whoami /priv               les privileges seuls
whoami /groups
net user                   les comptes locaux
net user jdupont           details d'un compte : groupes, derniere connexion, expiration
net localgroup             les groupes locaux
net localgroup administrateurs
net accounts               politique de mots de passe : longueur, age, verrouillage
```

```powershell
Get-LocalUser
Get-LocalGroupMember -Group Administrateurs
```

Dans `whoami /priv`, les lignes qui comptent : `SeImpersonatePrivilege`,
`SeBackupPrivilege`, `SeDebugPrivilege`, `SeTakeOwnershipPrivilege`. Un compte
non-admin qui en possède un est un compte non-admin sur le papier seulement.

## Le système

```bat
systeminfo                 OS, version, domaine, correctifs, memoire
hostname
systeminfo | findstr /B /C:"Nom du systeme" /C:"Version du systeme"
wmic qfe list brief        correctifs installes (deprecie)
driverquery                pilotes charges
```

```powershell
Get-ComputerInfo | Select-Object OsName, OsVersion, OsBuildNumber, CsDomain
Get-HotFix | Sort-Object InstalledOn -Descending | Select-Object -First 10
```

## Processus et services

```bat
tasklist                   les processus
tasklist /svc              quel service tourne dans quel processus
tasklist /v                avec le compte proprietaire de chaque processus
sc query                   les services actifs
sc qc <service>            sa configuration : binaire lance, compte, demarrage
```

```powershell
Get-Process | Sort-Object CPU -Descending | Select-Object -First 10
Get-Service | Where-Object Status -eq 'Running'
Get-CimInstance Win32_Service | Select-Object Name, StartName, PathName, StartMode
```

Le `PathName` d'un service dont le chemin contient un espace **et** n'est pas
entre guillemets est la vulnérabilité « unquoted service path » : Windows tente
d'exécuter `C:\Program.exe` avant `C:\Program Files\...`.

## Réseau

```bat
ipconfig /all              adresses, DNS, suffixes, DHCP
arp -a                     le voisinage vu par la machine
route print
netstat -ano               connexions et ports en ecoute, avec le PID
netstat -anob              idem, avec le nom du binaire (admin)
nslookup exemple.tld
net share                  les partages exposes par la machine
net use                    les partages montes
```

```powershell
Get-NetTCPConnection -State Listen | Sort-Object LocalPort
Get-NetIPConfiguration
Get-NetFirewallProfile | Select-Object Name, Enabled
Get-SmbShare
```

Le pont utile : croiser un port avec son processus.

```bat
netstat -ano | findstr :445
tasklist /fi "pid eq 1234"
```

```powershell
Get-NetTCPConnection -LocalPort 445 | ForEach-Object { Get-Process -Id $_.OwningProcess }
```

## Persistance et planification

```bat
schtasks /query /fo LIST /v                 taches planifiees, en detail
reg query HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Run
reg query HKCU\SOFTWARE\Microsoft\Windows\CurrentVersion\Run
cmdkey /list                                identifiants mis en cache
```

```powershell
Get-ScheduledTask | Where-Object State -ne 'Disabled'
Get-CimInstance Win32_StartupCommand | Select-Object Name, Command, Location
```

## Droits sur les fichiers

```bat
icacls C:\chemin                            qui a quoi sur ce dossier
dir /q                                      le proprietaire de chaque fichier
dir /r                                      les flux alternatifs (ADS) caches
```

```powershell
Get-Acl C:\chemin | Format-List
```

## Journaux

```bat
wevtutil qe Security /c:10 /rd:true /f:text
```

```powershell
Get-WinEvent -FilterHashtable @{LogName='Security'; Id=4625} -MaxEvents 20
Get-WinEvent -FilterHashtable @{LogName='System'; StartTime=(Get-Date).AddHours(-2)}
```

`4624` = ouverture de session réussie, `4625` = échouée, `4720` = compte créé,
`4672` = session avec privilèges élevés.

## Pièges

- **`wmic` est déprécié** et absent des Windows récents. Tout ce qu'il faisait
  se retrouve dans `Get-CimInstance` — le réflexe à prendre maintenant, pas le
  jour où `wmic` répondra « commande introuvable ».
- **`Get-WmiObject` n'existe pas en PowerShell 7.** Même conclusion :
  `Get-CimInstance`.
- **Les noms de groupes sont localisés.** `net localgroup administrators` échoue
  sur un Windows français (`administrateurs`). Le SID, lui, ne change jamais :
  le groupe Administrateurs est toujours `S-1-5-32-544`.
- Idem pour `systeminfo | findstr "OS Name"` : sur une machine française c'est
  `Nom du système`. Filtrer sur un fragment neutre, ou passer par
  `Get-ComputerInfo` qui renvoie des noms de propriétés stables.
- **`netstat -b` et `tasklist /v` complets exigent l'élévation** ; sans elle ils
  sortent partiellement, sans toujours le dire.
- `Get-ExecutionPolicy` restreint peut faire échouer un `.ps1` alors que les
  mêmes commandes tapées à la main passent. Ce n'est pas une barrière de
  sécurité, juste un garde-fou.
- Ces commandes sont bruyantes : `whoami /all`, `net user`, `netstat` et les
  requêtes `Security` laissent des traces dans les journaux. C'est voulu côté
  défense, à savoir côté audit.

## Voir aussi

- [Windows : créer, copier, renommer, supprimer](fichiers.md)

- [PowerShell : objets, pipeline et repères](powershell.md)
- [findstr : le grep de cmd](findstr.md)
- [Équivalences bash / cmd / PowerShell](equivalences-bash.md)
- [Lexique de l'évaluation de sécurité](../securite/lexique.md)
- [nmap : scan de ports et découverte réseau](../reseau/nmap.md)
