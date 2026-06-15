# My Sweet Hotel 🏨

**My Sweet Hotel** est une application mobile de gestion hôtelière destinée aux clients et permettant de centraliser les services de conciergerie de l'hôtel.

## À propos

My Sweet Hotel offre une expérience connectée entre les clients et leur hôtel : communication en temps réel via un chat intégré, gestion des demandes de chambre, commande de taxi, maintenance, et bien plus. L'application supporte iOS, Android et le Web.

## Fonctionnalités

- 🔐 Authentification sécurisée avec scan de QR code
- 💬 Chat en temps réel entre clients et personnel
- 🛎️ Demandes de service (maintenance, changement de chambre, taxi…)
- ⏱️ Timer de session
- 👤 Profil utilisateur personnalisable
- 🌍 Support multilingue (i18n)
- 🔔 Notifications push (OneSignal)
- 📸 Import de photos depuis la galerie ou l'appareil photo

## Stack technique

| Technologie | Usage |
|-------------|-------|
| React Native (Expo) | Framework mobile cross-platform |
| Firebase (Firestore, Auth, Hosting) | Backend & base de données |
| React Navigation | Navigation entre écrans |
| i18next | Internationalisation |
| Sentry | Monitoring des erreurs |
| Docker | Conteneurisation |

## Installation

```bash
# Cloner le repo
git clone https://github.com/Dadou1985/MySweetHotel.git
cd MySweetHotel

# Installer les dépendances
yarn install

# Lancer l'application
yarn start
```

## Lancer sur les différentes plateformes

```bash
# iOS
yarn ios

# Android
yarn android

# Web
yarn web
```

## Déploiement

L'application est déployée sur Firebase Hosting :

```bash
yarn deploy-hosting
```

## Licence

Projet privé — tous droits réservés.
