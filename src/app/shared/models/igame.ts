import { ITeam } from './ITeam';
import { IScore } from './IScore';

export interface IGame {
    gameId: number;
    homeTeam:ITeam;
    awayTeam:ITeam;
    gameDate:string;
    isActive:boolean;
    score: IScore;
    gamePeriod: number;
}