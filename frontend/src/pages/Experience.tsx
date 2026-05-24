import {
  BriefcaseIcon,
  CalendarIcon,
  ExternalLinkIcon,
  GraduationCapIcon,
} from "lucide-react";
import PingIcon from "../assets/icons/PingIcon.svg?react";
import Scaffold from "../components/Scaffold";
import { useEffect, useState } from "react";
import { type WorkAndTraning } from "../interfaces/WorkAndTraning";
import { getWorkAndTrainings } from "../services/workAndTrainingService";
import TimeLine, { TimeLineItem } from "../components/TimeLine";
import Card from "../components/ui/Card";
import Pill from "../components/ui/Pill";
import { formatDateTime } from "../utils/formatDateTime";

export default function Experience() {
  const [workAndTraining, setWorkAndTraining] = useState<WorkAndTraning[] | []>(
    [],
  );

  async function fetchWorkAndTraining() {
    await getWorkAndTrainings()
      .then((data) => setWorkAndTraining(data))
      .catch();
  }

  const isInProgress = (endDate: string | null) => {
    if (endDate) {
      const start = new Date();
      const end = new Date(endDate);

      const timeDiff = end.getTime() - start.getTime(); // Time difference in milliseconds
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Convert ms to days

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
        </div>
        <div className="ml-5">
          <TimeLine verticalPadding={5} lineColor="bg-primary/50">
            {workAndTraining.length > 0 &&
              workAndTraining
                .filter((e) => e.type == "WORK")
                .map((work) => (
                  <TimeLineItem key={work.id} dotStyle="bg-primary">
                    <Card className="gap-1">
                      <div className="w-full flex flex-row items-center justify-between">
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
        </div>

        <div className="ml-5">
          <TimeLine verticalPadding={5} lineColor="bg-primary/50">
            {workAndTraining.length > 0 &&
              workAndTraining
                .filter((e) => e.type == "TRAINING")
                .map((training) => (
                  <TimeLineItem key={training.id} dotStyle="bg-primary">
                    <Card className="gap-1">
                      <div className="w-full flex flex-row items-center justify-between">
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
                        <p className="flex gap-2 items-center">
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
                    </Card>
                  </TimeLineItem>
                ))}
          </TimeLine>
        </div>
      </div>
    </Scaffold>
  );
}
