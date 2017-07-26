import { Injectable, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Rx'; 
import { IUser } from '../models/IUser';
import { ILoginResponse } from '../models/ilogin-response';

export interface IUsersService {
    loggedInUserChangeEvent: EventEmitter<IUser>;

    create(user: IUser): Observable<IUser>;

    getAllUsers(): Observable<IUser[]>;

    getCurrentUser(): IUser;

    login(username: string, password: string): Observable<ILoginResponse>;

    logout();
}
