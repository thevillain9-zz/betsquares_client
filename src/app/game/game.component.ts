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

@Component ({
    selector: 'app-game',
    templateUrl: 'game.component.html',
    styleUrls: ['game.component.scss']
})
export class GameComponent implements OnInit {
    @Input() game: IGame;

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
              this.gamesDataService.getGame(gameId).subscribe((data) => {
                this.game = data;

                if (this.game === null || this.game === undefined) {
                  // redirect to select a game
                  this.router.navigate(['/games']);
                } else {
                  console.log('game received isActive:' + this.game.isActive);
                }
              }, (error) => {
                console.log('Games Error:' + error);
                // redirect to select a game
                this.router.navigate(['/games']);
              });
            } else {
              console.log('Games Error: lack of parameters: ' + keyParams);
              this.router.navigate(['/games']);
            }
        });
      }
    }

}
