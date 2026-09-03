---
title: "SSH : clés, configuration et tunnels"
tags: [reseau, securite, terminal]
created: 2026-09-03
updated: 2026-09-03
status: stable
---

## En bref

Se connecter, oui — mais l'essentiel est ailleurs : **le fichier
`~/.ssh/config`** qui supprime les commandes à rallonge, et **les tunnels**, qui
transforment SSH en outil réseau à part entière.

## Se connecter

```sh
ssh johndoe@serveur.tld
ssh -p 2222 johndoe@serveur.tld       # port non standard
ssh -i ~/.ssh/cle_projet johndoe@serveur.tld
ssh johndoe@serveur.tld 'uptime; df -h'  # executer et repartir
ssh -v johndoe@serveur.tld            # diagnostiquer (-vv, -vvv pour plus)
```

## Les clés

```sh
ssh-keygen -t ed25519 -C 'johndoe@portable'   # generer une paire
ssh-copy-id johndoe@serveur.tld               # installer la publique la-bas
ssh-copy-id -i ~/.ssh/cle_projet.pub johndoe@serveur.tld
```

La clé **publique** (`.pub`) part sur le serveur, dans
`~/.ssh/authorized_keys`. La clé **privée** ne quitte jamais la machine.

Les droits sont vérifiés par SSH et non négociables :

```sh
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_ed25519 ~/.ssh/authorized_keys
chmod 644 ~/.ssh/id_ed25519.pub
```

## L'agent, pour ne taper la phrase de passe qu'une fois

```sh
eval "$(ssh-agent -s)"      # demarrer l'agent
ssh-add ~/.ssh/id_ed25519   # y charger la cle
ssh-add -l                  # ce qu'il contient
ssh-add -D                  # tout oublier
```

## `~/.ssh/config`, le vrai gain

```
Host prod
    HostName 203.0.113.10
    User deploy
    Port 2222
    IdentityFile ~/.ssh/cle_prod
    ServerAliveInterval 60

Host interne
    HostName 10.0.0.42
    User johndoe
    ProxyJump prod          # rebond automatique par la machine « prod »

Host *
    AddKeysToAgent yes
    HashKnownHosts yes
```

`ssh prod` remplace alors la ligne complète — et `scp`, `rsync`, `git` lisent le
même fichier.

## Copier des fichiers

```sh
scp fichier.txt prod:/srv/app/
scp -r dossier/ prod:/srv/                  # recursif
scp prod:/var/log/app.log .                 # dans l'autre sens
rsync -avz --progress dossier/ prod:/srv/   # mieux : reprenable, incremental
```

## Tunnels

```sh
# LOCAL : le port 8080 chez moi arrive sur le 3306 vu depuis « prod »
ssh -L 8080:localhost:3306 prod

# DISTANT : le port 9000 sur « prod » revient sur mon 3000 local
ssh -R 9000:localhost:3000 prod

# SOCKS : un proxy local, tout le trafic passe par « prod »
ssh -D 1080 prod

# sans ouvrir de shell, en tache de fond
ssh -N -f -L 8080:localhost:3306 prod
```

Se lit toujours pareil : `-L <port ici>:<hôte vu de là-bas>:<port là-bas>`.

## Durcir le serveur

Dans `/etc/ssh/sshd_config`, puis `sudo systemctl reload sshd` :

```
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
AllowUsers johndoe deploy
MaxAuthTries 3
```

## Pièges

- **Les droits trop larges font échouer la connexion en silence.** Un
  `~/.ssh` en 755, une clé privée en 644, ou un répertoire personnel accessible
  en écriture au groupe : SSH refuse d'utiliser la clé et retombe sur le mot de
  passe sans expliquer pourquoi. C'est la cause n° 1, et `ssh -vv` la montre.
- **Ne jamais couper `PasswordAuthentication` avant d'avoir testé sa clé.**
  Garder une session ouverte pendant le test : si la clé ne marche pas, cette
  session est le seul moyen de revenir en arrière.
- **`ssh-copy-id` a besoin de l'authentification par mot de passe** encore
  active. Une fois désactivée, il faut passer la clé autrement.
- **`REMOTE HOST IDENTIFICATION HAS CHANGED`** a deux causes très différentes :
  le serveur a été réinstallé (bénin), ou quelqu'un s'intercale (grave). Ne pas
  supprimer la ligne par réflexe — vérifier l'empreinte auprès de l'hébergeur,
  puis `ssh-keygen -R serveur.tld`.
- **L'agent forwarding (`-A`) est dangereux.** Sur une machine dont
  l'administrateur n'est pas de confiance, root peut se servir de ton agent pour
  rebondir partout où tes clés ouvrent. `ProxyJump` fait la même chose sans ce
  risque : le rebond ne voit jamais l'agent.
- **Les clés `ssh-rsa` sont refusées par OpenSSH 8.8+** (signatures SHA-1). Si
  une vieille clé cesse de fonctionner après une mise à jour, c'est ça —
  regénérer en `ed25519`.
- **Changer le port n'est pas une mesure de sécurité**, seulement du bruit en
  moins dans les journaux. Ce qui protège réellement, c'est l'authentification
  par clé et la désactivation du mot de passe.
- **`-R` n'écoute que sur `localhost` du serveur** par défaut ; ouvrir au-delà
  demande `GatewayPorts yes` côté serveur — et y réfléchir à deux fois.
- Une connexion qui tombe au bout de quelques minutes d'inactivité :
  `ServerAliveInterval 60` côté client règle le cas, presque toujours dû à un
  NAT ou un pare-feu qui oublie la session.

## Voir aussi

- [Chiffrement, hachage et signature](../securite/chiffrement.md)
- [DNS : résolution et enregistrements](dns.md)
- [Linux : droits, propriétaire et umask](../linux/droits.md)
- [Générer des secrets, clés et mots de passe](../securite/generer-des-secrets.md)
