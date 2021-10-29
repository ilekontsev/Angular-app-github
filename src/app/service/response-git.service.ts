import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GIT_API_URL, tokenGit } from '../const';
import { Observable, of } from 'rxjs';
import { catchError, concatMap, map, mergeMap } from 'rxjs/operators';
import { CommitRepo, Repo } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class ResponseGitService {
  public commits: any = [];

  private headers = {
    headers: {
      Authorization: `token ${tokenGit}`,
    },
  };
  constructor(private http: HttpClient) {}

  getRepository(): Observable<any> {
    return this.http
      .get(
        `${GIT_API_URL}/search/repositories?q=stars%3A%3E0&sort=stars&per_page=15`,
        this.headers
      )
      .pipe(
        mergeMap((res: any) => {
          return res.items?.map((item: Repo) => item.url);
        }),
        concatMap((url: any) => this.http.get(url, this.headers)),
        catchError((err) => of(err))
      );
  }

  getCommits(login: string, nameRepo: string): Observable<any> {
    return this.http
      .get(
        `${GIT_API_URL}/repos/${login}/${nameRepo}/commits?per_page=5`,
        this.headers
      )
      .pipe(
        map((res: any) =>
          res.map((item: CommitRepo) => {
            return { ...item, userName: login };
          })
        )
      );
  }

  cacheCommits(commits: CommitRepo[]): void {
    commits.forEach((item) => this.commits.push(item));
  }

  getCacheCommit(login: string): any {
    return this.commits.filter((item: CommitRepo) => item.userName === login);
  }

  deleteRepoCacheCommits(login: string): void {
    this.commits.filter((item: CommitRepo) => item.userName !== login);
  }
}
