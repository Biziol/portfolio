import { Code2Icon, SmartphoneIcon } from "lucide-react";
import Scaffold from "../components/Scaffold";
import Card from "../components/ui/Card";
import { useEffect, useState } from "react";
import type { Skill } from "../interfaces/Skill";
import { getAllSkills } from "../services/skillService";
import { aboutSections } from "../data/about";
import {
  SKILL_FIELD_ICONS,
  SKILL_FIELDS,
} from "../interfaces/enums/SkillField";

export default function About() {
  const [skills, setSkills] = useState<Skill[]>([]);

  async function fetchSkills() {
    getAllSkills()
      .then((data) => {
        setSkills(data);
      })
      .catch();
  }

  useEffect(() => {
    fetchSkills();
  }, []);

  return (
    <Scaffold id="/about" className="justify-between">
      <h2>Chi sono?</h2>
      <div className="flex flex-wrap flex-row gap-5">
        <Card className="basis-0 grow min-w-50">
          <Code2Icon className="w-10 h-10 text-primary" />
          <h3>{aboutSections[0].title}</h3>
          <p className="text-foreground/50 text-wrap">
            {aboutSections[0].paragraphs[0]}
            <br /> <br />
            {aboutSections[0].paragraphs[1]}
            <br /> <br />
            {aboutSections[0].paragraphs[2]}
          </p>
        </Card>

        <Card className="basis-0 grow min-w-50">
          <SmartphoneIcon className="w-10 h-10 text-primary" />
          <h3>{aboutSections[1].title}</h3>
          <p className="text-foreground/50 text-wrap">
            {aboutSections[1].paragraphs[0]}
            <br /> <br />
            {aboutSections[1].paragraphs[1]}
            <br /> <br />
            {aboutSections[1].paragraphs[2]}
          </p>
        </Card>
      </div>

      <h2>Competenze Tecniche</h2>
      <div className="flex flex-wrap flex-row gap-5 w-full grow">
        {SKILL_FIELDS.map((f) => {
          const Icon = SKILL_FIELD_ICONS[f];
          return (
            <Card key={f} className="basis-0 grow">
              <div className="flex gap-2 items-center">
                <Icon className="w-6 h-6 text-primary" />
                <h4>{f}</h4>
              </div>
              <ul className="w-full pl-4 list-disc marker:text-primary">
                {Array.isArray(skills) &&
                  skills
                    ?.filter((s) => s.skillField == f)
                    .map((s) => <li key={s.id}>{s.name}</li>)}
              </ul>
            </Card>
          );
        })}
      </div>
    </Scaffold>
  );
}
