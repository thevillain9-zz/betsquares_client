import { EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { ServiceBase } from './service.base';
import { IGame } from '../models/IGame';
import { IGridGame } from '../models/igrid-game';
import { GridIronGameRequest } from '../models/request/gridiron-game-request';


export interface IGridGamesService {

    getGridGameByGridGameId(gridGameId: number, password?: string): Observable<IGridGame>;

    getGridGamesByGameId(gameId);

    getGridGamesByUserId(userId);
}
