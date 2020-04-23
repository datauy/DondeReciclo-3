import { TestBed } from '@angular/core/testing';

import { SubprogramService } from './subprogram.service';

describe('SubprogramService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SubprogramService = TestBed.get(SubprogramService);
    expect(service).toBeTruthy();
  });
});
