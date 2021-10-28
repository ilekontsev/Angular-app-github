import { TestBed } from '@angular/core/testing';

import { ResponseGitService } from './response-git.service';

describe('ResponseGitService', () => {
  let service: ResponseGitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResponseGitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
