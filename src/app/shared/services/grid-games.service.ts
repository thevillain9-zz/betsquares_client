import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { ServiceBase } from './service.base';
import { IGame } from '../models/IGame';
import { IGridGame } from '../models/igrid-game';
import { IGridGamesByUser } from '../models/igrid-game-by-user';
import { GridIronGameRequest } from '../models/request/gridiron-game-request';
import { IGridGamesService } from './grid-games.service.interface';

@Injectable()
export class GridGamesService extends ServiceBase implements IGridGamesService {

    constructor(private http: Http, protected baseUrl: string) {
        super(baseUrl);
    }

    getGridGameByGridGameId(gridGameId: number, password?: string): Observable<IGridGame> {
        const request = new GridIronGameRequest();
        request.gridGames.push(gridGameId);
        const url = this.baseUrl + '/api/gridgame/';
        return this.http.post(url, request, this.getAuthorizationHeaders()).map(this.extractData).catch(this.handleError);
    }

    getGridGamesByUserId(userId): Observable<IGridGamesByUser[]> {
        const request = new GridIronGameRequest();
        request.userId = userId;
        const url = this.baseUrl + '/api/gridgame/';
        return this.http.post(url, request, this.getAuthorizationHeaders()).map(this.extractData).catch(this.handleError);
    }
}
