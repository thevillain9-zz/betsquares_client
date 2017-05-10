import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
 
import { IUser } from '../models/IUser';
import { ServiceBase } from './service.base';

@Injectable() 
export class UsersService extends ServiceBase
{
    

    constructor(private http: Http) {
        super();
    }

    create(user: IUser) {
        return this.http.post('http://localhost:3009/api/users/register', user, this.getAuthorizationHeaders()).map((response: Response) => response.json());
    }

    getAll() {
        return this.http.get('http://localhost:3009/api/users', this.getAuthorizationHeaders()).map((response: Response) => response.json());
    }

}