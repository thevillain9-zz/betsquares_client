import { Injectable, Output, EventEmitter } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { IUser } from '../models/Iuser';
import { ILoginResponse } from '../models/ilogin-response';
import 'rxjs/add/operator/map'
 
@Injectable()
export class AuthenticationService {

    @Output() userChangeEvent: EventEmitter<IUser> = new EventEmitter(true)

    constructor(private http: Http) { }

    public getCurrentUser(): IUser
    {
        if (localStorage.getItem('currentUser'))
        {
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
                                this.userChangeEvent.emit(loginResponse.user);
                            }
                            return loginResponse;
                        }).catch((error: Response | any) => {
                            let errMsg = <ILoginResponse>{ status: 0, statusText: "", success: false, message: "", token: "", user: null};
                            if (error instanceof Response) {
                                const body = <ILoginResponse>error.json();
                                if(body !== undefined) {
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

        this.userChangeEvent.emit(null);
    }
}
