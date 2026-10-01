---
title: "Volatility 3 : analyser un dump mémoire"
tags: [securite, terminal, reference]
created: 2026-10-01
updated: 2026-10-01
status: brouillon
---

## En bref

Volatility 3 analyse une **image mémoire** (*memory dump*, `.raw`, `.mem`,
`.vmem`, `.dmp`) : processus, connexions réseau, code injecté, clés de
registre — ce qui n'existe qu'en RAM. Plus de profil à choisir comme en
Volatility 2 : on lance directement un plugin.

```sh
vol -f <DUMP> windows.info              # 1. le dump est-il lisible ? quel Windows ?
vol -f <DUMP> windows.pstree            # 2. arbre des processus : parent suspect ?
vol -f <DUMP> windows.netscan           # 3. connexions reseau et ports en ecoute
vol -f <DUMP> windows.malfind           # 4. code injecte dans un processus
vol -f <DUMP> windows.cmdline           # 5. lignes de commande de chaque processus
```

```sh
pipx install volatility3                # fournit la commande vol
vol -h                                  # liste de tous les plugins disponibles
vol windows.pslist -h                   # options d'un plugin
```

## Processus

```sh
vol -f <DUMP> windows.pslist                       # processus actifs (liste chainee)
vol -f <DUMP> windows.pslist --pid <PID>           # un seul processus
vol -f <DUMP> windows.pstree                       # meme liste, en arbre parent/enfant
vol -f <DUMP> windows.psscan                       # scan memoire : trouve aussi les processus caches ou termines
vol -f <DUMP> windows.cmdline --pid <PID>          # ligne de commande complete
vol -f <DUMP> windows.envars --pid <PID>           # variables d'environnement
vol -f <DUMP> windows.getsids --pid <PID>          # compte (SID) qui fait tourner le processus
```

**`pslist` vs `psscan`** : un processus présent dans `psscan` mais absent de
`pslist` a été retiré de la liste chaînée — soit terminé, soit **caché**
(rootkit, *DKOM*). À comparer systématiquement.

Ce qui doit alerter dans `pstree` :

```text
winword.exe -> powershell.exe          # macro qui lance un shell
svchost.exe dont le parent n'est pas services.exe
lsass.exe en double, ou scvhost.exe / lsas.exe (faute de frappe volontaire)
cmd.exe ou powershell.exe enfant d'un navigateur ou d'un serveur web
```

## Réseau

```sh
vol -f <DUMP> windows.netscan                      # connexions TCP/UDP, y compris fermees
vol -f <DUMP> windows.netstat                      # connexions actives (liste du noyau)
vol -f <DUMP> windows.netscan | grep <IP>          # qui parle a cette adresse ?
vol -f <DUMP> windows.netscan | grep <PORT>        # qui utilise ce port ?
vol -f <DUMP> windows.netscan | grep ESTABLISHED   # connexions etablies seulement
```

Colonnes utiles : `LocalAddr`, `ForeignAddr`, `State`, `PID`, `Owner`. Une
connexion sortante vers un port 4444, 8080 ou 443 depuis un processus qui n'a
rien à faire sur le réseau (`notepad.exe`, `rundll32.exe`) = piste de C2.

## Code injecté et DLL

```sh
vol -f <DUMP> windows.malfind                      # zones memoire RWX contenant du code (injection)
vol -f <DUMP> windows.malfind --pid <PID>          # sur un seul processus
vol -f <DUMP> -o <DOSSIER> windows.malfind --pid <PID> --dump  # extraire les zones suspectes
vol -f <DUMP> windows.dlllist --pid <PID>          # DLL chargees par le processus
vol -f <DUMP> windows.ldrmodules --pid <PID>       # DLL cachees (False dans une des trois colonnes)
vol -f <DUMP> windows.handles --pid <PID>          # fichiers, cles, mutex ouverts
```

`malfind` montre un en-tête `MZ` (exécutable PE) dans une zone
`PAGE_EXECUTE_READWRITE` non adossée à un fichier : signe classique
d'injection de processus (*process injection*).

## Fichiers, services, registre

