# Marco Prime API

API REST pour Marco Prime, développée avec Hono, TypeScript et Drizzle ORM.

## Prérequis

- Node.js 24.x
- pnpm 10
- MySQL

## Installation

```bash
pnpm install
```

## Configuration

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
NODE_ENV=development
PORT=3000
LOG_LEVEL=info
DATABASE_URL=mysql://user:password@localhost:3306/marco_prime
```

## Démarrage

### Mode développement

```bash
pnpm dev
```

Le serveur démarre sur http://localhost:3000

### Mode production

```bash
pnpm build
pnpm start
```

## Documentation API

Une fois le serveur lancé, accédez à la documentation interactive :

- **Interface Scalar** : http://localhost:3000/reference
- **Spécification OpenAPI** : http://localhost:3000/doc

## Scripts disponibles

### Développement
- `pnpm dev` - Lance le serveur en mode watch
- `pnpm build` - Compile le TypeScript
- `pnpm start` - Lance le serveur compilé

### Qualité de code
- `pnpm lint` - Vérifie le code avec Biome
- `pnpm lint:fix` - Corrige automatiquement les problèmes
- `pnpm test` - Lance les tests avec Vitest

### Base de données
- `pnpm db:generate` - Génère les migrations depuis les schémas
- `pnpm db:migrate` - Exécute les migrations en attente
- `pnpm db:push` - Applique directement les schémas (développement uniquement)
- `pnpm db:studio` - Ouvre l'interface Drizzle Studio

## Structure du projet

```
src/
├── core/
│   ├── config/          # Configuration (app, env, db, OpenAPI)
│   ├── middlewares/     # Middlewares globaux
│   └── helpers/         # Utilitaires (HTTP status codes, etc.)
├── db/
│   ├── schemas/         # Schémas Drizzle ORM
│   └── migrations/      # Migrations de base de données
├── app.ts              # Configuration de l'application
└── index.ts            # Point d'entrée
```

## Technologies

- **Framework** : [Hono](https://hono.dev) - Framework web ultra-rapide
- **ORM** : [Drizzle](https://orm.drizzle.team) - ORM TypeScript type-safe
- **Base de données** : MySQL
- **Validation** : Zod
- **Documentation** : OpenAPI avec Scalar
- **Logger** : Pino
- **Linter** : Biome
- **Tests** : Vitest

## Licence

MIT
