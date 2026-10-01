---
title: "Linux : créer, copier, renommer, supprimer"
tags: [linux, terminal]
created: 2026-09-03
updated: 2026-10-01
status: stable
---

## En bref

Les commandes de base sur les fichiers et les dossiers. Le pendant Unix de
[Windows : créer, copier, renommer, supprimer](../windows/fichiers.md) — avec la
même règle d'or : **pas de corbeille, la suppression est définitive**, et le
filet de sécurité s'appelle `-n` / `--dry-run`. Pour passer par la corbeille
du bureau, c'est `trash-put` au lieu de `rm` (voir [Corbeille](#corbeille-trash)).

## Créer

```sh
mkdir dossier
mkdir -p a/b/c                # cree toute l'arborescence, sans raler si elle existe
touch fichier.txt             # creer vide, ou mettre a jour la date
install -Dm 600 src /etc/app/conf.d/x.conf  # cree le dossier, copie et pose les droits
```

## Copier

```sh
cp source.txt destination.txt
cp -r dossier/ ailleurs/      # recursif
cp -a dossier/ ailleurs/      # archive : preserve dates, droits, proprietaire, liens
cp -i source dest             # demande avant d'ecraser
cp --parents a/b/c.txt /dest/  # recree l'arborescence a/b/ dans /dest/

rsync -a source/ dest/        # la meme chose, mais reprenable et incrementale
rsync -avh --progress source/ dest/
rsync -a --dry-run --delete source/ dest/  # SIMULATION d'un miroir
```

| Option `rsync` | Effet |
| --- | --- |
| `-a` | mode archive : récursif + tout préserver |
| `-v` | bavard, `-h` tailles lisibles |
| `-n` / `--dry-run` | simulation, n'écrit rien |
| `--delete` | miroir exact — **supprime** dans la destination |
| `--exclude='*.tmp'` | exclure |
| `-e ssh user@hote:/chemin/` | copie vers une machine distante |
| `-P` | `--partial --progress`, pour un gros transfert coupé |

## Renommer et déplacer

```sh
mv ancien.txt nouveau.txt     # renommer
mv fichier.txt /ailleurs/     # deplacer
mv -i a b                     # demande avant d'ecraser
mv -n a b                     # n'ecrase jamais, en silence
mv -- -fichier normal.txt     # pour un nom qui commence par un tiret

for f in *.jpeg; do mv -- "$f" "${f%.jpeg}.jpg"; done
rename 's/\.jpeg$/.jpg/' *.jpeg  # si le rename de Perl est installe
```

## Supprimer

Supprimer un fichier, effacer un dossier, vider un log — *delete*, en somme.

```sh
rm fichier.txt                # supprimer un fichier
rm -f fichier.txt             # forcer, aucune erreur si absent
rm -r dossier/                # recursif
rm -rf dossier/               # recursif et force -- aucune confirmation
rm -I *.tmp                   # demande UNE fois si plus de 3 fichiers
rm -- -fichier                # nom commençant par un tiret
rmdir dossier                 # seulement si le dossier est vide

find /var/log -type f -mtime +30 -delete          # plus vieux que 30 jours
find . -name '*.tmp' -print0 | xargs -0 rm --     # noms avec espaces
find . -maxdepth 1 -type f -delete                # quand `rm *` dit « trop d'arguments »

> fichier.log                 # vider sans supprimer (garde le descripteur ouvert)
truncate -s 0 fichier.log     # idem, plus explicite
```

`rm -I` est le bon compromis : `-i` demande pour chaque fichier — donc on prend
l'habitude de marteler `y`, ce qui annule l'intérêt — alors que `-I` ne demande
qu'une fois, et seulement quand c'est massif ou récursif.

## Corbeille (*trash*)

`rm` ne connaît pas la corbeille. Celle du bureau appartient au gestionnaire de
fichiers (Thunar, Nautilus…), **pas** au gestionnaire de fenêtres : qtile ou i3
n'ont rien pour la vider. Elle suit la norme freedesktop et vit dans
`~/.local/share/Trash` (et `.Trash-1000/` à la racine des disques externes).

Paquet `trash-cli`, qui partage la même corbeille que le gestionnaire de
fichiers :

```sh
trash-put <FICHIER>           # mettre a la corbeille au lieu de rm
trash-list                    # lister, avec date de suppression et chemin d'origine
trash-restore                 # restaurer : liste numerotee des fichiers supprimes SOUS le dossier courant
trash-restore /               # idem, pour toute la corbeille
trash-rm '*.log'              # supprimer definitivement de la corbeille ce qui correspond au motif
trash-empty --dry-run         # simuler : ce qui serait supprime
trash-empty                   # vider la corbeille
trash-empty 30                # vider seulement ce qui a plus de 30 jours
trash-empty -f                # vider sans demander confirmation (script, raccourci)
```

