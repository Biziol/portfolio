# Come uso l’IA

La sezione `/ai-workflow` racconta il processo di lavoro con l’IA attraverso
workflow pubblicati dall’amministratore. Non richiede API o crediti di un
fornitore di IA: è una sezione editoriale del portfolio.

## Gestione dei contenuti

In `/admin`, aprire **Workflow IA**. È possibile creare un workflow vuoto o
partire dall’esempio sul CV, che riempie soltanto l’editor e non viene salvato
né pubblicato automaticamente.

Ogni workflow comprende:

- Titolo e obiettivo.
- Strumenti, separati da virgole nell’editor.
- Da 1 a 20 passaggi, riordinabili con i pulsanti su/giù.
- Caso concreto e conclusioni, in cui riassumere risultati e verifiche personali.

Le descrizioni dei passaggi e i campi caso concreto e conclusioni supportano Markdown,
compresi elenchi, link, tabelle e blocchi di codice. L’anteprima usa lo stesso
componente della sezione pubblica. HTML e immagini Markdown non vengono
renderizzati; gli URL dei link sono filtrati da react-markdown.

**Salva bozza** conserva il contenuto senza mostrarlo ai visitatori. Per
pubblicare, selezionare la casella **Pubblicato** e salvare: le conclusioni
diventano obbligatorie. Deselezionarla e salvare ritira il workflow.
L’eliminazione richiede una conferma. Se il salvataggio fallisce, l’editor conserva
le modifiche per consentire un nuovo tentativo.

La bozza viene salvata solo con l’apposito pulsante. Le modifiche non salvate
richiedono conferma prima di chiudere l’editor, cambiare sezione admin o uscire.
Il browser avvisa anche prima di ricaricare/chiudere la pagina.

## Backend e database

Le entità JPA `AiWorkflow` e `AiWorkflowStep` vengono salvate nelle tabelle
`ai_workflow`, `ai_workflow_step` e `ai_workflow_tool`. L’ordine dei passaggi e
degli strumenti è persistente. Con la configurazione attuale
`spring.jpa.hibernate.ddl-auto=update`, le tabelle vengono create al riavvio del
backend. Non vengono inseriti contenuti iniziali nel database.

I vecchi testi di risultato e verifiche vengono letti e uniti in conclusioni,
separati da un paragrafo vuoto, fino al primo salvataggio nel nuovo formato.
Le colonne precedenti restano nel database per preservare i dati esistenti;
le nuove modifiche vengono salvate nel campo `conclusions`.

| Metodo | Endpoint | Accesso |
| --- | --- | --- |
| GET | `/api/ai-workflows` | Pubblico, solo workflow pubblicati |
| GET | `/api/ai-workflows/admin` | Admin, anche bozze |
| POST | `/api/ai-workflows` | Admin, creazione |
| PUT | `/api/ai-workflows/{id}` | Admin, aggiornamento e pubblicazione |
| DELETE | `/api/ai-workflows/{id}` | Admin, eliminazione |

Le operazioni di scrittura sono transazionali, validate dal backend e protette
con il ruolo `ADMIN` della sessione esistente. Il frontend usa la stessa
`VITE_API_BASE_URL` degli altri servizi.

## Verifica

- Frontend: `npm run build` e `npm run lint` nella cartella `frontend`.
- Backend: `bash gradlew test` nella cartella `backend`.
- I test Java usano il profilo `test` e un database H2 in memoria; verificano
  autorizzazioni, bozze, pubblicazione/ritiro, persistenza dell’ordine e validazione.
- La verifica nel browser copre creazione, anteprima Markdown, riordino,
  salvataggio e ricaricamento, pubblicazione, ritiro, eliminazione, errori e nuovo
  tentativo, conferma delle modifiche non salvate e visualizzazione mobile.
