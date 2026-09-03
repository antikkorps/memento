---
title: "WSL : ouvrir un fichier, franchir la frontière Windows"
tags: [linux, windows, terminal]
created: 2026-09-03
updated: 2026-09-03
status: stable
---

## En bref

Une image, un PDF, un dossier posés côté Linux, à ouvrir avec une application
Windows : `wslview`. Une seule commande, et elle traduit le chemin toute seule.

## Ouvrir avec l'application Windows par défaut

```sh
wslview image.png              # l'ouvre dans la visionneuse Windows
wslview rapport.pdf
wslview .                      # ouvre le dossier dans l'explorateur
wslview https://exemple.tld    # ouvre dans le navigateur Windows
explorer.exe .                 # meme effet pour un dossier, sans wslu
```

`wslview` vient du paquet **`wslu`** (`sudo apt install wslu`), livré par défaut
sur Ubuntu sous WSL.

## Sans quitter le terminal

```sh
chafa image.png                # rend l'image en couleurs dans le terminal
chafa --size 80x40 image.png   # en limitant la taille
```

Aucune fenêtre, aucun aller-retour à la souris. C'est la façon la plus rapide de
vérifier un schéma d'`assets/` en relisant une fiche.

## Traduire un chemin

```sh
wslpath -w /home/johndoe/img.png      # -> \\wsl.localhost\Ubuntu\home\johndoe\img.png
wslpath -u 'C:\Users\John\img.png'    # -> /mnt/c/Users/John/img.png
wslpath -w .                          # le dossier courant, vu de Windows
```

| Vu de… | Le disque Linux | Le disque Windows |
| --- | --- | --- |
| Linux | `/home/…` | `/mnt/c/…` |
| Windows | `\\wsl.localhost\Ubuntu\home\…` | `C:\…` |

## Lancer une application Windows précise

```sh
mspaint.exe "$(wslpath -w image.png)"
cmd.exe /c start "" "$(wslpath -w image.png)"
powershell.exe -c "Start-Process '$(wslpath -w image.png)'"
```

## Depuis Windows, aller chercher un fichier Linux

Dans l'explorateur ou dans n'importe quelle boîte de dialogue « Ouvrir », taper
le chemin réseau — ou cliquer l'icône Linux dans le volet de gauche :

```text
\\wsl.localhost\Ubuntu\home\johndoe\documents
```

## Une vraie visionneuse Linux (WSLg)

WSLg fournit un serveur graphique : une application Linux s'affiche comme une
fenêtre Windows ordinaire.

```sh
sudo apt install eog          # ou feh, imv, nsxiv
eog image.png
ls /mnt/wslg && echo $DISPLAY # verifier que WSLg tourne (attendu : :0)
```

## Pièges

- **`explorer.exe image.png` échoue avec un chemin Linux.** Explorer ne comprend
  pas `/home/…` : `explorer.exe .` fonctionne (chemin relatif traduit au
  passage), mais un nom de fichier absolu non. `wslview` marche dans les deux
  cas parce qu'il traduit **avant** d'appeler Windows.
- **Toute application Windows exige un chemin Windows.** D'où le
  `"$(wslpath -w …)"` — et les guillemets ne sont pas optionnels : les chemins
  UNC sont pleins de barres inverses et les noms de dossiers Windows pleins
  d'espaces.
- **Travailler dans `/mnt/c/` est lent.** Les accès au disque Windows passent
  par une couche de traduction : un `git status` y est des dizaines de fois plus
  lent que dans `/home`. La bonne organisation est l'inverse de l'intuition —
  **garder les fichiers côté Linux** et les ouvrir depuis Windows via
  `\\wsl.localhost`, jamais l'opposé.
- **Les droits Unix ne survivent pas sur `/mnt/c`** : tout y apparaît en `777`.
  Un `chmod 600` sur une clé SSH stockée côté Windows est donc sans effet, et
  SSH refusera la clé. Une clé privée doit vivre dans `/home`.
- **`\\wsl$\` est l'ancien nom de `\\wsl.localhost\`.** Les deux fonctionnent
  encore ; `wslpath` renvoie le second.
- Le presse-papiers traverse la frontière tout seul grâce à WSLg — voir
  [Neovim : copier une commande vers le presse-papiers](../nvim/presse-papiers.md).
- `wslview` sur une distribution sans `wslu` renvoie « command not found » :
  `sudo apt install wslu`.

## Voir aussi

- [Linux : créer, copier, renommer, supprimer](fichiers.md)
- [Windows : créer, copier, renommer, supprimer](../windows/fichiers.md)
- [Neovim : copier une commande vers le presse-papiers](../nvim/presse-papiers.md)
- <https://wslutiliti.es/wslu/>
