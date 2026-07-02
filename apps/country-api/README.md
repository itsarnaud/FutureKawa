# Country API Microservice - FutureKawa

Ce microservice fait partie du système **FutureKawa**. Il est conçu pour être déployé de manière distribuée dans chaque pays (Brésil, Équateur, Colombie).

## Rôle
Chaque instance de `country-api` gère les opérations locales pour un pays spécifique :
- **Ingestion IoT :** Connexion au broker MQTT local pour récupérer les mesures de température et d'humidité.
- **Stockage Local :** Enregistrement des mesures et des lots dans une base de données PostgreSQL dédiée.
- **Alerting :** Surveillance en temps réel des conditions de stockage et envoi d'alertes par email en cas de dépassement des seuils ou de péremption des lots (> 365 jours).
- **API REST :** Exposition des données pour le Backend Central (Siège).

## Architecture
C'est un microservice **NestJS**. Il utilise :
- **MQTT :** Pour la communication asynchrone avec les capteurs IoT.
- **TypeORM :** Pour la persistence des données.
- **Nodemailer :** Pour l'envoi d'emails d'alerte.

## Configuration (Variables d'environnement)
Le service est configurable pour s'adapter à chaque pays via les variables suivantes :

| Variable | Description | Exemple |
| :--- | :--- | :--- |
| `COUNTRY_NAME` | Nom du pays | `Brésil` |
| `MQTT_HOST` | Adresse du broker MQTT | `10.214.238.38` |
| `MQTT_PORT` | Port du broker MQTT | `1883` |
| `MQTT_TOPIC` | Topic à écouter | `bresil/entrepot1/mesures` |
| `TEMP_IDEAL` | Température de référence | `29` |
| `HUMID_IDEAL` | Humidité de référence | `55` |
| `TEMP_TOLERANCE` | Tolérance température | `3` |
| `HUMID_TOLERANCE` | Tolérance humidité | `2` |
| `MAIL_HOST` | Serveur SMTP | `smtp.example.com` |
| `MAIL_USER` | Utilisateur SMTP | `user@example.com` |
| `MAIL_PASS` | Mot de passe SMTP | `password` |

## Installation & Lancement
```bash
# Lancement via Nx
npx nx serve country-api
```
