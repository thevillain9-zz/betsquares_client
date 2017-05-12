import { TestBed, inject, tick, fakeAsync } from '@angular/core/testing';
import { GAMES_MOCK_DATA } from '../mocks/data/games';
import { MockBackend } from '@angular/http/testing';
import { Http, ConnectionBackend, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { IGridGame } from '../models/IGrid-game';
import { GridGamesService } from './grid-games.service';

describe('GridGamesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:
      [
        {
          provide: Http, useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
          return new Http(backend, defaultOptions);
        }, deps: [MockBackend, BaseRequestOptions]
        },
        {provide: GridGamesService, useClass: GridGamesService},
        {provide: MockBackend, useClass: MockBackend},
        {provide: BaseRequestOptions, useClass: BaseRequestOptions}
      ]
    });
  });

  it('should ...', inject([GridGamesService], (service: GridGamesService) => {
    expect(service).toBeTruthy();
  }));
});
