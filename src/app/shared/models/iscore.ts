export interface IScore {
    gameId: number;
    scoreId: number;
    homeTeamScore: number;
    awayTeamScore: number;
    currentPeriod: string;
    currentTime: string;
    homeTeamPeriodScores: number[];
    homeTeamTotalScores: number[];
    awayTeamPeriodScores: number[];
    awayTeamTotalScores: number[];
    periodNames: string[];
    state: number;
    lastUpdate: string;
    currentPeriodIndex: number;
}
