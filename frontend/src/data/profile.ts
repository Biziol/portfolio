import photo from "../assets/FotoCv.png";

// Plain data shared by the website and the PDF.
export const profile = {
  name: "Fabrizio Lombardi",
  portfolioUrl: "https://portfolio.flomb.it",
  role: "Fullstack Developer | React • Spring Boot • Flutter",
  bio: "Appassionato di tecnologia con focus sullo sviluppo Fullstack. Creo soluzioni moderne e performanti attraverso il learning by doing.",
  photo,
  birthDate: "17/02/2005",
  nationality: "Italiana",
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
    },
    {
      id: "phone",
      field: "Telefono",
      value: "+39 351 307 8597",
      href: "tel:+393513078597",
    },
    {
      id: "address",
      field: "Indirizzo",
      value: "Via G. B. Scaramelli, 26, 00155 Roma RM",
      href: "https://maps.app.goo.gl/MsStHrrQdSd6J2YXA",
    },
    {
      id: "github",
      field: "Github",
      value: "@Biziol",
      href: "https://github.com/Biziol",
    },
    {
      id: "linkedin",
      field: "Linkedin",
      value: "@fabrizio-lombardi-76837a209",
      href: "https://www.linkedin.com/in/fabrizio-lombardi-76837a209/",
    },
  ],
};
