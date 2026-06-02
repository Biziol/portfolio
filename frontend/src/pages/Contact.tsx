import {
  DownloadIcon,
  MailIcon,
  MapPinHouseIcon,
  PhoneIcon,
} from "lucide-react";
import Linkedin from "../assets/icons/Linkedin.svg?react";
import GitHub from "../assets/icons/Github.svg?react";
import Scaffold from "../components/Scaffold";
import Card from "../components/ui/Card";
import ContactInformation from "../components/ui/ContactInformation";
import Button from "../components/ui/Button";

export default function Contact() {
  return (
    <Scaffold className="px-80" prevPath="/rewiew">
      <div className="flex flex-col gap-2 items-center">
        <h1>Contatti</h1>
        <span className="text-foreground/60">
          Se vuoi contattarmi per una proposta di lavoro non esitare a farlo!
        </span>
      </div>

      <section className="flex flex-row gap-5 w-full">
        <Card className="grow basis-0 justify-between">
          <h2>Informazioni di Contatto</h2>

          <section className="flex flex-col gap-5">
            <ContactInformation
              icon={<MailIcon className="w-6 h-6" />}
              field="Email"
              value="fabriziolombardi732@gmail.com"
              href="mailto:fabriziolombardi732@gmail.com"
            />

            <ContactInformation
              icon={<PhoneIcon className="w-6 h-6" />}
              field="Telefono"
              value="+39 351 307 8597"
              href="tel:+39 3513078597"
            />

            <ContactInformation
              icon={<MapPinHouseIcon className="w-6 h-6" />}
              field="Indirizzo"
              value="Via G. B. Scaramelli, 26, 00155 Roma RM"
              href="https://maps.app.goo.gl/MsStHrrQdSd6J2YXA"
            />

            <ContactInformation
              icon={<GitHub className="w-6 h-6" />}
              field="Github"
              value="@Biziol"
              href="https://github.com/Biziol"
            />

            <ContactInformation
              icon={<Linkedin className="w-6 h-6" />}
              field="Linkedin"
              value="@fabrizio-lombardi-76837a209"
              href="https://www.linkedin.com/in/fabrizio-lombardi-76837a209/"
            />
          </section>

          <hr />

          <Button className="w-full" href="/api/cv" newTab>
            <DownloadIcon />
            Scarica CV (PDF)
          </Button>
        </Card>
        <Card className="grow basis-0">
          <h2>Disponibilità</h2>
          <section className="flex flex-col gap-3">
            <h4 className="font-semibold">Tipologie di Collaborazione</h4>

            <ul className="w-full pl-5 list-disc marker:text-primary marker:text-2xl">
              <li>Progetti Fullstack</li>
              <li>Sviluppo Frontend</li>
              <li>Sviluppo Backend</li>
              <li>App Mobile</li>
            </ul>
          </section>
          <span className="h-full" />
          <section className="flex flex-col gap-3">
            <h4 className="font-semibold">Informazioni Aggiuntive</h4>
            <div>
              <p className="flex gap-1">
                Data di Nascita:{" "}
                <p className="text-foreground/60">17/02/2005</p>
              </p>

              <p className="flex gap-1">
                Nazionalità: <p className="text-foreground/60">Italiana</p>
              </p>

              <p className="flex gap-1">
                Patenti: <p className="text-foreground/60">AM, B</p>
              </p>

              <p className="flex gap-1">
                Disponibilità: <p className="text-foreground/60">Immediata</p>
              </p>
            </div>
          </section>
          <hr />
          <span className="text-foreground/60">
            "L'iniziativa personale è il mio principale motore di crescita. Ogni
            progetto è un'opportunità per imparare e migliorare."
          </span>
        </Card>
      </section>
    </Scaffold>
  );
}
