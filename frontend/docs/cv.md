# CV generato nel browser

Il pulsante «Scarica CV (PDF)» nella sezione Contatti genera
`Fabrizio_Lombardi_CV.pdf` al momento del clic. Non è necessario aggiornare
manualmente un PDF quando cambiano i contenuti del portfolio.

## Contenuti e layout

- `src/data/profile.ts`: nome, ruolo, presentazione, foto, contatti e informazioni
  personali, condivisi con Home e Contatti.
- `src/data/portfolioData.tsx`: aggiunge ai contatti le icone usate dal sito.
- I servizi `skillService` e `workAndTrainingService` recuperano competenze,
  esperienze e formazione dalle API già utilizzate dal sito.
- `src/utils/createCvData.ts`: ordina le esperienze per data di inizio decrescente,
  raggruppa le competenze, formatta date e qualifiche e omette i campi facoltativi
  assenti. La data corrente viene interpretata nel fuso Europe/Rome.
- `src/components/cv/CvDocument.tsx`: impaginazione A4 chiara, testo selezionabile,
  link cliccabili, font Inter incorporato, foto e colori del portfolio. Il layout
  si estende su più pagine quando aumentano i contenuti.

## Flusso di download

`CvDownloadButton` importa dinamicamente `cvService`: il generatore PDF e i font
vengono caricati solo quando richiesti. Ogni clic recupera nuovamente i dati
dalle API. Il servizio ridimensiona la foto in memoria per mantenere leggero
il PDF, senza modificare l'immagine originale.

Il riquadro dei contatti include il link cliccabile al portfolio, ricavato
dall'origine del sito aperto (senza il percorso della pagina corrente).
In sviluppo o su localhost viene usato `https://portfolio.flomb.it`, configurato
in `src/data/profile.ts`, così il CV non rimanda al server locale.

Durante la generazione il pulsante è disabilitato. Se una richiesta o la
generazione fallisce, compare un messaggio e si può riprovare; non viene
scaricato un CV parziale. Le sezioni senza record vengono omesse.

Il frontend non usa più `/api/cv`. Il vecchio endpoint e il PDF statico nel
backend sono conservati per compatibilità con eventuali collegamenti esterni;
non partecipano alla generazione del nuovo CV.

## Verifica

Eseguire `npm run build` e `npm run lint` dalla cartella `frontend`.
Il bundle del generatore resta separato; Vite può segnalarne le dimensioni.

Con API disponibili, aprire Contatti e verificare:

1. Download con nome corretto, font, accenti, foto e link funzionanti.
2. Una modifica a esperienze o competenze compare nel download successivo.
3. Durante il caricamento non partono download duplicati.
4. Con API non disponibili compare l'errore; al ripristino è possibile riprovare.
5. Campi facoltativi assenti e sezioni vuote non impediscono la generazione.
6. Descrizioni molto lunghe continuano sulle pagine successive senza essere tagliate.
7. Download con viewport mobile e tema scuro: il documento resta A4 con tema chiaro.
