import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { ServiceBase } from './service.base';

import { GamesRequest } from '../models/request/gamesRequest';
import { IGame } from '../models/IGame';
import { IScore } from '../models/IScore';
import { IGameDisplayDetails} from '../models/igames-display-details';

import { IGamesService } from './games.service.interface';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class GamesService extends ServiceBase implements IGamesService {

    constructor(private http: Http, protected baseUrl: string) {
        super(baseUrl);
    }

    getGames(period: number): Observable<IGame[]> {
        const request = new GamesRequest();
        request.currentPeriod = period;
        const url = this.baseUrl + '/api/games/';
        return this.http.post(url, request, this.getAuthorizationHeaders()).map(this.extractData).catch(this.handleError);
    }

    getGame(gameId: number): Observable<IGame> {
        const request = new GamesRequest();
        request.games.push(gameId);
        const url = this.baseUrl + '/api/games/';
        return this.http.post(url, request, this.getAuthorizationHeaders()).map(this.extractData).catch(this.handleError);
    }

    getScores(games: Array<number>) {
        let url = this.baseUrl + '/api/scores?' + games.join('&games[]=');
        return this.http.get(url).map(this.extractData).catch(this.handleError);
    }

    getGamesDisplayDetails() : Observable<IGameDisplayDetails> {
        let url = this.baseUrl + '/api/games/details';
        return this.http.get(url).map(this.extractData).catch(this.handleError);
    }

}