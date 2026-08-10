import { BriefcaseIcon, Save, SchoolIcon, SendIcon, XIcon } from "lucide-react";
import Button from "../../../components/ui/Button";
import {
  emptyWorkAndTraining,
  type WorkAndTraning,
} from "../../../interfaces/WorkAndTraning";
import { useState } from "react";
import type { WorkType } from "../../../interfaces/enums/WorkType";
import Form from "../../../components/Form";
import Input from "../../../components/ui/Input";
import { Select, SelectItem } from "../../../components/ui/Select";
import {
  GRADUATION_TYPES,
  type GraduationType,
} from "../../../interfaces/enums/GraduationType";
import { cn } from "../../../utils/cn";
import { type Argument } from "../../../interfaces/Argument";
import { createWorkAndTraining } from "../../../services/workAndTrainingService";
import { createArgument } from "../../../services/argumentService";
import type { AlertType } from "../../../components/ui/Alert";
import Alert from "../../../components/ui/Alert";

export interface AddExperienceParams {
  type: WorkType;
  experienceParam?: WorkAndTraning;
  onClose?: () => void;
}
export default function AddExperience({
  type,
  experienceParam = emptyWorkAndTraining,
  onClose,
}: Readonly<AddExperienceParams>) {
  const [alertMessage, setAlertMessage] = useState<AlertType | null>(null);
  const handleCloseAlert = () => setAlertMessage(null);
  const [experience, setExperience] = useState<WorkAndTraning>({
    ...experienceParam,
    type: type,
  });
  const sections = ["general", "arguments"];
  const [currentSection, setCurrentSection] = useState("general");
  const [experienceArguments, setExperienceArguments] = useState<Argument[]>(
    experienceParam.arguments || [],
  );
  const [newArgument, setNewArgument] = useState("");

  async function handleSubmit() {
    setAlertMessage({ type: "loading", message: "Salvataggio..." });
    try {
      const result: WorkAndTraning = await createWorkAndTraining(experience);

      if (!experienceParam) {
        const updatedArguments = experienceArguments.map((arg) => ({
          ...arg,
          workAndTrainingId: result.id,
        }));

        setExperienceArguments(updatedArguments);

        await Promise.all(updatedArguments.map((arg) => createArgument(arg)));
      } else {
        const existingIds = new Set(
          (experienceParam.arguments || []).map((savedArg) => savedArg.id),
        );

        const newArgumentsToSave = experienceArguments.filter(
          (arg) => arg.id === 0 || !existingIds.has(arg.id),
        );

        await Promise.all(
          newArgumentsToSave.map((arg) =>
            createArgument({
              ...arg,
              workAndTrainingId: result.id,
            }),
          ),
        );
      }

      setAlertMessage({ type: "success", message: "Salvato con successo!" });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      setAlertMessage({ type: "error", message: errorMessage });
    }
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full flex flex-col justify-center items-center backdrop-blur-md backdrop-brightness-80 px-5">
      <Form
        onSubmit={handleSubmit}
        className="flex flex-col items-center sm:w-full md:w-1/2 lg:w-1/3"
      >
        <div className="p-3 bg-primary/20 rounded-2xl">
          {type == "TRAINING" ? (
            <SchoolIcon className="text-primary w-8 h-8" />
          ) : (
            <BriefcaseIcon className="text-primary w-8 h-8" />
          )}
        </div>

        <h2>
          {currentSection == "general" && "Campi Generali"}
          {currentSection == "arguments" && "Argomenti"}
        </h2>

        {currentSection == "general" && (
          <div className="flex flex-col gap-2 w-full">
            <Input
              label="Titolo"
              type="text"
              value={experience.title}
              onChange={(v) => setExperience({ ...experience, title: v })}
              required
            />
            <Input
              label={type == "TRAINING" ? "Nome istituto" : "Nome azienda"}
              type="text"
              value={experience.instituteOrCompany}
              onChange={(v) =>
                setExperience({ ...experience, instituteOrCompany: v })
              }
              required
            />
            <div className="flex flex-row gap-2 w-full">
              <Input
                label="Luogo"
                type="text"
                value={experience.location}
                onChange={(v) => setExperience({ ...experience, location: v })}
                required
              />
              <Input
                label="Sito Web"
                type="text"
                value={experience.website}
                onChange={(v) => setExperience({ ...experience, website: v })}
              />
            </div>

            <div className="flex flex-row gap-2 w-full">
              <Input
                label="Data inizio"
                type="date"
                value={experience.startDate}
                onChange={(v) => setExperience({ ...experience, startDate: v })}
                required
              />
              <Input
                label="Data fine"
                type="date"
                value={experience.endDate || ""}
                onChange={(v) => setExperience({ ...experience, endDate: v })}
              />
            </div>

            {type == "TRAINING" && (
              <div className="flex flex-row gap-2 w-full">
                <Input
                  label="Votazione"
                  type="number"
                  value={experience.graduation || 0}
                  onChange={(v) =>
                    setExperience({ ...experience, graduation: Number(v) })
                  }
                  required
                />
                <Select
                  label="Base Voto"
                  value={experience.graduationType}
                  onChange={(v) =>
                    setExperience({
                      ...experience,
                      graduationType: v as GraduationType,
                    })
                  }
                >
                  {GRADUATION_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type == "TEN_BASE" && "/10"}
                      {type == "HUNDRED_BASE" && "/100"}
                      {type == "EQF" && "EQF"}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            )}
          </div>
        )}

        {currentSection == "arguments" && (
          <div className="flex flex-col gap-4">
            <ul className="w-full pl-5 list-disc marker:text-primary marker:text-2xl h-50 overflow-y-auto">
              {experienceArguments?.map((a) => (
                <li key={a.id}>{a.text}</li>
              ))}
            </ul>

            <div className="w-full flex flex-row gap-2">
              <Input
                type="text"
                value={newArgument}
                onChange={(v) => setNewArgument(v)}
              />
              <Button
                variant="tertiary"
                onClick={() => {
                  if (!newArgument.trim()) return;

                  const createdArgument: Argument = {
                    id: 0,
                    text: newArgument,
                    workAndTrainingId: experienceParam.id || null,
                  };

                  // 3. Aggiungi il nuovo oggetto all'array esistente
                  setExperienceArguments((prev) => [...prev, createdArgument]);

                  // 4. Reset dello stato dell'input di testo
                  setNewArgument("");
                }}
              >
                <Save />
              </Button>
            </div>
          </div>
        )}

        <div className="flex flex-row justify-between w-full gap-2">
          <Button onClick={onClose} variant="secondary">
            <XIcon />
            Chiudi
          </Button>
          <div className="gap-2 flex flex-row items-center h-full">
            {sections.map((s) => (
              <Button
                key={s}
                variant={s != currentSection ? "transparent" : "tertiary"}
                className={cn(
                  "rounded-full p-0 bg-muted-foreground/50 w-10 h-3",
                  s == currentSection && "bg-primary",
                )}
                onClick={() => setCurrentSection(s)}
              ></Button>
            ))}
          </div>
          <Button type="submit">
            <SendIcon />
            Invia
          </Button>
        </div>
      </Form>
      {alertMessage && (
        <Alert
          type={alertMessage.type}
          message={alertMessage.message}
          onClose={() => {
            handleCloseAlert();
            if (onClose) {
              onClose();
            }
          }}
        />
      )}
    </div>
  );
}
