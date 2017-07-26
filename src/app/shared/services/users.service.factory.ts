import { Http } from '@angular/http';
import { environment } from './../../../environments/environment';
import { UsersService } from './users.service';
import { IUsersService } from './users.service.interface';
import { MockUsersService } from './users.mock.service';

export let mockService: MockUsersService;

export function mockUsersServiceFactory(): MockUsersService {

    if (mockService === undefined) {
        mockService = new MockUsersService();
    }

    return mockService;
}

export function UsersServiceFactory(httpService: Http): IUsersService {
    if (environment.isUseMockService === true) {
        return mockUsersServiceFactory();
    }

    return new UsersService(httpService, environment.baseServiceUri);
};
