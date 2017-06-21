import { Component, OnInit, ViewChild,  } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, ValidatorFn, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Params, Router, RouterStateSnapshot } from '@angular/router';
import { MdSnackBar} from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { IStepChangeEvent, StepState, TdStepComponent } from '@covalent/core';

import { IGridGame } from '../shared/models/igrid-game';
import { IGame } from '../shared/models/igame';
import { IUser } from '../shared/models/iuser';
import { IGridBox } from '../shared/models/igrid-box';
import { GamesService } from '../shared/services/games.service';
import { GridGamesService } from '../shared/services/grid-games.service';
import { AuthenticationService } from '../shared/services/authentication.service';

@Component({
  selector: 'app-join-grid',
  templateUrl: './join-grid.component.html',
  styleUrls: ['./join-grid.component.css']
})
export class JoinGridComponent implements OnInit {

    setupGridGameForm: FormGroup;
    joinGridIronGameForm: FormGroup;
    @ViewChild('step1') step1: TdStepComponent;
    @ViewChild('step2') step2: TdStepComponent;
    @ViewChild('step3') step3: TdStepComponent;
    @ViewChild('step4') step4: TdStepComponent;
    gameLabel: String = 'Game';
    isErrorState: Boolean = false;
    errorMessage = '';
    isNewGridVisible: Boolean = false;
    isJoinGridVisible: Boolean = false;
    maxSquaresAvailable: Number = 100;
    selectedSquares: Number = 1;
    game: IGame;
    currentUser: IUser;
    gridIronGame: IGridGame;

    formErrors = {
      'name': '',
      'password': '',
      'passwordConfirm': '',
      'fee': ''
    };

  validationMessages = {
    'name': {
      'required': 'name is required.',
      'minlength': '6 character minimum',
    },
    'password': {
      'required': 'password is required.',
      'minlength': '6 character minimum',
      'passwordRequirements': '6 character minimum + alphanumeric characters'
    },
    'passwordConfirm': {
      'validateEqual': 'passwords do not match'
    },
    'fee': {
      'pattern': 'Fee must be a positive number'
    },
    'joinPassword': {
      'required': 'password is required.',
    },
    'gridIronGameId': {
      'required': 'password is required.',
    },
  };


    constructor(private route: ActivatedRoute,
    private router: Router,
    public fb: FormBuilder,
    private _snackbar: MdSnackBar,
    private gamesService: GamesService,
    private gridGamesDataService: GridGamesService,
    private authenticationService: AuthenticationService
    ) {
    }

