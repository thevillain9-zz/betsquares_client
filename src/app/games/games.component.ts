import { Input, Component, OnInit, OnDestroy, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router} from '@angular/router';
import { IGame } from '../shared/models/IGame';
import { IUser } from '../shared/models/IUser';
import { IGridGamesByUser } from '../shared/models/igrid-game-by-user';
import { IGridGame } from '../shared/models/igrid-game';
import { IGameDisplayDetails} from '../shared/models/igames-display-details';
import { Observable } from 'rxjs/Observable';
import { AnonymousSubscription } from 'rxjs/Subscription';
import { GridGamesService} from '../shared/services/grid-games.service';
import { AuthenticationService} from '../shared/services/authentication.service';
import { GamesService} from '../shared/services/games.service';

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
    filteredGames: IGame[];
    sortBy: string = 'sku';
    gamesLabel: string;

    _searchInputTerm: string = '';
    gamesDetail: IGameDisplayDetails;
    isLoadingGames: Boolean = false;
    isSearchEnabled: Boolean = false;
    private _selectedSchedule: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private gamesDataService: GamesService,
    private gridGamesDataService: GridGamesService,
    private authenticationService: AuthenticationService) { 
    }

  ngOnInit() {
    this.gamesLabel = 'Games';

    this.loadGameDetails();
    //this.subscribeToScores();
  }

  ngOnDestroy(): void {
        if (this.timerSubscription) {
            this.timerSubscription.unsubscribe();
        }
  }

  //#region Property Get/Set
  @Input()
  set selectedSchedule(schedule: number) {
    this._selectedSchedule = schedule;
    this.onSelectedScheduleChanged();
  }

  get selectedSchedule(): number { return this._selectedSchedule; }

  @Input()
  set searchInputTerm(searchText: string) {
    this._searchInputTerm = searchText;
    this.onSearchInputChanged();
  }

  get searchInputTerm(): string {
    return this._searchInputTerm;
  }

  //#endregion

  private onSearchInputChanged(): void {
    if (this.searchInputTerm === undefined || this.searchInputTerm === null || this.searchInputTerm.length === 0) {
      this.filteredGames = this.games;
    } else {
      const searchTerm = this.searchInputTerm;
      this.filteredGames = this.games.filter(game =>
            game.homeTeam.shortName.search(new RegExp(searchTerm, 'i')) >= 0 ||
            game.homeTeam.teamName.search(new RegExp(searchTerm, 'i')) >= 0 ||
            game.homeTeam.location.search(new RegExp(searchTerm, 'i')) >= 0 ||
            game.awayTeam.shortName.search(new RegExp(searchTerm, 'i')) >= 0 ||
            game.awayTeam.teamName.search(new RegExp(searchTerm, 'i')) >= 0 ||
            game.awayTeam.location.search(new RegExp(searchTerm, 'i')) >= 0
          );
          console.log(this.filteredGames.length);
    }
  }

  private async loadGameDetails(): Promise<void> {
    this.isLoadingGames = true;
    this.gamesDetail = <IGameDisplayDetails>{
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
      this.selectedSchedule = this.gamesDetail.currentPeriod;
      this.applyCurrentPeriod();

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

  public onSelectedScheduleChanged() : void {
    this.isLoadingGames = true;
    this.applyCurrentPeriod();
  }

  private applyCurrentPeriod() : void {
    if (this.gamesDetail === undefined) {
      return;
    }

    // loads games for selected period
    this.loadGamesByPeriod();
  }

  private loadGamesByPeriod() : void {
    // load games
    this.gamesDataService.getGames(this.gamesDetail.currentPeriod).subscribe(games2 => {
      setTimeout(() => {
          this.games = games2;
          console.log(this.games[0].gameDate);
          this.filteredGames = this.games;
          this.isLoadingGames = false;
        }, 3000);
    }, error => {
      this.filteredGames = [];
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