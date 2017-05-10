import { TestBed, inject } from '@angular/core/testing';

import { GridGamesService } from './grid-games.service';

describe('GridGamesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GridGamesService]
    });
  });

  it('should ...', inject([GridGamesService], (service: GridGamesService) => {
    expect(service).toBeTruthy();
  }));
});
