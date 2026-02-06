# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Marco Prime API is a TypeScript-based REST API built with Hono framework, using Drizzle ORM with MySQL for database operations. The project uses pnpm as the package manager and includes OpenAPI documentation via Scalar.

## Development Commands

### Setup
```bash
pnpm install
```

### Development Server
```bash
pnpm dev  # Runs with tsx watch for hot reloading
```
Server starts at http://localhost:3000

### Building
```bash
pnpm build  # Compiles TypeScript to dist/
pnpm start  # Runs compiled code from dist/index.js
```

### Code Quality
```bash
pnpm lint       # Check code with Biome
pnpm lint:fix   # Auto-fix linting issues
pnpm test       # Run tests with Vitest
```

### Database Operations
```bash
pnpm db:generate  # Generate migrations from schema changes
pnpm db:migrate   # Run pending migrations
pnpm db:push      # Push schema directly to database (dev only)
pnpm db:studio    # Open Drizzle Studio GUI
```

## Architecture

### Core Structure

The application follows a layered architecture with clear separation of concerns:

- **src/index.ts**: Entry point that starts the Hono server using @hono/node-server
- **src/app.ts**: Main application setup, where routes are registered
- **src/core/config/**: Centralized configuration modules
  - **app.config.ts**: Creates the OpenAPIHono app instance with middleware stack (Pino logging, error handling, 404 handling). Exports `AppBindings` type for typed Hono context and `createRouter()` / `createTestApp()` utilities
  - **env.config.ts**: Environment variable validation using Zod schema (NODE_ENV, PORT, LOG_LEVEL, DATABASE_URL)
  - **db.config.ts**: Drizzle database instance with MySQL2 connection pool
  - **open-api.config.ts**: OpenAPI documentation setup with Scalar UI at `/reference`
  - **pino.config.ts**: Pino logger configuration

### Middleware Stack

Global middleware applied in this order:
1. Pino request logging (src/core/middlewares/pino.middleware.ts)
2. Error handler (src/core/middlewares/error-handler.middleware.ts) - returns JSON errors with stack traces in development
3. 404 handler (src/core/middlewares/not-found.middleware.ts) - returns JSON 404 responses

### Database Schema

Located in `src/db/schemas/`:
- **members.schema.ts**: User/member records with balance, admin/contributor flags
- **products.schema.ts**: Product catalog
- **product-types.schema.ts**: Product categories/types
- **orders.schema.ts**: Order records linking members to products
- **relations.ts**: Drizzle relational queries setup (members → orders, products → orders, product-types → products)
- **index.ts**: Exports all schemas

The database uses MySQL with Drizzle ORM. Schema changes should be made to the schema files, then run `pnpm db:generate` to create migrations.

### Routing

Routes are registered in `src/app.ts` by adding them to the `routes` array and calling `app.route("/", route)`. Currently the routes array is empty - new route modules should be imported and added here.

Each route module should:
1. Create a router using `createRouter()` from app.config.ts
2. Define routes using `@hono/zod-openapi` decorators for automatic OpenAPI doc generation
3. Use `AppRouteHandler` type for type-safe route handlers
4. Access logger via `c.var.logger` (provided by AppBindings)

### Type System

Key TypeScript types:
- **AppBindings**: Defines Hono context variables (currently just logger)
- **AppOpenAPI**: The OpenAPIHono type with AppBindings
- **AppRouteHandler<R>**: Type-safe route handler for RouteConfig R

The tsconfig.json uses path alias `@/*` mapping to `./src/*`.

## Configuration & Environment

Required environment variables (validated via Zod):
- `NODE_ENV`: defaults to "development"
- `PORT`: defaults to 3000
- `LOG_LEVEL`: one of fatal, error, warn, info, debug, trace, silent
- `DATABASE_URL`: MySQL connection URL (required)

## Code Style

This project uses Biome (not ESLint/Prettier):
- Double quotes for strings
- Space indentation
- Import organization enabled
- Console usage limited to assert/error/info/warn
- Direct process.env access discouraged (use env.config.ts)

## Testing

Tests use Vitest and should be placed in `tests/` directory. Use `createTestApp(router)` utility from app.config.ts to create a testable Hono app instance with middleware.

## API Documentation

OpenAPI spec available at `/doc` endpoint, interactive Scalar UI at `/reference`.
