interface GitHubRepositoryListItem {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  fork: boolean;
}

interface GitHubRepositoryTopicsResponse {
  names: string[];
}

export interface GitHubRepository {
  id: number;
  title: string;
  html_url: string;
  description: string | null;
  topics: string[];
}

const GITHUB_API_BASE_URL = "https://api.github.com";

export async function getPublicRepositories(
  username: string,
): Promise<GitHubRepository[]> {
  const response = await fetch(
    `${GITHUB_API_BASE_URL}/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=100`,
    {
      headers: {
        Accept: "application/vnd.github+json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      `GitHub API error: ${response.status} ${response.statusText}`,
    );
  }

  const repositories = (await response.json()) as GitHubRepositoryListItem[];

  const publicRepositories = repositories.filter(
    (repository) => !repository.fork,
  );

  return Promise.all(
    publicRepositories.map(async (repository) => ({
      id: repository.id,
      title: repository.name,
      html_url: repository.html_url,
      description: repository.description,
      topics: await getRepositoryTopics(username, repository.name),
    })),
  );
}

async function getRepositoryTopics(
  username: string,
  repositoryName: string,
): Promise<string[]> {
  const response = await fetch(
    `${GITHUB_API_BASE_URL}/repos/${encodeURIComponent(username)}/${encodeURIComponent(repositoryName)}/topics`,
    {
      headers: {
        Accept: "application/vnd.github+json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      `GitHub API error: ${response.status} ${response.statusText}`,
    );
  }

  const topics = (await response.json()) as GitHubRepositoryTopicsResponse;

  return topics.names;
}
