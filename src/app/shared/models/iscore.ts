export interface IScore {
    gameId: number;
    scoreId: number;
    homeTeamScore: number;
    awayTeamScore: number;
    currentPeriod: string;
    currentTime: string;
    homeTeamPeriodScores: [0];
    homeTeamTotalScores: [0];
    awayTeamPeriodScores: [0];
    awayTeamTotalScores: [0];
    periodNames: [0];
}