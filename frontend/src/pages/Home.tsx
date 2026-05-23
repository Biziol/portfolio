import Scaffold from "../components/Scaffold";
import fotoCv from "../assets/FotoCv.png";
import Linkedin from "../assets/icons/Linkedin.svg?react";
import GitHub from "../assets/icons/Github.svg?react";
import MouseAnimation from "../assets/icons/mouseanimation.svg?react";
import { MailIcon } from "lucide-react";

export default function Home() {
  return (
    <Scaffold className="justify-center gap-5">
      <img
        src={fotoCv}
        alt="foto cv"
        className="w-32 h-32 rounded-full object-cover block border-primary border-4 shadow-[0_0_40px_var(--color-primary)]"
      />
      <h2>
        Ciao, sono <span className="text-primary">Fabrizio Lombardi</span>
      </h2>
      <b className="text-l text-foreground/50">
        Fullstack Developer | React • Spring Boot • Flutter
      </b>
      <p className="text-foreground/50 text-center">
        Appassionato di tecnologia con focus sullo sviluppo Fullstack. Creo
        soluzioni <br /> moderne e performanti attraverso il learning by doing.
      </p>

      <div className="flex flex-row gap-3">
        <a
          href="https://github.com/Biziol"
          aria-label="GitHub"
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 rounded-lg bg-primary/10 hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          <GitHub className="w-6 h-6" />
        </a>

        <a
          href="https://www.linkedin.com/in/fabrizio-lombardi-76837a209/"
          aria-label="LinkedIn"
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 rounded-lg bg-primary/10 hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          <Linkedin className="w-6 h-6" />
        </a>

        <a
          href="mailto:fabriziolombardi732@gmail.com"
          aria-label="LinkedIn"
          className="p-3 rounded-lg bg-primary/10 hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          <MailIcon className="w-6 h-6" />
        </a>
      </div>

      <MouseAnimation className="w-10 h-10 fixed bottom-5 text-primary" />
    </Scaffold>
  );
}
