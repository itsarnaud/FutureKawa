MOC : [[MOC - Cours]]
Source : [360 Learning](https://epsi.360learning.com/course/play/6933074ec004c8c3709a205e)
Date : 27-04-2026
***

### 1. Présentation de l'entreprise


**FutureKawa** est une entreprise spécialisée dans la caféiculture et la logistique de café vert, opérant principalement au **Brésil, en Équateur et en Colombie**. Elle gère l'intégralité de la chaîne, de la graine à la récolte, jusqu'au stockage et à l'expédition mondiale.

#### Activité et chaîne de valeur

* **Production :** Pilotage de parcelles, gestion des cycles de culture, récolte et premières opérations de tri/séchage.
* **Traçabilité :** Chaque récolte est regroupée en **lots avec un ID unique**, associé à un pays, une exploitation, une date et des critères de qualité.
* **Stockage :** Les lots sont entreposés dans des hubs logistiques. Le suivi des conditions (température et humidité) est critique pour préserver les arômes.
* **Logistique :** Vente de café vert et organisation des expéditions (containers, douanes, traçabilité).

#### Modèle économique (B2B)

Le business model repose sur :

* La vente de café vert aux marques et torréfacteurs.
* Un engagement de qualité et de traçabilité totale.
* Des services de gestion de stocks, réservation de lots et reporting.

### 2. Cahier des charges

L'objectif est de mettre en place une solution multi-pays de suivi des stocks et des conditions de stockage via un dispositif IoT.

#### Finalités et objectifs

* **Centralisation :** Suivi par pays et par entrepôt.
* **Traçabilité :** Suivi des lots dès l'entrée en stock.
* **Surveillance automatisée :** Relevés de température et d'humidité en temps réel.
* **Gestion des risques :** Signalement des dérives de conditions ou des lots trop anciens.
* **Évolutivité :** Préparer le terrain pour l'automatisation des équipements (chauffage, aération).

#### Contraintes techniques et méthodologiques

* **Interface :** Application web (Back & Front).
* **IoT :** Utilisation du protocole **MQTT**.
* **Données :** Base de données SQL.
* **Qualité logicielle :** Documentation, tests, CI/CD, architecture cohérente avec un SI. ⚠️
* **Prototype :** Rendre un système fonctionnel et robuste, démontrant la faisabilité réelle.

### 3. Besoins détaillés

#### Gestion des stocks (Exploitations & Entrepôts)

L'objectif est d'assurer une traçabilité fiable et de faciliter la rotation **FIFO** (First In, First Out).

* **Multi-sites :** Gérer le Brésil, l'Équateur et la Colombie.
* **Attributs des lots :** ID unique (UUID), pays/exploitation/entrepôt, date de stockage, statut (conforme, alerte, périmé).
* **Fonctionnalités :** Consultation et tri par date pour expédier les lots les plus anciens en priorité.
* **Vue Siège :** Interface centralisée pour consulter l'état global.

#### Surveillance IoT

Chaque pays est équipé d'un module (microcontrôleur + capteur) pour remonter les mesures via un broker MQTT local.

**Seuils de référence et tolérances :**

| Pays | Température Idéale | Humidité Idéale |
| :--- | :--- | :--- |
| **Brésil** | 29°C | 55% |
| **Équateur** | 31°C | 60% |
| **Colombie** | 26°C | 80% |

* ⚠️ **Tolérance admise :** ± 3°C et ± 2% d'humidité.
* Un historique des mesures doit être conservé pour la traçabilité.

#### Alertes automatiques

Envoi d'un e-mail au responsable d'exploitation dans deux cas :

1. **Dépassement des seuils :** Conditions de stockage non respectées (température ou humidité hors tolérance).
2. **Ancienneté :** Lot stocké depuis plus de **365 jours**.

### 4. Architecture du système

Le système repose sur un découpage entre des backends locaux et un pilotage centralisé. ⚠️ *Tous les choix d'architecture devront être justifiés.*

#### Niveau Local (Pays)

Chaque pays possède un backend conteneurisé comprenant :

* Une base de données SQL et un broker MQTT local.
* Une API REST pour la gestion des lots et l'exposition des mesures.
* Un système de règles pour l'alerting e-mail.

#### Niveau Central (Siège)

* **Backend Central :** Requête les API des différents pays pour consolider les données.
* **Frontend Web :** Interface unique permettant de sélectionner une exploitation, visualiser les stocks et consulter les courbes de données.

### 5. Préparation à l'automatisation

Anticipation de l'installation d'actionneurs (chauffage, humidificateur, aérateur).

* **Livrable attendu :** Un schéma de principe (Capteurs → Décision → Actionneurs + Sécurités).
* **Questionnaire d'interview :** Préparer les questions sur les besoins métiers, la sécurité, les limites de l'automate et les modalités de maintenance.

### 6. Livrables du projet

1. **Backend Pays (Exemple) :** Complet et conteneurisé (API, BDD, MQTT, Alerting). Doit démarrer via un `docker-compose up`.
2. **Backend Siège & Frontend :** Interface de consolidation capable de requêter le backend pays.
3. **Module IoT :** Prototype fonctionnel (microcontrôleur + capteur) publiant en MQTT avec démonstration de la persistance des données.
4. **Dossier technique :** * Architecture globale et flux.
    * Conception IoT (câblage, protocoles, payloads).
    * Stratégie de tests (Unitaires, API, UI, E2E).
5. **Pipeline CI/CD (Jenkins) :** Automatisation du build, des tests et de la création des images Docker.
6. **Tests manuels :** Documentation pour exécuter les tests hors pipeline (commandes, jeux de données).
7. **Dépôt Git :** Code source complet, structuré, avec un historique de commits cohérent et un README.
8. **Documentation utilisateur :** Guide métier pour l'utilisation de l'interface, la gestion des lots et l'interprétation des alertes.
9. **Schéma d'automatisation :** Logique de pilotage des équipements d'entrepôt (cas nominaux et dégradés).
