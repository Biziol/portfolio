# Portfolio

Questo repository contiene il codice del mio portfolio personale, composto da un backend Spring Boot e da un frontend React (Vite + TypeScript).

**Scopo:** mostrare progetti, esperienza, competenze e permettere una semplice demo CRUD per autenticazione e dati di esempio.

**Contenuto del repository**

- `backend/` : applicazione Java Spring Boot (API REST, sicurezza, persistenza).
- `frontend/` : applicazione React + TypeScript (Vite) per l'interfaccia utente.

**Tecnologie principali**

- Backend: Java, Spring Boot, Spring Security, JPA/Hibernate
- Frontend: React, TypeScript, Vite, TailwindCss
- Build: Gradle (backend), npm / pnpm (frontend)

Struttura rilevante:

- `backend/src/main/java/...` : sorgenti Java dell'API
- `backend/src/main/resources` : configurazioni Spring (application.properties)
- `frontend/src` : sorgenti React (componenti, pagine, servizi)

Prerequisiti

- Java 17+
- Gradle wrapper incluso (usare `./gradlew`)
- Node.js 18+ e npm o pnpm
- Docker + Docker Compose (per deploy containerizzato)

Esecuzione in locale

1. Avviare il backend

```bash
cd backend
./gradlew bootRun
```

Il backend espone le API su `http://localhost:8080` (configurazione locale).

2. Avviare il frontend

```bash
cd frontend
npm install
npm run dev
```

Per usare `pnpm` sostituire i comandi di `npm` con `pnpm`.

Build e pubblicazione immagini Docker su GitHub Container Registry

Questo repository usa GitHub Actions per costruire e pubblicare le immagini Docker di backend e frontend su GHCR.

Le immagini pubblicate sono:

- `ghcr.io/biziol/portfolio-backend`
- `ghcr.io/biziol/portfolio-frontend`

Deploy su server con Docker Compose

Il file `docker-compose.yml` è già configurato per usare immagini GHCR e avviare:

- frontend esposto su `3001`
- backend esposto su `8081`
- database MariaDB interno

Per avviare i servizi con l'ultima immagine pubblicata:

```bash
export IMAGE_TAG=latest
docker compose pull
docker compose up -d
```

Se i package GHCR sono privati, prima fai login:

```bash
docker login ghcr.io -u biziol
```

Nginx sull'host può poi fare da proxy pubblico verso:

- `http://127.0.0.1:3001` (frontend)
- `http://127.0.0.1:8081` (backend API)

Se vuoi ricostruire in locale dal sorgente, Docker Compose continuerà a usare i `Dockerfile` presenti in `backend/` e `frontend/`.

Documentazione API (Swagger UI)

Il backend include la documentazione OpenAPI tramite SpringDoc e rende disponibile Swagger UI.

- In locale (backend su `8080`): `http://localhost:8080/swagger-ui.html`
- In deploy con Docker Compose (backend su `8081`): `http://localhost:8081/swagger-ui.html`
- Endpoint OpenAPI JSON: `/v3/api-docs`

Contenuti del portfolio in JSON

`GET /api/portfolio` è pubblico e raccoglie i contenuti dinamici in un'unica
risposta `application/json`, riutilizzando gli stessi servizi delle API di sezione:

- `workAndTraining`: esperienze e formazione, con i rispettivi `arguments`.
- `skills`: competenze e categorie.
- `aiWorkflows`: solo workflow IA pubblicati, con strumenti, passaggi, esempio e conclusioni.
- `projects`: progetti dallo snapshot condiviso GitHub, senza chiamate esterne durante la richiesta.
- `projectsAvailable`: `false` prima del primo aggiornamento GitHub riuscito; in quel caso
  `projects` è `[]` e gli altri contenuti rimangono disponibili con HTTP 200.
- `reviews` e `rating`: recensioni pubbliche e media (0 in assenza di recensioni).

Le collezioni senza contenuti sono array vuoti. I DTO delle sezioni mantengono
gli stessi campi delle API esistenti. Le bozze dei workflow e i dati amministrativi
non sono inclusi. Profilo, contatti e testi About definiti staticamente nel frontend
(`frontend/src/data/profile.ts` e `about.ts`) non fanno parte di questo endpoint.

```bash
curl -H 'Accept: application/json' http://localhost:8080/api/portfolio
```

Variabili di ambiente

- `frontend/.env` o `frontend/.env.example` contiene variabili per la build (es. URL backend).
- `backend/src/main/resources/application-local.properties` può essere usato per configurare il profilo locale.

Contatti e autore

- Autore: Fabrizio Lombardi
- Contatto: fabriziolombardi732@gmail.com

Contribuire

Se vuoi suggerire modifiche o miglioramenti, apri una issue o invia una pull request. Per modifiche rilevanti, apri prima una issue per discutere il cambiamento.

Licenza

Questo progetto è rilasciato sotto la Apache License, Version 2.0. Vedi il file [LICENSE](LICENSE) per il testo completo della licenza.
