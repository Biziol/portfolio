import Scaffold from "../components/Scaffold";
import fotoCv from "../assets/FotoCv.jpg";

export default function Home() {
  return (
    <Scaffold>
      <img src={fotoCv} alt="foto cv" className="w-32 h-32 rounded-full object-cover" />
      <h2>Ciao, sono Fabrizio Lombardi</h2>
      <b className="text-l text-foreground/50">
        Fullstack Developer | React • Spring Boot • Flutter
      </b>
      <p className="text-foreground/50 text-center">
        Appassionato di tecnologia con focus sullo sviluppo Fullstack. Creo
        soluzioni <br /> moderne e performanti attraverso il learning by doing.
      </p>
    </Scaffold>
  );
}
