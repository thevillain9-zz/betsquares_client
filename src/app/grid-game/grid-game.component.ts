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
export class GridGameComponent implements OnInit {

  scoreNumbers: String[];
  gridGame: IGridGame;

  constructor(
        private route: ActivatedRoute,
        private router: Router,
        @Inject(GridGamesServiceToken) private gridGamesDataService: IGridGamesService,
        @Inject(UsersServiceToken) private usersService: IUsersService) {
    }

    ngOnInit() {
      this.scoreNumbers = new Array<String>();
      this.scoreNumbers.push('');
      for (let i = 0; i < 10; i++) {
        this.scoreNumbers[i] = i + '';
      }

      // validate parameters
      this.route.params.subscribe((params: Params) => {
            const keyParams = Object.keys(params);
            if (keyParams.indexOf('gridgameid') >= 0) {
              const gridGameId = +params['gridgameid'];
              this.gridGamesDataService.getGridGameByGridGameId(gridGameId).subscribe((data) => {
                this.gridGame = data;
                console.log(this.gridGame.game);
                // console.log('Winning grid boxes: ' + this.gridGame.boxes.filter(z=>z.isWinner).length)
              }, (error) => {
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
