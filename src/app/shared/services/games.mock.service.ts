import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { IGamesService } from './games.service.interface';
import { GamesRequest } from '../models/request/gamesRequest';
import { IGame } from '../models/IGame';
import { IScore } from '../models/IScore';
import { ITeam } from '../models/ITeam';
import { IGameDisplayDetails} from '../models/igames-display-details';


@Injectable()
export class MockGamesService implements IGamesService {

    getGames(period: number): Observable<IGame[]> {
        const games = Array<IGame>();
        if (period === 8) {
            games.push(this.getTestGame());
        }

        return Observable.of(games);
    };

    getGame(gameId: number): Observable<IGame> {
        if (gameId === 1) {
            return Observable.create((observer) => {
                    observer.next(this.getTestGame());
                    observer.complete();
                    });
        } else {
            return Observable.create((subscriber) => {
                    subscriber.next(null);
                    subscriber.complete();
                    });
        }
    };

    getScores(games: Array<number>) {
        return null;
    };

    getGamesDisplayDetails(): Observable<IGameDisplayDetails> {
        const gameDetails = <IGameDisplayDetails>{
                    currentPeriod: 8,
                    maxPeriod: 23,
                    minPeriod: 1,
                    displayPeriods: [
                        {period: 1, displayPeriod: 'Preseason Week 1'},
                        {period: 2, displayPeriod: 'Preseason Week 2'},
                        {period: 3, displayPeriod: 'Preseason Week 3'},
                        {period: 4,  displayPeriod: 'Preseason Week 4'},
                        {period: 5,  displayPeriod: 'Week 1'},
                        {period: 6,  displayPeriod: 'Week 2'},
                        {period: 7,  displayPeriod: 'Week 3'},
                        {period: 8,  displayPeriod: 'Week 4'},
                        {period: 9,  displayPeriod: 'Week 5'},
                        {period: 10,  displayPeriod: 'Week 6'},
                        {period: 11,  displayPeriod: 'Week 7'},
                        {period: 12,  displayPeriod: 'Week 8'},
                        {period: 13,  displayPeriod: 'Week 9'},
                        {period: 14,  displayPeriod: 'Week 10'},
                        {period: 16,  displayPeriod: 'Week 11'},
                        {period: 17,  displayPeriod: 'Week 12'},
                        {period: 20,  displayPeriod: 'Week 13'},
                        {period: 21,  displayPeriod: 'Week 14'},
                        {period: 22,  displayPeriod: 'Week 15'},
                        {period: 23,  displayPeriod: 'Week 16'},
                        {period: 24,  displayPeriod: 'Wildcard'},
                        {period: 25,  displayPeriod: 'Divisional Round'},
                        {period: 26,  displayPeriod: 'Conference Championships'},
                        {period: 27,  displayPeriod: 'Pro Bowl'},
                        {period: 28,  displayPeriod: 'Super Bowl'},
                    ]
                };
        return Observable.of(gameDetails);
    };

    public getTestGame(): IGame {
        return <IGame>{
                gameId: 1,
                homeTeam: <ITeam> {
                    teamId: 4,
                    location: 'New York',
                    teamName: 'Giants',
                    shortName: 'NYG',
                    logoUri: 'http://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/scoreboard/nyg.png&h=50',
                    teampageUri: 'http://www.espn.com/nfl/team/_/name/nyg/new-york-giants',
                },
                awayTeam: <ITeam> {
                    teamId: 2,
                    location: 'Dallas',
                    teamName: 'Cowboys',
                    shortName: 'DAL',
                    logoUri: 'http://a.espncdn.com/combiner/i?img=/i/teamlogos/nfl/500/scoreboard/dal.png&h=50',
                    teampageUri: '"http://www.espn.com/nfl/team/_/name/dal/dallas-cowboys',
                },
                isActive: false,
                isFinished: true,
                gameDate: '2016-10-13 06:30:00.000',
                score: <IScore>{
                    homeTeamScore: 30,
                    awayTeamScore: 17,
                    currentPeriod: '4th quarter',
                    currentTime: '8:58',
                    periodNames: ['1', '2', '3', '4'],
                    awayTeamTotalScores: [7, 14, 0, 17],
                    homeTeamTotalScores: [3, 6, 16, 30],
                    awayTeamPeriodScores: [7, 7, 0, 3],
                    homeTeamPeriodScores: [3, 3, 10, 14],
                    scoreId: 1
                },
                gamePeriod: 8
            };
    }
}