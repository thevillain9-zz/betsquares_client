import { Http } from '@angular/http';
import { environment } from './../../../environments/environment';
import { GamesService } from './games.service';
import { IGamesService } from './games.service.interface';
import { MockGamesService } from './games.mock.service';

export let mockService: MockGamesService;

export function mockGamesServiceFactory(): IGamesService {

    if (mockService === undefined) {
        mockService = new MockGamesService();
    }

    return mockService;
}

export function GamesServiceFactory(httpService: Http): IGamesService  {
    if (environment.isUseMockService === true) {
        return mockGamesServiceFactory();
    }

    return new GamesService(httpService, environment.baseServiceUri);
};
