import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import {
  catchError,
  concatMap,
  map,
  mergeMap,
  switchMap,
} from 'rxjs/operators';

import { GIT_API_URL, tokenGit } from '../const';
import { CommitRepo, DataRepo, Repo } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class ResponseGitService {
  private headers = {
    headers: {
      Authorization: `token ${tokenGit}`,
    },
  };
  public commits: CommitRepo[] = [];
  public repositories = new BehaviorSubject<Repo[]>([]);
  public userProfile = new Subject();
  public arrayRepos: Repo[] = [];
  
  constructor(private http: HttpClient) {}

  getObservableRepositories() {
    return this.repositories;
  }

  getUserProfile() {
    return this.userProfile;
  }

  getRepository(): void {
    this.arrayRepos = [];
    this.http
      .get<DataRepo>(
        `${GIT_API_URL}/search/repositories?q=stars%3A%3E0&sort=stars&per_page=15`,
        this.headers
      )
      .pipe(
        mergeMap((res) => {
          return res.items?.map((item: Repo) => item.url);
        }),
        concatMap((url: string) => this.http.get(url, this.headers)),
        map((res) => {
          return { ...res, flag: false };
        }),
        catchError((err) => of(err))
      )
      .subscribe((res) => {
        if (!res.error) {
          this.arrayRepos.push(res);
          this.repositories.next(this.arrayRepos);
        }
      });
  }

  getCommits(login: string, nameRepo: string): Observable<CommitRepo[]> {
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
        ),
        catchError((err) => of(err))
      );
  }

  cacheCommits(commits: CommitRepo[]): void {
    if (commits.length) {
      commits.forEach((item) => this.commits.push(item));
    }
  }

  getCacheCommit(login: string): CommitRepo[] {
    return this.commits.filter((item: CommitRepo) => item.userName === login);
  }

  deleteRepoCacheCommits(login: string): void {
    this.commits.filter((item: CommitRepo) => item.userName !== login);
  }

  searchRepositories(value: string): void {
    if (!value.trim()) {
      this.getRepository();
    } else {
      this.arrayRepos = [];
      this.http
        .get<DataRepo>(
          `${GIT_API_URL}/search/repositories?q=${value}+in:name&per_page=7`,
          this.headers
        )
        .pipe(
          switchMap((res: DataRepo) => res.items),
          map((res) => {
            return { ...res, flag: false };
          })
        )
        .subscribe((res) => {
          this.arrayRepos.push(res);
          this.repositories.next(this.arrayRepos);
        });
    }
  }
  
  getUser(): void {
    this.http.get(`${GIT_API_URL}/user`, this.headers).subscribe(
      (res) => this.userProfile.next(res),
      (error) => error
    );
  }
}
