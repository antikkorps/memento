---
title: "IDS / IPS : détection et prévention d'intrusion"
tags: [securite, reseau, reference]
created: 2026-09-30
updated: 2026-09-30
status: brouillon
---

## En bref

Un **IDS** (*Intrusion Detection System*, système de détection d'intrusion)
**regarde** le trafic ou l'hôte et **alerte**. Un **IPS** (*Intrusion
Prevention System*) est placé **en coupure** (*inline*) et peut **bloquer**.
Le réflexe qui tranche : IDS = détecte et prévient un humain ; IPS = détecte et
agit tout seul.

Deux axes suffisent à classer n'importe quel produit : **où il regarde**
(réseau ou hôte) et **comment il décide** (signature ou anomalie).

## Où il regarde

| Type | Regarde | Exemples |
| --- | --- | --- |
| **NIDS** (*Network*) | le trafic d'un segment, via un port miroir (*SPAN*) ou un *TAP* | Snort, Suricata, Zeek |
| **HIDS** (*Host*) | journaux, fichiers, processus d'**une** machine | Wazuh, OSSEC, Sysmon + règles |
| **NIPS** / **HIPS** | idem, mais en coupure : peut bloquer | Snort / Suricata en mode IPS |
| **WIPS** (*Wireless*) | le spectre Wi-Fi : points d'accès pirates | — |

- **NIDS** : voit tout le segment d'un coup, mais **aveugle au trafic chiffré**
  (TLS) et à ce qui se passe *sur* la machine.
- **HIDS** : voit le contenu déchiffré et les actions locales, mais une machine à
  la fois, et un attaquant root peut l'éteindre.

## Comment il décide

| Méthode | Principe | Force | Faiblesse |
| --- | --- | --- | --- |
| **Signature** (*signature-based*) | compare à des motifs connus (règles) | précis, peu de faux positifs | **aveugle au zero-day** et aux variantes |
| **Anomalie** (*anomaly / behaviour-based*) | écart à une **ligne de base** (*baseline*) du trafic normal | détecte l'inconnu | beaucoup de faux positifs, apprentissage |
| **Politique** (*policy-based*) | viole une règle métier (« pas de SSH vers l'extérieur ») | simple, clair | ne voit que ce qu'on a décrit |

## Les quatre issues d'une alerte

| | Il y a une attaque | Il n'y a pas d'attaque |
| --- | --- | --- |
| **Alerte** | vrai positif (*true positive*) | **faux positif** (*false positive*) |
| **Pas d'alerte** | **faux négatif** (*false negative*) | vrai négatif (*true negative*) |

```text
faux positif = alerte pour rien (bruit)     -> fatigue d'alerte
faux negatif = attaque ratee, silence        -> le plus grave
```

Durcir les règles baisse les faux négatifs et monte les faux positifs ; les
relâcher fait l'inverse. Le réglage (*tuning*) est ce compromis.

## Pièges

- **IDS ≠ pare-feu** (*firewall*). Le pare-feu filtre sur des règles d'accès
  (IP, port) ; l'IDS inspecte le **contenu** et le comportement. Un IPS est le
  plus proche du pare-feu, mais il décide sur la même logique qu'un IDS.
- **Faux positif vs faux négatif** : la question d'examen classique. Le **faux**
  porte sur le verdict de l'outil, **positif / négatif** sur le fait qu'il ait
  alerté ou non. « Attaque non détectée » = faux **négatif**.
- **Un IPS mal réglé bloque le légitime.** Un faux positif d'IDS coûte un coup
  d'œil ; un faux positif d'IPS coupe un service. D'où : IDS d'abord, passage en
  IPS une fois les règles rodées.
- **Chiffré = invisible pour le NIDS.** Sans déchiffrement TLS en amont, il ne
  voit que les en-têtes.
- **Zeek n'est pas vraiment un IDS à signatures** : il journalise le trafic en
  métadonnées (connexions, DNS, HTTP) pour l'analyse. Snort et Suricata, eux,
  appliquent des règles.

## Voir aussi

- [tcpdump : capturer et lire le trafic réseau](../reseau/tcpdump.md)
- [Maliciels, attaques et vocabulaire des menaces](menaces.md)
- [Quel outil pour quel objectif](quel-outil.md)
