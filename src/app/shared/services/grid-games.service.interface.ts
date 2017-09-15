import { EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { ServiceBase } from './service.base';
import { IGame } from '../models/IGame';
import { IGridGame } from '../models/igrid-game';
import { IGridGamesByUser } from '../models/igrid-game-by-user';
import { IGridBox } from '../models/igrid-box';
import { GridIronGameRequest } from '../models/request/gridiron-game-request';


export interface IGridGamesService {

    getGridGameByGridGameId(gridGameId: number, password?: string): Observable<IGridGame>;

    getGridGamesByUserId(userId):  Observable<IGridGamesByUser[]>;
}
