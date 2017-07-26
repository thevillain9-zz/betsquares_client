import { ITeam } from './iteam';
import { IGame } from './igame';
import { IUser } from './iuser';
import { IGridBox } from './igrid-box';

export interface IGridGame {
    gridGameId: number;
    name: String;
    password: String;
    owner: IUser;
    game: IGame;
    boxes: IGridBox[];
}
