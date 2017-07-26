import { Http } from '@angular/http';
import { environment } from './../../../environments/environment';
import { GridGamesService } from './grid-games.service';
import { IGridGamesService } from './grid-games.service.interface';
import { MockGridGamesService } from './grid-games.mock.service';
import { MockUsersService } from './users.mock.service';
import { MockGamesService } from './games.mock.service';

export let mockService: MockGridGamesService;

export function mockGridGamesServiceFactory(): MockGridGamesService {

    if (mockService === undefined) {
        mockService = new MockGridGamesService(new MockUsersService(), new MockGamesService());
    }

    return mockService;
}

export function GridGamesServiceFactory(httpService: Http): IGridGamesService {
    if (environment.isUseMockService === true) {
        return mockGridGamesServiceFactory();
    }

    return new GridGamesService(httpService, environment.baseServiceUri);
};
