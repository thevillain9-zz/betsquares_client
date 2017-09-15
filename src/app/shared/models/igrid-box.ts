import { IUser } from './iuser';

export interface IGridBox {
    scoreX: number;
    scoreY: number;
    userId: IUser;
    isWinner: boolean;
    isTempWinner: boolean;
}

