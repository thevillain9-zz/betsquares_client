import { Input, Component, OnInit, OnDestroy, SimpleChanges, Inject, ViewChild, ViewChildren,
         ElementRef, Renderer, QueryList } from '@angular/core';
import { DataSource} from '@angular/cdk/collections';
import { ActivatedRoute, Router, Params} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AnonymousSubscription } from 'rxjs/Subscription';
import { BehaviorSubject} from 'rxjs/BehaviorSubject';

import { BoxUserFilter } from '../shared/pipes/box-user-pipe';
import { IScore } from '../shared/models/iscore';
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
  selector: 'app-my-games',
  templateUrl: './my-games.component.html',
  styleUrls: ['./my-games.component.css']
})
export class MyGamesComponent  implements OnInit, OnDestroy {

  currentUser: IUser;
  myGamesDataSource: MyGamesDataSource | null;
  userGamesLabel = 'Games';

  boxesByUser: BoxUserFilter;
  boxesByUserWinning: BoxUserFilter;
  boxesByUserMightWin: BoxUserFilter;

  displayedColumns = ['gameMatchup', 'gameScore', 'gameTime', 'myBoxGames', 'myBoxes', 'myWinBoxes'];

  private scoresSubscription: AnonymousSubscription;
  private timerSubscription: AnonymousSubscription;

  constructor(private route: ActivatedRoute,
        private router: Router,
        @Inject(GamesServiceToken) private gamesDataService: IGamesService,
        @Inject(GridGamesServiceToken) private gridGamesDataService: IGridGamesService,
        @Inject(UsersServiceToken) private usersService: IUsersService) {
    }

  ngOnInit() {
    this.currentUser = this.usersService.getCurrentUser();
    if (this.currentUser !== undefined && this.currentUser !== null) {

      this.boxesByUser = new BoxUserFilter({
        winningFlag: 0,
        currentUser: this.currentUser
      });
      this.boxesByUserWinning = new BoxUserFilter({
        winningFlag: 1,
        currentUser: this.currentUser
      });
      this.boxesByUserMightWin = new BoxUserFilter({
        winningFlag: 2,
        currentUser: this.currentUser
      });


      this.userGamesLabel = this.currentUser.firstName + '\'s Games';
      this.refreshScores();

      this.gridGamesDataService.getGridGamesByUserId(this.currentUser.userId).subscribe(myGames => {
        this.myGamesDataSource = new MyGamesDataSource(myGames);
      }, error => {
       console.log('getGridGamesByUserId Error: ' + error);
      });
    }
  }

  ngOnDestroy(): void {
    if (this.timerSubscription) {
        this.timerSubscription.unsubscribe();
    }
  }

  refreshScores() {
    if (this.myGamesDataSource === undefined || this.myGamesDataSource === null) {
      this.subscribeToScores();
      return;
    }
    const games = this.myGamesDataSource.getAllGames();
    this.gamesDataService.getScores(games).subscribe((scores) => {
        if (this.myGamesDataSource !== null) {
          this.myGamesDataSource.updateScores(scores);
        }
        this.subscribeToScores();
    }, (error) => {
    });

  }

  private subscribeToScores() {
      this.timerSubscription = Observable.timer(5000).first().subscribe(() => this.refreshScores());
  }

}

export class MyGamesDataSource extends DataSource<any> {
  _filterChange = new BehaviorSubject('');
  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) { this._filterChange.next(filter); }


  constructor(private _games: IGridGamesByUser[]) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<IGridGamesByUser[]> {
    const displayDataChanges = [
      this._filterChange
    ];
    return Observable.merge(...displayDataChanges).map(() => {
      return this._games.slice().filter((game: IGridGamesByUser) =>
            true
          );
      });
  }

  disconnect() {}

  getAllGames(): number[] {
    return this._games.map( ({ game}) => game.gameId);
  }

  updateScores(scores: IScore[]): void {
    this._games.forEach((game) => {
      game.game.score = scores.find((score) => score.gameId === game.game.gameId);
    });
  }

}
