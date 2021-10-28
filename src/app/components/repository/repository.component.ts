import { Component, OnInit } from '@angular/core';
import { ResponseGitService } from '../../service/response-git.service';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

export interface Repo {
  name: string;
  owner: {
    login: string;
  };
  watchers: number;
  stargazers_count: number;
  forks: number;
  language: string;
}

@Component({
  selector: 'app-repository',
  templateUrl: './repository.component.html',
  styleUrls: ['./repository.component.scss'],
})
export class RepositoryComponent implements OnInit {
  public repositories: Observable<any> = new Observable();
  constructor(private responseGitService: ResponseGitService) {}

  ngOnInit(): void {
    this.repositories = this.responseGitService.repositories.pipe(
      take(1),
      map((res) => res)
    );
  }
}