```sh
vol -f <DUMP> windows.filescan                                 # fichiers references en memoire
vol -f <DUMP> windows.filescan | grep -i <MOTIF>               # chercher un nom de fichier
vol -f <DUMP> -o <DOSSIER> windows.dumpfiles --virtaddr <ADRESSE>  # extraire un fichier (adresse donnee par filescan)
vol -f <DUMP> -o <DOSSIER> windows.dumpfiles --pid <PID>       # extraire les fichiers d'un processus
vol -f <DUMP> -o <DOSSIER> windows.memmap --pid <PID> --dump   # extraire toute la memoire d'un processus
vol -f <DUMP> windows.svcscan                                  # services (persistance)
vol -f <DUMP> windows.registry.hivelist                        # ruches de registre chargees
vol -f <DUMP> windows.registry.printkey --key "Software\Microsoft\Windows\CurrentVersion\Run"  # cles de demarrage (persistance)
vol -f <DUMP> windows.registry.printkey --key "<CLE>"          # une cle quelconque
vol -f <DUMP> windows.hashdump                                 # hachages NTLM des comptes locaux
vol -f <DUMP> windows.vadyarascan --yara-file <REGLES_YARA>    # passer des regles YARA sur la memoire des processus
```

## Formats de sortie

```sh
vol -r csv -f <DUMP> windows.pslist > <SORTIE>.csv    # CSV, pour un tableur
vol -r json -f <DUMP> windows.pslist > <SORTIE>.json  # JSON, pour jq
vol -q -f <DUMP> windows.pslist                       # sans la barre de progression
vol -f <DUMP> timeliner.Timeliner                     # chronologie de tous les evenements horodates
```

Les options globales (`-f`, `-o`, `-r`, `-q`) se placent **avant** le nom du
plugin ; celles du plugin (`--pid`, `--dump`) **après**.

## Linux et macOS

```sh
vol -f <DUMP> banners.Banners             # version exacte du noyau dans le dump
vol -f <DUMP> linux.pslist                # processus
vol -f <DUMP> linux.pstree                # arbre des processus
vol -f <DUMP> linux.bash                  # historique bash recupere en memoire
vol -f <DUMP> linux.sockstat              # sockets reseau
vol -f <DUMP> linux.malfind               # code injecte
```

Sous Windows, les tables de symboles sont téléchargées automatiquement depuis
Microsoft. Sous **Linux et macOS, non** : il faut une table de symboles (*ISF*,
fichier `.json.xz`) générée avec `dwarf2json` pour **le noyau exact** du dump
(d'où `banners.Banners`), à déposer dans `volatility3/symbols/linux/`.

## Lien avec ATT&CK

| Constat Volatility | Technique ATT&CK |
| --- | --- |
| `malfind` : PE dans une zone RWX | T1055 — *Process Injection* |
| `pstree` : `winword.exe` → `powershell.exe` | T1204.002 *Malicious File* + T1059.001 *PowerShell* |
| `cmdline` : `powershell -enc ...` | T1059.001 + T1027 *Obfuscated Files or Information* |
| `printkey` sur `...\CurrentVersion\Run` | T1547.001 — *Registry Run Keys* |
| `svcscan` : service inconnu | T1543.003 — *Windows Service* |
| `hashdump`, accès à `lsass.exe` | T1003 — *OS Credential Dumping* |
| `netscan` : connexion sortante régulière | T1071 — *Application Layer Protocol* (C2) |

## Pièges

- **Volatility 2 et 3 n'ont pas la même syntaxe.** Les tutoriels avec
  `--profile=Win7SP1x64` et `pslist` tout court sont du v2. En v3 : pas de
  profil, plugins préfixés (`windows.pslist`).
- **Premier lancement lent ou en échec hors ligne** : sur un dump Windows, v3
  télécharge les symboles (PDB) de Microsoft. Dans une VM d'analyse coupée
  du réseau, les récupérer avant.
- **Les noms de plugins bougent d'une version à l'autre** (certains passent
  sous `windows.malware.*`, avec un alias temporaire). `vol -h | grep <MOTIF>`
  tranche.
- **`netscan` montre aussi des connexions fermées** : une ligne ne prouve pas
  que la connexion était active au moment du dump. Regarder `State` et
  croiser avec `netstat`.
- **Travailler sur une copie du dump** et en noter l'empreinte (`sha256sum`)
  dès l'acquisition : c'est une preuve.

## Voir aussi

- [MITRE ATT&CK : tactiques et techniques des attaquants](mitre-attack.md)
- [oletools et oledump : analyser un document Office suspect](oletools.md)
- [IDS / IPS : détection et prévention d'intrusion](ids.md)
- <https://volatility3.readthedocs.io/>
- <https://github.com/volatilityfoundation/volatility3>
