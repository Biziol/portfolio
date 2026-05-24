import { useEffect, useState } from "react";
import {
  getPublicRepositories,
  type GitHubRepository,
} from "../services/githubService";
import Scaffold from "../components/Scaffold";
import Card from "../components/ui/Card";
import Pill from "../components/ui/Pill";
import Button from "../components/ui/Button";
import GitHub from "../assets/icons/Github.svg?react";
import { ApplicationTypeColors } from "../interfaces/enums/ApplicationType";

const APPLICATION_TYPES = new Set<keyof typeof ApplicationTypeColors>([
  "mobile",
  "frontend",
  "backend",
  "fullstack",
  "tool",
  "library"
]);

function isApplicationType(
  topic: string,
): topic is keyof typeof ApplicationTypeColors {
  return APPLICATION_TYPES.has(topic as keyof typeof ApplicationTypeColors);
}

export default function Project() {
  const [repos, setRepos] = useState<GitHubRepository[]>([]);

  useEffect(() => {
    getPublicRepositories("Biziol").then((data) => setRepos(data));
  }, []);
  return (
    <Scaffold>
      <h1>Progetti</h1>
      <div className="w-full flex-row grid grid-cols-2 gap-5">
        {repos.map((repo) => (
          <Card key={repo.id} className="grow basis-0 justify-between">
            <h2>{repo.title}</h2>
            <div className="flex flex-row gap-2">
              {repo.topics.filter(isApplicationType).map((type) => (
                <Pill
                  key={type}
                  className="py-1 rounded-full text-sm border"
                  style={{
                    color: ApplicationTypeColors[type],
                    borderColor: ApplicationTypeColors[type],
                    backgroundColor: `${ApplicationTypeColors[type]}1A`,
                  }}
                >
                  {type}
                </Pill>
              ))}
            </div>
            <span className="text-foreground/60">{repo.description}</span>

            <div className="flex flex-row gap-2">
              {repo.topics
                .filter((t) => !isApplicationType(t))
                .map((language) => (
                  <Pill key={language} className="text-sm">
                    {language}
                  </Pill>
                ))}
            </div>

            <Button href={repo.html_url} newTab>
              <GitHub />
              GitHub
            </Button>
          </Card>
        ))}
      </div>
    </Scaffold>
  );
}
