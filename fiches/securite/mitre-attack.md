---
title: "MITRE ATT&CK : tactiques et techniques des attaquants"
tags: [securite, reference]
created: 2026-10-01
updated: 2026-10-01
status: brouillon
---

## En bref

**ATT&CK** (*Adversarial Tactics, Techniques, and Common Knowledge*) est une
base de connaissance publique de MITRE qui recense **ce que font réellement
les attaquants**, observé sur des attaques réelles. Elle sert de vocabulaire
commun : on ne dit plus « il a mis un truc au démarrage » mais « T1547.001 ».

Le réflexe de lecture : **tactique = pourquoi** (l'objectif), **technique =
comment** (le moyen), **procédure = exactement comment** (tel groupe, tel
outil, telle commande).

```sh
xdg-open https://attack.mitre.org/techniques/<TECHNIQUE>/              # ouvrir la page d'une technique (ex. T1055)
xdg-open https://attack.mitre.org/techniques/<TECHNIQUE>/<SOUS_TECHNIQUE>/  # sous-technique : T1059.001 -> T1059/001
xdg-open https://attack.mitre.org/groups/<GROUPE>/                     # un groupe d'attaquants (ex. G0007)
```

## Le vocabulaire

| Objet | Identifiant | Exemple |
| --- | --- | --- |
| Tactique (*tactic*) | `TA00xx` | TA0003 *Persistence* |
| Technique | `T1xxx` | T1547 *Boot or Logon Autostart Execution* |
| Sous-technique (*sub-technique*) | `T1xxx.yyy` | T1547.001 *Registry Run Keys / Startup Folder* |
| Procédure (*procedure*) | — | « APT28 écrit dans la clé Run avec `reg add` » |
| Groupe (*group*) | `G0xxx` | G0007 APT28 |
| Logiciel (*software*) | `S0xxx` | S0002 Mimikatz |
| Contre-mesure (*mitigation*) | `M1xxx` | M1032 *Multi-factor Authentication* |

Une technique peut servir **plusieurs tactiques** : une tâche planifiée
(T1053) sert à l'exécution, à la persistance et à l'élévation de privilèges.

## Les 14 tactiques (matrice Enterprise)

Dans l'ordre approximatif d'une attaque — ce n'est **pas** une séquence
obligatoire.

| ID | Tactique | L'attaquant veut… |
| --- | --- | --- |
| TA0043 | *Reconnaissance* | se renseigner sur la cible |
| TA0042 | *Resource Development* | se doter d'infrastructure, de comptes, d'outils |
| TA0001 | *Initial Access* | entrer (hameçonnage, service exposé) |
| TA0002 | *Execution* | faire tourner son code |
| TA0003 | *Persistence* | rester après un redémarrage |
| TA0004 | *Privilege Escalation* | obtenir plus de droits |
| TA0005 | *Defense Evasion* | ne pas être détecté |
| TA0006 | *Credential Access* | voler des identifiants |
| TA0007 | *Discovery* | explorer l'environnement |
| TA0008 | *Lateral Movement* | passer à d'autres machines |
| TA0009 | *Collection* | rassembler les données visées |
| TA0011 | *Command and Control* | piloter à distance (C2) |
| TA0010 | *Exfiltration* | sortir les données |
| TA0040 | *Impact* | chiffrer, détruire, perturber |

Il existe aussi les matrices **Mobile** et **ICS** (systèmes industriels).

## Techniques qu'on croise tout le temps

| ID | Technique | Où on la voit |
| --- | --- | --- |
| T1566.001 | *Spearphishing Attachment* | document Office piégé en pièce jointe |
| T1204.002 | *User Execution: Malicious File* | l'utilisateur ouvre le fichier |
| T1059.001 | *PowerShell* | `powershell -enc ...` |
| T1059.005 | *Visual Basic* | macro VBA (olevba) |
| T1027 | *Obfuscated Files or Information* | base64, `Chr()`, chaînes découpées |
| T1055 | *Process Injection* | `malfind` dans Volatility |
| T1547.001 | *Registry Run Keys / Startup Folder* | clé `...\CurrentVersion\Run` |
| T1053.005 | *Scheduled Task* | `schtasks /create` |
| T1543.003 | *Windows Service* | service créé par l'attaquant |
| T1003.001 | *LSASS Memory* | Mimikatz, dump de `lsass.exe` |
| T1071.001 | *Web Protocols* | C2 en HTTP/HTTPS |
| T1486 | *Data Encrypted for Impact* | rançongiciel (*ransomware*) |

## Interroger la base en ligne de commande

Toute la base est publiée en **STIX 2** (JSON) sur GitHub. Utile hors ligne,
dans une VM d'analyse.

```sh
curl -sLo enterprise-attack.json https://raw.githubusercontent.com/mitre/cti/master/enterprise-attack/enterprise-attack.json  # telecharger la base (environ 40 Mo)
jq -r '.objects[] | select(.type=="attack-pattern" and any(.external_references[]?; .external_id=="<TECHNIQUE>")) | .name' enterprise-attack.json  # nom d'une technique a partir de son ID
jq -r '.objects[] | select(.type=="attack-pattern" and (.revoked|not) and (.x_mitre_deprecated|not)) | [(.external_references[] | select(.source_name=="mitre-attack") | .external_id), .name] | @tsv' enterprise-attack.json | sort  # toutes les techniques : ID et nom
jq -r '.objects[] | select(.type=="attack-pattern" and (.name|test("<MOTIF>";"i"))) | [(.external_references[] | select(.source_name=="mitre-attack") | .external_id), .name] | @tsv' enterprise-attack.json  # chercher une technique par mot-cle
```

## ATT&CK Navigator

Application web qui affiche la matrice et permet de **colorier** des
techniques : couverture de détection d'un SOC, techniques d'un groupe, constats
d'un incident. Les calques (*layers*) s'exportent en JSON.

<https://mitre-attack.github.io/attack-navigator/>

## À quoi ça sert concrètement

- **Rapport d'incident** : chaque constat rattaché à un ID — lisible par
  n'importe quelle équipe, sans ambiguïté.
- **Couverture de détection** : quelles techniques nos règles IDS / SIEM
  voient-elles ? Les trous apparaissent sur la matrice.
- **Émulation d'adversaire** (*adversary emulation*) : rejouer les techniques
  d'un groupe précis lors d'un exercice red team (outil : Atomic Red Team).
- **Renseignement sur la menace** (*threat intelligence*) : comparer un
  incident aux techniques connues d'un groupe.

## Pièges

- **ATT&CK n'est pas une méthode d'attaque séquentielle.** Contrairement à la
  *Cyber Kill Chain* de Lockheed Martin (7 étapes linéaires), les tactiques ne
  s'enchaînent pas forcément dans l'ordre, et une attaque n'utilise pas toutes
  les colonnes.
- **Tactique ≠ technique** : « Persistence » n'est pas une technique, c'est un
  objectif. La technique est le moyen (T1547, T1053…).
- **Couvrir une technique ≠ détecter toutes ses procédures.** Une règle qui voit
  `powershell -enc` ne voit pas PowerShell lancé autrement : cocher T1059.001
  sur le Navigator est souvent trop optimiste.
- **La base évolue** (deux versions par an) : des techniques sont renommées,
  fusionnées ou dépréciées (*revoked*, *deprecated*). Un vieil ID peut ne plus
  exister — vérifier sur le site.
- **Sous-technique dans l'URL** : `T1059.001` s'écrit `T1059/001` dans
  l'adresse de la page.

## Voir aussi

- [Volatility 3 : analyser un dump mémoire](volatility.md)
- [oletools et oledump : analyser un document Office suspect](oletools.md)
- [Maliciels, attaques et vocabulaire des menaces](menaces.md)
- [IDS / IPS : détection et prévention d'intrusion](ids.md)
- <https://attack.mitre.org/>
- <https://github.com/mitre/cti>
