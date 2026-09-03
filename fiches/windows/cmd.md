---
title: "cmd : historique, redirections et raccourcis"
tags: [windows, terminal]
created: 2026-09-03
updated: 2026-09-03
status: stable
---

## En bref

Tout ce qui n'est pas une commande mais qui fait gagner du temps dans `cmd` :
rappeler ce qu'on a tapé, rediriger, enchaîner, retrouver un exécutable.

## Historique

| Touche | Effet |
| --- | --- |
| `F7` | liste l'historique dans une fenêtre, navigable aux flèches |
| `F8` | complète la ligne en cours à partir de l'historique (appuis successifs) |
| `F3` | rappelle la commande précédente en entier |
| `F1` | rappelle la commande précédente **caractère par caractère** |
| `F9` | rappelle une commande par son numéro (celui affiché par `F7`) |
| `↑` `↓` | commande précédente / suivante |
| `Alt+F7` | efface l'historique |
| `Tab` | complète un nom de fichier ou de dossier |

```bat
doskey /history              & rem l'historique de la session, en texte
doskey /history > commandes.txt  & rem le garder avant de fermer la fenetre
```

**L'historique de `cmd` meurt avec la fenêtre.** Il n'y a pas de fichier
équivalent au `.bash_history` : c'est le vrai argument pour préférer PowerShell,
dont `PSReadLine` persiste l'historique sur disque et propose `Ctrl+R`.

```powershell
Get-Content (Get-PSReadlineOption).HistorySavePath | Select-Object -Last 40
```

## Se déplacer

```bat
cd /d D:\projets  & rem changer de lecteur ET de dossier -- sans /d, cd ne change pas de lecteur
cd              & rem affiche le dossier courant (pas de remontee au home)
cd ..           & rem dossier parent
pushd \\serveur\part  & rem monte un partage reseau sur une lettre temporaire
popd            & rem revient, et libere la lettre
start .         & rem ouvre le dossier courant dans l'explorateur
where python    & rem ou est l'executable qui sera lance (le `which` de Windows)
```

## Rediriger et enchaîner

```bat
commande > fichier    & rem ecrase
commande >> fichier   & rem ajoute
commande 2> erreurs.txt  & rem seulement le flux d'erreur
commande > sortie.txt 2>&1  & rem tout dans un seul fichier
commande > nul 2>&1   & rem silence complet
commande < entree.txt  & rem lit l'entree depuis un fichier
cmd1 | cmd2           & rem pipe
cmd1 & cmd2           & rem enchaine, quoi qu'il arrive
cmd1 && cmd2          & rem cmd2 seulement si cmd1 reussit
cmd1 || cmd2          & rem cmd2 seulement si cmd1 echoue
dir /b | clip         & rem envoie la sortie dans le presse-papiers
type gros.log | more  & rem pagine
```

`nul` est le `/dev/null` de Windows. **Un seul `l`.**

## Variables d'environnement

```bat
set                  & rem liste toutes les variables
set PATH             & rem toutes celles qui commencent par PATH
set MAVAR=valeur     & rem definit, pour cette session seulement
setx MAVAR valeur    & rem definit durablement (utilisateur)
echo %USERPROFILE%   & rem C:\Users\<toi>
echo %CD% %TEMP% %APPDATA% %COMPUTERNAME% %USERNAME%
```

## Boucles interactives

```bat
for %i in (*.log) do echo %i
for /f "tokens=1,2 delims=," %a in (donnees.csv) do echo %a - %b
for /f "tokens=*" %i in ('dir /b *.txt') do type "%i"
```

## Pièges

- **`%i` en interactif, `%%i` dans un `.bat`.** Le double `%` dans un fichier
  batch, le simple à la main. Se tromper donne une erreur de syntaxe opaque.
- **`setx` ne change rien à la session en cours** : il faut rouvrir un terminal.
  Il tronque aussi les valeurs à 1024 caractères — ne jamais l'utiliser sur
  `PATH`, on y perd la moitié du chemin sans avertissement.
- **`&&` et `||` regardent le code de retour**, pas la présence d'un message
  d'erreur. Beaucoup d'outils Windows sortent en `0` malgré un échec affiché ;
  vérifier avec `echo %ERRORLEVEL%` juste après.
- `%ERRORLEVEL%` est évalué **au moment où la ligne est lue**. Dans un bloc
  `if ( ... )`, il garde sa valeur d'avant le bloc : c'est le classique de la
  « delayed expansion » (`setlocal enabledelayedexpansion`, puis `!ERRORLEVEL!`).
- **Le caractère d'échappement est `^`**, pas `\`. Et `^` en fin de ligne
  continue la commande sur la ligne suivante.
- Le `%` doit être doublé (`%%`) pour être littéral dans un `.bat`.
- Un chemin contenant des espaces se met entre guillemets — y compris derrière
  `cd`.
- `cd` seul **affiche** le dossier courant, il ne ramène nulle part. Le retour
  au home, c'est `cd %USERPROFILE%`.
- Le presse-papiers via `clip` ne rajoute pas de retour à la ligne final : coller
  dans un terminal exécute directement la dernière commande.

## Voir aussi

- [Windows : créer, copier, renommer, supprimer](fichiers.md)

- [dir : lister, trier et filtrer en cmd](dir.md)
- [findstr : le grep de cmd](findstr.md)
- [PowerShell : objets, pipeline et repères](powershell.md)
- [Équivalences bash / cmd / PowerShell](equivalences-bash.md)
