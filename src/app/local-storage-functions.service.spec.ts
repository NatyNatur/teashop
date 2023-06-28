import { TestBed } from '@angular/core/testing';

import { LocalStorageFunctionsService } from './local-storage-functions.service';

describe('LocalStorageFunctionsService', () => {
  let service: LocalStorageFunctionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageFunctionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
