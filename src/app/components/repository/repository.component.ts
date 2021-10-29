import { Component, OnInit } from '@angular/core';
import { ResponseGitService } from '../../service/response-git.service';
import { map } from 'rxjs/operators';
import { CommitRepo, Repo } from '../../interfaces';

@Component({
  selector: 'app-repository',
  templateUrl: './repository.component.html',
  styleUrls: ['./repository.component.scss'],
})
export class RepositoryComponent implements OnInit {
  public repositories: Repo[] = [];
  public commits: CommitRepo[] = [];
  constructor(private responseGitService: ResponseGitService) {}

  ngOnInit(): void {
    this.responseGitService
      .getRepository()
      .pipe(
        map((res) => {
          return { ...res, flag: false };
        })
      )
      .subscribe((res) => this.repositories.push(res));
  }

  getCommitRepo(repo: Repo): void {
    const hasCheckedCache = this.responseGitService.getCacheCommit(
      repo.owner.login
    );
    if (repo.flag && !hasCheckedCache.length) {
      this.responseGitService
        .getCommits(repo.owner.login, repo.name)
        .pipe(
          map((res) => {
            this.responseGitService.cacheCommits(res);
            return res;
          })
        )
        .subscribe((res) => (this.commits = res));
    }
    this.commits = hasCheckedCache;
  }

  handleHiddenCommit(repo: Repo): void {
    this.repositories.forEach((item) => {
      if (item.id !== repo.id) {
        item.flag = false;
      }
    });
    repo.flag = !repo.flag;
    this.getCommitRepo(repo);
  }

  handleRefreshCommit(event: MouseEvent, repo: Repo) {
    event.stopPropagation();
    this.responseGitService.deleteRepoCacheCommits(repo.owner.login);
    this.responseGitService
      .getCommits(repo.owner.login, repo.name)
      .subscribe((res) => (this.commits = res));
  }
  
}
