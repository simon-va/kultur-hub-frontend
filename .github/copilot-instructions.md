# Copilot Instructions for Kulturhub Frontend

## Build, Test, and Lint Commands

```bash
# Dev server (runs at http://localhost:4200)
npx nx serve kultur-hub

# Production build
npx nx build kultur-hub

# Lint all projects (includes NX module boundary checks)
npx nx lint

# Run unit tests (only the app project `kultur-hub` has a test target)
npx nx test kultur-hub
```

## Generating the API Client

The backend must be running (default: `http://localhost:5159`).

```bash
npm run generate-api
```

This runs `nswag run nswag.json /runtime:Net100` and writes the generated client to `libs/shared/api/src/lib/api.generated.ts`. **Never edit this file manually.**

---

## High-Level Architecture

### NX Monorepo with Scope-Based Boundaries

The workspace is organized around **scopes** (`public`, `portal`, `admin`, `shared`) and **types** (`feature`, `ui`, `data-access`, `domain`, `util`). Every library has two tags in its `project.json`. The linter enforces these rules via `@nx/enforce-module-boundaries`:

- `scope:app` (the single app) can import everything.
- `scope:public/portal/admin` can only import from itself and `scope:shared`.
- `scope:shared` can only import from `scope:shared`.
- `type:ui` can only import `type:ui`, `type:domain`, `type:util`.
- `type:data-access` can only import `type:data-access`, `type:domain`, `type:util`.
- `type:feature` must not be imported by other features.

### Application Routing Structure

| Route prefix | Scope | Auth required |
|--------------|-------|---------------|
| `/` | Public (`public/`) | No |
| `/login`, `/register` | Auth features (`shared/auth/`) | No (redirects if already logged in) |
| `/portal/*` | Portal (`portal/`) | Yes (`authGuard`) |
| `/admin/*` | Admin (`admin/`) | Yes (`authGuard` + `adminGuard`) |

Routes are lazy-loaded. Feature libraries expose a `*Routes` array (e.g., `portalFeatureEventsRoutes`) from `src/lib/lib.routes.ts`.

### Auth Flow

1. **Registration**: `POST /api/signup` with `{ firstName, lastName, email, password, invitationCode }` — only possible via invitation link.
2. **Login**: `SupabaseService.signIn(email, password)` sets the Supabase session. Then `UserService.loadCurrentUser()` fetches the user profile (including `isAdmin`) from `GET /api/users/me`.
3. **API calls**: `authInterceptor` automatically attaches `Authorization: Bearer <supabase-jwt>` to all HTTP requests.
4. **Error handling**: `httpErrorInterceptor` handles 401 (signs out and redirects to `/login`), 403, and 500 globally via `ErrorStateService` + a global PrimeNG Toast.

### State Management

- **Local component state**: Angular `signal()` and `computed()`.
- **Shared/global state**: `@ngrx/signals` `signalStore` with `rxResource` for API-backed data. Stores are typically `providedIn: 'root'`.
- Example pattern: `rxResource` takes a `params` signal and a `stream` observable factory; reload with `resource.reload()`.

---

## Key Conventions

### Components

- All components are **standalone**. There are no NgModules.
- PrimeNG modules are imported **directly in the component's `imports` array** (e.g., `ButtonModule`, `CardModule`, `InputTextModule`).
- Use `inject()` instead of constructor injection.
- Component selectors follow the pattern `lib-*` for libraries and `app-*` for the app itself.

### Forms

- Use `FormBuilder.nonNullable` for reactive forms.
- Server validation errors can be mapped to form controls with `mapValidationErrorsToForm(form, errors)` from `@kultur-hub/shared/util`.

### API Client

- The generated client is in `libs/shared/api/src/lib/api.generated.ts`.
- Each controller becomes an injectable client class (e.g., `EventClient`, `OrganisationClient`, `UserClient`).
- The `API_BASE_URL` injection token is provided in `app.config.ts`.
- **Do not edit the generated file.** Regenerate via `npm run generate-api`.

### Creating New Libraries and Components

Use NX generators to preserve tags and structure:

```bash
# New library
npx nx g @nx/angular:library \
  --directory=libs/<scope>/<name> \
  --name=<scope>-<name> \
  --importPath="@kultur-hub/<scope>/<name>" \
  --standalone \
  --tags="scope:<scope>,type:<type>" \
  --skipTests \
  --no-routing   # or --routing for feature libraries

# New component inside a library
npx nx g @nx/angular:component \
  --project=<nx-project-name> \
  --name=<component-name> \
  --standalone
```

### TypeScript and Style

- Strict mode is enabled (`strict: true`, `noImplicitReturns`, etc.).
- No `any` types.
- Single quotes for strings (enforced by `.editorconfig`).
- Prettier print width is **100**.

### Language

UI text is written in **German**. Error messages, labels, and toast notifications should remain in German.

### Import Paths

Key library paths (defined in `tsconfig.base.json`):

- `@kultur-hub/shared/domain` — TypeScript interfaces (`User`, `Organisation`, `Event`, `Report`, `Invitation`, `SignUpRequest`, etc.)
- `@kultur-hub/shared/auth/data-access` — `SupabaseService`, `UserService`, `authGuard`, `adminGuard`, `notAuthenticatedGuard`, `authInterceptor`, `httpErrorInterceptor`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`
- `@kultur-hub/shared/auth/feature-login` — `LoginPage`
- `@kultur-hub/shared/api` — Generated OpenAPI client + `API_BASE_URL`
- `@kultur-hub/shared/util` — `ErrorStateService`, `mapValidationErrorsToForm`
- `@kultur-hub/portal/domain` — `OrganisationsStore`, `EventsStore`, `hasOrganisationGuard`
