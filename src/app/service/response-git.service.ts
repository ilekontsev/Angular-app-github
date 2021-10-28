import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GIT_API_URL, tokenGit } from '../const';
import { Observable, of, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Repo } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class ResponseGitService {
  public repositories: any;
  private headers = {
    headers: {
      Authorization: `token ${tokenGit}`,
    },
  };
  constructor(private http: HttpClient) {}

  getRepository(): Observable<Repo[]> {
    const responseWrongData = this.http
      .get(
        `${GIT_API_URL}/search/repositories?q=stars%3A%3E0&sort=stars&per_page=15`,
        this.headers
      )
      .pipe(map((res: any) => res.items));

    // responseWrongData.subscribe((repositories: Repo[]) =>
    //   repositories.forEach((item) =>
    //     this.repositories.push(this.repeatedReq(item.url))
    //   )
    // );
    // console.log(this.repositories);

    return responseWrongData;
  }

  repeatedReq(url: string) {
    return this.http.get(url, this.headers);
  }
}
