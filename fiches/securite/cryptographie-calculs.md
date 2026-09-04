---
title: "Cryptographie : les algorithmes et leurs calculs"
tags: [securite, terminal]
created: 2026-09-04
updated: 2026-09-04
status: stable
---

## En bref

Le pendant calculatoire de [Chiffrement, hachage et signature](chiffrement.md) :
là où l'autre fiche dit *quoi utiliser*, celle-ci dit **comment ça compte**.
César, Vigenère, XOR, modulo, un RSA et un Diffie-Hellman en petits nombres —
tout ce qui se fait à la main sur un coin de table, et qui tombe en examen.

Un rappel de vocabulaire avant tout le reste : on dit **symétrique** et
**asymétrique**. « Synchrone » et « asynchrone » désignent autre chose (le temps,
pas les clés) et n'ont aucun sens ici.

## Les quatre familles

| Famille | Principe | Exemple |
| --- | --- | --- |
| Substitution | remplacer chaque symbole | César, Vigenère |
| Transposition | garder les symboles, changer l'ordre | scytale, colonnes |
| Chiffrement par flux (*stream*) | un octet à la fois, XOR avec un flux de clé | RC4, ChaCha20 |
| Chiffrement par bloc (*block*) | par paquets de 128 bits | AES, DES |

**Principe de Kerckhoffs** : la sécurité doit reposer sur la clé seule, jamais
sur le secret de l'algorithme. Un algorithme public et analysé depuis vingt ans
est plus sûr qu'un algorithme maison que personne n'a attaqué.

## César : un décalage constant

L'alphabet indexé de 0 à 25 (`A`=0, `Z`=25), et une clé qui est un nombre.

```text
chiffrer   : C = (P + k) mod 26
dechiffrer : P = (C - k) mod 26
```

Avec `k = 3`, la clé historique :

| Clair | A | T | T | A | Q | U | E |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Index | 0 | 19 | 19 | 0 | 16 | 20 | 4 |
| +3 mod 26 | 3 | 22 | 22 | 3 | 19 | 23 | 7 |
| Chiffré | D | W | W | D | T | X | H |

```sh
echo 'ATTAQUE A LAUBE' | tr 'A-Za-z' 'D-ZA-Cd-za-c'   # cesar +3
echo 'DWWDTXH D ODXEH' | tr 'A-Za-z' 'X-ZA-Wx-za-w'   # cesar -3, on retrouve le clair
echo 'Bonjour' | tr 'A-Za-z' 'N-ZA-Mn-za-m'           # rot13 : k=13, son propre inverse
```

Le calcul qui condamne César : **25 clés utiles**. On les essaie toutes plus vite
qu'on ne lit l'énoncé.

```sh
python3 -c 'c="DWWDTXH"; [print(k, "".join(chr((ord(x)-65-k)%26+65) for x in c)) for k in range(1,26)]'   # les 25 decalages
```

Corollaire : **deux César enchaînés font un seul César** de clé `k1 + k2`.
Chiffrer deux fois ne renforce rien.

## Substitution libre : beaucoup de clés, aucune sécurité

Une permutation quelconque de l'alphabet, ce sont 26! ≈ 4 × 10²⁶ clés — plus
qu'AES-64. Et pourtant ça se casse en quelques minutes par **analyse de
fréquences**, parce que la structure de la langue traverse la substitution.

En français : `E` ≈ 15 %, puis `A`, `S`, `I`, `N`, `T`. Les mots d'une lettre
sont `A` ou `Y`, les doubles lettres fréquentes `SS`, `LL`, `EE`.

**La leçon est le vrai point de la fiche** : la taille de l'espace de clés est un
*plafond* de sécurité, jamais une mesure. Un algorithme qui laisse fuir de la
structure est cassé quel que soit ce plafond.

## Vigenère : un César par lettre de clé

La clé est un mot, répété sous le message.

