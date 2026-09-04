---
title: "Windows : élévation (UAC) et édition d'un fichier protégé"
tags: [windows, terminal, procedure]
created: 2026-09-04
updated: 2026-09-04
status: stable
---

## En bref

Le scénario type : ouvrir `hosts` dans le Bloc-notes, taper la ligne, et se
prendre un « Accès refusé » **au moment d'enregistrer** — le travail est perdu.

La règle qui l'explique : sous Windows on n'élève pas une commande, on **lance
un programme déjà élevé**. L'élévation (*elevation*) se demande **avant**
d'ouvrir le fichier, jamais pendant. Il n'y a pas d'équivalent de `sudo` qui
rattrape le coup après coup — sauf sur Windows 11 24H2, justement nommé `sudo`.

## Le fichier hosts

```text
C:\Windows\System32\drivers\etc\hosts
```

Il court-circuite le DNS pour la machine entière, et gagne toujours contre lui —
voir [DNS : résolution et enregistrements](../reseau/dns.md).

```text
# une entree = une ligne, adresse puis nom, separes par des espaces ou une tabulation
203.0.113.10    app.exemple.tld
127.0.0.1       test.exemple.tld
```

```bat
type C:\Windows\System32\drivers\etc\hosts   & rem le lire ne demande aucun droit
ipconfig /flushdns                           & rem vider le cache apres modification
ipconfig /displaydns | findstr exemple       & rem verifier ce que le cache contient
ping app.exemple.tld                         & rem l'entree est-elle prise en compte
```

## Élever une console

```text
Menu Démarrer → taper « cmd » → Ctrl+Maj+Entrée
```

```powershell
Start-Process powershell -Verb RunAs      # une console PowerShell elevee
Start-Process wt -Verb RunAs              # Windows Terminal eleve
Start-Process cmd -Verb RunAs             # une console cmd elevee
```

```bat
powershell -c "Start-Process cmd -Verb RunAs"   & rem s'elever depuis cmd, sans la souris
```

`-Verb RunAs` déclenche l'invite UAC. C'est le seul mécanisme d'élévation :
tout le reste n'en est qu'un emballage.

## Ouvrir directement l'éditeur en élevé

C'est la forme à retenir, parce qu'elle évite la perte de saisie.

```powershell
Start-Process notepad -Verb RunAs -ArgumentList 'C:\Windows\System32\drivers\etc\hosts'
Start-Process notepad -Verb RunAs -ArgumentList "$env:SystemRoot\System32\drivers\etc\hosts"
```

**Windows 11 24H2** livre un vrai `sudo`, à activer dans *Paramètres → Système →
Pour les développeurs → Activer sudo* :

```powershell
sudo notepad C:\Windows\System32\drivers\etc\hosts
sudo config --enable normal    # exécute dans la console courante, sans nouvelle fenetre
```

Avant 24H2, l'équivalent est **gsudo**, qui s'installe en une ligne :

```powershell
winget install gerardog.gsudo
gsudo notepad C:\Windows\System32\drivers\etc\hosts
```

## Vérifier qu'on est réellement élevé

```bat
whoami /groups | findstr /i "12288"   & rem S-1-16-12288 = niveau obligatoire eleve
net session >nul 2>&1 && echo eleve || echo pas eleve
```

```powershell
([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
```

## Éditer sans interface graphique

Depuis une console **déjà élevée** :

```bat
copy C:\Windows\System32\drivers\etc\hosts %USERPROFILE%\hosts.bak   & rem toujours
echo 203.0.113.10    app.exemple.tld>>C:\Windows\System32\drivers\etc\hosts
```

