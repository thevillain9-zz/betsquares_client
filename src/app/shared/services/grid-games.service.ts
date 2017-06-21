import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

import { ServiceBase } from './service.base';
import { IGame } from '../models/IGame';
import { IGridGame } from '../models/igrid-game';
import { GridIronGameRequest } from '../models/request/gridiron-game-request';



@Injectable()
export class GridGamesService extends ServiceBase {

    constructor(private http: Http) {
        super();
    }

    getGridGameByGridGameId(gridGameId: number, password: String): Observable<IGridGame> {
        const request = new GridIronGameRequest();
        request.gridGames.push(gridGameId);
        let url = 'http://localhost:3009/api/gridgame/';
        return this.http.post(url, request, this.getAuthorizationHeaders()).map(this.extractData).catch(this.handleError);
    }

    getGridGamesByGameId(gameId) {
        const request = new GridIronGameRequest();
        request.games.push(gameId);
        let url = 'http://localhost:3009/api/gridgame/';
        return this.http.post(url, request, this.getAuthorizationHeaders()).map(this.extractData).catch(this.handleError);
    }

    getGridGamesByUserId(userId) {
        const request = new GridIronGameRequest();
        request.userId = userId;
        let url = 'http://localhost:3009/api/gridgame/';
        return this.http.post(url, request, this.getAuthorizationHeaders()).map(this.extractData).catch(this.handleError);
    }
}
