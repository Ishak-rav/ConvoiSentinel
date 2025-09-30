# ConvoiSentinel – Application mobile Expo/React Native

Application hors-ligne pour mémoriser les obstacles d’un convoi exceptionnel et les contacts utiles. L’app fonctionne sans réseau (stockage local), permet d’ajouter une description, des coordonnées GPS (saisie manuelle ou position actuelle), une photo (caméra), de supprimer un obstacle, et d’ouvrir sa position dans une page web de carte (Google Maps, Plan…).

## Fonctionnalités (barème)

- 2 écrans et navigation:
  - Onglet Obstacles (liste + suppression + lien carte + navigation vers ajout)
  - Onglet Contacts (liste statique utile, pas de CRUD)
- Écran d’ajout d’obstacle accessible par un bouton (+)
- Suppression d’un obstacle depuis la liste
- Stockage des obstacles en local via AsyncStorage (offline)
- Ergonomie:
  - Bouton flottant +, validations simples, feedbacks d’erreur
  - Mise en page claire (titres, coordonnées, actions visibles)
- Position géographique:
  - Saisie manuelle de latitude/longitude
  - Récupération de la position GPS actuelle
- Ouverture de carte web (sans SDK carto): ouvre Google Maps (ou l’app carto par défaut via URL)

## Structure des fichiers pertinents

- [app/(tabs)/\_layout.tsx](<app/(tabs)/_layout.tsx:1>): configuration des onglets (Obstacles, Contacts)
- [app/(tabs)/index.tsx](<app/(tabs)/index.tsx:1>): liste des obstacles (affichage, suppression, lien carte, bouton +)
- [app/add-obstacle.tsx](app/add-obstacle.tsx:1): écran d’ajout (titre, description, coordonnées manuelles, GPS, photo)
- [app/(tabs)/explore.tsx](<app/(tabs)/explore.tsx:1>): écran Contacts (liste statique + bouton Appeler)
- [app/\_layout.tsx](app/_layout.tsx:1): stack root (déclare la route add-obstacle)
- [services/obstacles.ts](services/obstacles.ts:1): service de persistance AsyncStorage (CRUD minimal)

## Dépendances principales

Installées via Expo:

- @react-native-async-storage/async-storage (stockage local)
- expo-location (GPS / permissions localisation)
- expo-image-picker (caméra)
- expo-file-system (provisionné si besoin futur)

Déjà présentes (template Expo Router):

- react, react-native, expo, expo-router, etc.

## Permissions (app.json)

- iOS (Info.plist via app.json):
  - NSCameraUsageDescription
  - NSLocationWhenInUseUsageDescription
- Android (Manifest via app.json):
  - CAMERA
  - ACCESS_FINE_LOCATION

Elles sont déjà configurées dans [app.json](app.json:1).

## Lancer le projet

1. Installer les dépendances:

```bash
npm install
```

2. Démarrer en développement:

```bash
npx expo start --tunnel
```

3. Ouvrir sur:

- Expo Go, Android Emulator, iOS Simulator ou Web (voir prompts Expo dans le terminal)

## Utilisation

- Onglet “Obstacles”:

  - Appuyez sur le bouton + pour créer un obstacle
  - Renseignez titre, description (optionnelle)
  - Coordonnées:
    - Saisie manuelle (latitude/longitude)
    - Ou “Utiliser ma position” pour remplir automatiquement depuis le GPS
  - Photo:
    - “Prendre une photo” ouvre la caméra
  - Enregistrez. L’obstacle apparaît en tête de liste
  - Dans la liste:
    - “Carte” ouvre la position dans le navigateur (Google Maps…)
    - “Supprimer” retire l’obstacle (confirmation)

- Onglet “Contacts”:
  - Liste statique de contacts utiles avec bouton “Appeler” quand un numéro est disponible

## Offline / Persistance

- Les obstacles sont stockés dans AsyncStorage (clé: @convoisentinel:obstacles)
- Le chargement se fait à chaque focus de l’écran liste (retour depuis l’ajout, relance de l’app, etc.)

## Tests manuels suggérés

- Ajouter un obstacle (texte seulement), vérifier qu’il apparaît
- Ajouter avec coordonnées manuelles
- Utiliser “Utiliser ma position” (autoriser la localisation) et vérifier l’affichage
- Prendre une photo et vérifier l’aperçu sur l’écran d’ajout (avant enregistrement)
- Ouvrir la carte depuis la liste (vérifier la bonne latitude/longitude dans l’URL)
- Supprimer un obstacle (confirmation)
- Fermer/réouvrir l’app (ou recharger) et vérifier la persistance des obstacles

## Dépôt Git

Initialiser le dépôt local:

```bash
git init
git add -A
git commit -m "ConvoiSentinel: app Expo offline (obstacles + contacts)"
git branch -M main
```

Créer un dépôt distant (GitHub, GitLab, etc.), puis l’ajouter:

```bash
git remote add origin https://github.com/Ishak-rav/ConvoiSentinel.git
git push -u origin main
```

Partagez ensuite le lien du repository Git demandé.

## Notes techniques

- Navigation:
  - Tabs: [app/(tabs)/\_layout.tsx](<app/(tabs)/_layout.tsx:1>)
  - Stack root + route “add-obstacle”: [app/\_layout.tsx](app/_layout.tsx:1)
- Stockage: [services/obstacles.ts](services/obstacles.ts:1) expose ObstaclesStore.getAll(), ObstaclesStore.add(), ObstaclesStore.remove(), ObstaclesStore.saveAll()
- Ouverture carte: construction d’URL Google Maps via Linking API
- Validation simple sur latitude/longitude (plages [-90..90], [-180..180])

## License

Privé / Interne (à adapter).
