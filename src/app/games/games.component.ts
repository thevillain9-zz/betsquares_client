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
export class GamesComponent implements OnInit {
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

  //#region Property Get/Set
  @Input()
  set selectedSchedule(schedule: number) {
    this._selectedSchedule = schedule;
    this.onSelectedScheduleChanged();
  }

  get selectedSchedule(): number { return this._selectedSchedule; }

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

  public onSearchKeyDown(key: KeyboardEvent) {
    if (key != null && key.code === 'Escape') {
      this.toggleSearch();
    }
  }

  private subscribeFilterGames(): void {
    // subscribe to search input to filter list of available games
    if (this.searchInput !== undefined) {
      Observable.fromEvent(this.searchInput.nativeElement, 'keyup')
        .debounceTime(200)
        .distinctUntilChanged()
        .subscribe(() => {
          if (!this.gamesDataSource) { return; }
          this.gamesDataSource.filter = this.searchInput.nativeElement.value;
        });
    }
  }

  private async loadGameDetails(): Promise<void> {
    this.isLoadingGames = true;
    this.gamesDataService.getGamesDisplayDetails().subscribe((data) => {
      this.gamesDetail = data;
      this.selectedSchedule = this.gamesDetail.currentPeriod;
      this.applyCurrentPeriod();
    }, (error) => {
      // TODO: handle error
      console.log('loadGameDetails Error=' + error);
    });
  }

  private focusSearchBox() {
    // focus search box
    if (this.isSearchActive && this.searchInput !== null  &&
        this.searchInput !== undefined  &&
        this.searchInput.nativeElement !== undefined &&
        this.searchInput.nativeElement !== null) {
      this.renderer.invokeElementMethod(this.searchInput.nativeElement, 'focus');
    }
  }

  private applyCurrentPeriod(): void {
    // loads games for selected period
    if (this.gamesDetail !== undefined) {
      this.loadGamesByPeriod();
    }
  }

  private loadGamesByPeriod(): void {
    this.isLoadingGames = true;
    // console.log('loading games by period ' + this.selectedSchedule);
    // load games
    this.gamesDataService.getGames(this.selectedSchedule).subscribe(games2 => {
      this.gamesDataSource = new GamesDataSource(games2);
      this.isLoadingGames = false;
    }, error => {
      this.isLoadingGames = false;
      // TODO: Handle error
      console.log('games received: ' + error);
    });
  }

  private currentTimeZone() {
    // TODO: determine how to figure out local time zone
    return 'PDT';
  }
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
