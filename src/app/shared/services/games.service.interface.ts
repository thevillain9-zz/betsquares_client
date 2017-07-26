import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { ServiceBase } from './service.base';

import { GamesRequest } from '../models/request/gamesRequest';
import { IGame } from '../models/IGame';
import { IScore } from '../models/IScore';
import { IGameDisplayDetails} from '../models/igames-display-details';

import { Observable } from 'rxjs/Rx';

export interface IGamesService {

    getGames(period: number): Observable<IGame[]>;

    getGame(gameId: number): Observable<IGame>;

    getScores(games: Array<number>);

    getGamesDisplayDetails(): Observable<IGameDisplayDetails>;

}
