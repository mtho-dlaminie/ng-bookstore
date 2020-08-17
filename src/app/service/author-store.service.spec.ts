import { TestBed } from '@angular/core/testing';

import { AuthorStoreService } from './author-store.service';

describe('AuthorStoreService', () => {
  let service: AuthorStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthorStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
