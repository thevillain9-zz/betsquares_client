import { Component, OnInit } from '@angular/core';
import { IGame } from '../shared/models/IGame';
import { ActivatedRoute } from '@angular/router';
import { Observable }     from 'rxjs/Observable';

@Component({
  selector: 'app-join-grid',
  templateUrl: './join-grid.component.html',
  styleUrls: ['./join-grid.component.css']
})
export class JoinGridComponent{
    game: IGame;
    is_initial_row_visible: Boolean;
    is_new_game_visibile: Boolean;
    errorMessage: string;

    constructor(private route: ActivatedRoute) {
        this.is_initial_row_visible = true;
        this.is_new_game_visibile = false;
    }

    ngOnInit() {
        this.route.data.forEach((data : {games: Observable<IGame>}) => {
            data.games.subscribe(game => this.game = game, error => this.errorMessage = <any>error);
        })
    }

    loadNewGame() {
        this.is_initial_row_visible = false;
        this.is_new_game_visibile = true;
    }

}