import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { ResponseGitService } from '../../service/response-git.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  
  private searchString = new Subject<string>();
  public userProfile: any;

  constructor(private responseGitService: ResponseGitService) {
    this.responseGitService
      .getUserProfile()
      .pipe(map((res) => (this.userProfile = res)))
      .subscribe();
  }

  public search(value: string): void {
    this.searchString.next(value);
  }

  ngOnInit(): void {
    this.searchString
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        map((value: string) =>
          this.responseGitService.searchRepositories(value)
        )
      )
      .subscribe();
  }
}
