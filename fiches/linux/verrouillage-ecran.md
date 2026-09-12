---
title: "i3 : l'écran gris de i3lock, et sortir d'un verrouillage"
tags: [linux, bureau, depannage]
created: 2026-09-12
updated: 2026-09-12
status: stable
---

## En bref

Un écran gris uni, sans champ ni invite, qui refuse tout : ce n'est pas un
plantage, c'est **i3lock**. On y tape son mot de passe à l'aveugle, directement.
Et une touche Entrée avant de commencer compte comme un essai raté. Cette fiche
couvre aussi comment en sortir sans redémarrer, et comment changer
d'utilisateur.

## Qui déclenche le verrouillage

```sh
xset q | grep -A2 -i "screen saver"     # timeout: 600  -> 10 min d'inactivite
grep -n xss-lock ~/.config/i3/config
```

```
exec --no-startup-id xss-lock --transfer-sleep-lock -- i3lock --nofork
```

Cette ligne est dans la **configuration i3 par défaut de Debian**. La chaîne
complète : après le délai d'inactivité, le serveur X déclenche son économiseur
d'écran → `xss-lock` l'intercepte → il lance `i3lock`. Le DPMS éteint l'écran au
même moment, ce qui accentue l'impression de machine morte.

**Ce n'est pas la mise en veille.** La confusion est naturelle, la vérification
immédiate :

```sh
journalctl | grep -iE "systemd-sleep|Entering sleep"   # vide = la machine n'a jamais dormi
```

## L'écran gris n'a pas de champ de saisie

C'est l'apparence par défaut de i3lock : fond gris uni, aucune invite, aucun
curseur. **On tape son mot de passe directement**, à l'aveugle ; l'indicateur
rond n'apparaît qu'à la première touche, puis passe au rouge en cas d'échec.

Le piège est le réflexe de réveiller la machine avec Entrée. `man i3lock`, à
l'option `-e` :

> When an empty password is provided by the user, do not validate it. Without
> this option, the empty password will be provided to PAM and, if invalid, the
> user will have to wait a few seconds […] happen to wake up your computer with
> the enter key.

Autrement dit, sans `-e`, cette Entrée part dans PAM comme un vrai essai, échoue,
et impose une pénalité de quelques secondes. La preuve est dans le journal :

```sh
journalctl | grep "i3lock:auth"
# pam_unix(i3lock:auth): authentication failure; user=franck
```

Options qui rendent l'écran moins hostile, si on veut s'écarter du défaut :

| Option | Effet |
| --- | --- |
| `-e` | une Entrée à vide ne compte plus comme un essai |
| `-f` | affiche le nombre d'essais ratés |
| `-k` | affiche la disposition clavier |
| `-c 1e1e2e` | un fond sombre plutôt que le gris qui fait penser à un plantage |

## Sortir sans redémarrer

Le changement de console n'est **pas** bloqué pendant le verrouillage :

```
Ctrl+Alt+F3          console texte
franck + mot de passe
pkill i3lock
Ctrl+Alt+F2          retour dans la session graphique, intacte
```

Le numéro de console de sa propre session, quand on ne le connaît pas :

```sh
loginctl list-sessions        # colonne TTY, ici tty2
```

## Changer d'utilisateur

i3lock ne sait qu'authentifier le propriétaire de la session : changer
d'utilisateur est le métier du gestionnaire de connexion. Pour une session
graphique supplémentaire sous GDM, remplaçant de l'ancien `gdmflexiserver` :

```sh
dbus-send --system --dest=org.gnome.DisplayManager \
  /org/gnome/DisplayManager/LocalDisplayFactory \
  org.gnome.DisplayManager.LocalDisplayFactory.CreateTransientDisplay
```

GDM ouvre un écran de connexion sur une console libre ; les deux sessions
coexistent, chacune sur sa console.

## Tester le verrouillage automatique sans attendre dix minutes

```sh
xset -dpms      # l'ecran ne s'eteint plus
xset s 60       # mais l'economiseur se declenche au bout de 60 s
```

Ne plus rien toucher pendant une minute. Pour revenir à l'état d'origine, ou
simplement se reconnecter — ces réglages ne vivent que dans la session courante :

```sh
xset +dpms
xset s 600
```

## Pièges

- **`xset s off` ne « désactive pas la mise en veille », il supprime le
  déclencheur.** L'économiseur d'écran *est* ce qui réveille `xss-lock` : sans
  lui, plus aucun verrouillage. Pour garder le verrou tout en empêchant l'écran
  de s'éteindre, c'est `xset -dpms` **seul**.
- **Un écran gris peut aussi être l'autotest du moniteur** — un cadre flottant
  affiché quand il ne reçoit plus de signal. Le test qui tranche : `Ctrl+Alt+F3`.
  Si la console texte s'affiche, l'écran va bien et le problème est ailleurs ; si
  l'écran reste gris, c'est qu'aucun signal ne sort.
- **Verr. Num éteint** : les chiffres tapés au pavé numérique ne sont pas saisis
  du tout, ils valent flèches et `Début`/`Fin`. Un mot de passe chiffré au pavé
  échoue alors systématiquement, sans le moindre indice à l'écran. `xset q |
  grep "LED mask"` renvoie `00000000` quand il est éteint ; `numlockx on` dans la
  configuration i3 règle la question.
- **Le verrouillage protège l'écran, pas la machine.** Les consoles texte
  restent accessibles — c'est ce qui permet le `pkill i3lock` ci-dessus. Sur une
  machine exposée, `DontVTSwitch` dans la configuration Xorg ferme cette porte,
  mais supprime du même coup la sortie de secours.

## Voir aussi

- [i3 : raccourcis par défaut et configuration](i3.md)
- [Linux : lister, inspecter et tuer un processus](processus.md)
