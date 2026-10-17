# Cache GitHub condivisa

Il frontend legge `GET /api/github/repositories`. Questo endpoint restituisce solo
lo snapshot in memoria e non contatta mai GitHub, neppure al primo accesso.

Il backend aggiorna lo snapshot all'avvio (in background) e ogni 600.000 ms,
indipendentemente dalle visite. Per ogni aggiornamento richiede l'elenco dei
repository pubblici, ordinati per aggiornamento, con 100 risultati per pagina.
I topic sono inclusi nella stessa risposta: non vengono richiesti separatamente.
I fork vengono esclusi. Con meno di 100 repository basta una richiesta ogni 10
minuti, circa sei all'ora.

Lo snapshot viene sostituito atomicamente solo dopo il recupero di tutte le
pagine. Errori HTTP, limiti GitHub, timeout e risposte non valide mantengono
l'ultimo snapshot riuscito. Il tentativo successivo avviene al prossimo ciclo,
senza retry causati dai visitatori. Un elenco vuoto ottenuto con successo è valido.
Prima del primo aggiornamento riuscito l'endpoint risponde 503 con `Retry-After: 60`;
il frontend mostra un messaggio con il link al profilo GitHub.

## Configurazione

- `GITHUB_USERNAME`: account pubblico da mostrare (predefinito `Biziol`).
- `GITHUB_TOKEN`: token opzionale, usato esclusivamente dal backend; non serve per
  leggere repository pubblici. Docker Compose inoltra entrambe le variabili.
- `app.github.scheduling-enabled=false`: disabilita gli aggiornamenti automatici,
  come nel profilo di test, per evitare chiamate esterne durante i test.

Non sono necessarie migrazioni del database. La cache è condivisa da tutti gli
utenti della stessa istanza backend; viene ricreata a ogni riavvio. Con più
repliche ogni istanza eseguirebbe il proprio aggiornamento: per una cache unica
fra repliche occorrerebbe un archivio condiviso e un unico job di aggiornamento.

Riferimento: [GitHub REST API — repository](https://docs.github.com/en/rest/repos/repos).
