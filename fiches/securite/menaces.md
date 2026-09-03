---
title: "Maliciels, attaques et vocabulaire des menaces"
tags: [securite]
created: 2026-09-03
updated: 2026-09-03
status: stable
---

## En bref

Le vocabulaire qu'une certification interroge par définitions et distinctions.
Les pièges d'examen sont toujours au même endroit : **virus ou ver**, **force
brute ou bourrage d'identifiants**, **menace ou vulnérabilité ou risque**.

## Les trois mots à ne pas confondre

| Terme | Définition |
| --- | --- |
| **Vulnérabilité** | une faiblesse dans le système |
| **Menace** (*threat*) | ce qui pourrait l'exploiter |
| **Risque** | probabilité × impact — ce qu'on gère réellement |
| **Vecteur** | le chemin emprunté (courriel, clé USB, service exposé) |
| **Exploit** | le code qui tire parti de la vulnérabilité |

Un risque se **traite** de quatre façons : le réduire, le transférer
(assurance), l'éviter, ou l'accepter formellement.

## Maliciels (*malware*)

| Nom | Ce qui le définit |
| --- | --- |
| **Virus** | s'attache à un fichier hôte, a besoin d'une **action de l'utilisateur** |
| **Ver** (*worm*) | **autonome**, se propage seul sur le réseau |
| **Cheval de Troie** | se fait passer pour un logiciel légitime — défini par la **tromperie** |
| **Rançongiciel** | chiffre les données et exige un paiement |
| **Logiciel espion** | collecte à l'insu de l'utilisateur |
| **Enregistreur de frappe** | capture ce qui est tapé |
| **Rootkit** | s'installe au plus bas niveau pour **rester invisible** |
| **Porte dérobée** | accès de rechange laissé volontairement |
| **Bot / réseau de zombies** | machine enrôlée dans un parc contrôlé à distance |
| **Bombe logique** | se déclenche à une condition (date, départ d'un salarié) |
| **Maliciel sans fichier** | vit en mémoire, souvent via PowerShell — rien à analyser sur le disque |

## Ingénierie sociale

| Nom | Principe |
| --- | --- |
| **Hameçonnage** (*phishing*) | courriel de masse, appât générique |
| **Harponnage** (*spear phishing*) | ciblé, personnalisé sur la victime |
| **Chasse à la baleine** (*whaling*) | vise un dirigeant |
| **Vishing / smishing** | par téléphone / par SMS |
| **Prétexte** | scénario inventé pour obtenir une information |
| **Talonnage** (*tailgating*) | entrer physiquement derrière quelqu'un |
| **Appât** (*baiting*) | clé USB abandonnée |
| **Fraude au président** | ordre de virement urgent, faussement hiérarchique |

## Attaques réseau et authentification

| Nom | Principe |
| --- | --- |
| **DoS / DDoS** | saturer le service ; *distribué* = depuis un parc de machines |
| **Homme du milieu** (*MITM*) | s'intercaler dans l'échange |
| **Usurpation** (*spoofing*) | falsifier une adresse IP, MAC ou un expéditeur |
| **Empoisonnement ARP / DNS** | corrompre une table de correspondance |
| **Jumeau maléfique** | faux point d'accès Wi-Fi au même nom |
| **Rejeu** (*replay*) | réutiliser une requête capturée |
| **Force brute** | essayer toutes les combinaisons |
| **Attaque par dictionnaire** | essayer une liste de mots probables |
| **Bourrage d'identifiants** | rejouer des couples volés **ailleurs** |
| **Pulvérisation** (*password spraying*) | **un** mot de passe courant sur **beaucoup** de comptes |
| **Tables arc-en-ciel** | empreintes précalculées — le sel les neutralise |

## Vulnérabilités : CVE, CWE, CVSS

- **CVE** — l'identifiant unique d'**une** vulnérabilité précise :
  `CVE-2024-3094`.
- **CWE** — la **catégorie** de faiblesse : `CWE-89` = injection SQL.
- **CVSS** — un **score de 0 à 10** : 9.0+ critique, 7.0+ élevé.
- **Zero-day** — une vulnérabilité **sans correctif disponible**.
- **APT** — un attaquant organisé, patient, qui vise la persistance plutôt que
  le gain immédiat.

## Pièges

- **Virus ou ver : c'est l'autonomie qui tranche.** Le ver n'a besoin ni d'un
  fichier hôte, ni d'une action de l'utilisateur. C'est la distinction la plus
  demandée.
- **Un cheval de Troie n'est pas défini par sa charge utile** mais par sa
  tromperie : il peut contenir n'importe quoi, ce qui le nomme, c'est le
  déguisement.
- **Force brute ≠ bourrage d'identifiants.** La première essaie des
  combinaisons, la seconde rejoue des mots de passe **déjà volés sur un autre
  service** — d'où la règle de ne jamais réutiliser un mot de passe.
- **La pulvérisation contourne le verrouillage de compte** : quelques essais
  seulement par compte, mais sur des milliers de comptes. Un seuil de
  verrouillage ne la détecte pas ; il faut surveiller les échecs par *source*.
- **Zero-day veut dire « sans correctif », pas « inconnue ».** Une faille
  publique dont le correctif n'existe pas encore en est une.
- **Le CVSS mesure la gravité technique, pas ton risque.** Un 9.8 sur un service
  que tu n'exposes pas peut être moins urgent qu'un 6.5 en frontal. Le score est
  une entrée du calcul, pas la conclusion.
- Un rançongiciel moderne **exfiltre avant de chiffrer** (double extorsion) :
  restaurer la sauvegarde ne fait pas disparaître la fuite de données, ni
  l'obligation de la notifier.
- L'ingénierie sociale ne se corrige pas par un correctif. C'est la raison pour
  laquelle elle reste le premier vecteur.

## Voir aussi

- [Lexique de l'évaluation de sécurité](lexique.md)
- [Les attaques web courantes](attaques-web.md)
- [Chiffrement, hachage et signature](chiffrement.md)
- [nmap : scan de ports et découverte réseau](../reseau/nmap.md)
