import { Injectable, Output, EventEmitter } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { ILoginResponse } from '../models/ilogin-response';
import { IUser } from '../models/IUser';
import { ServiceBase } from './service.base';
import { IUsersService } from './users.service.interface';

@Injectable()
export class UsersService extends ServiceBase implements IUsersService {

    @Output() loggedInUserChangeEvent: EventEmitter<IUser> = new EventEmitter(true);

    constructor(private http: Http, protected baseUrl: string) {
        super(baseUrl);
    }

    public create(user: IUser) {
        return this.http.post(this.baseUrl + '/api/users/register', user, this.getAuthorizationHeaders())
                        .map(this.extractData).catch(this.handleError);
    }

    public getAllUsers(): Observable<IUser[]>  {
        return this.http.get(this.baseUrl + '/api/users', this.getAuthorizationHeaders())
                        .map(this.extractData).catch(this.handleError);
    }


    public getCurrentUser(): IUser {
        if (localStorage.getItem('currentUser')) {
            return JSON.parse(localStorage.getItem('currentUser'));
        } else {
            return null;
        }
    }

    public login(username: string, password: string): Observable<ILoginResponse> {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const options = new RequestOptions({ headers: headers }); 
        const body = JSON.stringify({ username: username, password: password });
        return this.http.post('http://localhost:3009/api/users/authenticate',body, options)
                        .map((response: Response) => {
                            // login successful if there's a jwt token in the response
                            const loginResponse = <ILoginResponse>response.json();
                            if (loginResponse && loginResponse.token) {
                                // store user details and jwt token in local storage to keep user logged in between page refreshes
                                localStorage.setItem('currentUser', JSON.stringify(loginResponse.user));
                                localStorage.setItem('currentUser.token', JSON.stringify(loginResponse.token));
                                this.loggedInUserChangeEvent.emit(loginResponse.user);
                            }
                            return loginResponse;
                        }).catch((error: Response | any) => {
                            let errMsg = <ILoginResponse>{ status: 0, statusText: '', success: false, message: '', token: '', user: null};
                            if (error instanceof Response) {
                                const body = <ILoginResponse>error.json();
                                if (body !== undefined) {
                                    errMsg = body;
                                }
                                errMsg.status = error.status;
                                errMsg.statusText = error.statusText;
                            } else {
                                errMsg = error.message ? error.message : error.toString();
                            }
                            return Observable.throw(errMsg);
                        });
    }

    public logout() {

        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        localStorage.removeItem('currentUser.token');

        this.loggedInUserChangeEvent.emit(null);
    }

}
