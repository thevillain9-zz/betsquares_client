import { Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod, XHRBackend, RequestOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

export function fakeBackendFactory(backend: MockBackend, options: BaseRequestOptions, realBackend: XHRBackend) {
    // array in local storage for registered users
    let users: any[] = JSON.parse(localStorage.getItem('users')) || [];

    // configure fake backend
    backend.connections.subscribe((connection: MockConnection) => {
        // wrap in timeout to simulate server api call
        setTimeout(() => {

            

            // get users
            if (connection.request.url.endsWith('/api/games/details') && connection.request.method === RequestMethod.Get) {
                
                connection.mockRespond(new Response(new ResponseOptions({ status: 200, body: {
                    currentPeriod: 8,
                    maxPeriod: 23,
                    minPeriod: 1,
                    displayPeriods: [
                        {period:1, displayPeriod: "Preseason Week 1"},
                        {period:2, displayPeriod: "Preseason Week 2"},
                        {period:3, displayPeriod: "Preseason Week 3"},
                        {period:4,  displayPeriod: "Preseason Week 4"},
                        {period:5,  displayPeriod: "Week 1"},
                        {period:6,  displayPeriod: "Week 2"},
                        {period:7,  displayPeriod: "Week 3"},
                        {period:8,  displayPeriod: "Week 4"},
                        {period:9,  displayPeriod: "Week 5"},
                        {period:10,  displayPeriod: "Week 6"},
                        {period:11,  displayPeriod: "Week 7"},
                        {period:12,  displayPeriod: "Week 8"},
                        {period:13,  displayPeriod: "Week 9"},
                        {period:14,  displayPeriod: "Week 10"},
                        {period:16,  displayPeriod: "Week 11"},
                        {period:17,  displayPeriod: "Week 12"},
                        {period:20,  displayPeriod: "Week 13"},
                        {period:21,  displayPeriod: "Week 14"},
                        {period:22,  displayPeriod: "Week 15"},
                        {period:23,  displayPeriod: "Week 16"},
                        {period:24,  displayPeriod: "Wildcard"},
                        {period:25,  displayPeriod: "Divisional Round"},
                        {period:26,  displayPeriod: "Conference Championships"},
                        {period:27,  displayPeriod: "Pro Bowl"},
                        {period:28,  displayPeriod: "Super Bowl"},
                    ]
                    
                }})));

                return;
            }

            

            // pass through any requests not handled above
            let realHttp = new Http(realBackend, options);
            let requestOptions = new RequestOptions({
                method: connection.request.method,
                headers: connection.request.headers,
                body: connection.request.getBody(),
                url: connection.request.url,
                withCredentials: connection.request.withCredentials,
                responseType: connection.request.responseType
            });
            realHttp.request(connection.request.url, requestOptions)
                .subscribe((response: Response) => {connection.mockRespond(response);},
                (error: any) => {
                    connection.mockError(error);
                });

        }, 500);

    });

    return new Http(backend, options);
};

export let fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: Http,
    useFactory: fakeBackendFactory,
    deps: [MockBackend, BaseRequestOptions, XHRBackend]
};