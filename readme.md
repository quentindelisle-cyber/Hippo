# Hippopogramme

Web app EPS / musculation au format PWA.

## Fichiers à placer à la racine

- index.html
- manifest.webmanifest
- service-worker.js
- machine-questions.json
- Logo N'EPS.jpeg
- icon-192.png
- icon-512.png

## Dossier machines

Créer un dossier `machines/` contenant exactement :

- Vélo.png
- deltoïdes.png
- Développé Couché.png
- Dorso Lombaire.png
- ischios.png
- Leg Curl.png
- Pompes.png
- Presse Oblique.png
- Rowing.png
- Shoulder Press.png
- Tapis de course.png
- Tirage Assis.png
- Tirage Nuque.png
- Tractions.png

## Questions sur les machines

Les questions sont dans le fichier `machine-questions.json` à la racine du dépôt.

Tu peux les modifier directement sans toucher au fichier HTML.

Chaque machine contient 3 questions.
Chaque question contient :
- `question`
- `correct`
- `wrong1`
- `wrong2`

## Déploiement GitHub Pages

1. Créer un dépôt GitHub.
2. Déposer tous les fichiers à la racine.
3. Ajouter le dossier `machines/`.
4. Aller dans `Settings > Pages`.
5. Choisir `Deploy from a branch`.
6. Sélectionner `main` puis `/root`.
7. Enregistrer.

## Installation PWA

### Android / Chrome
- Ouvrir le site
- Menu
- Ajouter à l’écran d’accueil

### iPad / Safari
- Ouvrir le site
- Partager
- Sur l’écran d’accueil