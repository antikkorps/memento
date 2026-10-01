---
title: "oletools et oledump : analyser un document Office suspect"
tags: [securite, terminal, reference]
created: 2026-10-01
updated: 2026-10-01
status: brouillon
---

## En bref

Analyse **statique** d'un document Office (`.doc`, `.xls`, `.docm`, `.xlsm`…)
sans jamais l'ouvrir dans Office. L'ordre réflexe :

```sh
oleid <FICHIER>              # 1. triage : macros ? chiffre ? liens externes ?
olevba -a <FICHIER>          # 2. macros : mots-cles suspects (AutoOpen, Shell, URL...)
olevba -c --decode <FICHIER> # 3. lire le code VBA, chaines obfusquees decodees
oledump.py <FICHIER>         # 4. lister les flux (streams), reperer ceux marques M
```

`oleid`, `olevba`, `oledir`, `mraptor`, `oleobj` viennent du paquet **oletools**
(Philippe Lagadec) ; `oledump.py` est un outil **séparé**, de Didier Stevens.
Les deux sont préinstallés sur REMnux.

```sh
pipx install oletools        # installe oleid, olevba, oledir, mraptor, oleobj...
pipx upgrade oletools        # mettre a jour (les detections evoluent)
```

`oledump.py` : à récupérer dans le dépôt `DidierStevensSuite` sur GitHub, puis
`python3 oledump.py`.

## oleid : le triage

```sh
oleid <FICHIER>              # tableau d'indicateurs avec niveau de risque
```

| Indicateur | Ce qu'il dit |
| --- | --- |
| `File format` | OLE (Office 97-2003) ou OpenXML (zip, Office 2007+) |
| `Encrypted` | chiffré : rien ne sera analysable sans le mot de passe |
| `VBA Macros` | présence de macros VBA (`Yes, suspicious` = mots-clés à risque) |
| `XLM Macros` | macros Excel 4.0, anciennes et très utilisées par les maliciels |
| `External Relationships` | modèle ou ressource chargé depuis une URL (*remote template*) |
| `ObjectPool` / `Flash` | objets embarqués |

## olevba : extraire et analyser les macros

```sh
olevba <FICHIER>                   # code VBA + tableau d'analyse
olevba -a <FICHIER>                # analyse seule (mots-cles, IOC), sans le code
olevba -c <FICHIER>                # code seul, sans l'analyse
olevba --decode <FICHIER>          # montre toutes les chaines obfusquees decodees (base64, hex, StrReverse...)
olevba --deobf <FICHIER>           # tente d'evaluer les expressions VBA (Chr(), concatenations) - lent
olevba --reveal <FICHIER>          # reinjecte les chaines desobfusquees dans le code
olevba -j <FICHIER>                # sortie JSON, pour un script
olevba -t <DOSSIER>/*              # triage : une ligne de resume par fichier
olevba -r '<DOSSIER>/*'            # recursif dans les sous-dossiers
olevba -z <MOT_DE_PASSE> <ZIP>     # analyse dans une archive zip protegee (souvent "infected")
```

Le tableau d'analyse classe ce qu'il trouve :

| Type | Exemples | Lecture |
| --- | --- | --- |
| `AutoExec` | `AutoOpen`, `Document_Open`, `Workbook_Open` | s'exécute **à l'ouverture** |
| `Suspicious` | `Shell`, `CreateObject`, `WScript.Shell`, `Run`, `URLDownloadToFile`, `Chr`, `Base64` | exécute, télécharge, ou cache quelque chose |
| `IOC` | URL, IP, nom d'exécutable | indicateur de compromission (*IOC*) à relever |
| `VBA Stomping` | code source ≠ p-code | le code affiché n'est **pas** celui qui s'exécute |

`AutoExec` + `Suspicious` dans le même fichier = le schéma classique du
maliciel par macro (*malicious macro*).

```sh
mraptor <FICHIER>            # verdict rapide : SUSPICIOUS si auto-exec + ecriture/execution
```

`mraptor` affiche des drapeaux : `A` auto-exécution, `W` écriture sur disque,
`X` exécution. **A + (W ou X) = suspect.**

## oledir : la structure du conteneur OLE

Un fichier OLE est un mini-système de fichiers : des **stockages** (dossiers)
et des **flux** (*streams*, fichiers). `oledir` en liste les entrées.

