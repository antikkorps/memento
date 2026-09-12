---
title: "Codes de réponse HTTP"
tags: [reseau, web, securite]
created: 2026-09-03
updated: 2026-09-03
status: stable
---

## En bref

Trois chiffres qui disent **qui a le problème**. Le premier suffit à trancher :
`4xx` c'est le client, `5xx` c'est le serveur. Tout le reste est du détail — mais
le détail se pose en entretien comme en certification.

## Les familles

| Famille | Sens | Qui doit corriger |
| --: | --- | --- |
| `1xx` | information, échange en cours | personne |
| `2xx` | succès | personne |
| `3xx` | redirection | personne, le client suit |
| `4xx` | erreur **du client** : requête mal formée ou non autorisée | l'appelant |
| `5xx` | erreur **du serveur** : la requête était valide | l'hébergeur |

## Ceux qu'on croise vraiment

| Code | Nom | Quand |
| --: | --- | --- |
| `200` | OK | tout va bien |
| `201` | Created | ressource créée (réponse d'un `POST`) |
| `204` | No Content | réussi, rien à renvoyer (`DELETE`) |
| `301` | Moved Permanently | déplacé définitivement |
| `302` | Found | déplacé temporairement |
| `304` | Not Modified | le cache du client est encore bon |
| `307` / `308` | Temporary / Permanent Redirect | comme 302 / 301, **méthode préservée** |
| `400` | Bad Request | requête malformée |
| `401` | Unauthorized | **non authentifié** — « qui es-tu ? » |
| `403` | Forbidden | authentifié mais **pas autorisé** — « je sais qui tu es, non » |
| `404` | Not Found | la ressource n'existe pas |
| `405` | Method Not Allowed | bonne URL, mauvais verbe |
| `409` | Conflict | conflit d'état (doublon, version concurrente) |
| `413` | Payload Too Large | corps de requête trop gros |
| `422` | Unprocessable Entity | syntaxe correcte, données invalides |
| `429` | Too Many Requests | limitation de débit, voir `Retry-After` |
| `500` | Internal Server Error | l'application a planté |
| `501` | Not Implemented | le serveur ne sait pas faire |
| `502` | Bad Gateway | le proxy a reçu une réponse invalide de l'amont |
| `503` | Service Unavailable | surcharge ou maintenance |
| `504` | Gateway Timeout | l'amont n'a pas répondu à temps |

## 401 ou 403 ?

C'est la question qui tombe, et le nom du 401 induit en erreur :

- **`401` = authentification manquante ou invalide.** Le serveur ne sait pas qui
  tu es. Il doit renvoyer un en-tête `WWW-Authenticate`. Se connecter peut
  résoudre le problème.
- **`403` = authentification réussie, droits insuffisants.** Se reconnecter n'y
  changera rien : il faut d'autres droits.

Malgré son nom officiel *Unauthorized*, **`401` veut dire « non
authentifié »**. C'est une erreur de nommage figée dans la norme depuis 1997.

## 502, 503 ou 504 ?

Les trois disent « ce n'est pas moi, c'est derrière » — mais pas de la même
façon :

- **`502`** : l'amont a répondu quelque chose d'incompréhensible, ou est mort.
- **`503`** : le serveur lui-même refuse temporairement — surcharge,
  maintenance. Accompagné d'un `Retry-After` quand c'est bien fait.
- **`504`** : l'amont est vivant mais trop lent, le proxy a coupé.

Sur un `502` derrière nginx, regarder si l'application tourne encore ; sur un
`504`, regarder ses temps de réponse.

## Les tester

```sh
curl -o /dev/null -s -w '%{http_code}\n' https://exemple.tld
curl -I https://exemple.tld               # les en-tetes seuls
curl -IL https://exemple.tld              # en suivant les redirections
curl -X POST -d 'a=1' -i https://exemple.tld/api

# Repartition des codes dans un journal d'acces
awk '{print $9}' access.log | sort | uniq -c | sort -rn
```

## Pièges

- **`401` ne veut pas dire ce que son nom dit.** *Unauthorized* = non
  authentifié. L'autorisation, c'est `403`.
- **Un `301` est mis en cache très agressivement par les navigateurs**, parfois
  indéfiniment. Une redirection permanente posée par erreur reste active chez
  les visiteurs même après correction côté serveur : en cas de doute, poser un
  `302` et ne passer en `301` qu'une fois certain.
- **`301` et `302` transforment un `POST` en `GET`** chez la plupart des
  clients, par tradition. `307` et `308` préservent la méthode et le corps —
  ce sont eux qu'il faut pour une API.
- **Renvoyer `200` avec un message d'erreur dans le corps** casse tout ce qui
  observe le trafic : supervision, réessais automatiques, alertes. Une API qui
  répond `{"error": "..."}` en `200` est une API sans code d'erreur.
- **`404` au lieu de `403` est parfois volontaire.** Répondre `403` confirme que
  la ressource existe : c'est une fuite d'information qui permet d'énumérer les
  chemins ou les comptes. Sur une surface exposée, `404` uniforme est plus sûr.
  À l'inverse, sur une API interne, le `403` est plus honnête pour déboguer.
- **Le code d'un `curl` sans `-L` est celui de la redirection**, pas celui de la
  page finale. Un `301` compté comme un échec de supervision est une fausse
  alerte classique.
- `429` sans `Retry-After` laisse le client réessayer aveuglément et aggraver
  la surcharge.
- Un `500` ne doit **jamais** exposer la trace d'exécution en production : c'est
  une divulgation de chemins, de versions et parfois d'identifiants.

## Voir aussi

- [HTTPS et TLS : ce qui se passe avant la page](https.md)
- [Le modèle OSI en 7 couches](modele-osi.md)
- [awk : colonnes, filtres et calculs](../shell/awk.md)
