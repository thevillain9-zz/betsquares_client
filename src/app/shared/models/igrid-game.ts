import { ITeam } from './iteam';
import { IGame } from './igame';
import { IUser } from './iuser';
import { IGridBox } from './igrid-box';

export interface IGridGame {
    gridGameId: number;
    name : String;
    //accessCode : String;
    //owner : IUser;
    //game : IGame;
    boxes: IGridBox[]
}

export interface IGridGamesByUser {
    game: IGame;
    gridGames: IGridGame[];
}