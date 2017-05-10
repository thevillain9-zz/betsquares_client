import { ITeam } from './ITeam';
import { IGame } from './IGame';
import { IUser } from './IUser';
import { IGridBox } from './igrid-box';
import { IGridGame} from './igrid-game';

export interface IGridGamesByUser {
    game: IGame;
    gridGames: IGridGame[];
}