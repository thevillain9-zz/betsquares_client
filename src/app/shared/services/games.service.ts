import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { ServiceBase } from './service.base';

import { GamesRequest } from '../models/request/gamesRequest';
import { IGame } from '../models/IGame';
import { IScore } from '../models/IScore';
import { IGameDisplayDetails} from '../models/igames-display-details';

import { Observable } from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/Rx';
import 'rxjs/Rx';

@Injectable()
export class GamesService extends ServiceBase {

    constructor(private http: Http) {
        super();
    }

    getGames(period: number) : Observable<IGame[]> {
        let request = new GamesRequest();
        request.currentPeriod = period;
        let url = 'http://localhost:3009/api/games/';
        return this.http.post(url, request, this.getAuthorizationHeaders()).map(this.extractData).catch(this.handleError);
    }

    getGame(gameId): Observable<IGame> {
        let request = new GamesRequest();
        request.games.push(gameId);
        let url = 'http://localhost:3009/api/games/';
        return this.http.post(url, request, this.getAuthorizationHeaders()).map(this.extractData).catch(this.handleError);
    }

    getScores(games: Array<number>) {
        let url = 'http://localhost:3009/api/scores?' + games.join('&games[]=');
        return this.http.get(url).map(this.extractData).catch(this.handleError);
    }

    getGamesDisplayDetails() : Observable<IGameDisplayDetails> {
        let url = 'http://localhost:3009/api/games/details';
        return this.http.get(url).map(this.extractData).catch(this.handleError);
    }

}