```sh
oledir <FICHIER>                                     # toutes les entrees du repertoire OLE
unzip -o <FICHIER> 'word/vbaProject.bin' -d <DOSSIER> # docm/docx : extraire le projet VBA (xl/ pour Excel)
oledir <DOSSIER>/word/vbaProject.bin                 # puis l'analyser
```

Colonnes à lire : `Status` (`<Used>`, `unused`, `ORPHAN`), `Type` (stream,
storage), `Name`, `Size`. Un flux **orphelin** (*orphan*) ou une entrée
`unused` de taille non nulle = données cachées, à extraire avec `oledump.py`.

## oledump.py : lister et extraire les flux

```sh
oledump.py <FICHIER>                         # liste numerotee des flux
oledump.py -s <NUMERO_FLUX> -v <FICHIER>     # decompresser et afficher le VBA d'un flux
oledump.py -s a -v <FICHIER>                 # le VBA de tous les flux
oledump.py -s <NUMERO_FLUX> -d <FICHIER> > <SORTIE>  # extraire le flux brut dans un fichier
oledump.py -s <NUMERO_FLUX> -a <FICHIER>     # vue hexadecimale + ascii
oledump.py -s <NUMERO_FLUX> -S <FICHIER>     # chaines lisibles (strings) du flux
oledump.py -i <FICHIER>                      # infos supplementaires sur les flux VBA
oledump.py -p plugin_http_heuristics -s <NUMERO_FLUX> <FICHIER>  # plugin : chercher des URL obfusquees
oledump.py -y <REGLES_YARA> <FICHIER>        # passer des regles YARA sur chaque flux
```

La lettre après le numéro de flux est l'information clé :

```text
  1:       114 '\x01CompObj'
  2:      4096 '\x05DocumentSummaryInformation'
  8: M    1561 'Macros/VBA/ThisDocument'    <- M : macro avec du code
  9: m     938 'Macros/VBA/Module1'         <- m : attributs seuls, pas de code
 10: O   20480 'ObjectPool/_1/\x01Ole10Native'  <- O : objet embarque
```

`M` majuscule = flux à lire en priorité avec `-s <NUMERO_FLUX> -v`. `oledump.py`
lit directement les fichiers OpenXML (`.docm`, `.xlsm`) : pas besoin de dézipper.

## Les autres outils oletools

```sh
olemeta <FICHIER>            # metadonnees : auteur, dates, application
oletimes <FICHIER>           # horodatages de creation/modification de chaque flux
oleobj <FICHIER>             # extraire les objets embarques et les liens externes
rtfobj <FICHIER>             # idem pour un .rtf (objets OLE, exploits Equation Editor)
msodde <FICHIER>             # liens DDE (execution sans macro)
```

## Pièges

- **Ne jamais ouvrir le document dans Office**, même « juste pour voir » : tout
  se fait en statique, dans une VM d'analyse (REMnux), réseau coupé.
- **Un `.docx` ne contient pas de macro** — mais il peut charger un modèle
  distant qui en contient (`External Relationships` dans `oleid`, puis
  `oleobj`). « Pas de macro » ne veut pas dire « inoffensif ».
- **VBA stomping** : le code source peut être effacé ou remplacé alors que le
  p-code compilé, lui, s'exécute. Si `olevba` signale `VBA Stomping`, le code
  affiché ment ; regarder le p-code (`pcodedmp <FICHIER>`).
- **Fichier chiffré** : `oleid` dit `Encrypted`, et `olevba` ne voit rien.
  Déchiffrer d'abord avec `msoffcrypto-tool -p <MOT_DE_PASSE> <FICHIER> <SORTIE>`
  (le mot de passe par défaut d'Excel, `VelvetSweatshop`, est fréquent).
- **Macros XLM (Excel 4.0)** : elles vivent dans des feuilles de macro, pas dans
  un projet VBA. `oleid` les signale ; pour les désobfusquer,
  `XLMMacroDeobfuscator --file <FICHIER>`.
- **`olestream` n'existe pas** : c'est `oledump.py` qui liste les flux.

## Voir aussi

- [Volatility 3 : analyser un dump mémoire](volatility.md)
- [MITRE ATT&CK : tactiques et techniques des attaquants](mitre-attack.md)
- [Maliciels, attaques et vocabulaire des menaces](menaces.md)
- <https://github.com/decalage2/oletools/wiki>
- <https://blog.didierstevens.com/programs/oledump-py/>
