# FutureKawa — Questionnaire de cadrage phase 2 (automatisation des entrepôts)

> À utiliser lors d'un entretien de cadrage avec le client avant tout développement de la phase 2.
> Conformément au cahier des charges (§10.4), ce document liste les questions à poser ; il ne présume
> pas des réponses. Aucune de ces questions n'a été posée à un client réel dans le cadre de ce projet.

## 1. Objectifs métier de l'automatisation

1. Quel est le problème prioritaire à résoudre : dérives de température, dérives d'humidité, les deux ?
2. L'objectif est-il de **réduire les pertes de qualité** (lots dégradés), de **réduire la charge de
   travail** des équipes terrain, ou les deux ?
3. Existe-t-il un objectif chiffré (ex. réduire de X % le nombre d'alertes qualité par mois) ?
4. L'automatisation doit-elle couvrir tous les entrepôts dès le départ, ou un déploiement pilote sur un
   entrepôt/pays est-il envisagé ?
5. Le pilotage automatique doit-il aussi anticiper des dérives (prédictif), ou se limiter à réagir à un
   dépassement de seuil déjà constaté (réactif) ?

## 2. Contraintes

### Sécurité

6. Existe-t-il déjà des normes de sécurité électrique/incendie applicables aux entrepôts (chauffage,
   ventilation) à respecter dans le choix des actionneurs ?
7. Qui est habilité à déclencher un arrêt d'urgence logique depuis l'interface (rôle métier) ?
8. Un arrêt d'urgence manuel physique est-il déjà présent sur les équipements actuels, ou doit-il être
   ajouté avec la phase 2 ?

### Maintenance

9. Qui assure la maintenance des actionneurs (chauffage, humidificateur, aération) aujourd'hui : équipe
   interne, prestataire externe ?
10. Quelle est la fréquence de maintenance préventive attendue, et comment doit-elle être tracée dans le
    système (rappel automatique, ticket, etc.) ?
11. En cas de panne d'un actionneur, quel est le délai d'intervention acceptable avant qu'il ne devienne
    critique pour la qualité du café stocké ?

### Coûts

12. Existe-t-il une enveloppe budgétaire définie pour l'équipement (actionneurs, câblage, automates) par
    entrepôt ?
13. Le coût d'exploitation (consommation électrique du chauffage/climatisation en continu) a-t-il été
    évalué, et existe-t-il une contrainte de consommation maximale ?

### Responsabilités

14. En cas de dommage sur un lot causé par une décision automatique erronée (ex. actionneur resté actif
    trop longtemps), qui est responsable : l'exploitant de l'entrepôt, l'éditeur de la solution, le
    fournisseur de l'actionneur ?
15. Le client souhaite-t-il une phase de validation humaine systématique avant toute action automatique
    (semi-automatique), ou une automatisation complète sans validation (pleinement automatique) ?

## 3. Tolérances et modes manuel/automatique

16. Les seuils de confort qualité (déjà définis phase 1 : température/humidité idéales ± tolérance)
    doivent-ils être identiques aux seuils de déclenchement des actionneurs, ou une marge différente
    est-elle souhaitée pour éviter des cycles marche/arrêt trop fréquents ?
17. Le mode manuel doit-il rester disponible en permanence (bouton bascule automatique/manuel par
    entrepôt), ou seulement en cas d'incident déclaré ?
18. Le passage en mode manuel doit-il nécessiter une justification/un commentaire de la part de
    l'opérateur (traçabilité) ?
19. Souhaitez-vous des plages horaires différenciées (ex. tolérance plus stricte la nuit quand personne
    n'est présent sur site) ?

## 4. Priorités de déploiement et indicateurs de réussite

20. Quel est l'entrepôt/pays pilote souhaité pour un premier déploiement de la phase 2 ?
21. Quels indicateurs permettront de juger le succès du pilote avant généralisation (ex. nombre
    d'alertes qualité évitées, temps d'intervention réduit, taux de disponibilité des actionneurs) ?
22. Quel est l'horizon de temps souhaité entre la validation du cadrage et un premier déploiement pilote ?
23. Existe-t-il une contrainte de compatibilité avec des équipements d'entrepôt déjà installés (marque,
    protocole de communication) à réutiliser plutôt que remplacer ?

## 5. Risques et scénarios d'incident

24. Que doit-il se passer en cas de coupure électrique prolongée de l'entrepôt (perte de tous les
    actionneurs et de la supervision en même temps) ?
25. Que doit-il se passer en cas de perte de connexion réseau/MQTT alors qu'un actionneur est en cours
    de fonctionnement (rester dans l'état courant, revenir à un état de repli sécurisé) ?
26. Un actionneur qui reste bloqué en position « active » (ex. chauffage qui ne s'éteint plus) doit-il
    déclencher une alerte critique distincte d'une alerte qualité classique ?
27. Le client souhaite-t-il un historique/audit des décisions automatiques consultable a posteriori
    (qui/quoi a déclenché telle action, à quelle heure, avec quel résultat) ?
28. Quel est le scénario du pire cas (ex. dégradation totale d'un lot de grande valeur suite à une panne
    d'actionneur non détectée) et quelle tolérance au risque le client est-il prêt à accepter avant que
    ce risque ne soit ramené à un niveau acceptable par des redondances (double capteur, double
    actionneur, etc.) ?
