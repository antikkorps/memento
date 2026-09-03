---
title: "ufw : le pare-feu simple"
tags: [linux, reseau, securite]
created: 2026-09-03
updated: 2026-09-03
status: stable
---

## En bref

Une façade lisible au-dessus de `nftables`/`iptables`. La séquence à ne jamais
inverser : **autoriser SSH d'abord, activer ensuite.**

## La mise en route, dans cet ordre

```sh
sudo ufw allow OpenSSH            # OU : sudo ufw allow 22/tcp -- EN PREMIER
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw enable                   # demande confirmation, coupe les sessions si mal fait
sudo ufw status verbose
```

## Les règles

```sh
sudo ufw allow 80/tcp
sudo ufw allow 443                          # ouvre TCP *et* UDP
sudo ufw allow 8000:8010/tcp                # une plage
sudo ufw allow from 192.168.1.0/24          # une source entiere
sudo ufw allow from 10.0.0.5 to any port 3306 proto tcp
sudo ufw allow in on eth1 to any port 5432  # limite a une interface
sudo ufw deny 23
sudo ufw limit 22/tcp                       # 6 connexions max par 30 s et par IP
```

Les **profils applicatifs** évitent de retenir les numéros :

```sh
sudo ufw app list
sudo ufw app info 'Nginx Full'
sudo ufw allow 'Nginx Full'
```

## Lire et défaire

```sh
sudo ufw status verbose           # les regles et les politiques par defaut
sudo ufw status numbered          # avec un numero par regle
sudo ufw delete 3                 # supprimer la regle numero 3
sudo ufw delete allow 80/tcp      # supprimer par son libelle
sudo ufw reset                    # TOUT effacer et desactiver
sudo ufw disable
sudo ufw logging medium           # off / low / medium / high
sudo tail -f /var/log/ufw.log
```

## Pièges

- **Activer `deny incoming` sans avoir autorisé SSH coupe l'accès à la
  machine.** Sur un serveur distant, c'est irrattrapable sans console de secours
  chez l'hébergeur. `ufw allow OpenSSH` **avant** `ufw enable`, toujours — et
  garder une session ouverte pendant le test.
- **Docker contourne ufw, complètement.** Un conteneur lancé avec
  `-p 3306:3306` insère ses règles dans la chaîne `DOCKER`, en amont de celles
  d'ufw : le port est exposé sur Internet même avec `ufw deny 3306`, et
  `ufw status` n'en dit rien. La parade est de publier sur la boucle locale
  (`-p 127.0.0.1:3306:3306`) et de laisser un proxy faire l'exposition. C'est le
  piège le plus coûteux de cette fiche, parce qu'il donne un faux sentiment de
  sécurité.
- **Les numéros de règles se décalent après chaque suppression.** Enchaîner
  `ufw delete 3` puis `ufw delete 4` ne supprime pas ce qu'on croit : relancer
  `ufw status numbered` entre chaque.
- **`ufw allow 443` ouvre TCP et UDP.** Préciser `/tcp` quand seul TCP est
  voulu — d'autant qu'HTTP/3 passe bien en UDP, donc le choix doit être
  délibéré.
- **La règle la plus spécifique doit venir avant la générale**, ufw appliquant
  la première qui correspond. `ufw insert 1 …` permet de placer une règle en
  tête.
- **Le trafic sortant est autorisé par défaut.** Un `default deny outgoing` est
  possible mais casse tout ce qui n'a pas été prévu, à commencer par les mises
  à jour et le DNS.
- **IPv6 est traité séparément.** Vérifier `IPV6=yes` dans `/etc/default/ufw` :
  sinon la machine est protégée en IPv4 et ouverte en IPv6.
- Un pare-feu local ne remplace pas les groupes de sécurité du fournisseur cloud.
  Les deux couches se cumulent, et c'est la plus restrictive qui gagne.
- `ufw reset` désactive aussi le pare-feu : la machine se retrouve sans
  protection jusqu'au prochain `enable`.

## Voir aussi

- [fail2ban : bannir les tentatives répétées](fail2ban.md)
- [SSH : clés, configuration et tunnels](../reseau/ssh.md)
- [TCP et UDP : quand et pourquoi](../reseau/tcp-udp.md)
- [Docker : commandes courantes](../docker/commandes-courantes.md)
