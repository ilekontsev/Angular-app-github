import { Component, OnInit } from '@angular/core';
import { ResponseGitService } from '../../service/response-git.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { Repo } from '../../interfaces';

@Component({
  selector: 'app-repository',
  templateUrl: './repository.component.html',
  styleUrls: ['./repository.component.scss'],
})
export class RepositoryComponent implements OnInit {
  public repositories: Repo[] = [];

  constructor(private responseGitService: ResponseGitService) {}

  ngOnInit(): void {
    this.responseGitService
      .getRepository()
      .pipe(
        tap((res) => console.log(res)),
        map((res) =>
          res.map((item: Repo) => {
            return { ...item, flag: false };
          })
        )
      )
      .subscribe((res) => (this.repositories = res));
  }

  hidden(repo: Repo): void {
    this.repositories.forEach((item) => {
      if (item.id !== repo.id) {
        item.flag = false;
      }
    });
    repo.flag = !repo.flag;
  }
}
