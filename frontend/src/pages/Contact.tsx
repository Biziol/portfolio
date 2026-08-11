import { DownloadIcon } from "lucide-react";
import Scaffold from "../components/Scaffold";
import Card from "../components/ui/Card";
import ContactInformation from "../components/ui/ContactInformation";
import Button from "../components/ui/Button";
import { profileData } from "../data/portfolioData";

export default function Contact() {
  return (
    <Scaffold id="/contact" className="2xl:px-100 lg:px-50 md:px-10 sm:px-5">
      <div className="flex flex-col gap-2 items-center">
        <h1>Contatti</h1>
        <span className="text-foreground/60">
          Se vuoi contattarmi per una proposta di lavoro non esitare a farlo!
        </span>
      </div>

      <section className="flex flex-row gap-5 w-full flex-wrap-reverse">
        <Card className="grow basis-0 justify-between">
          <h2>Informazioni di Contatto</h2>

          <section className="flex flex-col gap-5">
            {profileData.contacts.map((contact) => (
              <ContactInformation
                key={contact.id}
                icon={contact.icon}
                field={contact.field}
                value={contact.value}
                href={contact.href}
              />
            ))}
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
              {profileData.collaborations.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </section>
          <span className="h-full" />
          <section className="flex flex-col gap-3">
            <h4 className="font-semibold">Informazioni Aggiuntive</h4>
            <div>
              <span className="flex gap-1">
                Data di Nascita:{" "}
                <p className="text-foreground/60">17/02/2005</p>
              </span>

              <span className="flex gap-1">
                Nazionalità: <p className="text-foreground/60">Italiana</p>
              </span>

              <span className="flex gap-1">
                Patenti:{" "}
                <p className="text-foreground/60">
                  {profileData.patenti.join(", ")}
                </p>
              </span>

              <span className="flex gap-1">
                Disponibilità:{" "}
                <p className="text-foreground/60">
                  {profileData.disponibilità}
                </p>
              </span>
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
