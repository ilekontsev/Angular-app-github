export interface Repo {
  name: string;
  owner: {
    login: string;
    html_url: string;
    avatar_url: string;
  };
  watchers: number;
  stargazers_count: number;
  forks: number;
  language: string;
  html_url: string;
  flag?: boolean;
  id: number;
  url: string;
}

export interface CommitRepo {
  commit: {
    author: {
      name: string;
      date: string;
    };
    message: string;
  };
  sha: string;
}
