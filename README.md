# Agil-dashboard
Application web Angular pour dashboards Power BI et prédiction de chiffre d'affaires - SNDP AGIL

## Description
Application web Angular complète avec les fonctionnalités suivantes :
- Page d'accueil avec présentation de la société SNDP AGIL
- Système d'authentification avec protection des routes
- Dashboard Power BI intégré
- Page de prédiction avec intégration API Flask
- Design moderne et responsive

## Installation

```bash
npm install
```

## Development server

```bash
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

```bash
ng build
```

## Architecture
```
src/app/
├── core/
│   ├── auth/ (services, guards, interceptors)
│   ├── api/ (service de prédiction)
│   └── constants/
├── shared/
│   ├── components/ (header, footer, loading)
│   └── models/
├── features/
│   ├── home/
│   ├── dashboard/
│   ├── prediction/
│   └── auth/
└── assets/
```