Sans `trash-cli`, `gio` (livré avec GLib, souvent déjà là) fait l'essentiel :

```sh
gio trash <FICHIER>           # mettre a la corbeille
gio list trash://             # lister
gio trash --empty             # vider la corbeille
```

Raccourci qtile, dans `~/.config/qtile/config.py` :

```python
Key([mod, "shift"], "Delete", lazy.spawn("trash-empty -f")),  # vider la corbeille
```

## Liens

```sh
ln -s /chemin/reel lien       # lien symbolique (symlink)
ln -sf /nouveau/reel lien     # le refaire pointer ailleurs
ln fichier copie              # lien physique : le meme inode, pas une copie
readlink -f lien              # ou pointe-t-il vraiment
rm lien                       # supprime le LIEN, jamais la cible
```

## Pièges

- **Il n'y a pas de corbeille** (*recycle bin*)**.** `rm` ne demande rien et ne garde rien. Le
  réflexe qui sauve : lancer d'abord la même sélection avec `ls` ou `find` sans
  `-delete`, et n'ajouter la suppression qu'une fois la liste vérifiée. Ou
  `trash-put` à la place de `rm` quand on veut pouvoir revenir en arrière.
- **`trash-restore` ne propose que ce qui venait du dossier courant.** Lancé
  depuis `~/Documents`, il ne voit pas un fichier supprimé dans `~/Images` :
  « No files trashed from current dir ». Lui passer le chemin d'origine, ou `/`.
- **Ne pas faire `alias rm=trash-put`.** Les options diffèrent, et l'habitude
  prise suit sur un serveur où l'alias n'existe pas : là, `rm` supprime pour de
  bon. Taper `trash-put` explicitement.
- **La variable vide qui efface tout.** `rm -rf "$DIR"/*` avec `DIR` non défini
  devient `rm -rf /*`. GNU `rm` protège `/` lui-même, pas `/*`. Dans un script,
  écrire `rm -rf "${DIR:?DIR non defini}"/*` : le `:?` fait échouer la commande
  au lieu de la lancer sur la racine.
- **L'espace de trop.** `rm -rf / home/vieux` au lieu de `rm -rf /home/vieux`
  est l'accident classique. Relire la ligne avant `Entrée`, toujours.
- **Un nom commençant par `-` est pris pour une option.** `rm -- -fichier`, ou
  `rm ./-fichier`.
- **`rsync` et la barre oblique finale.** `rsync -a src/ dst/` copie le
  *contenu* de `src` ; `rsync -a src dst/` crée `dst/src`. Une barre de
  différence, deux résultats. Le `--dry-run` avant chaque `--delete` n'est pas
  de la prudence excessive, c'est la procédure.
- **`cp -r` ne préserve ni les dates, ni le propriétaire, ni les liens.** Pour
  une sauvegarde, c'est `cp -a` (ou `rsync -a`), jamais `cp -r`.
- **`mv` écrase sans rien dire.** Ajouter `-n` (jamais écraser) ou `-i` dès que
  la destination existe peut-être. Et un `mv` entre deux systèmes de fichiers
  n'est pas atomique : c'est une copie suivie d'une suppression, interruptible
  au milieu.
- **Supprimer un fichier ne libère pas l'espace tant qu'un processus le tient
  ouvert.** C'est le classique « `df` dit plein, `du` dit vide » : un log
  supprimé alors que le service écrit encore dedans. `lsof +L1` liste ces
  fichiers — voir [lsof](lsof.md). D'où l'intérêt de `> fichier.log` plutôt que
  `rm` sur un log actif.
- **Les droits qui comptent sont ceux du dossier, pas ceux du fichier.** Avec
  l'écriture sur un répertoire, on peut supprimer un fichier appartenant à
  quelqu'un d'autre. C'est le rôle du *sticky bit* sur `/tmp` (`drwxrwxrwt`) :
  il rend cette suppression impossible sauf au propriétaire.
- **`shred` ne garantit rien sur un SSD**, ni sur btrfs, ZFS, ou un ext4
  journalisé : la copie d'origine peut survivre ailleurs. Pour effacer
  réellement, c'est le chiffrement du disque en amont, pas l'effacement en aval.
- `rm -r lien-vers-dossier/` avec une barre finale peut suivre le lien selon
  l'implémentation. Sur un lien, ne jamais mettre la barre.

## Voir aussi

- [Windows : créer, copier, renommer, supprimer](../windows/fichiers.md)
- [lsof : trouver ce qui occupe un port, un volume ou un fichier](lsof.md)
- [Équivalences bash / cmd / PowerShell](../windows/equivalences-bash.md)
- [Ressources sur le shell et la ligne de commande](ressources.md)
