# Kulturhub Frontend

Eine Web-Plattform für Kulturvereine. Nutzer können Organisationen verwalten, Veranstaltungen und Berichte veröffentlichen sowie Vereinsprofile pflegen. Dazu gibt es einen öffentlichen Bereich und einen Adminbereich.

## Tech Stack

- **Angular 21** (Standalone Components)
- **NX 22** (Monorepo, Library-Boundaries)
- **PrimeNG 21** mit Aura-Theme
- **Supabase JS** (Session-Management)
- **nswag** (OpenAPI → Angular Client)

## Entwicklungsserver starten

```bash
npm start
# oder
npx nx serve kultur-hub
```

App läuft unter `http://localhost:4200`.

## Bauen

```bash
npm run build
# oder
npx nx build kultur-hub
```

## API-Client generieren

Setzt einen laufenden Backend-Server voraus (Standard: `http://localhost:5000`).

```bash
npm run generate-api
```

Der generierte Client landet in `libs/shared/api/src/lib/api.generated.ts`.

## Projektstruktur

```
apps/
  kultur-hub/                    # Deploybare Angular-App

libs/
  public/                        # Öffentlicher Bereich (kein Login)
    feature-events/
    feature-reports/
    feature-clubs/
    ui/

  portal/                        # Organisationsverwaltung (Login required)
    feature-register/            # Registrierung per Einladungslink
    feature-organizations/
    feature-events/
    feature-reports/
    feature-profile/
    ui/

  admin/                         # Adminbereich (Admin-Rolle required)
    feature-invitations/
    feature-users/
    feature-organizations/
    ui/

  shared/
    auth/
      feature-login/             # Login-Seite
      data-access/               # SupabaseService, Guards, Interceptor
    api/                         # nswag-generierter OpenAPI-Client
    ui/
    util/
    domain/                      # TypeScript-Interfaces
```

## URL-Struktur

| Pfad | Bereich | Auth |
|------|---------|------|
| `/` | Öffentlich (Startseite → `/events`) | Nein |
| `/events`, `/reports`, `/clubs` | Öffentlich | Nein |
| `/login` | Login | Nein |
| `/register?code=xyz` | Registrierung per Einladungslink | Nein |
| `/portal/...` | Organisationsverwaltung | Ja |
| `/admin/...` | Adminbereich | Ja + Admin-Rolle |

## Konfiguration

Supabase-URL, Anon-Key und API-Base-URL werden in `apps/kultur-hub/src/environments/environment.ts` gesetzt.

## Tests

```bash
npx nx test
```
