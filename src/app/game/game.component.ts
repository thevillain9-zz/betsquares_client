import { Input, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params} from '@angular/router';
import { Observable }     from 'rxjs/Observable';
import { GamesService } from '../shared/services/games.service';
import { GridGamesService } from '../shared/services/grid-games.service';
import { IGame } from '../shared/models/IGame';

@Component ({
    selector: 'app-game',
    templateUrl: 'game.component.html',
    styleUrls: ['game.component.css']
})

export class GameComponent implements OnInit {
    
    @Input() game: IGame;

    constructor(private route: ActivatedRoute,
        private router: Router,
        private gamesService: GamesService,
        private gridGamesService: GridGamesService) {
    }

    ngOnInit() {

        // Load game
        this.route.params.subscribe((params: Params) => {
            let gameId = params['gameid'];
            this.loadGame(gameId);
        });
    }

    loadGame(gameId) {
        this.gamesService.getGame(gameId).forEach((data : IGame) => {
            this.game = data;
        });
    }

    // loadAvailableGridGames(gameId) {
    //     this.gridGamesService.getGridGamesByGameId(gameId).forEach((data : {items: Observable<any>}) => {
    //         console.log(data);

    //     });
    // }
}