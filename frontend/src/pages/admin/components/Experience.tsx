import {
  BriefcaseIcon,
  CalendarIcon,
  Edit2Icon,
  ExternalLinkIcon,
  GraduationCapIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import PingIcon from "../../../assets/icons/PingIcon.svg?react";
import { useEffect, useState } from "react";
import type { WorkAndTraning } from "../../../interfaces/WorkAndTraning";
import {
  deleteWorkAndTraining,
  getWorkAndTrainings,
} from "../../../services/workAndTrainingService";
import Scaffold from "../../../components/Scaffold";
import TimeLine, { TimeLineItem } from "../../../components/TimeLine";
import Card from "../../../components/ui/Card";
import { formatDateTime } from "../../../utils/formatDateTime";
import Pill from "../../../components/ui/Pill";
import Button from "../../../components/ui/Button";
import type { AddExperienceParams } from "./AddExperience";
import AddExperience from "./AddExperience";
import AlertDialog from "./AlertDialog";
import type { AlertType } from "../../../components/ui/Alert";
import Alert from "../../../components/ui/Alert";

export default function Experience() {
  const [workAndTraining, setWorkAndTraining] = useState<WorkAndTraning[] | []>(
    [],
  );
  const [experienceToDelete, setExperienceToDelete] =
    useState<WorkAndTraning | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [workAndTrainingTemp, setWorkAndTrainingTemp] =
    useState<AddExperienceParams | null>(null);

  const [alertMessage, setAlertMessage] = useState<AlertType | null>(null);
  const handleCloseAlert = () => setAlertMessage(null);

  async function fetchWorkAndTraining() {
    try {
      const data = await getWorkAndTrainings();
      setWorkAndTraining(data);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      setAlertMessage({ type: "error", message: errorMessage });
    }
  }

  async function handleDeleteExperience() {
    if (!experienceToDelete || isDeleting) {
      return;
    }

    setIsDeleting(true);

    try {
      const message = await deleteWorkAndTraining(experienceToDelete.id);
      setAlertMessage({ type: "success", message });
      await fetchWorkAndTraining();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      setAlertMessage({ type: "error", message: errorMessage });
    } finally {
      setIsDeleting(false);
      setExperienceToDelete(null);
    }
  }

  const isInProgress = (endDate: string | null) => {
    if (!endDate) {
      return true;
    }

    const now = new Date();
    return new Date(endDate).getTime() > now.getTime();
  };

  useEffect(() => {
    void (async () => {
      await fetchWorkAndTraining();
    })();
  }, []);

  return (
    <Scaffold>
      <h1>Esperienza e Formazione</h1>

      <section className="w-full h-max flex flex-col gap-2">
        <div className="flex gap-5 items-center">
          <span className="bg-primary w-max p-3 rounded-xl">
            <BriefcaseIcon className="text-primary-foreground w-7 h-7" />
          </span>
          <h3>Esperienza Lavorativa</h3>
          <Button
            variant="tertiary"
            onClick={() => setWorkAndTrainingTemp({ type: "WORK" })}
          >
            <PlusIcon />
          </Button>
        </div>
        <div className="ml-5">
          <TimeLine verticalPadding={5} lineColor="bg-primary/50">
            {Array.isArray(workAndTraining) &&
              workAndTraining.length > 0 &&
              workAndTraining
                .filter((e) => e.type == "WORK")
                .map((work) => (
                  <TimeLineItem key={work.id} dotStyle="bg-primary">
                    <Card className="gap-1 mr-5">
                      <div className="w-full flex flex-wrap flex-row items-center justify-between">
                        <h3>{work.title}</h3>
                        <p className="flex text-xs text-foreground/60 gap-2 items-center">
                          <CalendarIcon size={15} />
                          {formatDateTime(
                            work.startDate,
                            "it-IT",
                            true,
                            false,
                            "long",
                          )}{" "}
                          -{" "}
                          {isInProgress(work.endDate) ? (
                            <Pill className="bg-green-500/10 text-green-500">
                              <PingIcon className="w-6 h-6" /> In corso
                            </Pill>
                          ) : (
                            formatDateTime(
                              work.endDate || "",
                              "it-IT",
                              true,
                              false,
                              "long",
                            )
                          )}
                        </p>
                      </div>

                      <div className="flex flex-row w-full justify-between">
                        <div className="flex flex-col justify-between">
                          <div className="text-foreground/60">
                            <p className="flex gap-2 items-center">
                              {work.instituteOrCompany} |
                              <a
                                className="text-xs flex"
                                href={work.website}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLinkIcon size={15} />
                                Vai al sito
                              </a>
                            </p>
                            <p>{work.location}</p>
                          </div>
                          {work.arguments != null &&
                            work.arguments.length > 0 && (
                              <ul className="w-full pl-5 list-disc marker:text-primary marker:text-2xl">
                                {work.arguments.map((argument) => (
                                  <li key={argument.id}>{argument.text}</li>
                                ))}
                              </ul>
                            )}
                        </div>

                        <div className="flex flex-col gap-2 mt-auto">
                          <Button
                            variant="tertiary"
                            onClick={() => setExperienceToDelete(work)}
                          >
                            <Trash2Icon />
                          </Button>
                          <Button
                            variant="tertiary"
                            onClick={() =>
                              setWorkAndTrainingTemp({
                                type: "WORK",
                                experienceParam: work,
                              })
                            }
                          >
                            <Edit2Icon />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </TimeLineItem>
                ))}
          </TimeLine>
        </div>
      </section>

      <div className="w-full h-max flex flex-col gap-2">
        <div className="flex gap-5 items-center">
          <span className="bg-primary w-max p-3 rounded-xl">
            <GraduationCapIcon className="text-primary-foreground w-7 h-7" />
          </span>
          <h3>Istruzione e Formazione</h3>
          <Button
            variant="tertiary"
            onClick={() => setWorkAndTrainingTemp({ type: "TRAINING" })}
          >
            <PlusIcon />
          </Button>
        </div>

        <div className="ml-5">
          <TimeLine verticalPadding={5} lineColor="bg-primary/50">
            {Array.isArray(workAndTraining) &&
              workAndTraining.length > 0 &&
              workAndTraining
                .filter((e) => e.type == "TRAINING")
                .map((training) => (
                  <TimeLineItem key={training.id} dotStyle="bg-primary">
                    <Card className="gap-1 mr-5">
                      <div className="w-full flex flex-wrap flex-row items-center justify-between">
                        <h3>{training.title}</h3>
                        <p className="flex text-xs text-foreground/60 gap-2 items-center">
                          <CalendarIcon size={15} />
                          {formatDateTime(
                            training.startDate,
                            "it-IT",
                            true,
                            false,
                            "long",
                          )}{" "}
                          -{" "}
                          {isInProgress(training.endDate) ? (
                            <Pill className="bg-green-500/10 text-green-500">
                              <PingIcon className="w-6 h-6" /> In corso
                            </Pill>
                          ) : (
                            formatDateTime(
                              training.endDate || "",
                              "it-IT",
                              true,
                              false,
                              "long",
                            )
                          )}
                        </p>
                      </div>

                      <div className="flex flex-row w-full justify-between">
                        <div className="flex flex-col justify-between">
                          <div className="text-foreground/60">
                            <p className="flex gap-2 items-center text-nowrap">
                              {training.instituteOrCompany} |
                              <a
                                className="text-xs flex"
                                href={training.website}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLinkIcon size={15} />
                                Vai al sito
                              </a>
                            </p>
                            <p>{training.location}</p>
                          </div>
                          {training.arguments != null &&
                            training.arguments.length > 0 && (
                              <ul className="w-full pl-5 list-disc marker:text-primary marker:text-2xl">
                                {training.arguments.map((argument) => (
                                  <li key={argument.id}>{argument.text}</li>
                                ))}
                              </ul>
                            )}

                          {training.graduationType == "EQF" && (
                            <Pill>Livello EQF: {training.graduation}</Pill>
                          )}

                          {training.graduationType == "HUNDRED_BASE" && (
                            <Pill>Voto: {training.graduation}/100</Pill>
                          )}

                          {training.graduationType == "TEN_BASE" && (
                            <Pill>Voto: {training.graduation}/10</Pill>
                          )}
                        </div>
                        <div className="flex flex-col gap-2 mt-auto">
                          <Button
                            variant="tertiary"
                            onClick={() => setExperienceToDelete(training)}
                          >
                            <Trash2Icon />
                          </Button>
                          <Button
                            variant="tertiary"
                            onClick={() =>
                              setWorkAndTrainingTemp({
                                type: "TRAINING",
                                experienceParam: training,
                              })
                            }
                          >
                            <Edit2Icon />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </TimeLineItem>
                ))}
          </TimeLine>
        </div>
      </div>
      {workAndTrainingTemp && (
        <AddExperience
          key={`${workAndTrainingTemp.type}-${workAndTrainingTemp.experienceParam?.id ?? "new"}`}
          type={workAndTrainingTemp.type}
          experienceParam={workAndTrainingTemp.experienceParam}
          onClose={() => {
            setWorkAndTrainingTemp(null);
            fetchWorkAndTraining();
          }}
        />
      )}
      {experienceToDelete && (
        <AlertDialog
          message={`Sei sicuro di voler eliminare ${
            experienceToDelete.title || "questa esperienza"
          }?`}
          onAccept={() => handleDeleteExperience()}
          onClose={() => setExperienceToDelete(null)}
        ></AlertDialog>
      )}
      {alertMessage && (
        <Alert
          type={alertMessage.type}
          message={alertMessage.message}
          onClose={() => {
            handleCloseAlert();
            setExperienceToDelete(null);
          }}
        />
      )}
    </Scaffold>
  );
}
