import { Component, OnInit } from '@angular/core';
import { ResponseGitService } from './service/response-git.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'angular-app-github';

  constructor(private responseGitService: ResponseGitService) {}
  ngOnInit() {}
}
