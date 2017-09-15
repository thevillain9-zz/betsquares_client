import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { IUser } from '../models/iuser';
import { IGridGame } from '../models/igrid-game';
import { IGridBox } from '../models/igrid-box';
import { IGridGamesByUser } from '../models/igrid-game-by-user';
import { IGridGamesService } from './grid-games.service.interface';
import { IUsersService } from './users.service.interface';
import { UsersServiceToken } from './users.service.token';
import { IGamesService } from './games.service.interface';
import { GamesServiceToken } from './games.service.token';



@Injectable()
export class MockGridGamesService implements IGridGamesService {

    constructor(@Inject(UsersServiceToken) private usersService: IUsersService,
                @Inject(GamesServiceToken) private gamesDataService: IGamesService) {

    }

    getAllBoxes(): Array<IGridBox> {
        const tempAllBoxes = new Array<[number, number]>();
        for (let x = 0; x < 10; x++) {
            for (let y = 0; y < 10; y++) {
                tempAllBoxes.push([x, y]);
            }
        }

        const staticUser = this.usersService.getCurrentUser();
        const tempGridBoxes = new Array<IGridBox>();
        while (tempAllBoxes.length !== 0) {
            const randomBoxIndex = Math.floor(Math.random() * (tempAllBoxes.length - 1));
            if (randomBoxIndex > -1) {

                const box = tempAllBoxes[randomBoxIndex];
                tempGridBoxes.push(<IGridBox>{
                    scoreX: box[0],
                    scoreY: box[1],
                    userId: staticUser
                    });

                // delete the item
                tempAllBoxes.splice(randomBoxIndex, 1);
            }

        }

        tempGridBoxes.sort( (item1, item2) => {
            return (item1.scoreX * 10 + item1.scoreY) - (item2.scoreX * 10 + item2.scoreY);
        });

        const winningBoxes = tempGridBoxes.filter(box =>  (box.scoreX === 3 && box.scoreY === 7) ||
                                                        (box.scoreX === 4 && box.scoreY === 6) ||
                                                        (box.scoreX === 0 && box.scoreY === 6) ||
                                                        (box.scoreX === 7 && box.scoreY === 0));
        winningBoxes.forEach((box) => { box.isWinner = true; });

        return tempGridBoxes;
    }



    getGridGameByGridGameId(gridGameId: number, password?: string): Observable<IGridGame> {

        const tempGame = this.gamesDataService.getGame(1);

        const gridBoxesTemp = this.getAllBoxes();

        const tempGridGame = <IGridGame>{
            gridGameId: 1,
            name: 'Test grid game',
            password: 'test123',
            owner: null,
            game: null,
            boxes: gridBoxesTemp
        };

        const tempObserveGridGame = new Observable<IGridGame>((observer: any) => {
            tempGame.subscribe(game => {
                tempGridGame.game = game;
                observer.next(tempGridGame);
                observer.complete();
            }, (error) => {
                observer.complete();
            });

        });

        return tempObserveGridGame;
    }

    getGridGamesByUserId(userId): Observable<IGridGamesByUser[]> {
        const tempGridGame = this.getGridGameByGridGameId(1);
        const tempGridGameByUser = new Array();
        tempGridGameByUser.push(<IGridGamesByUser>{
            game: null,
            gridGames: new Array<IGridGame>()
        });
        const tempObserveGridGame = new Observable<IGridGamesByUser[]>((observer: any) => {
            tempGridGame.subscribe(game => {
                tempGridGameByUser[0].game = game.game;
                tempGridGameByUser[0].gridGames.push(game);
                observer.next(tempGridGameByUser);
                observer.complete();
            }, (error) => {
                observer.complete();
            });

        });

        return tempObserveGridGame;
    }
}
