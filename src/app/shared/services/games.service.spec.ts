import { TestBed, inject, tick, fakeAsync } from '@angular/core/testing';
import { GAMES_MOCK_DATA } from '../mocks/data/games';
import { MockBackend } from '@angular/http/testing';
import { Http, ConnectionBackend, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { IGame } from '../models/IGame';
import { GamesService } from './games.service';

describe('GamesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:
      [
        {
          provide: Http, useFactory: (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) => {
          return new Http(backend, defaultOptions);
        }, deps: [MockBackend, BaseRequestOptions]
        },
        {provide: GamesService, useClass: GamesService},
        {provide: MockBackend, useClass: MockBackend},
        {provide: BaseRequestOptions, useClass: BaseRequestOptions}
      ]
    });
  });

  it('should ...', inject([GamesService], (service: GamesService) => {
    expect(service).toBeTruthy();
  }));

  it('Return Games by Period',
  inject([GamesService, MockBackend], fakeAsync((gamesService: GamesService, mockBackend: MockBackend) => {
    let res: IGame[];


    mockBackend.connections.subscribe(c => {
      expect(c.request.url).toContain('api/games/');
      let response = new ResponseOptions({body: GAMES_MOCK_DATA});
      c.mockRespond(new Response(response));
    });
    gamesService.getGames(8).subscribe((response) => {
      res = response;
    });
    tick();
    expect(res.length).toBeGreaterThan(0);
    expect(res[0].homeTeam.shortName).toBe('NYG');
  }))
);



});
