import {
  Code2Icon,
  DatabaseIcon,
  LayoutIcon,
  ServerIcon,
  SmartphoneIcon,
  TerminalIcon,
} from "lucide-react";
import Scaffold from "../components/Scaffold";
import Card from "../components/ui/Card";

export default function About() {
  return (
    <Scaffold className="justify-between">
      <h2>Chi sono?</h2>
      <div className="flex flex-row gap-5">
        <Card className="basis-0 grow">
          <Code2Icon className="w-10 h-10 text-primary" />
          <h3>Il Mio Percorso</h3>
          <p className="text-foreground/50">
            Nato il 17 febbraio 2005 a Roma, la mia passione per la tecnologia
            mi ha portato a specializzarmi nello sviluppo Fullstack.
            <br /> <br />
            Attualmente frequento l'ITS Lazio Digital e ho completato un
            tirocinio presso SMC Treviso S.r.l, dove ho sviluppato una Web App
            completa integrando Spring Boot e React.
            <br /> <br />
            Il mio approccio è basato sul learning by doing: imparo progettando
            e implementando soluzioni reali.
          </p>
        </Card>

        <Card className="basis-0 grow">
          <SmartphoneIcon className="w-10 h-10 text-primary" />
          <h3>Filosofia di Lavoro</h3>
          <p className="text-foreground/50">
            Credo nell'iniziativa personale come motore di crescita. Ogni
            progetto è un'opportunità per sperimentare nuove tecnologie e
            migliorare le mie competenze.
            <br /> <br />
            Utilizzo Linux quotidianamente, ottimizzando costantemente il mio
            ambiente di sviluppo per massimizzare la produttività.
            <br /> <br />
            La mia dedizione a un approccio tecnico e completo mi permette di
            affrontare sfide sempre più complesse con successo.
          </p>
        </Card>
      </div>

      <h2>Competenze Tecniche</h2>
      <div className="flex flex-row gap-5 w-full grow">
        <Card className="basis-0 grow">
          <div className="flex gap-2 items-center">
            <LayoutIcon className="w-6 h-6 text-primary" />
            <h4>Forntend</h4>
          </div>
          <ul className="w-full pl-4 list-disc marker:text-primary">
            <li>React</li>
            <li>Flutter</li>
            <li>HTML</li>
            <li>CSS</li>
            <li>JavaScript</li>
          </ul>
        </Card>
        <Card className="basis-0 grow">
          <div className="flex gap-2 items-center">
            <ServerIcon className="w-6 h-6 text-primary" />
            <h4>Backend</h4>
          </div>
          <ul className="w-full pl-4 list-disc marker:text-primary">
            <li>Java</li>
            <li>Spring Boot</li>
            <li>REST API</li>
          </ul>
        </Card>
        <Card className="basis-0 grow">
          <div className="flex gap-2 items-center">
            <DatabaseIcon className="w-6 h-6 text-primary" />
            <h4>Database</h4>
          </div>
          <ul className="w-full pl-4 list-disc marker:text-primary">
            <li>SQL</li>
            <li>PostgreSQL</li>
            <li>MySQL</li>
          </ul>
        </Card>
        <Card className="basis-0 grow">
          <div className="flex gap-2 items-center">
            <TerminalIcon className="w-6 h-6 text-primary" />
            <h4>Tools</h4>
          </div>
          <ul className="w-full pl-4 list-disc marker:text-primary">
            <li>Git</li>
            <li>Linux</li>
            <li>Vite</li>
            <li>Maven</li>
          </ul>
        </Card>
      </div>
    </Scaffold>
  );
}
