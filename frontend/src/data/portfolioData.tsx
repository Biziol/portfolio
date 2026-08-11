import type { ReactNode } from "react";
import { MailIcon, PhoneIcon, MapPinHouseIcon } from "lucide-react";
import Linkedin from "../assets/icons/Linkedin.svg?react";
import GitHub from "../assets/icons/Github.svg?react";

export interface ContactItem {
  id: string;
  field: string;
  value: string;
  href: string;
  icon: ReactNode;
}

export const profileData = {
  name: "Fabrizio Lombardi",
  role: "Fullstack Developer | React • Spring Boot • Flutter",
  bio: "Appassionato di tecnologia con focus sullo sviluppo Fullstack. Creo soluzioni moderne e performanti attraverso il learning by doing.",
  avatar: "/favicon.png",
  patenti: ["AM", "B"],
  disponibilità: "Immediata",

  collaborations: [
    "Progetti Fullstack",
    "Sviluppo Frontend",
    "Sviluppo Backend",
    "App Mobile",
  ],

  contacts: [
    {
      id: "email",
      field: "Email",
      value: "fabriziolombardi732@gmail.com",
      href: "mailto:fabriziolombardi732@gmail.com",
      icon: <MailIcon className="w-6 h-6" />,
    },
    {
      id: "phone",
      field: "Telefono",
      value: "+39 351 307 8597",
      href: "tel:+393513078597",
      icon: <PhoneIcon className="w-6 h-6" />,
    },
    {
      id: "address",
      field: "Indirizzo",
      value: "Via G. B. Scaramelli, 26, 00155 Roma RM",
      href: "https://maps.app.goo.gl/MsStHrrQdSd6J2YXA",
      icon: <MapPinHouseIcon className="w-6 h-6" />,
    },
    {
      id: "github",
      field: "Github",
      value: "@Biziol",
      href: "https://github.com/Biziol",
      icon: <GitHub className="w-6 h-6" />,
    },
    {
      id: "linkedin",
      field: "Linkedin",
      value: "@fabrizio-lombardi-76837a209",
      href: "https://www.linkedin.com/in/fabrizio-lombardi-76837a209/",
      icon: <Linkedin className="w-6 h-6" />,
    },
  ] as ContactItem[],
};
