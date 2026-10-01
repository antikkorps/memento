---
title: "Créer une clé USB bootable en ligne de commande"
tags: [linux, procedure, terminal]
created: 2026-10-01
updated: 2026-10-01
status: brouillon
---

## En bref

Écrire une ISO **sur le disque entier** de la clé (`/dev/sdb`, jamais
`/dev/sdb1`) avec `dd`, après avoir **identifié la clé à coup sûr** : `dd` ne
demande aucune confirmation et écrase ce qu'on lui donne. Marche pour les ISO
Linux « hybrides » (Debian, Ubuntu, Fedora, Arch…) ; pas pour une ISO Windows.

```sh
lsblk -o NAME,SIZE,MODEL,TRAN,MOUNTPOINTS                                       # reperer la cle (TRAN = usb)
sudo umount /dev/<DISQUE>?*                                                     # demonter toutes ses partitions
sudo dd if=<ISO> of=/dev/<DISQUE> bs=4M status=progress conv=fsync oflag=direct # ecrire l'iso sur la cle
sudo eject /dev/<DISQUE>                                                        # retirer proprement
```

`<DISQUE>` est le **nom du disque**, sans numéro de partition : `sdb`, `sdc`,
`nvme1n1` — jamais `sdb1`.

## Identifier la clé

```sh
lsblk -o NAME,SIZE,MODEL,TRAN,MOUNTPOINTS          # liste des disques, TRAN=usb pour la cle
sudo journalctl -kf                                # brancher la cle : le noyau annonce son nom (sdX)
sudo dmesg -w                                      # idem, sans systemd
ls -l /dev/disk/by-id/ | grep usb                  # noms stables, avec le modele
sudo fdisk -l /dev/<DISQUE>                        # taille et partitions du disque choisi
```

Le réflexe le plus sûr : `lsblk` **avant** de brancher, `lsblk` **après** — la
ligne qui apparaît est la clé. La taille (8G, 16G, 32G…) confirme.

## Vérifier l'ISO avant d'écrire

```sh
sha256sum <ISO>                                    # empreinte a comparer a celle du site
sha256sum -c --ignore-missing SHA256SUMS           # verifie contre le fichier de sommes officiel
gpg --verify SHA256SUMS.sign SHA256SUMS            # authentifie le fichier de sommes (cle de la distrib)
```

La somme seule prouve que le téléchargement n'est pas corrompu ; la signature
`gpg` prouve qu'il vient bien de la distribution. Le nom du fichier de
signature varie (`SHA256SUMS.sign`, `SHA256SUMS.gpg`, `.asc`).

## Écrire l'ISO

```sh
sudo umount /dev/<DISQUE>?*                                                     # demonter toutes les partitions de la cle
sudo wipefs -a /dev/<DISQUE>                                                    # facultatif : effacer les anciennes signatures
sudo dd if=<ISO> of=/dev/<DISQUE> bs=4M status=progress conv=fsync oflag=direct # ecrire, avec progression
sync                                                                            # vider les caches avant de retirer
```

| Option | Rôle |
| --- | --- |
| `if=` / `of=` | fichier d'entrée (*input file*) / de sortie (*output file*) |
| `bs=4M` | blocs de 4 Mo : bien plus rapide que les 512 octets par défaut |
| `status=progress` | affiche l'avancement |
| `conv=fsync` | ne rend la main qu'une fois **tout** écrit physiquement |
| `oflag=direct` | contourne le cache : la progression affichée est la vraie |

Alternatives sans `dd`, équivalentes pour une ISO hybride :

```sh
sudo cp <ISO> /dev/<DISQUE> && sync                # copie brute, sans options
pv <ISO> | sudo tee /dev/<DISQUE> > /dev/null      # avec barre de progression (paquet pv)
```

## Vérifier la clé après écriture

```sh
sudo cmp -n "$(stat -c %s <ISO>)" <ISO> /dev/<DISQUE> && echo OK    # compare octet par octet sur la taille de l'iso
```

Aucune sortie de `cmp` puis `OK` : la clé est fidèle. Le `-n` est
indispensable — la clé est plus grande que l'ISO, sans lui `cmp` signale une
différence après la fin de l'image.

## Remettre la clé en état « normal »

Après `dd`, la clé porte la table de partitions de l'ISO (souvent en lecture
seule, taille bizarre). Pour la réutiliser comme simple clé de stockage :

```sh
sudo wipefs -a /dev/<DISQUE>                                        # effacer toutes les signatures
sudo parted -s /dev/<DISQUE> mklabel msdos mkpart primary fat32 1MiB 100%   # une partition sur tout le disque
sudo mkfs.vfat -F 32 -n <NOM> /dev/<DISQUE>1                        # formater en FAT32 (lisible partout)
sudo mkfs.exfat -n <NOM> /dev/<DISQUE>1                             # ou exFAT, pour fichiers > 4 Go
```

## Pièges

- **`of=/dev/sdb1` au lieu de `/dev/sdb`** : écrit l'ISO *dans* la partition,
  la clé ne démarre pas. Toujours le disque entier.
- **Se tromper de disque** : `dd` sur `/dev/sda` efface le disque système, sans
  confirmation ni retour possible. Revérifier `lsblk` juste avant d'appuyer sur
  Entrée — les lettres changent d'un branchement à l'autre.
- **La progression atteint 100 % puis « bloque »** : sans `oflag=direct`, `dd`
  remplit le cache mémoire puis attend l'écriture réelle. Ne pas débrancher :
  attendre la fin, c'est `conv=fsync` qui travaille.
- **ISO Windows** : `dd` ne donne pas une clé bootable (l'ISO n'est pas
  hybride, et `install.wim` dépasse 4 Go en FAT32). Utiliser `woeusb` ou Ventoy.
- **Clé montée automatiquement** par l'environnement de bureau : la démonter
  avant `dd`, sinon le système peut réécrire dessus pendant la copie.
- **Ventoy** : alternative à connaître — on installe Ventoy une fois sur la clé,
  puis on y **copie** simplement plusieurs ISO ; un menu propose de choisir au
  démarrage.

## Voir aussi

- [Linux : créer, copier, renommer, supprimer](fichiers.md)
- <https://www.debian.org/CD/faq/#write-usb>
- <https://www.ventoy.net/>