```powershell
$hosts = "$env:SystemRoot\System32\drivers\etc\hosts"
Copy-Item $hosts "$env:USERPROFILE\hosts.bak"
Add-Content $hosts -Value "203.0.113.10`tapp.exemple.tld" -Encoding ascii
Get-Content $hosts | Select-String exemple
```

## Depuis WSL

`sudo` côté Linux ne donne **aucun** droit côté Windows : il élève dans la
distribution, pas sur l'hôte. Un `sudo nvim /mnt/c/Windows/System32/drivers/etc/hosts`
échoue à l'écriture, malgré des permissions affichées en `777`.

```sh
powershell.exe -c "Start-Process notepad -Verb RunAs -ArgumentList 'C:\Windows\System32\drivers\etc\hosts'"
```

L'invite UAC s'affiche sur le bureau Windows. Autre voie : ouvrir un terminal
Windows élevé, y taper `wsl`, et éditer depuis ce shell-là — l'élévation est
héritée par la distribution.

## Pièges

- **Le Bloc-notes n'échoue qu'à l'enregistrement.** Il ouvre le fichier sans
  broncher, laisse taper, puis refuse d'écrire. Élever **avant** d'ouvrir est la
  seule parade.
- **« Enregistrer sous » ajoute `.txt`.** On obtient un `hosts.txt` que Windows
  ignore en silence, et la résolution ne change pas. Choisir « Tous les
  fichiers » ou entourer le nom de guillemets, puis vérifier avec
  `dir /a C:\Windows\System32\drivers\etc` — l'explorateur masque les extensions
  connues, donc il ne montrera pas le problème.
- **`runas` n'élève pas.** Il lance un programme sous **un autre compte** ; avec
  l'UAC actif, ce compte reçoit lui aussi un jeton filtré. `runas /user:Administrateur`
  demande en plus le mot de passe du compte Administrateur intégré, désactivé par
  défaut. Pour élever, c'est `-Verb RunAs`, pas `runas`.
- **Appartenir au groupe Administrateurs ne suffit pas** : dans une console non
  élevée, l'UAC retire le jeton privilégié — voir
  [droits NTFS et icacls](droits.md).
- **PowerShell 5.1 écrit en UTF-16 avec `>` et `Out-File`.** Un `hosts` ainsi
  réécrit devient illisible pour le résolveur, sans le moindre message d'erreur.
  Forcer `-Encoding ascii`, ou utiliser `Add-Content` plutôt qu'une redirection.
- **Defender surveille ce fichier** et signale une modification en
  `SettingsModifier:Win32/HostsFileHijack`, parfois en restaurant la version
  d'origine. Relire le fichier après coup plutôt que supposer que l'écriture a
  tenu.
- **Ni jokers ni ports** dans `hosts` : `*.exemple.tld` et `exemple.tld:8080`
  n'y ont aucun sens. C'est une correspondance nom → adresse, rien d'autre.
- **Terminer le fichier par une ligne vide.** Une dernière entrée sans retour à
  la ligne peut être ignorée.
- **Le navigateur a son propre cache DNS**, que `ipconfig /flushdns` ne touche
  pas : `chrome://net-internals/#dns` pour le vider, ou une fenêtre de navigation
  privée pour tester.
- **L'élévation ne se transmet pas à un processus déjà lancé.** Ouvrir la console
  élevée d'abord ; un `Start-Process -Verb RunAs` depuis une session normale crée
  bien un nouveau processus, jamais une promotion de l'ancien.
- **Les lecteurs réseau montés disparaissent en session élevée** : un `Z:` mappé
  par `net use` n'existe pas pour la console administrateur, parce que c'est un
  autre jeton. D'où des scripts qui marchent en normal et échouent en élevé.
- **Sauvegarder avant.** Un `hosts` cassé se manifeste par des résolutions
  incohérentes bien plus tard, quand on ne fait plus le lien.

## Voir aussi

- [Windows : droits NTFS et icacls](droits.md)
- [Windows : créer, copier, renommer, supprimer](fichiers.md)
- [DNS : résolution et enregistrements](../reseau/dns.md)
- [WSL : ouvrir un fichier, franchir la frontière Windows](../linux/wsl.md)
- [Équivalences bash / cmd / PowerShell](equivalences-bash.md)
