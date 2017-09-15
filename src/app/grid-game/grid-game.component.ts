import { Input, Component, OnInit, OnDestroy, SimpleChanges, Inject, ViewChild, ViewChildren,
         ElementRef, Renderer, QueryList } from '@angular/core';
import { DataSource} from '@angular/cdk';
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

      // initialize grid box
      this.scoreNumbers = new Array<String>();
      this.scoreNumbers.push('');
      for (let i = 0; i < 10; i++) {
        this.scoreNumbers[i] = i + '';
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

    public onGameScoreChanged(data: any): void {
      console.log(data);
    }

    private refreshGridGame(): void {

      this.gridGamesDataService.getGridGameByGridGameId(this.gridGameId).subscribe((data) => {
        this.gridGame = data;
        // this.subscribeToWinningSquares();
      }, (error) => {
        // TODO: handle error
        // redirect to select a game
        this.router.navigate(['/games']);
      });
    }

    private refreshWinningSquares(): void {

    }
    private validateWinningSquare(): void {

    }

}
