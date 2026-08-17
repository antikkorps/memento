# memento

Base de connaissance personnelle : des fiches markdown, une hiérarchie peu
profonde pour ranger, des tags pour croiser.

Les conventions sont dans [CONVENTIONS.md](CONVENTIONS.md), le vocabulaire de
tags dans [TAGS.md](TAGS.md), le modèle de fiche dans
[templates/fiche.md](templates/fiche.md).

Régénérer l'index après avoir ajouté ou modifié une fiche :

```sh
npm run index
```

Chercher les fiches portant un tag (`--tag` seul liste le vocabulaire) :

```sh
node scripts/index.js --tag reseau
```

Tout ce qui suit est généré par `scripts/index.js` : ne pas l'éditer à la main.

<!-- INDEX:START -->

## Fiches

### git

- [Remotes git et miroirs](fiches/git/remotes.md)

### linux

- [Lister les paquets installés manuellement](fiches/linux/paquets-installes.md)
- [Libérer un volume ou un dossier occupé](fiches/linux/volume-occupe.md) — _brouillon_

### reseau

- [nmap : scan de ports et découverte réseau](fiches/reseau/nmap.md) — _brouillon_

### securite

- [Lexique de l'évaluation de sécurité](fiches/securite/lexique.md)

## Inbox

_Vide._

## Index par tag

### depannage

- [Libérer un volume ou un dossier occupé](fiches/linux/volume-occupe.md)

### git

- [Remotes git et miroirs](fiches/git/remotes.md)

### linux

- [Lister les paquets installés manuellement](fiches/linux/paquets-installes.md)
- [Libérer un volume ou un dossier occupé](fiches/linux/volume-occupe.md)

### procedure

- [Remotes git et miroirs](fiches/git/remotes.md)
- [Lister les paquets installés manuellement](fiches/linux/paquets-installes.md)

### reseau

- [nmap : scan de ports et découverte réseau](fiches/reseau/nmap.md)

### securite

- [nmap : scan de ports et découverte réseau](fiches/reseau/nmap.md)
- [Lexique de l'évaluation de sécurité](fiches/securite/lexique.md)

## Compteurs

| | |
| --- | --: |
| Fiches classées | 5 |
| Fiches en inbox | 0 |
| Brouillons | 2 |
| Tags utilisés | 6 |
| Tags déclarés | 11 |

<!-- INDEX:END -->
