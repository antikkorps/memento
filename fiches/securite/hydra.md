---
title: "Hydra : brute-force d'authentification en ligne"
tags: [securite, reseau, terminal]
created: 2026-09-19
updated: 2026-09-19
status: stable
---

## En bref

Deviner un mot de passe en **frappant le service directement** : SSH, FTP, RDP,
un formulaire web… Hydra essaie chaque combinaison utilisateur/mot de passe d'une
liste jusqu'à ce qu'une réponse dise « réussi ». Le cycle : **choisir le service
→ fournir les identifiants à tester → lire les réussites.**

C'est du brute-force **en ligne** (*online*), contre un service vivant — à ne pas
confondre avec [John the Ripper](john-the-ripper.md) et
[hashcat](hashcat.md), qui cassent des hachages déjà récupérés, **hors ligne** et
sans limite de débit.

## Syntaxe générale

```sh
hydra -l johndoe -P rockyou.txt ssh://10.10.10.5     # un user connu, une liste de mots de passe
hydra -L users.txt -P rockyou.txt ftp://10.10.10.5   # listes des deux cotes
hydra -l johndoe -p Ete2026 ssh://10.10.10.5         # une seule paire (verifier un identifiant)
```

`-l`/`-p` en minuscule = **une** valeur ; `-L`/`-P` en majuscule = **un fichier**.
La liste de mots de passe la plus courante :

```sh
/usr/share/wordlists/rockyou.txt        # a decompresser une fois : gunzip rockyou.txt.gz
```

## Options qui reviennent

| Option | Effet |
| --- | --- |
| `-t 4` | nombre de tentatives parallèles (**4 pour SSH**, sinon ça décroche) |
| `-f` | s'arrêter dès le premier couple trouvé |
| `-s 2222` | port non standard |
| `-V` / `-vV` | afficher chaque essai (utile pour vérifier que ça avance) |
| `-e nsr` | essayer aussi : `n` mot de passe vide, `s` = login, `r` login à l'envers |

## Formulaires web

Le mode le plus délicat : Hydra ne « voit » pas si la connexion a réussi, il faut
le lui dire avec une chaîne présente **en cas d'échec** (`F=`) ou de réussite
(`S=`).

```sh
hydra -l admin -P rockyou.txt 10.10.10.5 http-post-form \
  "/login:username=^USER^&password=^PASS^:F=identifiants invalides"
```

Trois champs séparés par `:` — le chemin, le corps POST avec les marqueurs
`^USER^`/`^PASS^`, et la condition. `http-get-form` existe pour les formulaires en
`GET`. La chaîne `F=` doit être **exactement** un morceau du texte renvoyé sur
échec ; on la relève d'abord en tentant une connexion bidon.

## Pièges

- **La chaîne `F=`/`S=` est tout le sujet.** Si elle ne correspond pas au vrai
  message d'échec, Hydra croit *tout* réussir (des centaines de faux positifs)
  ou *tout* échouer. La vérifier à la main avant de lancer la liste complète.
- **Le verrouillage de compte** (*account lockout*). Beaucoup d'applis bloquent
  après quelques essais ratés : le brute-force verrouille alors le compte visé
  sans jamais trouver. Vérifier la politique avant.
- **`-t` trop haut sur SSH fait décrocher la connexion** et fausse les
  résultats. Rester à `-t 4` pour SSH ; les services web encaissent davantage.
- **La limitation de débit** (*rate limiting*) ralentit ou coupe : un brute-force
  bruyant est facile à détecter et à bloquer.
- **Hydra ne casse pas les hachages.** Face à un fichier de hachages
  récupéré, c'est [john](john-the-ripper.md) ou [hashcat](hashcat.md), sans
  toucher au réseau.
- **Ne viser que ce qui est autorisé.** Le brute-force en ligne est une attaque
  active, journalisée et souvent contractuellement encadrée.

## Voir aussi

- [John the Ripper : casser des hachages hors ligne](john-the-ripper.md)
- [hashcat : casser des hachages sur GPU](hashcat.md)
- [gobuster : brute-force de chemins, DNS et vhosts](gobuster.md)
- [Méthodologie : de la reconnaissance au shell (web)](methodologie-pentest-web.md)
- [nmap : scan de ports et découverte réseau](../reseau/nmap.md)
- <https://github.com/vanhauser-thc/thc-hydra>
