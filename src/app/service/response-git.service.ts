import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GIT_API_URL, tokenGit } from '../const';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ResponseGitService {
  public repositories = new Subject();
  constructor(private http: HttpClient) {}

  getRepository(): void {
    this.http
      .get(
        `${GIT_API_URL}/search/repositories?q=stars%3A%3E0&sort=stars&per_page=15`,
        {
          headers: {
            Authorization: `token ${tokenGit}`,
          },
        }
      )
      .pipe(map((res: any) => this.repositories.next(res)));
  }
}
