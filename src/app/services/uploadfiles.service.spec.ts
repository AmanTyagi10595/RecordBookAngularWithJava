import { TestBed } from '@angular/core/testing';

import { UploadfilesService } from './uploadfiles.service';

describe('UploadfilesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UploadfilesService = TestBed.get(UploadfilesService);
    expect(service).toBeTruthy();
  });
});
