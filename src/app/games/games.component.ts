import { Input, Component, OnInit, OnDestroy, SimpleChanges, Inject, ViewChild, ViewChildren,
         ElementRef, Renderer, QueryList, ChangeDetectorRef } from '@angular/core';
import { DataSource} from '@angular/cdk';
import { ActivatedRoute, Router} from '@angular/router';
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
    moduleId: module.id,
    selector: 'app-games',
    templateUrl: 'games.component.html',
    styleUrls: ['games.component.css']
})
export class GamesComponent implements OnInit, OnDestroy {

    private scoresSubscription: AnonymousSubscription;
    private timerSubscription: AnonymousSubscription;

    games: IGame[];
    gamesDataSource: GamesDataSource | null;
    sortBy: string = 'sku';
    gamesLabel: string;
    isSearchActive: Boolean = false;

    _searchInputTerm: string = '';
    gamesDetail: IGameDisplayDetails;
    isLoadingGames: Boolean = false;
    loadingLabel: string = 'Loading...';
    isSearchEnabled: Boolean = false;
    private _selectedSchedule: number;

    displayedColumns = ['homeTeam', 'awayTeam', 'gameDate', 'join'];

    private searchInput: ElementRef;
    @ViewChildren('searchBox') set searchBox(content: QueryList<ElementRef>) {
      if (content !== undefined && content.length > 0 && this.searchInput !== null) {
        this.searchInput = content.first;
        this.subscribeFilterGames();
        this.focusSearchBox();
      }
    }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private renderer: Renderer,
    private cdr: ChangeDetectorRef,
    @Inject(GamesServiceToken) private gamesDataService: IGamesService,
    @Inject(GridGamesServiceToken) private gridGamesDataService: IGridGamesService,
    @Inject(UsersServiceToken) private usersService: IUsersService) {
  }

  ngOnInit() {
    this.gamesLabel = 'Games';

    this.loadGameDetails();
  }


  ngOnDestroy(): void {
        if (this.timerSubscription) {
            this.timerSubscription.unsubscribe();
        }
  }

  private subscribeFilterGames(): void {
    if (this.searchInput !== undefined) {
      // searches the items
      Observable.fromEvent(this.searchInput.nativeElement, 'keyup')
        .debounceTime(200)
        .distinctUntilChanged()
        .subscribe(() => {
          if (!this.gamesDataSource) { return; }
          this.gamesDataSource.filter = this.searchInput.nativeElement.value;
        });
    }
  }

  //#region Property Get/Set
  @Input()
  set selectedSchedule(schedule: number) {
    this._selectedSchedule = schedule;
    this.onSelectedScheduleChanged();
  }

  get selectedSchedule(): number { return this._selectedSchedule; }

  private async loadGameDetails(): Promise<void> {
    this.isLoadingGames = true;
    this.gamesDataService.getGamesDisplayDetails().subscribe((data) => {
      this.gamesDetail = data;
      this.selectedSchedule = this.gamesDetail.currentPeriod;
      this.applyCurrentPeriod();
    }, (error) => {
      console.log('loadGameDetails Error=' + error);
    });

    // this.gamesDataService.getGamesDisplayDetails().subscribe((data) => {
    //       this.gamesDetail = data;
    //       this.applyCurrentPeriod();
    //   },(error) => {

    // });
  }

  public onChangePeriod(newPeriod: number): void {
    if (this.gamesDetail === undefined) {
      return;
    }

    this.gamesDetail.currentPeriod += newPeriod;
    this.applyCurrentPeriod();
  }

  public onSelectedScheduleChanged(): void {
    const period = this.gamesDetail.displayPeriods.filter(x => x.period === this._selectedSchedule);
    this.loadingLabel = period !== null && period.length > 0 ? 'Loading ' + period[0].displayPeriod + ' Games...' : 'Loading...';
    this.isLoadingGames = true;
    this.applyCurrentPeriod();
  }

  public toggleSearch() {
    this.isSearchActive = !this.isSearchActive;
    this.cdr.detectChanges();
    this.focusSearchBox();
  }

  private focusSearchBox() {
    if (this.isSearchActive && this.searchInput !== null  &&
        this.searchInput !== undefined  &&
        this.searchInput.nativeElement !== undefined &&
        this.searchInput.nativeElement !== null) {
      this.renderer.invokeElementMethod(this.searchInput.nativeElement, 'focus');
    }
  }

  public onSearchKeyDown(key: KeyboardEvent) {
    if (key != null && key.code === 'Escape') {
      this.toggleSearch();
    }
  }

  private applyCurrentPeriod(): void {
    if (this.gamesDetail === undefined) {
      return;
    }

    // loads games for selected period
    this.loadGamesByPeriod();
  }

  private loadGamesByPeriod(): void {
    // load games
    this.gamesDataService.getGames(this.gamesDetail.currentPeriod).subscribe(games2 => {
      setTimeout(() => {
          this.games = games2;
          this.gamesDataSource = new GamesDataSource(this.games);
          this.isLoadingGames = false;
        }, 3000);
    }, error => {
      this.games = [];
      this.isLoadingGames = false;
      // TODO: Handle error
      console.log('games received: ' + error);
    });
  }

  private currentTimeZone() {
    // TODO: determine how to figure out local time zone
    return 'PDT';
  }


  // refreshScores() {
  //     if(this.myGridGames != null && this.myGridGames.length > 0) {

  //       let gameIds = [];
  //       this.myGridGames.forEach((game) => {
  //         gameIds.push(game.game.gameId);
  //       });

  //       this.myGridGames.forEach(game => {
  //               let updateTeamScore = Math.random();
  //               if(updateTeamScore < 0.5) {
  //                 game.game.score.awayTeamScore = Math.round(Math.random() * 100);
  //               }
  //               else {
  //                 game.game.score.homeTeamScore = Math.round(Math.random() * 100);
  //               }
  //             });
  //     }

  //     this.subscribeToScores();
  // }

  // public isValidBoxesExist(gridGame: IGridGame) {
  //   let isAllBoxesValid = true;
  //   let boxes = gridGame.boxes != null && gridGame.boxes.length > 0 ? gridGame.boxes : null;
  //   if(boxes != null) {
  //     isAllBoxesValid = boxes.every((box, index, arr) => {
  //       if(box.scoreX == undefined || box.scoreY == undefined)
  //         return false;
  //       else
  //         return true;
  //     });
  //   }
  //   else {
  //     isAllBoxesValid = false;
  //   }
  //   return isAllBoxesValid;
  // }

  // private subscribeToScores() {
  //   this.timerSubscription = Observable.timer(30000).first().subscribe(() => this.refreshScores());
  // }

}


export class GamesDataSource extends DataSource<any> {
  _filterChange = new BehaviorSubject('');
  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) { this._filterChange.next(filter); }

  constructor(private _games: IGame[]) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<IGame[]> {
    const displayDataChanges = [
      this._filterChange
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      return this._games.slice().filter((game: IGame) =>
            game.homeTeam.shortName.search(new RegExp(this.filter, 'i')) >= 0 ||
            game.homeTeam.teamName.search(new RegExp(this.filter, 'i')) >= 0 ||
            game.homeTeam.location.search(new RegExp(this.filter, 'i')) >= 0 ||
            game.awayTeam.shortName.search(new RegExp(this.filter, 'i')) >= 0 ||
            game.awayTeam.teamName.search(new RegExp(this.filter, 'i')) >= 0 ||
            game.awayTeam.location.search(new RegExp(this.filter, 'i')) >= 0
          );
      });
  }

  disconnect() {}
}
