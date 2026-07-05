---
name: FutureKawa Design System
description: Système de design chaleureux, artisanal et moderne pour la gestion opérationnelle de cafés.
colors:
  primary: "#532a0e"
  primary-foreground: "#fdfaf7"
  background: "#ffffff"
  foreground: "#252525"
  border: "#ebebeb"
  ring: "#b5b5b5"
typography:
  display:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 5vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.2
  body:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-primary-hover:
    backgroundColor: "rgba(83, 42, 14, 0.9)"
---

# Design System: FutureKawa

## 1. Overview

**Creative North Star: "L'Atelier de Torréfaction"**

Ce système de design traduit visuellement l'ambiance chaleureuse d'un atelier artisanal de torréfaction combiné à la précision et l'efficacité d'un outil d'administration moderne. Le design repose sur des contrastes marqués, des tons bruns et beiges terreux, et une clarté typographique qui permet aux gérants de travailler efficacement, même dans la précipitation du service.

Ce système rejette la froideur des SaaS conventionnels bleus et gris, ainsi que le minimalisme clinique dénué de texture.

**Key Characteristics:**
- Palette dominante brune et crème chaleureuse.
- Densité confortable favorisant la lecture rapide et l'accessibilité.
- Élévation discrète : les éléments restent plats au repos pour préserver l'authenticité artisanale, réagissant de manière dynamique lors des interactions.

## 2. Colors

La palette s'articule autour du grain de café et de ses dérivés, mariant des accents profonds et chauds avec des fonds très doux.

### Primary
- **Brun Grains de Café** (#532a0e) : Couleur principale utilisée pour les états actifs, la marque, les boutons d'action principale et les indicateurs majeurs.
- **Crème Mousse de Lait** (#fdfaf7) : Couleur de contraste primaire, utilisée pour le texte sur fond brun afin de garantir une parfaite lisibilité.

### Neutral
- **Fond Papier** (#ffffff) : Couleur de fond des pages.
- **Texte Expresso** (#252525) : Couleur de texte par défaut, offrant un contraste élevé sans la dureté du noir pur.
- **Texte Secondaire** (`oklch(0.45 0 0)`, ≈ #737373) : couleur des textes secondaires/discrets (légendes, métadonnées, placeholders). Contraste ≥7:1 sur fond blanc — volontairement plus foncé que le gris par défaut de shadcn/ui (`oklch(0.556 0 0)`, ≈4.7:1, à peine conforme) pour rester lisible même sur les fonds teintés (badges, cartes `bg-muted/40`, etc.).
- **Bordure Tasse** (#ebebeb) : Couleur de bordure standard des cartes et séparateurs.

**The Contrast Rule.** Toute utilisation de la couleur primaire brune pour un arrière-plan interactif ou un badge doit obligatoirement être accompagnée de la couleur crème (#fdfaf7) pour le texte de premier plan. Le texte noir sur fond brun est strictement interdit.

**La règle des teintes de statut.** Les couleurs sémantiques (emerald/amber/rose) utilisées comme **texte** doivent toujours être la nuance **700** (clair) ou **400** (sombre), jamais 500/600 : ces nuances intermédiaires tombent sous 4.5:1 sur les fonds clairs/teintés de l'application. La nuance 500/600 reste correcte pour les **icônes** et les **puces de couleur** (contrainte non-textuelle à 3:1).

## 3. Typography

**Display Font:** System Sans (ui-sans-serif, system-ui, sans-serif)
**Body Font:** System Sans (ui-sans-serif, system-ui, sans-serif)

**Character:** Choix d'une typographie sans-serif neutre, propre et hautement lisible, laissant la chaleur visuelle s'exprimer par les couleurs, l'espacement et la hiérarchie.

### Hierarchy
- **Display** (Bold, clamp(2rem, 5vw, 3rem), 1.2) : Titres des pages marketing et grands en-têtes d'accueil.
- **Headline** (SemiBold, 1.5rem, 1.3) : Titres des sections et grands blocs d'information.
- **Title** (Medium, 1.125rem, 1.4) : Titres des cartes et des sous-menus.
- **Body** (Regular, 1rem, 1.5) : Texte courant. Limité à une longueur de ligne de 70ch pour un confort de lecture optimal.
- **Label** (Medium, 0.875rem, normal) : Libellés de formulaires, badges et petits tableaux.

## 4. Elevation

L'atelier de torréfaction privilégie un rendu tactile et physique. Les éléments sont plats par défaut et s'élèvent discrètement sous l'effet du survol de l'utilisateur pour mimer le contact.

**The Flat-By-Default Rule.** Tous les boutons et cartes sont dessinés à plat, sans ombre portée au repos. Les ombres n'apparaissent que comme un retour interactif lors du survol ou du focus.

### Shadow Vocabulary
- **Interactive Glow** (`box-shadow: 0 4px 12px rgba(83, 42, 14, 0.08)`) : Utilisé lors du survol des cartes ou des boutons pour indiquer la sélection.

## 5. Components

### Buttons
- **Shape:** Coins légèrement arrondis (8px/rounded-md).
- **Primary:** Fond brun (#532a0e), texte crème (#fdfaf7), padding confortable.
- **Hover / Focus:** Transition douce vers une opacité réduite (`hover:bg-primary/90`) et apparition de l'Interactive Glow.

### Cards / Containers
- **Corner Style:** Arrondi standard (8px/rounded-lg).
- **Background:** Fond blanc uni ou beige très léger.
- **Shadow Strategy:** Bordure fine grise au repos, élévation subtile au survol.
- **Internal Padding:** 1.5rem (24px/spacing-lg).

### Inputs / Fields
- **Style:** Bordure fine, hauteur constante, coins arrondis (6px/rounded-sm).
- **Focus:** Bordure passant à un brun clair avec halo discret.

### Navigation
- Liens textuels discrets avec indicateur d'état actif utilisant la couleur primaire en arrière-plan (dans le sidebar) ou en soulignement léger.

## 6. Do's and Don'ts

### Do:
- **Do** toujours accompagner l'arrière-plan brun par un texte crème (#fdfaf7) ou blanc.
- **Do** conserver un style à plat au repos pour les conteneurs et les cartes.
- **Do** limiter les éléments à angle droit stricts, privilégier des arrondis doux (8px).

### Don't:
- **Don't** utiliser du bleu ou du gris froid pour les actions majeures ou les arrières-plans.
- **Don't** ajouter de bande de couleur accentuée sur les bords des cartes (side-stripe borders).
- **Don't** appliquer des dégradés de couleurs (gradients) sur les textes ou les boutons.
