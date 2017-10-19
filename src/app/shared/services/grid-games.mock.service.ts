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

        // user can only have 1 to 50 boxes
        let boxesPerUser = Math.floor(Math.random() * 50) - 1;

        const staticUser = this.usersService.getCurrentUser();
        const tempGridBoxes = new Array<IGridBox>();
        while (tempAllBoxes.length !== 0) {
            const randomBoxIndex = Math.floor(Math.random() * (tempAllBoxes.length - 1));
            if (randomBoxIndex > -1) {

                const box = tempAllBoxes[randomBoxIndex];
                tempGridBoxes.push(<IGridBox>{
                    scoreX: box[0],
                    scoreY: box[1],
                    userId: boxesPerUser > 0 ? staticUser : null
                    });

                // decrement count
                if (boxesPerUser > 0) {
                    boxesPerUser -= 1;
                }

                // delete the last item item
                tempAllBoxes.splice(randomBoxIndex, 1);
            }

        }

        // order boxes
        tempGridBoxes.sort( (item1, item2) => {
            return (item1.scoreX * 10 + item1.scoreY) - (item2.scoreX * 10 + item2.scoreY);
        });

        return tempGridBoxes;
    }



    getGridGameByGridGameId(gridGameId: number, password?: string): Observable<IGridGame> {

        const tempGame = this.gamesDataService.getGame(1);

        const tempGridGame = <IGridGame>{
            gridGameId: 1,
            name: 'Test grid game',
            password: 'test123',
            owner: null,
            game: null,
            boxes: this.getAllBoxes()
        };

        const tempGridGame2 = <IGridGame>{
            gridGameId: 2,
            name: 'Sundays are for the boys',
            password: 'test123',
            owner: null,
            game: null,
            boxes: this.getAllBoxes()
        };

        const tempObserveGridGame = new Observable<IGridGame>((observer: any) => {
            tempGame.subscribe(game => {
                tempGridGame.game = game;
                tempGridGame2.game = game;
                observer.next(tempGridGame);
                observer.next(tempGridGame2);
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
