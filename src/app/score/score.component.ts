import { Component, OnInit, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.css']
})
export class ScoreComponent implements OnInit, OnChanges {
    
    readonly scoreBgUpdate: Number;
    isHomeTeamScoreUpdated: Boolean;
    isAwayTeamScoreUpdated: Boolean;

    @Input() awayTeamScore: number;
    @Input() homeTeamScore: number;

    constructor() {
        this.isAwayTeamScoreUpdated = false;
        this.isHomeTeamScoreUpdated = false;
        this.scoreBgUpdate = 11000;
     }

    ngOnInit() { }

    ngOnChanges(changes: SimpleChanges) {
        for(let propName in changes) {
            if(propName === "homeTeamScore"
                && !changes[propName].firstChange
                && changes[propName].previousValue != changes[propName].currentValue) {
                this.isHomeTeamScoreUpdated = true;
                this.isAwayTeamScoreUpdated = false;
                setTimeout(() => {
                    this.isHomeTeamScoreUpdated = false;
                }, this.scoreBgUpdate);
            }
            else if(propName === "awayTeamScore"
                && !changes[propName].firstChange
                && changes[propName].previousValue != changes[propName].currentValue) {
                this.isAwayTeamScoreUpdated = true;
                this.isHomeTeamScoreUpdated = false;
                setTimeout(() => {
                    this.isAwayTeamScoreUpdated = false;
                }, this.scoreBgUpdate);
            }
        }
    }

    
}

