# CLAUDE.md – Entwicklungskonventionen

## Wichtige Befehle

```bash
npx nx serve kultur-hub          # Dev-Server
npx nx build kultur-hub          # Build
npx nx lint                      # Alle Libraries linten (inkl. Boundary-Checks)
npm run generate-api             # OpenAPI-Client generieren (Backend muss laufen)
npx nx show projects             # Alle registrierten Projekte anzeigen
npx nx graph                     # Dependency-Graph im Browser
```

## Library-Struktur & Import-Pfade

| Import-Pfad | Inhalt |
|-------------|--------|
| `@kultur-hub/shared/domain` | TypeScript-Interfaces: `User`, `Organization`, `Event`, `Report`, `Invitation`, `SignUpRequest` |
| `@kultur-hub/shared/auth/data-access` | `SupabaseService`, `UserService`, `authGuard`, `adminGuard`, `notAuthenticatedGuard`, `authInterceptor`, `SUPABASE_URL`, `SUPABASE_ANON_KEY` |
| `@kultur-hub/shared/auth/feature-login` | `LoginPage` |
| `@kultur-hub/shared/api` | nswag-generierter Client + `API_BASE_URL` Token |
| `@kultur-hub/shared/ui` | Gemeinsame PrimeNG-Wrapper-Komponenten |
| `@kultur-hub/shared/util` | Pipes, Direktiven, Helper |
| `@kultur-hub/portal/feature-register` | `RegisterPage` (pre-auth, Einladungslink) |
| `@kultur-hub/portal/feature-organizations` | Org-CRUD |
| `@kultur-hub/portal/feature-events` | Event-CRUD |
| `@kultur-hub/portal/feature-reports` | Berichte-CRUD |
| `@kultur-hub/portal/feature-profile` | Steckbrief bearbeiten |
| `@kultur-hub/portal/ui` | Portal-spezifische Komponenten |
| `@kultur-hub/public/feature-events` | Öffentliche Veranstaltungen |
| `@kultur-hub/public/feature-reports` | Öffentliche Berichte |
| `@kultur-hub/public/feature-clubs` | Öffentliche Vereinsprofile |
| `@kultur-hub/public/ui` | Public-spezifische Komponenten |
| `@kultur-hub/admin/feature-invitations` | Einladungslinks |
| `@kultur-hub/admin/feature-users` | Nutzerverwaltung |
| `@kultur-hub/admin/feature-organizations` | Org-Moderation |
| `@kultur-hub/admin/ui` | Admin-spezifische Komponenten |

## NX-Tags & Dependency Rules

Jede Library hat zwei Tags (`scope` und `type`). Der Lint-Check schlägt an, wenn eine Library etwas importiert, das nicht erlaubt ist.

**Erlaubte Abhängigkeiten:**
- `scope:shared` → darf von allen importiert werden
- `scope:public/portal/admin` → darf nur `scope:shared` und die eigene Scope importieren
- `type:feature` → darf nicht von anderen Scopes importiert werden
- `type:ui` → darf nur `type:ui`, `type:domain`, `type:util` importieren
- `type:data-access` → darf nur `type:data-access`, `type:domain`, `type:util` importieren

Beim Erstellen einer neuen Library: Tags in `project.json` korrekt setzen.

## Neue Library anlegen

```bash
npx nx g @nx/angular:library \
  --directory=libs/<scope>/<name> \
  --name=<scope>-<name> \
  --importPath="@kultur-hub/<scope>/<name>" \
  --standalone \
  --tags="scope:<scope>,type:<type>" \
  --skipTests \
  --no-routing   # oder --routing für Feature-Libraries
```

## Neue Komponente anlegen

```bash
npx nx g @nx/angular:component \
  --project=<nx-project-name> \
  --name=<component-name> \
  --standalone
```

## Auth-Flow

1. **Registrierung**: `POST /api/signup` mit `{ firstName, lastName, email, password, invitationCode }` — nur per Einladungslink möglich
2. **Login**: Supabase `signInWithPassword(email, password)` → dann `GET /api/users/me` für User-Details (inkl. `isAdmin`)
3. **API-Calls**: `authInterceptor` setzt automatisch `Authorization: Bearer <supabase-jwt>` auf alle Requests

## Coding-Konventionen

- Alle Komponenten sind **Standalone** (kein NgModule)
- PrimeNG-Komponenten direkt in `imports: []` der Komponente importieren
- Signals für lokalen State (`signal()`, `computed()`)
- `inject()` statt Konstruktor-Injection
- Formulare mit `FormBuilder.nonNullable` und Reactive Forms
- Keine `any`-Typen (TypeScript strict mode aktiv)
- Kein generierter Code in `libs/shared/api/src/lib/api.generated.ts` manuell bearbeiten
