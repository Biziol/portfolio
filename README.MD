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