```text
C(i) = (P(i) + K(i mod m)) mod 26      # m = longueur de la cle
```

Clé `CLE` (2, 11, 4) sur `ATTAQUE` :

| Clair | A | T | T | A | Q | U | E |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Clé | C | L | E | C | L | E | C |
| Somme mod 26 | 2 | 4 | 23 | 2 | 1 | 24 | 6 |
| Chiffré | C | E | X | C | B | Y | G |

Deux `T` identiques donnent `E` puis `X` : les fréquences sont brouillées. Mais
la clé se répète, donc l'attaque se fait en deux temps — retrouver `m`
(répétitions de motifs, *Kasiski* ; indice de coïncidence), puis résoudre `m`
César indépendants. **Une clé plus courte que le message est toujours la faille.**

## XOR : le calcul de base de la crypto moderne

| P | K | P ⊕ K |
| --- | --- | --- |
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 0 |

XOR est **involutif** : `(P ⊕ K) ⊕ K = P`. Un seul et même code chiffre et
déchiffre, ce qui explique sa présence partout.

```text
'A' = 0x41 = 0100 0001
 K  = 0x0F = 0000 1111
  ⊕        = 0100 1110 = 0x4E = 'N'
```

```sh
echo -n 'A' | xxd -b                                          # voir les bits d'un octet
python3 -c 'print(bytes(b ^ 0x0f for b in b"secret").hex())'  # xor : 7c6a6c7d6a7b
python3 -c 'print(bytes(b ^ 0x0f for b in bytes.fromhex("7c6a6c7d6a7b")).decode())'   # le meme code dechiffre
```

**Masque jetable** (*one-time pad*) : XOR avec une clé aléatoire, aussi longue
que le message, **utilisée une seule fois**. C'est le seul chiffrement
mathématiquement incassable — et le seul dont les trois conditions ne sont jamais
réunies en pratique.

Réutiliser la clé sur deux messages annule tout : `C1 ⊕ C2 = P1 ⊕ P2`, la clé
disparaît de l'équation et il ne reste que deux textes clairs superposés, qu'on
sépare par devinettes successives (*crib dragging*).

## Modulo : l'arithmétique qui porte tout

Le modulo sert deux fois : il **referme** l'ensemble (rester dans l'alphabet, ou
dans 128 bits) et il **détruit l'information** de départ — connaître
`7^11 mod 13` ne dit rien sur 11. C'est cette asymétrie qui fait la crypto à clé
publique.

```sh
python3 -c 'print((-3) % 26)'        # 23 : python ramene dans [0, 26[
node -e 'console.log(-3 % 26)'       # -3 : JS, C, Java gardent le signe
python3 -c 'print(pow(7, 11, 13))'   # exponentiation modulaire, sans calculer 7^11
```

## RSA en petits nombres

À faire une fois à la main, c'est ce qui fait comprendre le reste.

```text
p = 3, q = 11                 deux premiers
n = p × q = 33                le module, public
φ(n) = (p-1)(q-1) = 20        indicatrice d'Euler
e = 3                         public, premier avec φ(n)
d = 7                         prive : e × d ≡ 1 mod φ(n)  →  3 × 7 = 21 ≡ 1 mod 20

chiffrer   : C = M^e mod n  →  4^3  = 64  mod 33 = 31
dechiffrer : M = C^d mod n  →  31^7          mod 33 = 4
```

```sh
python3 -c 'print(pow(4, 3, 33), pow(31, 7, 33))'   # 31 4 : aller et retour
```

La sécurité tient à un seul point : **retrouver `p` et `q` à partir de `n`**.
Trivial sur 33, hors de portée sur 2048 bits. Rien d'autre n'est difficile
là-dedans.

## Diffie-Hellman en petits nombres

Se mettre d'accord sur un secret partagé **sans jamais le transmettre**.

