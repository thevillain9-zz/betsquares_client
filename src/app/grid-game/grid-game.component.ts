import { Input, Component, OnInit, OnDestroy, SimpleChanges, Inject, ViewChild, ViewChildren,
         ElementRef, Renderer, QueryList } from '@angular/core';
import { DataSource} from '@angular/cdk/collections';
import { ActivatedRoute, Router, Params} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AnonymousSubscription } from 'rxjs/Subscription';
import { BehaviorSubject} from 'rxjs/BehaviorSubject';

import { IGame } from '../shared/models/IGame';
import { IUser } from '../shared/models/IUser';
import { IScore } from '../shared/models/IScore';
import { IGridGamesByUser } from '../shared/models/igrid-game-by-user';
import { IGridGame } from '../shared/models/igrid-game';
import { IGameDisplayDetails} from '../shared/models/igames-display-details';
import { IGridGamesService } from '../shared/services/grid-games.service.interface';
import { GridGamesServiceToken } from '../shared/services/grid-games.service.token';
import { IUsersService } from '../shared/services/users.service.interface';
import { UsersServiceToken } from '../shared/services/users.service.token';
import { IGamesService } from '../shared/services/games.service.interface';
import { GamesServiceToken } from '../shared/services/games.service.token';


@Component({
  selector: 'app-grid-game',
  templateUrl: './grid-game.component.html',
  styleUrls: ['./grid-game.component.css']
})
export class GridGameComponent implements OnInit, OnDestroy {

  scoreNumbers: String[];
  gridGame: IGridGame;
  gridGameId: number;
  private timerSubscription: AnonymousSubscription;
  private winningSquaresSubscription: AnonymousSubscription;

  constructor(
        private route: ActivatedRoute,
        private router: Router,
        @Inject(GridGamesServiceToken) private gridGamesDataService: IGridGamesService,
        @Inject(UsersServiceToken) private usersService: IUsersService) {


      this.buildGridGame();

      if (this.gridGame === null || this.gridGame === undefined) {

        // validate parameters
        this.route.params.subscribe((params: Params) => {
          const keyParams = Object.keys(params);
          if (keyParams.indexOf('gridgameid') >= 0) {
            this.gridGameId = +params['gridgameid'];
            this.refreshGridGame();
          } else {
            this.router.navigate(['/games']);
          }
      });
      }
    }

    public ngOnInit() {

      // validate parameters
      this.route.params.subscribe((params: Params) => {
            const keyParams = Object.keys(params);
            if (keyParams.indexOf('gridgameid') >= 0) {
              this.gridGameId  = +params['gridgameid'];
              this.refreshGridGame();
            } else {
              console.log('Games Error: lack of parameters: ' + keyParams);
              this.router.navigate(['/games']);
            }
        });
    }

    public ngOnDestroy(): void {
        if (this.winningSquaresSubscription) {
            this.winningSquaresSubscription.unsubscribe();
        }
        if (this.timerSubscription) {
            this.timerSubscription.unsubscribe();
        }
    }

    public onGameScoreChanged(data: IScore): void {
      this.gridGame.game.score = data;
      this.refreshWinningSquares();
    }

    private refreshGridGame(): void {

      this.gridGamesDataService.getGridGameByGridGameId(this.gridGameId).subscribe((data) => {
        this.gridGame = data;
      }, (error) => {
        // TODO: handle error
        // redirect to select a game
        this.router.navigate(['/games']);
      });
    }

    private buildGridGame(): void {
      // initialize grid box
      this.scoreNumbers = new Array<String>();
      this.scoreNumbers.push('');
      for (let i = 0; i < 10; i++) {
        this.scoreNumbers[i] = i + '';
      }
    }

    private refreshWinningSquares(): void {
      const maxPeriodIdx = this.gridGame.game.score.currentPeriodIndex;
      for (let boxIdx = 0; boxIdx < this.gridGame.boxes.length; boxIdx++) {
        const gridBox = this.gridGame.boxes[boxIdx];
        gridBox.isWinner = false;
        gridBox.isTempWinner = false;
        for (let periodIdx = 0; periodIdx < maxPeriodIdx + 1; periodIdx++) {
          const awayScore = this.gridGame.game.score.awayTeamTotalScores[periodIdx].toString();
          const homeScore = this.gridGame.game.score.homeTeamTotalScores[periodIdx].toString();
          const awayScoreEnd = awayScore.substr(awayScore.length - 1);
          const homeScoreEnd = homeScore.substr(homeScore.length - 1);

          const isWinner = (+awayScoreEnd === gridBox.scoreX) && (+homeScoreEnd === gridBox.scoreY);
          if (isWinner && maxPeriodIdx === periodIdx && this.gridGame.game.score.state !== 2) {
            gridBox.isTempWinner = true;
          } else if (isWinner) {
            gridBox.isWinner = true;
          }
        }
      }
    }

}

