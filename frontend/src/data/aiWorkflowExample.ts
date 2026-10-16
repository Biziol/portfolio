import type { AiWorkflow } from "../interfaces/AiWorkflow";

// An editable starting point. Never persisted or published automatically.
export function cvWorkflowExample(): AiWorkflow {
  return {
    title: "Dal portfolio al CV PDF con il supporto dell’IA",
    objective: "Generare un CV dai contenuti del portfolio, mantenendo uno stile coerente con il sito.",
    tools: ["Codex", "React", "Spring Boot", "React-pdf"],
    steps: [
      { title: "Definire l’obiettivo", description: "Ho descritto il problema: aggiornare manualmente il PDF duplicava il lavoro di manutenzione del portfolio." },
      { title: "Valutare il piano", description: "Ho chiesto all’IA un piano e ho scelto la generazione nel frontend, utilizzando le API già disponibili." },
      { title: "Implementare e rivedere", description: "Ho usato l’IA per preparare il modello dei dati, l’impaginazione A4 e il download. Ho verificato che i contenuti e lo stile fossero coerenti con il portfolio." },
      { title: "Verificare il risultato", description: "L’IA ha eseguito build e controlli nel browser con API simulate. Ho visionato l’anteprima del CV e controllato che le informazioni fossero corrette." },
    ],
    example: "Il pulsante **Scarica CV** raccoglie profilo, competenze ed esperienze e genera un PDF con contatti e link al portfolio.",
    conclusions: "Un CV generato al clic, senza dover caricare ogni volta un nuovo PDF.\n\nHo controllato i dati e visionato l’anteprima del documento.\n\nPrima di pubblicare questo racconto, aggiorno questa sezione con le verifiche che ho svolto personalmente sulla versione collegata al database.",
    published: false,
  };
}
