import Scaffold from "../components/Scaffold";
import fotoCv from "../assets/FotoCv.png";
import MouseAnimation from "../assets/icons/mouseanimation.svg?react";
import { profileData } from "../data/portfolioData";
import ContactInformation from "../components/ui/ContactInformation";

export default function Home() {
  return (
    <Scaffold id="/" className="justify-center gap-5">
      <img
        src={fotoCv}
        alt="foto cv"
        className="w-32 h-32 rounded-full object-cover block border-primary border-4 shadow-[0_0_40px_var(--color-primary)]"
      />
      <h2>
        Ciao, sono <span className="text-primary">Fabrizio Lombardi</span>
      </h2>
      <b className="text-center text-foreground/50">
        Fullstack Developer | React • Spring Boot • Flutter
      </b>
      <p className="text-foreground/50 text-center text-wrap max-w-150">
        Appassionato di tecnologia con focus sullo sviluppo Fullstack. Creo
        soluzioni moderne e performanti attraverso il learning by doing.
      </p>

      <div className="flex flex-row gap-3">
        {profileData.contacts
          .filter((c) => ["github", "linkedin", "email"].includes(c.id))
          .map((contact) => (
            <ContactInformation
              key={contact.id}
              icon={contact.icon}
              href={contact.href}
            />
          ))}
      </div>

      <MouseAnimation className="w-10 h-10 absolute bottom-5 text-primary" />
    </Scaffold>
  );
}
