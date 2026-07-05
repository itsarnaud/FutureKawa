# FutureKawa

Suivi multi-pays des stocks de café vert (Brésil, Équateur, Colombie) : traçabilité des lots, surveillance IoT (température/humidité) via MQTT, et alerting automatique par e-mail. Projet réalisé dans le cadre de la MSPR TPRE814.

## Architecture

Un backend conteneurisé par pays (BDD, broker MQTT, API REST, alerting), et un backend central qui agrège les 3 pays pour le frontend. Chaque pays est isolé des autres : base de données, broker MQTT, `country-api` et `alerting-service` dédiés, sans partage de données au niveau du stockage. Le `gateway` est le seul composant qui connaît les 3 pays ; il a sa propre base (`postgres-siege`) pour les comptes utilisateurs, indépendante des données métier des pays.

Schéma détaillé et flux complet : voir [docs/technique.md](docs/technique.md#41-architecture-globale).

## Stack

- **Backend** : NestJS (TypeScript), Prisma 7 (PostgreSQL), MQTT (Eclipse Mosquitto)
- **Frontend** : Next.js
- **IoT** : ESP8266/ESP32 + capteur DHT11, PlatformIO
- **Monorepo** : Nx
- **Infra** : Docker Compose

## Démarrage rapide

Prérequis : Docker.

```sh
git clone https://github.com/itsarnaud/FutureKawa && cd FutureKawa
npm start
```

Ce script (`scripts/start.sh`) fait tout en une commande : crée `.env` depuis `.env.exemple` si besoin, build et démarre toute la stack (3 `country-api` + 3 `alerting-service`, une par pays, chacune avec sa base et son broker MQTT, le `gateway`, et Mailpit), attend que les 3 bases soient prêtes, pousse le schéma Prisma et injecte les données de démo pour chaque pays, puis affiche les URLs de tous les services.

Pour tout arrêter :

```sh
docker compose down
```

Pour repartir d'une base propre (pousser le schéma / re-seed manuellement sur un pays donné) :

```sh
DATABASE_URL="postgresql://postgres:<password>@localhost:5433/mydb?schema=public" npx prisma db push
DATABASE_URL="postgresql://postgres:<password>@localhost:5433/mydb?schema=public" SEED_COUNTRY=BR npx prisma db seed
# répéter avec le port 5434/SEED_COUNTRY=EC et 5435/SEED_COUNTRY=CO
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3001 |
| Gateway (API centrale) | http://localhost:3010/api — doc interactive sur `/api/docs` |
| country-api Brésil | http://localhost:3000/api — doc interactive sur `/api/docs` |
| country-api Équateur | http://localhost:3002/api |
| country-api Colombie | http://localhost:3003/api |
| Mailpit (e-mails d'alerte) | http://localhost:8025 |

Un compte est nécessaire pour utiliser le frontend : créez-en un depuis `/auth/register`, ou directement
via l'API (`POST /api/auth/register` sur le gateway).

## Structure du dépôt

```
apps/
  country-api/     # API REST par pays : lots, entrepôts, ingestion des mesures IoT (MQTT)
  alerting-service/ # Microservice par pays : seuils température/humidité, lots périmés, e-mail
  gateway/         # API centrale : agrège les 3 country-api pour le frontend
  fe/              # Frontend Next.js
libs/
  db/              # PrismaService/PrismaModule partagés
prisma/
  schema.prisma    # Modèle de données (Lot, Warehouse, Exploitation, IotDevice, Alert...)
  seed.ts          # Données de démo (SEED_COUNTRY=BR|EC|CO pour cibler un seul pays)
IOT/
  futurekawa-iot-esp32/  # Firmware capteur (PlatformIO)
  broker/          # Config Mosquitto
docker-compose.yml # Orchestration complète (BDD, brokers, APIs, gateway, frontend, mailpit)
scripts/
  start.sh         # Démarrage one-command (build, migrations, seed, récap des URLs)
docs/
  technique.md                       # Dossier technique (architecture, IoT, tests, CI/CD)
  phase2-automatisation.md           # Schéma de principe : pilotage d'actionneurs (phase 2)
  questionnaire-cadrage-phase2.md    # Questions à poser au client avant la phase 2
  support-soutenance.html            # Support de présentation
Jenkinsfile        # Pipeline CI/CD (lint, tests, build, intégration, packaging Docker)
```

## Frontend

Le frontend (`apps/fe`, Next.js App Router) ne parle qu'au `gateway` — jamais directement à un `country-api`. Il est inclus dans `docker-compose.yml` (service `fe`, port `3001`) et démarre avec le reste de la stack via `npm start` / `docker compose up`.

**En local, hors Docker :**

```sh
NEXT_PUBLIC_API_URL=http://localhost:3010/api npx nx run fe:dev --port 4200
```

**Variable d'environnement :** `NEXT_PUBLIC_API_URL` — l'URL du `gateway`, telle que le *navigateur* doit pouvoir la joindre. C'est une variable `NEXT_PUBLIC_*` : elle est injectée dans le bundle client au moment du **build**, pas au démarrage du conteneur. Sur une installation Docker classique en local, la valeur par défaut de `.env.exemple` (`http://localhost:3010/api`, le port du gateway mappé sur l'hôte) convient.

**Build Docker :** `apps/fe/Dockerfile` (multi-stage, `next.config.js` en `output: "standalone"` pour une image minimale) prend `NEXT_PUBLIC_API_URL` en `build arg`, lu depuis `.env` par `docker-compose.yml`. Rebuild nécessaire si cette valeur change (`docker compose build fe`).

## Commandes utiles

```sh
npx nx serve country-api          # lancer country-api en local (hors Docker)
npx nx serve gateway               # lancer gateway en local (hors Docker)
npx nx test <projet>                # tests unitaires d'un projet
npx nx test-e2e country-api        # tests d'intégration API (contre un vrai Postgres, voir DATABASE_URL)
npx nx lint <projet>                # lint
node IOT/simulate-sensors.js       # simule des capteurs IoT sans matériel (voir --help dans le fichier)
```

## Sécurité

- **Authentification** : JWT (voir `apps/gateway/src/app/auth`). Le frontend appelle `/api/auth/register`
  et `/api/auth/login` sur le gateway ; toutes les autres routes métier du gateway exigent un jeton
  `Authorization: Bearer`.
- **CORS grand ouvert pour l'instant** : le projet n'est pas encore déployé, et le frontend/gateway se
  retrouvent régulièrement sur des domaines différents en dev (ports forwardés Codespaces, etc.).
  `apps/gateway/src/main.ts` accepte donc n'importe quelle origine — à restreindre avant tout déploiement
  réel.
- **Cloisonnement pays/siège, clé API interne et limitation de débit** : implémentés
  (`apps/country-api/src/app/common/`) mais volontairement **désactivés** pour la même raison (confort de
  test, pas de déploiement en cours) — voir le commentaire dans `apps/country-api/src/app/app.module.ts`
  pour les réactiver.

## CI/CD

Un [`Jenkinsfile`](Jenkinsfile) définit le pipeline (install → lint → tests unitaires → build → tests
d'intégration → packaging Docker). Voir [docs/technique.md](docs/technique.md) pour l'état de validation.

## Convention MQTT

Chaque capteur publie sur `{pays}/{entrepot}/mesures` (ex. `bresil/entrepot1/mesures`) au format :

```json
{ "temperature": 29.4, "humidite": 56.1, "timestamp": "2026-07-03T10:00:00Z" }
```

En interne, après avoir persisté une mesure, `country-api` publie sur `internal/reading-recorded` (même broker) pour déclencher la vérification de seuil côté `alerting-service`.
