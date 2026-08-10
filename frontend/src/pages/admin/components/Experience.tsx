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
  const [itemToDelete, setItemToDelete] = useState<number>(0);

  const [workAndTrainingTemp, setWorkAndTrainingTemp] =
    useState<AddExperienceParams | null>(null);

  const [alertMessage, setAlertMessage] = useState<AlertType | null>(null);
  const handleCloseAlert = () => setAlertMessage(null);

  async function fetchWorkAndTraining() {
    await getWorkAndTrainings()
      .then((data) => setWorkAndTraining(data))
      .catch();
  }

  async function handleDeleteExperience() {
    if (itemToDelete > 0) {
      await deleteWorkAndTraining(itemToDelete)
        .then((data) => {
          setAlertMessage({ type: "success", message: data });
          fetchWorkAndTraining();
        })
        .catch((e) => {
          const errorMessage = e instanceof Error ? e.message : String(e);
          setAlertMessage({ type: "error", message: errorMessage });
        });
    }
  }

  const isInProgress = (endDate: string | null) => {
    if (endDate) {
      const start = new Date();
      const end = new Date(endDate);

      const timeDiff = end.getTime() - start.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

      console.log(
        "endDate: " +
          endDate +
          " start: " +
          start +
          " end: " +
          end +
          "dayDiff: " +
          daysDiff,
      );
      return daysDiff > 0;
    } else {
      return true;
    }
  };

  useEffect(() => {
    fetchWorkAndTraining();
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
            onClick={() =>
              setWorkAndTrainingTemp({
                ...workAndTrainingTemp,
                type: "WORK",
              })
            }
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

                      {work.arguments != null && work.arguments.length > 0 && (
                        <ul className="w-full pl-5 list-disc marker:text-primary marker:text-2xl">
                          {work.arguments.map((argument) => (
                            <li key={argument.id}>{argument.text}</li>
                          ))}
                        </ul>
                      )}
                      <div className="absolute right-5 bottom-5 flex flex-col gap-2">
                        <Button
                          variant="tertiary"
                          onClick={() => setItemToDelete(work.id)}
                        >
                          <Trash2Icon />
                        </Button>
                        <Button
                          variant="tertiary"
                          onClick={() =>
                            setWorkAndTrainingTemp({
                              ...workAndTrainingTemp,
                              type: "WORK",
                              experienceParam: work,
                            })
                          }
                        >
                          <Edit2Icon />
                        </Button>
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
            onClick={() =>
              setWorkAndTrainingTemp({
                ...workAndTrainingTemp,
                type: "TRAINING",
              })
            }
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
                      <div className="absolute right-5 bottom-5 flex flex-col gap-2">
                        <Button
                          variant="tertiary"
                          onClick={() => setItemToDelete(training.id)}
                        >
                          <Trash2Icon />
                        </Button>
                        <Button
                          variant="tertiary"
                          onClick={() =>
                            setWorkAndTrainingTemp({
                              ...workAndTrainingTemp,
                              type: "TRAINING",
                              experienceParam: training,
                            })
                          }
                        >
                          <Edit2Icon />
                        </Button>
                      </div>
                    </Card>
                  </TimeLineItem>
                ))}
          </TimeLine>
        </div>
      </div>
      {workAndTrainingTemp && (
        <AddExperience
          type={workAndTrainingTemp.type}
          experienceParam={workAndTrainingTemp.experienceParam}
          onClose={() => {
            setWorkAndTrainingTemp(null);
            fetchWorkAndTraining();
          }}
        />
      )}
      {itemToDelete > 0 && (
        <AlertDialog
          message="Sei sicuro di voler eliminare l'esperienza Lavorativa/Formativa?"
          onAcept={() => handleDeleteExperience()}
          onClose={() => setItemToDelete(0)}
        ></AlertDialog>
      )}
      {alertMessage && (
        <Alert
          type={alertMessage.type}
          message={alertMessage.message}
          onClose={() => {
            handleCloseAlert();
            setItemToDelete(0);
          }}
        />
      )}
    </Scaffold>
  );
}
