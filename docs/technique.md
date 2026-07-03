# FutureKawa — Dossier technique (backend)

Ce document couvre le périmètre backend/API/IoT du projet : architecture, conception IoT, stratégie de tests. Le frontend n'est pas détaillé ici.

## 1. Architecture globale et flux

### Découpage

Le système suit le découpage imposé par le sujet : un backend local par pays, et un backend central côté siège.

**Niveau local (par pays — Brésil, Équateur, Colombie)**, identique pour les 3, chacun isolé des autres :
- Une base PostgreSQL dédiée
- Un broker MQTT dédié (Eclipse Mosquitto)
- `country-api` : API REST (lots, entrepôts) + ingestion des mesures IoT via MQTT
- `alerting-service` : microservice séparé qui applique les règles de seuil (température/humidité) et le contrôle des lots périmés (>365 jours), et envoie les e-mails

**Niveau central (siège)** :
- `gateway` : API qui requête les 3 `country-api` (en parallèle, tolérante aux pannes partielles) et consolide les réponses pour le frontend

Voir le schéma dans le [README](../README.md#architecture).

### Pourquoi séparer `country-api` et `alerting-service`

Initialement, la vérification de seuil et l'envoi d'e-mail étaient dans `country-api`, déclenchés en appel direct depuis le handler MQTT. Ça fonctionnait, mais couplait la disponibilité de l'API REST à celle du sous-système d'alerting (un bug dans l'envoi de mail pouvait, en théorie, impacter le traitement des requêtes REST puisque tout tournait dans le même processus Node).

Extraction en processus séparé, communiquant via le broker MQTT du pays déjà en place :
1. `country-api` reçoit une mesure sur `{pays}/{entrepot}/mesures`, l'enregistre en base (table `SensorReading`).
2. `country-api` publie un événement interne sur `internal/reading-recorded` (même broker).
3. `alerting-service` écoute cet événement, vérifie les seuils du pays (`Country.tempIdeal ± tempTolerance`, `Country.humidityIdeal ± humidityTolerance`), crée une `Alert` en base si dépassement, et envoie l'e-mail au responsable d'entrepôt (`Warehouse.managerEmail`).
4. En parallèle, un cron quotidien (`@Cron(EVERY_DAY_AT_MIDNIGHT)`) dans `alerting-service` marque les lots stockés depuis plus de 365 jours comme `perime` et déclenche une alerte.

Ce découpage reste dans l'esprit du sujet : chaque pays garde son "système de règles pour l'alerting e-mail" en local (même broker, même BDD), c'est juste un processus déployé séparément — pas un service centralisé mutualisé entre pays.

### Agrégation côté gateway

`gateway` ne stocke rien. Pour une requête `GET /api/lots`, il :
- appelle en parallèle les 3 `country-api` (`Promise.allSettled`) si aucun `?country=` n'est précisé,
- ou route vers un seul `country-api` si `?country=BR|EC|CO` est fourni,
- retourne les résultats des pays disponibles même si un pays est en panne (tolérance de panne partielle — un pays down ne bloque pas les 2 autres).

## 2. Conception IoT

### Matériel

- Microcontrôleur : ESP8266 (WiFi intégré)
- Capteur : DHT11 (température + humidité)
- Câblage : DHT11 sur GPIO2 (D4), alimentation 3.3V

### Firmware (`IOT/futurekawa-iot-esp32/`, PlatformIO)

Boucle de fonctionnement :
1. Connexion WiFi (avec reconnexion automatique si la connexion tombe)
2. Connexion au broker MQTT du pays (avec reconnexion automatique)
3. Toutes les 5 minutes (300 000 ms) : lecture du capteur DHT11, construction du payload JSON, publication MQTT

Payload publié sur `{pays}/{entrepot}/mesures` (ex. `bresil/entrepot1/mesures`) :

```json
{ "temperature": 29.4, "humidite": 56.1, "timestamp": "2026-07-03T10:00:00Z" }
```

> ⚠️ Le SSID/mot de passe WiFi et l'adresse IP du broker MQTT sont actuellement codés en dur dans le firmware (`main.cpp`), propres à l'environnement de développement. Avant toute démo sur un réseau différent, il faut reflasher avec les identifiants du réseau utilisé et l'IP réelle de la machine qui fait tourner `docker-compose`.

### Persistance et traçabilité

Chaque device est enregistré en base (`IotDevice`, avec `mqttTopic` unique) et rattaché à un `Warehouse`. Chaque mesure reçue crée une ligne `SensorReading` (température, humidité, horodatage), conservée indéfiniment pour l'historique — aucune purge automatique. Un index composite (`deviceId`, `recordedAt`) permet de requêter l'historique par device efficacement.

### Vers l'automatisation (préparation)

Le système est aujourd'hui en lecture seule côté capteurs (pas d'actionneurs). Schéma de principe visé pour une itération future :

```
Capteurs (température/humidité)
        │
        ▼
   Décision (seuils par pays, déjà en place dans alerting-service)
        │
        ▼
   Actionneurs (chauffage / humidificateur / aérateur — à ajouter)
        │
        ▼
   Sécurités (butées haute/basse, coupure manuelle, timeout)
```

La logique de décision (comparaison aux seuils `Country.tempIdeal`/`humidityIdeal` ± tolérance) existe déjà dans `alerting-service` — il resterait à ajouter un topic MQTT de commande (`{pays}/{entrepot}/commandes`) et le firmware côté actionneur.

## 3. Stratégie de tests

| Niveau | Outil | Approche |
|---|---|---|
| Unitaire | Jest | Services et controllers de `country-api`, `alerting-service`, `gateway` — logique métier (calcul de seuils, agrégation multi-pays, CRUD lots) testée avec Prisma/MQTT mockés |
| API | `curl` | Vérification systématique du comportement HTTP réel à chaque évolution d'architecture (filtrage par pays, codes d'erreur, agrégation) — voir exemples ci-dessous |
| E2E | Simulation MQTT | La chaîne complète (capteur → broker → API → alerte → e-mail) est vérifiée de bout en bout par simulation d'un message MQTT identique au firmware, sans dépendre du matériel physique — voir exemple ci-dessous |
| UI | — | Hors périmètre de ce document (frontend) |

Le choix a été fait de prioriser les tests unitaires (rapides, exécutés à chaque changement) et une vérification API/E2E ciblée sur les points sensibles de l'architecture (cloisonnement des données par pays, chaîne IoT → alerte), plutôt qu'une suite E2E automatisée exhaustive, compte tenu du calendrier du projet.

### Tests unitaires

Lancer les tests d'un projet :
```sh
npx nx test country-api
npx nx test alerting-service
npx nx test gateway
```

### Exemple de test API

Vérifier que le filtrage par pays fonctionne bien avec une base par pays :
```sh
curl "http://localhost:3010/api/lots?country=BR"   # ne doit renvoyer que des lots brésiliens
curl "http://localhost:3010/api/lots?country=XX"   # doit renvoyer 400 Bad Request
```

### Exemple de test E2E (simulation IoT)

Vérifier la chaîne IoT → alerte sans dépendre du capteur physique :
```sh
docker exec mosquitto-bresil mosquitto_pub -h localhost -t "bresil/entrepot1/mesures" \
  -m '{"temperature":30.5,"humidite":58.2,"timestamp":"2026-07-10T10:00:00Z"}'
# puis vérifier http://localhost:8025 (Mailpit) pour l'e-mail d'alerte
```
