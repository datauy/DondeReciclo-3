import { TestBed } from '@angular/core/testing';

import { NovedadService } from './novedad.service';

describe('NovedadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NovedadService = TestBed.get(NovedadService);
    expect(service).toBeTruthy();
  });
});
