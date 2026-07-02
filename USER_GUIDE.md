# Guide Utilisateur — FutureKawa Vue Siège

Bienvenue dans le guide utilisateur de la **Vue Siège FutureKawa**. Cette interface centralisée permet aux gestionnaires et torréfacteurs de superviser en temps réel les stocks de café importés et les conditions environnementales (IoT) de chaque site d'exploitation (Brésil, Colombie, Équateur).

---

## Table des Matières
1. [Supervision Multi-Sites (Sélecteur de Pays)](#1-supervision-multi-sites-s%C3%A9lecteur-de-pays)
2. [Gestion Logistique FIFO (Rotation des Stocks)](#2-gestion-logistique-fifo-rotation-des-stocks)
3. [Suivi des Capteurs IoT (Température & Humidité)](#3-suivi-des-capteurs-iot-temp%C3%A9rature--humidit%C3%A9)
4. [Panneau des Alertes et Résolution des Anomalies](#4-panneau-des-alertes-et-r%C3%A9solution-des-anomalies)

---

## 1. Supervision Multi-Sites (Sélecteur de Pays)

La Vue Siège intègre un **sélecteur de contexte global** situé en haut à droite du tableau de bord. 
- **Fonctionnement** : En sélectionnant un pays (Brésil 🇧🇷, Colombie 🇨🇴 ou Équateur 🇪🇨), l'ensemble du tableau de bord (KPIs, graphiques historiques, panneau d'alertes et table des stocks) s'actualise instantanément.
- **Paramètres de Référence** : Chaque pays possède ses propres cibles de stockage optimales, calibrées selon l'altitude et le type de grains (Arabica/Robusta) :
  
| Pays | Température Cible | Tolérance Temp. | Humidité Cible | Tolérance Hum. |
| :--- | :---: | :---: | :---: | :---: |
| **Brésil** 🇧🇷 | 29°C | ±3°C (26°C - 32°C) | 55% | ±2% (53% - 57%) |
| **Colombie** 🇨🇴 | 27°C | ±3°C (24°C - 30°C) | 60% | ±2% (58% - 62%) |
| **Équateur** 🇪🇨 | 28°C | ±3°C (25°C - 31°C) | 58% | ±2% (56% - 60%) |

---

## 2. Gestion Logistique FIFO (Rotation des Stocks)

Pour préserver les qualités organoleptiques du café vert, FutureKawa applique strictement la règle **FIFO (First In, First Out)** : les lots entrés le plus tôt doivent être torréfiés ou expédiés en premier.

### Utilisation de la Table des Stocks
- **Tri FIFO Automatique** : Par défaut, la table est triée par **Date d'entrée** de manière ascendante (le lot le plus ancien s'affiche tout en haut). Une bannière d'information orange confirme l'activation de ce tri prioritaire.
- **Tri Interactif** : Vous pouvez cliquer sur les en-têtes de colonnes (*Site*, *Date d'entrée*, *Température*, *Humidité*) pour modifier l'ordre de tri.
- **Recherche & Filtres** : 
  - Saisissez un UUID de lot ou un nom de site dans la barre de recherche pour filtrer instantanément.
  - Utilisez les filtres de statut pour isoler les lots conformes ou posant problème.

### Signification des Badges de Qualité
- 🟢 **Conforme** : Le lot respecte les seuils IoT de son site de stockage et sa date d'entrée est inférieure à 365 jours.
- 🟠 **Alerte** : Le lot a été exposé à des conditions hors-seuils (ex: température trop élevée ou humidité excessive).
- 🔴 **Périmé (>365j)** : Le lot est stocké depuis plus d'un an. **Action Requise** : Sortir ce lot immédiatement pour éviter la dégradation des grains.

---

## 3. Suivi des Capteurs IoT (Température & Humidité)

Le tableau de bord affiche deux courbes d'évolution temporelle distinctes (mises à jour toutes les heures par les passerelles IoT locales) :

1. **Graphique de Température** :
   - **Courbe marron** : Représente les relevés réels du capteur.
   - **Ligne pointillée marron** : Indique la température cible idéale.
   - **Zone ombrée beige** : Représente la zone de tolérance de ±3°C. Toute incursion de la courbe en dehors de cette zone déclenche une alerte de dérive.
2. **Graphique d'Humidité** :
   - **Courbe bleue** : Représente les relevés réels d'humidité.
   - **Ligne pointillée bleue** : Indique l'humidité cible idéale.
   - **Zone ombrée bleue** : Représente la zone de tolérance de ±2%.

---

## 4. Panneau des Alertes et Résolution des Anomalies

Le panneau **Alertes Actives** consolide toutes les anomalies en cours sur le site sélectionné. Les alertes sont classées par sévérité :

- 🔴 **Sévérité Haute (Rouge)** : 
  - Dérive globale actuelle du capteur de température ou d'humidité du hangar.
  - Présence de lots périmés depuis plus de 365 jours.
- 🟠 **Sévérité Moyenne (Orange)** :
  - Lots de café individuels ayant subi des dérives de température ou d'humidité.
  - Historique récent de dérives de capteurs (dernières heures).

### Actions Recommandées en cas d'Alerte :
1. **Alerte Périmé** : Planifiez une torréfaction immédiate du lot concerné ou contactez l'entrepôt pour un contrôle qualité visuel.
2. **Alerte Dérive IoT** : Contactez le technicien de maintenance du site concerné pour vérifier le système de climatisation ou de déshumidification du hangar.
