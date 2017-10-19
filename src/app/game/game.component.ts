import { Input, Component, OnInit, OnDestroy, SimpleChanges, Inject, ViewChild, ViewChildren,
         ElementRef, Renderer, QueryList, Output, EventEmitter } from '@angular/core';
import { DataSource} from '@angular/cdk/collections';
import { ActivatedRoute, Router, Params} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AnonymousSubscription } from 'rxjs/Subscription';
import { BehaviorSubject} from 'rxjs/BehaviorSubject';

import { IGame } from '../shared/models/IGame';
import { IUser } from '../shared/models/IUser';
import { IGridGamesByUser } from '../shared/models/igrid-game-by-user';
import { IGridGame } from '../shared/models/igrid-game';
import { IGameDisplayDetails} from '../shared/models/igames-display-details';
import { IGridGamesService } from '../shared/services/grid-games.service.interface';
import { GridGamesServiceToken } from '../shared/services/grid-games.service.token';
import { IUsersService } from '../shared/services/users.service.interface';
import { UsersServiceToken } from '../shared/services/users.service.token';
import { IGamesService } from '../shared/services/games.service.interface';
import { GamesServiceToken } from '../shared/services/games.service.token';

@Component ({
    selector: 'app-game',
    templateUrl: 'game.component.html',
    styleUrls: ['game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy {

  @Output() onScoreChanged = new EventEmitter();
  @Input() game: IGame;
  private timerSubscription: AnonymousSubscription;
  private scoreSubscription: AnonymousSubscription;

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      @Inject(GamesServiceToken) private gamesDataService: IGamesService,
      @Inject(GridGamesServiceToken) private gridGamesDataService: IGridGamesService,
      @Inject(UsersServiceToken) private usersService: IUsersService) {
  }

  ngOnInit() {

    if (this.game === null || this.game === undefined) {
        console.log('load game');
        // validate parameters
        this.route.params.subscribe((params: Params) => {
          const keyParams = Object.keys(params);
          if (keyParams.indexOf('gameid') >= 0) {
            const gameId = +params['gameid'];
            this.refreshGame(gameId);
          } else {
            this.router.navigate(['/games']);
          }
      });
    } else if (this.game !== null) {
      this.refreshScore();
    }
  }

  public ngOnDestroy(): void {
    if (this.scoreSubscription) {
      this.scoreSubscription.unsubscribe();
    }

    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  private refreshGame(gameId: number): void {
    this.gamesDataService.getGame(gameId).subscribe(game => {
      this.game = game;
      this.refreshScore();
    }, error => {
      this.router.navigate(['/games']);
    });
  }

  private refreshScore(): void {
    const games = new Array<number>();
    games.push(this.game.gameId);
    this.scoreSubscription = this.gamesDataService.getScores(games).subscribe(scores => {
      if (this.game !== null && this.game !== undefined) {
        const tempScores = scores.filter(r => r.gameId === this.game.gameId);

        if (tempScores !== null && tempScores.length === 1) {
          const newScore = tempScores[0];

          // check if score, period or state has changed
          if (this.onScoreChanged !== null &&
             (newScore.awayTeamScore !== this.game.score.awayTeamScore ||
              newScore.homeTeamScore !== this.game.score.homeTeamScore ||
              newScore.currentPeriod !== this.game.score.currentPeriod ||
              newScore.state !== this.game.score.state)) {
               console.log('Score changed' + newScore.awayTeamScore + ' vs ' + newScore.homeTeamScore);
            this.onScoreChanged.emit(newScore);
          }

          this.game.score = newScore;
        }

        if (this.game.score.state !== 2) {
          // subscribe to score as long as game is not finished
          this.subscribeToScores();
        }

      }
    }, error => {
      console.log('Get Score Error:' + error);
    });
  }

  private subscribeToScores(): void {
    this.timerSubscription = Observable.timer(2000).first().subscribe(() => this.refreshScore());
  }
}
