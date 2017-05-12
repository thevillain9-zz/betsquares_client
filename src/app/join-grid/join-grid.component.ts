import { Component, OnInit, ViewChild } from '@angular/core';
import { IGame } from '../shared/models/IGame';
import { ActivatedRoute } from '@angular/router';
import { Observable }     from 'rxjs/Observable';
import { IStepChangeEvent, StepState, TdStepComponent } from '@covalent/core';

@Component({
  selector: 'app-join-grid',
  templateUrl: './join-grid.component.html',
  styleUrls: ['./join-grid.component.css']
})
export class JoinGridComponent{
    game: IGame;

    @ViewChild('step1') step1: TdStepComponent;
    @ViewChild('step2') step2: TdStepComponent;

    isStep1Active: Boolean = true;
    isStep2Active: Boolean = false;
    isStep3Active: Boolean = false;
    step1State: StepState = StepState.None;
    step2State: StepState = StepState.None;
    step3State: StepState = StepState.None;

    constructor(private route: ActivatedRoute) {
    }

    ngOnInit() {
        // this.route.data.forEach((data : {games: Observable<IGame>}) => {
        //     data.games.subscribe(game => this.game = game, error => this.errorMessage = <any>error);
        // })
    }

    loadNewGame() {
        //this.step1State = StepState.Complete;
        this.isStep1Active = false;
        this.step1.close();
        this.isStep2Active = true;
        this.step2.stepActions = 
    }

    onStepChanged(event: IStepChangeEvent) {
            console.log("onStepChanged: " + event.newStep.active);
    }

}