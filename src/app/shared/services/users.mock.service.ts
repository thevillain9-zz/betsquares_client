import { Injectable, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { IUser } from '../models/IUser';
import { IUsersService } from './users.service.interface';
import { ILoginResponse } from '../models/ilogin-response';

@Injectable()
export class MockUsersService implements IUsersService {
    @Output() loggedInUserChangeEvent: EventEmitter<IUser> = new EventEmitter(true);



    create(user: IUser): Observable<IUser> {
        return null;
    }

    getAllUsers(): Observable<IUser[]> {
        return Observable.of(new Array<IUser>(this.getTestUser()));
    }

    getCurrentUser(): IUser {
        if (localStorage.getItem('currentUser')) {
            return JSON.parse(localStorage.getItem('currentUser'));
        } else {
            return null;
        }
    }

    login(username: string, password: string): Observable<ILoginResponse> {
        const loginResponse = <ILoginResponse>{
            success: true,
            token: 'test',
            user : this.getTestUser()
        };

        localStorage.setItem('currentUser', JSON.stringify(loginResponse.user));
        localStorage.setItem('currentUser.token', JSON.stringify(loginResponse.token));
        this.loggedInUserChangeEvent.emit(loginResponse.user);

        return Observable.of(loginResponse);
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        localStorage.removeItem('currentUser.token');

        this.loggedInUserChangeEvent.emit(null);
    }

    private getTestUser(): IUser {
        return <IUser>{
                email: 'rickypatel@betsquares.com',
                firstName: 'Ricky',
                lastName: 'Patel',
                userId: 2,
                password: 'test',
                username: 'rickypatel',
                initials: 'RP'
            };
    }
}
