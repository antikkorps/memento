---
title: "Windows : droits NTFS et icacls"
tags: [windows, terminal, securite]
created: 2026-09-03
updated: 2026-09-03
status: stable
---

## En bref

Changer les droits d'un fichier sous Windows, c'est `icacls` en cmd et
`Get-Acl` / `Set-Acl` en PowerShell. Le modèle n'est pas celui d'Unix : pas de
triplet propriétaire/groupe/autres, mais une **liste** d'entrées, héritée du
dossier parent. Le pendant Linux est
[Linux : droits, propriétaire et umask](../linux/droits.md).

## Lire les droits

```bat
icacls C:\app                     les droits effectifs, ligne par ligne
dir /q                            le proprietaire de chaque fichier
whoami /groups                    a quels groupes j'appartiens
```

```powershell
Get-Acl C:\app | Format-List
(Get-Acl C:\app).Access | Format-Table IdentityReference, FileSystemRights, AccessControlType, IsInherited
```

Une sortie `icacls` se lit ainsi :

```
C:\app BUILTIN\Administrateurs:(I)(OI)(CI)(F)
       AUTORITE NT\Systeme:(I)(OI)(CI)(F)
       BUREAU\franck:(OI)(CI)(M)
```

| Code | Sens |
| --- | --- |
| `F` | contrôle total |
| `M` | modification (lire, écrire, supprimer) |
| `RX` | lecture et exécution |
| `R` | lecture seule |
| `W` | écriture seule |
| `D` | suppression |
| `(I)` | **hérité** du dossier parent |
| `(OI)` | s'applique aux fichiers du dossier |
| `(CI)` | s'applique aux sous-dossiers |
| `(IO)` | ne s'applique pas au dossier lui-même, seulement à ce qu'il contient |

## Modifier les droits (*permissions*)

```bat
icacls C:\app /grant franck:(OI)(CI)M          donner, avec heritage
icacls C:\app /grant:r franck:(OI)(CI)F        REMPLACE au lieu de cumuler
icacls C:\app /remove franck                   retirer les entrees de ce compte
icacls C:\app /deny franck:(OI)(CI)W           interdire explicitement
icacls C:\app /inheritance:r                   couper l'heritage, en copiant les regles
icacls C:\app /inheritance:d                   couper l'heritage, en supprimant tout
icacls C:\app /reset /T /C                     reappliquer l'heritage du parent, recursivement
icacls C:\app /setowner franck /T
icacls C:\app /save droits.txt /T              sauvegarder les ACL
icacls C:\ /restore droits.txt                 les restaurer
```

```powershell
$acl = Get-Acl C:\app
$regle = New-Object System.Security.AccessControl.FileSystemAccessRule(
  'BUREAU\franck', 'Modify', 'ContainerInherit,ObjectInherit', 'None', 'Allow')
$acl.SetAccessRule($regle)
Set-Acl C:\app $acl
```

## Reprendre la main sur un dossier

La séquence à connaître, pour un dossier dont on n'a plus l'accès :

```bat
takeown /f C:\bloque /r /d o          devenir proprietaire, recursivement
icacls C:\bloque /grant %USERNAME%:F /t
rd /s /q C:\bloque
```

## Attributs (l'ancien système, distinct des droits)

```bat
attrib fichier.txt                  voir
attrib -h -s -r fichier.txt         enlever cache / systeme / lecture seule
```

Lecture seule, caché et système sont des **attributs**, pas des droits : ils ne
protègent de rien et n'importe qui peut les enlever.

## Pièges

- **`icacls /grant` cumule, `/grant:r` remplace.** Sans les deux-points-r, on
  empile des entrées sans jamais en retirer, et l'ACL devient illisible en
  quelques manipulations.
- **Un `deny` l'emporte toujours sur un `allow`**, quel que soit l'ordre. Un
  utilisateur membre de deux groupes dont l'un est en `deny` n'a pas l'accès —
  c'est la cause la plus fréquente d'un « Accès refusé » alors que les droits
  semblent corrects.
- **Copier et déplacer ne se comportent pas pareil.** Un fichier *déplacé* sur
  le même volume garde ses ACL ; *copié*, ou déplacé vers un autre volume, il
  hérite de celles de la destination. Un fichier confidentiel copié dans un
  dossier partagé devient lisible par tous, sans le moindre avertissement.
- **Droits NTFS et droits de partage sont deux couches distinctes.** Sur un
  accès réseau, le droit effectif est le **plus restrictif** des deux. Un
  partage en lecture seule annule un contrôle total NTFS.
- **Devenir propriétaire ne donne aucun droit.** `takeown` permet ensuite de
  s'en attribuer avec `icacls /grant` — c'est une étape, pas la solution.
- **Les noms de groupes sont localisés** : `Administrateurs` sur un Windows
  français, `Administrators` sur un anglais. Un script portable utilise les SID,
  qui ne changent jamais : `S-1-5-32-544` pour les administrateurs,
  `S-1-1-0` pour Tout le monde.
- **`/inheritance:r` copie les règles héritées avant de couper**, `/inheritance:d`
  les supprime. Se tromper de lettre laisse un dossier sans aucune entrée,
  inaccessible même à son propriétaire jusqu'à un `takeown`.
- **Un compte administrateur n'a pas ses droits d'administrateur** dans un
  terminal non élevé : l'UAC lui retire le jeton privilégié. D'où des `icacls`
  qui échouent alors qu'on « est » administrateur.
- Les droits ne s'appliquent qu'en NTFS. Sur une clé en FAT32 ou exFAT, il n'y
  a aucune ACL — le fichier est lisible par quiconque branche la clé.

## Voir aussi

- [Linux : droits, propriétaire et umask](../linux/droits.md)
- [Windows : créer, copier, renommer, supprimer](fichiers.md)
- [Windows : reconnaissance système en ligne de commande](reconnaissance.md)
