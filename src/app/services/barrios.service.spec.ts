import { TestBed } from '@angular/core/testing';

import { BarriosService } from './barrios.service';

describe('BarriosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BarriosService = TestBed.get(BarriosService);
    expect(service).toBeTruthy();
  });
});
