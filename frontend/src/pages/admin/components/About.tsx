import { useEffect, useState } from "react";
import Scaffold from "../../../components/Scaffold";
import Card from "../../../components/ui/Card";
import {
  SKILL_FIELD_ICONS,
  SKILL_FIELDS,
} from "../../../interfaces/enums/SkillField";
import { SkillPayload, type Skill } from "../../../interfaces/Skill";
import {
  createSkill,
  deleteSkill,
  getAllSkills,
  updateSkill,
} from "../../../services/skillService";
import Button from "../../../components/ui/Button";
import { Edit2Icon, PlusIcon, SendIcon, Trash2Icon, XIcon } from "lucide-react";
import Input from "../../../components/ui/Input";
import type { AlertType } from "../../../components/ui/Alert";
import Alert from "../../../components/ui/Alert";

export default function About() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState<Skill>(SkillPayload);
  const [alertMessage, setAlertMessage] = useState<AlertType | null>(null);
  const [skillToUpdate, setSkillToUpdate] = useState<Skill>(SkillPayload);
  const handleCloseAlert = () => setAlertMessage(null);

  async function fetchSkills() {
    getAllSkills()
      .then((data) => {
        setSkills(data);
      })
      .catch();
  }

  async function cancelSkill(skill_id: number) {
    deleteSkill(skill_id)
      .then(() => {
        setAlertMessage({ type: "success", message: "Skill eliminata" });
        fetchSkills();
      })
      .catch((e) => {
        const errorMessage = e instanceof Error ? e.message : String(e);
        setAlertMessage({ type: "error", message: errorMessage });
      });
  }

  async function editSkill(skill_id: number) {
    updateSkill(skill_id, skillToUpdate)
      .then(() => {
        setAlertMessage({ type: "success", message: "Skill aggiornata!" });
        fetchSkills();
        setSkillToUpdate(SkillPayload);
      })
      .catch((e) => {
        const errorMessage = e instanceof Error ? e.message : String(e);
        setAlertMessage({ type: "error", message: errorMessage });
      });
  }

  async function saveSkill(skill: Skill) {
    createSkill(skill)
      .then(() => {
        setAlertMessage({ type: "success", message: "Skill creata!" });
        fetchSkills();
        setNewSkill(SkillPayload);
      })
      .catch((e) => {
        const errorMessage = e instanceof Error ? e.message : String(e);
        setAlertMessage({ type: "error", message: errorMessage });
      });
  }

  useEffect(() => {
    fetchSkills();
  }, []);

  return (
    <Scaffold>
      <h1>Skills</h1>
      <section className="w-full flex flex-row gap-5">
        {SKILL_FIELDS.map((f) => {
          const Icon = SKILL_FIELD_ICONS[f];
          return (
            <Card key={f} className="basis-0 grow">
              <div className="flex gap-2 items-center">
                <Icon className="w-6 h-6 text-primary" />
                <h4>{f}</h4>
              </div>
              {Array.isArray(skills) &&
                skills
                  ?.filter((s) => s.skillField == f)
                  .map((s) => (
                    <div
                      key={s.id}
                      className="w-full flex flex-row justify-between items-center"
                    >
                      {skillToUpdate.id == s.id ? (
                        <Input
                          type="text"
                          value={skillToUpdate.name}
                          onChange={(v) => setSkillToUpdate({ ...s, name: v })}
                        ></Input>
                      ) : (
                        s.name
                      )}

                      {skillToUpdate.id != s.id ? (
                        <div className="flex flex-row gap-2">
                          <Button
                            variant="transparent"
                            onClick={() => {
                              setSkillToUpdate(s);
                            }}
                          >
                            <Edit2Icon className="w-4 h-4 text-primary" />
                          </Button>
                          <Button
                            variant="transparent"
                            onClick={() => cancelSkill(s.id)}
                          >
                            <Trash2Icon className="w-4 h-4 text-primary" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-row gap-2">
                          <Button
                            variant="transparent"
                            onClick={() => {
                              setSkillToUpdate(SkillPayload);
                            }}
                          >
                            <XIcon className="w-4 h-4 text-primary" />
                          </Button>
                          <Button
                            variant="transparent"
                            onClick={() => editSkill(s.id)}
                          >
                            <SendIcon className="w-4 h-4 text-primary" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
              <div className="flex flex-row gap-2 mt-auto">
                <Button
                  variant="tertiary"
                  disabled={
                    !newSkill?.name?.trim() || newSkill.skillField !== f
                  }
                  onClick={() => saveSkill(newSkill)}
                >
                  <PlusIcon />
                </Button>

                <Input
                  type="text"
                  value={newSkill.skillField === f ? newSkill.name : ""}
                  onChange={(v) =>
                    setNewSkill((prevSkill) => ({
                      ...prevSkill,
                      name: v,
                      skillField: f,
                    }))
                  }
                ></Input>
              </div>
            </Card>
          );
        })}
      </section>
      {alertMessage && (
        <Alert
          type={alertMessage.type}
          message={alertMessage.message}
          onClose={handleCloseAlert}
        />
      )}
    </Scaffold>
  );
}