    ngOnInit() {

      // get current user
      this.currentUser = this.authenticationService.getCurrentUser();
      if (this.currentUser === undefined || this.currentUser === null) {
          // redirect to login
          this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.routerState.snapshot.url }});
      }

      // validate parameters
      this.route.params.subscribe((params: Params) => {
            const gameId = params['gameid'];
            this.gamesService.getGame(gameId).subscribe((data: IGame) => {
              this.game = data;
              this.initializeWizard();
            }, (error) => {

              // redirect to select a game
              this.router.navigate(['/games']);
            });
        });
    }

    private initializeWizard(): void {
      // Initialize Form
      this.buildForm();

      // Initialize stepper state
      this.step1.active = true;
      const disableSteps = [ this.step2, this.step3, this.step4];
      disableSteps.forEach(step => {
        step.active = false;
        step.disabled = true;
        step.state = StepState.None;
      });
    }

    private buildForm(): void {
      const tempDate = new Date(this.game.gameDate);
      console.log(tempDate.toDateString());
      const gridGameName = this.currentUser.firstName + '\'s ' + this.game.awayTeam.shortName + ' vs ' +
                           this.game.homeTeam.shortName + ' Game on ' + tempDate.toLocaleDateString();
      this.setupGridGameForm = this.fb.group({
        'name': [gridGameName, [Validators.required, Validators.minLength(5)]],
        'password': ['', [Validators.required, Validators.minLength(5)]],
        'passwordConfirm': ['', [Validators.required, this.passwordMatchValidate(() => {
          if (this.setupGridGameForm != null && this.setupGridGameForm.controls != null) {
            return this.setupGridGameForm.controls['password'].value;
          } else {
            return null;
          }
        })]],
        'fee': ['10']
      });

      this.joinGridIronGameForm = this.fb.group({
        'gridIronGameId': ['',[Validators.required]],
        'joinPassword': ['',[Validators.required]],
      });

      this.setupGridGameForm.valueChanges.subscribe(data => this.onValidateSetupGridForm(data));

      // resets validation
      this.onValidateSetupGridForm();
  }

  passwordValidation(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: Boolean} => {
      const pwd = control.value;
      return {'passwordRequirements': true};
    };
  }

  passwordMatchValidate(getActualValue: () => string): ValidatorFn {
    return (control: AbstractControl): {[key: string]: Boolean} => {
      const matchPassword = control.value;
      const actualPassword = getActualValue();

      // value not equal
      if (matchPassword !== actualPassword) {
        return {
          'validateEqual': false
        };
      } else {
          return null;
      }
    };
}

  private onValidateSetupGridForm(data?: any): boolean {
    let isValidForm = true;
    if (!this.setupGridGameForm) {
      return isValidForm;
    }
    const form = this.setupGridGameForm;
    const errorFields = [];
    for (const field in this.formErrors) {

      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);

      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        if (messages !== undefined) {
          for (const key in control.errors) {
            if(messages[key] !== undefined && messages[key] !== null) {
              this.formErrors[field] += messages[key] + ' ';
              errorFields.push(field);
              if (isValidForm) {
                isValidForm = false;
              }
            }
          }
        }

      }
    }
    if (errorFields.length > 0) {
      this.isErrorState = true;
      this.errorMessage = 'Please fix the following fields: ' + errorFields.join(',');
    } else {
      this.isErrorState = false;
      this.errorMessage = '';
    }

    return isValidForm;
  }

    joinGame(step: Number, isExistingGame: Boolean) {
      if (step === 1) {
        if(isExistingGame) {
          this.isJoinGridVisible = true;
        } else {
          this.isNewGridVisible = true;
        }
        this.onAdvanceToStep(2);
      } else if (step === 2) {
        // hide cards
        this.isJoinGridVisible = false;
        this.isNewGridVisible = false;
        if (!isExistingGame) {
          // save new grid game
          this.gridIronGame = <IGridGame>{
            'name': <String>this.setupGridGameForm.controls['name'].value,
            'password': <String>this.setupGridGameForm.controls['password'].value,
            'owner': this.currentUser,
            'game': this.game,
            'gridGameId' : -1,
            'boxes' : null
          };
          this.onAdvanceToStep(3);
        } else {
          // validate is valid gridIron game
          let gridIronGameId = this.joinGridIronGameForm.controls['gridIronGameId'].value;
          let joinPassword = this.joinGridIronGameForm.controls['joinPassword'].value;
          this.gridGamesDataService.getGridGameByGridGameId(parseInt(gridIronGameId), joinPassword).subscribe((data: any) => {
            this.onAdvanceToStep(3);
          }, (error) => {
            this.onAdvanceToStep(3);
          });
        }
      } else if (step === 3 ) {

      }
    }

    validate

    onAdvanceToStep(step) {
      if(step === 2) {
        this.step1.active = false;
        this.step1.disabled = true;
        this.step1.state = StepState.Complete;
        this.step1.close();

        this.step2.disabled = false;
        this.step2.toggle();
      } else if (step === 3) {
        this.step2.active = false;
        this.step2.disabled = true;
        this.step2.state = StepState.Complete;
        this.step2.close();

        this.step3.disabled = false;
        this.step3.toggle();
      } else if (step === 4) {
        this.step3.active = false;
        this.step3.disabled = true;
        this.step3.state = StepState.Complete;
        this.step3.close();

        this.step4.disabled = false;
        this.step4.toggle();
      }
    }

    onSubmit() {
      console.log('on submit');
    }
}
