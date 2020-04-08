import { TestBed } from '@angular/core/testing';

import { NeighbourService } from './neighbour.service';

describe('NeighbourService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NeighbourService = TestBed.get(NeighbourService);
    expect(service).toBeTruthy();
  });
});