```text
public   : p = 23, g = 5
Alice    : a = 6  (secret)   →  A = 5^6  mod 23 = 8    (envoye)
Bob      : b = 15 (secret)   →  B = 5^15 mod 23 = 19   (envoye)
Alice    : B^a mod 23 = 19^6 mod 23 = 2
Bob      : A^b mod 23 =  8^15 mod 23 = 2      →  meme secret, jamais transmis
```

```sh
python3 -c 'print(pow(5,6,23), pow(5,15,23), pow(19,6,23), pow(8,15,23))'   # 8 19 2 2
```

Un espion voit `p`, `g`, `8` et `19`, et doit résoudre `5^x mod 23 = 8` — le
**logarithme discret**. C'est l'échange de clés de TLS et de SSH, voir
[HTTPS et TLS](../reseau/https.md).

## Tailles de clés : le seul calcul à retenir

Une clé de `n` bits, c'est `2^n` possibilités, et une force brute qui coûte `2^(n-1)`
essais en moyenne. Chaque bit ajouté **double** le coût de l'attaque.

| Clé | Espace | Verdict |
| --- | --- | --- |
| César | 25 | instantané |
| DES, 56 bits | 7 × 10¹⁶ | cassé publiquement depuis 1998 |
| AES-128 | 3 × 10³⁸ | hors de portée |
| AES-256 | 10⁷⁷ | marge contre le quantique |

**Les tailles ne se comparent pas entre familles.** Le facteur limitant n'est pas
le même : force brute d'un côté, factorisation ou log discret de l'autre.

| Sécurité effective | Symétrique | RSA / DH | Courbes elliptiques |
| --- | --- | --- | --- |
| 112 bits | 3DES | 2048 bits | 224 bits |
| 128 bits | AES-128 | 3072 bits | 256 bits |
| 256 bits | AES-256 | 15360 bits | 512 bits |

Pour un **hachage** de `n` bits, l'attaque de référence n'est pas la force brute
mais le **paradoxe des anniversaires** : une collision arrive vers `2^(n/2)`.
SHA-256 offre donc 128 bits de résistance aux collisions, pas 256.

## Pièges

- **On ne dit pas « synchrone / asynchrone »** mais **symétrique / asymétrique**.
  La confusion est fréquente et immédiatement sanctionnée à l'oral.
- **César, Vigenère et XOR à clé courte n'ont aucune valeur de sécurité.** Ils
  sont là pour comprendre le mécanisme, jamais pour protéger un fichier.
- **Un grand espace de clés ne fait pas un bon chiffrement** : la substitution
  libre a 26! clés et tombe à l'analyse de fréquences.
- **Une clé XOR réutilisée révèle les deux messages** sans qu'on ait à chercher
  la clé. Un flux de clé ne se rejoue jamais — d'où les *nonces*.
- **Le modulo négatif dépend du langage** : `-3 % 26` vaut `23` en Python mais
  `-3` en JS, C et Java. Écrire `((x % 26) + 26) % 26` dans ces derniers.
- **Chiffrer deux fois ne renforce pas** : deux César s'additionnent en un seul,
  et ROT13 appliqué deux fois rend le clair.
- **Comparer 2048 bits de RSA à 256 bits d'AES est un raisonnement faux.** RSA
  2048 vaut ≈ 112 bits de sécurité effective.
- **Un hachage de 256 bits résiste à 128 bits en collision.** Diviser par deux
  est le réflexe à avoir.
- **Ne jamais implémenter soi-même** : ces calculs sont justes sur le papier et
  faux en production (temps constant, remplissage, générateur aléatoire). Le
  détail d'implémentation est l'endroit où sont les failles.

## Voir aussi

- [Chiffrement, hachage et signature](chiffrement.md)
- [Générer des secrets, clés et mots de passe](generer-des-secrets.md)
- [HTTPS et TLS : ce qui se passe avant la page](../reseau/https.md)
- [Lexique de l'évaluation de sécurité](lexique.md)
