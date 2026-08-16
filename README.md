# Abricot

Application de gestion de projets et de tâches (type Trello/Notion simplifié), développée avec Next.js.

## Stack

- [Next.js 16](https://nextjs.org/) (App Router, Server Actions)
- React 19 / TypeScript
- Tailwind CSS 4
- [Zod](https://zod.dev/) pour la validation des formulaires
- [jose](https://github.com/panva/jose) pour les sessions JWT

Ce dépôt est le **front-end** uniquement ; il consomme une API backend séparée (voir `API_URL`).

## Prérequis

- Node.js 20+
- pnpm
- Une instance de l'API backend accessible ([voir ce repo](https://github.com/UgustinV/P7-FullStack-Back))

## Installation

```bash
pnpm install
```

## Variables d'environnement

Créer un fichier `.env` à la racine (exemple avec le backend en local) :

```env
API_URL=http://localhost:8000
SESSION_SECRET=<clé aléatoire, générée avec par ex. `openssl rand -base64 32`>
```

- `API_URL` : URL de base de l'API backend.
- `SESSION_SECRET` : clé utilisée pour signer les sessions JWT (`app/lib/session.ts`). Ne jamais commit sa valeur réelle.

## Lancer le projet

```bash
pnpm dev       # démarre le serveur de développement
pnpm build     # build de production
pnpm start     # lance le build de production
pnpm lint      # eslint
```

L'application est disponible sur [http://localhost:3000](http://localhost:3000) si lancée avec `pnpm dev`.

## Structure

```
app/
  (auth)/         pages login / signup
  (app)/          pages authentifiées : dashboard, projects, account
  actions/        Server Actions (auth, projects, tasks, users)
  lib/            session, data access layer (dal), permissions, définitions de types
components/       composants UI réutilisables
proxy.ts          middleware de protection des routes (redirection login/dashboard)
```

## Fonctionnalités

- **Authentification** : inscription, connexion, déconnexion, modification du mot de passe. Sessions stockées dans un cookie httpOnly signé (JWT).
- **Projets** : création, modification, suppression, gestion des contributeurs et de leurs rôles.
- **Tâches** : création, modification, suppression, commentaires, vues Liste / Kanban / Calendrier.
- **Rôles et droits d'accès** :
  - Tout utilisateur peut créer un projet et en devient automatiquement propriétaire (`OWNER`).
  - Seuls les contributeurs d'un projet peuvent le consulter et créer/supprimer des tâches.
  - Seuls les administrateurs (`OWNER`/`ADMIN`) peuvent modifier les informations du projet (description, contributeurs, deadlines).

## Accessibilité

Respect des standards WCAG AA : navigation clavier complète, attributs ARIA sur les composants interactifs (modales, menus, listes déroulantes), textes alternatifs sur toutes les images.