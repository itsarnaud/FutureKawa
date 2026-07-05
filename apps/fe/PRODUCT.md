# Product

## Register

product

## Users

Gestionnaires d'exploitation et torréfacteurs travaillant au siège de FutureKawa, en supervision à
distance des stocks de café vert et des conditions d'entreposage (température/humidité) répartis sur
trois pays producteurs (Brésil, Équateur, Colombie). Usage bureau/écran large, dans un contexte
professionnel quotidien où il faut pouvoir juger rapidement de l'état des stocks sans margin d'erreur —
un lot mal identifié ou une alerte manquée a un coût réel (dégradation qualité, perte de traçabilité
client). Pas d'usage terrain/entrepôt prévu pour cette interface.

## Product Purpose

FutureKawa Vue Siège centralise ce qui était auparavant suivi de façon semi-manuelle et dispersée par
pays : conditions de stockage (IoT température/humidité), rotation FIFO des lots, preuve de traçabilité
pour les clients B2B, et alertes qualité/péremption. Le succès se mesure à la capacité d'un gestionnaire
à répondre en un coup d'œil à trois questions : quel lot sortir en premier, quels entrepôts sont hors
plage, et quelles alertes restent à traiter.

## Brand Personality

Chaleureux, précis, artisanal. Le produit doit se sentir comme l'outil d'un atelier de torréfaction
exigeant — pas comme un tableau de bord SaaS générique. La chaleur vient de la palette (bruns café,
crème) et de l'absence de froideur clinique ; la précision vient de la densité d'information et de la
clarté des statuts (conforme / alerte / périmé toujours visibles avant le détail).

## Anti-references

Pas de bleu/gris froid façon SaaS d'entreprise conventionnel. Pas de minimalisme clinique dénué de
texture. Pas de bandes de couleur en bord de carte (side-stripe), pas de dégradés sur texte ou boutons
(voir DESIGN.md, section Do's and Don'ts — ces règles visuelles découlent directement de ce
positionnement de marque).

## Design Principles

- **Le statut avant le détail.** Sur chaque écran (lots, entrepôts, alertes), l'état (conforme / alerte
  / périmé, traité / non traité) doit être lisible avant qu'on ait besoin de cliquer.
- **Authenticité artisanale, pas froideur corporate.** Chaque choix visuel doit renforcer l'idée d'un
  outil pensé pour le café, pas d'un dashboard interchangeable.
- **Densité confortable.** L'utilisateur travaille parfois dans la précipitation ; l'interface doit
  rester scannable rapidement sans sacrifier les détails utiles (dates FIFO, seuils par pays).
- **Prévisibilité multi-pays.** Les seuils, unités et données diffèrent par pays (Brésil, Équateur,
  Colombie), mais la grammaire d'interface (mise en page, composants, hiérarchie) reste identique
  partout — jamais de surprise en changeant de contexte pays.

## Accessibility & Inclusion

Cible WCAG AA (contrastes suffisants texte/fond, navigation clavier complète, aucun état porté par la
couleur seule — voir les badges de statut qui combinent icône + couleur + libellé). Pas d'exigence
d'accessibilité spécifique au-delà de ce standard pour l'instant.
