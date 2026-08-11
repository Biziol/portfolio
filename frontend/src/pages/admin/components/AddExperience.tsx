import {
  BriefcaseIcon,
  Edit2Icon,
  Save,
  SchoolIcon,
  SendIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
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
import {
  createWorkAndTraining,
  updateWorkAndTraining,
} from "../../../services/workAndTrainingService";
import {
  createArgument,
  deleteArgument,
  updateArgument,
} from "../../../services/argumentService";
import type { AlertType } from "../../../components/ui/Alert";
import Alert from "../../../components/ui/Alert";

type EditableArgument = Argument & {
  localId: string;
};

export interface AddExperienceParams {
  type: WorkType;
  experienceParam?: WorkAndTraning;
  onClose?: () => void;
}
export default function AddExperience({
  type,
  experienceParam,
  onClose,
}: Readonly<AddExperienceParams>) {
  const [alertMessage, setAlertMessage] = useState<AlertType | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedArgumentLocalId, setSelectedArgumentLocalId] = useState<
    string | null
  >(null);
  const handleCloseAlert = () => setAlertMessage(null);
  const initialExperience = experienceParam ?? emptyWorkAndTraining;
  const initialArguments = initialExperience.arguments || [];
  const [experience, setExperience] = useState<WorkAndTraning>({
    ...initialExperience,
    type: type,
  });
  const sections = ["general", "arguments"];
  const [currentSection, setCurrentSection] = useState("general");
  const [experienceArguments, setExperienceArguments] = useState<
    EditableArgument[]
  >(
    initialArguments.map((argument) => ({
      ...argument,
      localId: `server-${argument.id}`,
    })),
  );
  const [newArgument, setNewArgument] = useState("");
  const isEditing = Boolean(initialExperience.id > 0);

  async function persistArguments(savedExperience: WorkAndTraning) {
    const argumentsToSave = experienceArguments.map((arg) => ({
      ...arg,
      workAndTrainingId: savedExperience.id,
    }));

    if (!isEditing) {
      await Promise.all(argumentsToSave.map((arg) => createArgument(arg)));
      return;
    }

    const currentArgumentsById = new Map(
      argumentsToSave
        .filter((arg) => arg.id > 0)
        .map((arg) => [arg.id, arg] as const),
    );
    const existingArgumentsById = new Map(
      initialArguments.map((arg) => [arg.id, arg] as const),
    );

    const argumentsToCreate = argumentsToSave.filter((arg) => arg.id === 0);
    const argumentsToUpdate = argumentsToSave.filter((arg) => {
      const existingArgument = existingArgumentsById.get(arg.id);
      return arg.id > 0 && existingArgument?.text !== arg.text;
    });
    const argumentsToDelete = initialArguments.filter(
      (arg) => !currentArgumentsById.has(arg.id),
    );

    await Promise.all(argumentsToCreate.map((arg) => createArgument(arg)));
    await Promise.all(
      argumentsToUpdate.map((arg) => updateArgument(arg.id, arg)),
    );
    await Promise.all(argumentsToDelete.map((arg) => deleteArgument(arg.id)));
  }

  function resetArgumentDraft() {
    setNewArgument("");
    setSelectedArgumentLocalId(null);
  }

  function handleSaveArgumentDraft() {
    const normalizedText = newArgument.trim();

    if (!normalizedText) {
      return;
    }

    if (selectedArgumentLocalId === null) {
      const createdArgument: Argument = {
        id: 0,
        text: normalizedText,
        workAndTrainingId: initialExperience.id || null,
      };

      setExperienceArguments((prev) => [
        ...prev,
        {
          ...createdArgument,
          localId: crypto.randomUUID(),
        },
      ]);
      resetArgumentDraft();
      return;
    }

    setExperienceArguments((prev) =>
      prev.map((argument) =>
        argument.localId === selectedArgumentLocalId
          ? { ...argument, text: normalizedText }
          : argument,
      ),
    );
    resetArgumentDraft();
  }

  function handleEditArgument(argument: EditableArgument) {
    setSelectedArgumentLocalId(argument.localId);
    setNewArgument(argument.text);
    setCurrentSection("arguments");
  }

  function handleDeleteArgument(argument: EditableArgument) {
    setExperienceArguments((prev) =>
      prev.filter(
        (currentArgument) => currentArgument.localId !== argument.localId,
      ),
    );

    if (selectedArgumentLocalId === argument.localId) {
      resetArgumentDraft();
    }
  }

  async function handleSubmit() {
    if (isSaving) {
      return;
    }

    setIsSaving(true);
    setAlertMessage({ type: "loading", message: "Salvataggio..." });
    try {
      const savedExperience = isEditing
        ? await updateWorkAndTraining(initialExperience.id, experience)
        : await createWorkAndTraining(experience);

      await persistArguments(savedExperience);

      setAlertMessage({ type: "success", message: "Salvato con successo!" });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      setAlertMessage({ type: "error", message: errorMessage });
    } finally {
      setIsSaving(false);
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
            <ul className="w-full space-y-2 h-50 overflow-y-auto">
              {experienceArguments?.map((a) => (
                <li
                  key={a.localId}
                  className={cn(
                    "flex items-start justify-between gap-3 rounded-lg border border-border/60 px-3 py-2",
                    selectedArgumentLocalId === a.localId &&
                      "border-primary bg-primary/5",
                  )}
                >
                  <span className="min-w-0 wrap-break-word">{a.text}</span>
                  <div className="flex shrink-0 gap-2">
                    <Button
                      type="button"
                      variant="transparent"
                      className="px-2"
                      onClick={() => handleEditArgument(a)}
                    >
                      <Edit2Icon />
                    </Button>
                    <Button
                      type="button"
                      variant="transparent"
                      className="px-2"
                      onClick={() => handleDeleteArgument(a)}
                    >
                      <Trash2Icon />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="w-full flex flex-row gap-2">
              <Input
                type="text"
                value={newArgument}
                onChange={(v) => setNewArgument(v)}
                placeholder="Scrivi un argomento"
              />
              <Button
                type="button"
                variant="tertiary"
                onClick={handleSaveArgumentDraft}
                disabled={!newArgument.trim()}
              >
                <Save />
                {selectedArgumentLocalId === null ? "Aggiungi" : "Aggiorna"}
              </Button>
            </div>
            {selectedArgumentLocalId !== null && (
              <Button
                type="button"
                variant="transparent"
                onClick={resetArgumentDraft}
              >
                <XIcon />
                Annulla modifica
              </Button>
            )}
          </div>
        )}

        <div className="flex flex-row justify-between w-full gap-2">
          <Button type="button" onClick={onClose} variant="secondary">
            <XIcon />
            Chiudi
          </Button>
          <div className="gap-2 flex flex-row items-center h-full">
            {sections.map((s) => (
              <Button
                key={s}
                type="button"
                variant={s != currentSection ? "transparent" : "tertiary"}
                className={cn(
                  "rounded-full p-0 bg-muted-foreground/50 w-10 h-3",
                  s == currentSection && "bg-primary",
                )}
                onClick={() => setCurrentSection(s)}
              ></Button>
            ))}
          </div>
          <Button type="submit" disabled={isSaving}>
            <SendIcon />
            {isSaving ? "Salvataggio..." : "Invia"}
          </Button>
        </div>
      </Form>
      {alertMessage && (
        <Alert
          type={alertMessage.type}
          message={alertMessage.message}
          onClose={() => {
            handleCloseAlert();
            if (onClose && alertMessage.type !== "loading") {
              onClose();
            }
          }}
        />
      )}
    </div>
  );
}
