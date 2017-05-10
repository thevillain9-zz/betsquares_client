import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { IGame } from '../models/IGame';

import { Observable }     from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class GridGamesService {

    constructor(private http: Http) {
    }

    getGridGamesByGameId(gameId) {
        var url = 'http://localhost:3009/api/gridGame/gameId/' + gameId;
        return this.http.get(url).map(this.extractData).catch(this.handleError);
    }

    getGridGamesByUserId(userId) {
        var url = 'http://localhost:3009/api/gridgame/userId/' + userId;
        return this.http.get(url).map(this.extractData).catch(this.handleError);
    }

    private extractData(res: Response) {
        let body = res.json();
        return body || { };
    }

    private handleError (error: Response | any) {

        // In a real world app, we might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
        const body = error.json() || '';
        const err = body.error || JSON.stringify(body);
        errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
        errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Observable.throw(errMsg);
    }
}