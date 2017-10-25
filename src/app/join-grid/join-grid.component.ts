import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, ValidatorFn, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Params, Router, RouterStateSnapshot } from '@angular/router';
import { MatStep, MatHorizontalStepper } from '@angular/material/stepper'
import { MatSnackBar} from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { IGridGame } from '../shared/models/igrid-game';
import { IGame } from '../shared/models/igame';
import { IUser } from '../shared/models/iuser';
import { IGridBox } from '../shared/models/igrid-box';
import { IGridGamesService } from '../shared/services/grid-games.service.interface';
import { GridGamesServiceToken } from '../shared/services/grid-games.service.token';
import { IUsersService } from '../shared/services/users.service.interface';
import { UsersServiceToken } from '../shared/services/users.service.token';
import { IGamesService } from '../shared/services/games.service.interface';
import { GamesServiceToken } from '../shared/services/games.service.token';
import { PasswordValidation } from '../shared/validators/passwordValidation';

@Component({
  selector: 'app-join-grid',
  templateUrl: './join-grid.component.html',
  styleUrls: ['./join-grid.component.css']
})
export class JoinGridComponent implements OnInit {

    @ViewChild('step1') step1: MatStep;
    @ViewChild('step2') step2: MatStep;
    @ViewChild('step3') step3: MatStep;
    @ViewChild('step4') step4: MatStep;
    @ViewChild('stepperer') stepper: MatHorizontalStepper;
    initialGameForm: FormGroup;
    setupGridGameForm: FormGroup;
    joinGridIronGameForm: FormGroup;
    secondGameForm: FormGroup;
    squaresGameForm: FormGroup;

    gameLabel: String = 'Game';
    isErrorState: Boolean = false;
    errorMessage = '';
    isNewGridVisible: Boolean = false;
    isJoinGridVisible: Boolean = false;
    isSaving: Boolean = false;
    maxSquaresAvailable: Number = 100;
    selectedSquares: Number = 1;
    game: IGame;
    currentUser: IUser;
    gridIronGame: IGridGame;

    selectedStep: Number;

    formErrors = {
      'name': '',
      'password': '',
      'passwordConfirm': '',
      'fee': '',
      'gridIronGameId' : '',
      'joinPassword' : ''
    };

  validationMessages = {
    'name': {
      'required': 'name is required.',
      'minlength': '6 character minimum',
    },
    'password': {
      'required': 'password is required.',
      'minlength': '6 character minimum',
      'validateEqual': 'passwords do not match'
    },
    'passwordConfirm': {
      'required': 'password is required.',
      'validateEqual': 'passwords do not match',
      'minlength': '6 character minimum',
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
    @Inject(GamesServiceToken) private gamesDataService: IGamesService,
    @Inject(GridGamesServiceToken) private gridGamesDataService: IGridGamesService,
    @Inject(UsersServiceToken) private usersService: IUsersService,
    private _snackbar: MatSnackBar) {
  }

    ngOnInit() {
      // get current user
      this.currentUser = this.usersService.getCurrentUser();
      if (this.currentUser === undefined || this.currentUser === null) {
          // redirect to login
          this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.routerState.snapshot.url }});
      }

      // validate parameters
      this.route.params.subscribe((params: Params) => {
            const keyParams = Object.keys(params);
            if (keyParams.includes('gridgameid')) {
              const gridGameId = +params['gridgameid'];
              this.initializeWizard();
            } else if (keyParams.indexOf('gameid') >= 0) {
              const gameId = +params['gameid'];
              this.gamesDataService.getGame(gameId).subscribe((data) => {
                this.game = data;
                if (this.game === null || this.game === undefined) {
                  // redirect to select a game
                  this.router.navigate(['/games']);
                } else {
                  this.initializeWizard();
                }
              }, (error) => {
                console.log('JoinGrid Error:' + error);
                // redirect to select a game
                this.router.navigate(['/games']);
              });
            } else {
              console.log('JoinGrid Error: lack of parameters: ' + keyParams);
              this.router.navigate(['/games']);
            }
        });
    }

    private initializeWizard(): void {
      // Initialize Form
      this.buildForm();

      // Initialize stepper state
    }

    private buildForm(): void {
      const tempDate = new Date(this.game.gameDate);
      const gridGameName = this.currentUser.firstName + '\'s ' + this.game.awayTeam.shortName + ' vs ' +
                           this.game.homeTeam.shortName + ' Game on ' + tempDate.toLocaleDateString();
      this.initialGameForm = this.fb.group({});
      this.initialGameForm.setErrors({'nextGame': false})
      this.squaresGameForm = this.fb.group({});
      this.secondGameForm = this.fb.group({});
      this.setupGridGameForm = this.fb.group({
        'name': [gridGameName, [Validators.required, Validators.minLength(5)]],
        'password': ['', [Validators.required, Validators.minLength(6)]],
        'passwordConfirm': ['', [Validators.required, Validators.minLength(6)]],
        'fee': ['10']
      }, {validator: (x) => PasswordValidation.MatchPassword(x, 'password', 'passwordConfirm', 'validateEqual')});

      this.joinGridIronGameForm = this.fb.group({
        'gridIronGameId': ['tester123', [Validators.required, Validators.minLength(6)]],
        'joinPassword': ['', [Validators.required, Validators.minLength(6)]],
      });

      // this.setupGridGameForm.valueChanges.subscribe(data => this.onValidateGridForm(this.setupGridGameForm, data));
      // this.joinGridIronGameForm.valueChanges.subscribe(data => this.onValidateGridForm(this.joinGridIronGameForm, data));

      // resets validation
      // this.onValidateGridForm(this.setupGridGameForm);
  }

  private onStepperChange() {
    // console.log('CurrentStep:' + this.stepper.selectedIndex);
  }

  private onValidateGridForm(formGroup: FormGroup, data?: any): boolean {
    let isValidForm = true;
    if (formGroup === null) {
      return false;
    }
    const errorFields = [];
    const keys = Object.keys(this.formErrors);

    for (let i = 0; i < keys.length; i++) {
      const field = keys[i];
      // clear previous error message (if any)
      this.formErrors[field] = '';

      const control = formGroup.get(field);

      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        if (messages !== undefined) {
          for (const key in control.errors) {

            if (messages[key] !== undefined && messages[key] !== null) {
              this.formErrors[field] += messages[key];
              errorFields.push(field);
              if (isValidForm) {
                isValidForm = false;
              }
              console.log('error in  form' + field);
              break;
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
        if (isExistingGame) {
          this.isJoinGridVisible = true;
          this.isNewGridVisible = false;
        } else {
          this.isNewGridVisible = true;
          this.isJoinGridVisible = false;
        }
        this.onAdvanceToStep(2);
      } else if (step === 2) {
        if (this.isNewGridVisible) {
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
          const gridIronGameId = this.joinGridIronGameForm.controls['gridIronGameId'].value;
          const joinPassword = this.joinGridIronGameForm.controls['joinPassword'].value;
          this.gridGamesDataService.getGridGameByGridGameId(parseInt(gridIronGameId, 10), joinPassword).subscribe((data: any) => {
            this.onAdvanceToStep(3);
          }, (error) => {
            this.onAdvanceToStep(3);
          });
        }
      } else if (step === 3 ) {
        this.isSaving = true;
        this.onAdvanceToStep(4);
        console.log('saving....');
        setTimeout(() => {
          console.log('save finished');
          // save done
          this.isSaving = false;
        }, 2000);
      } else if (step === 4) {
        console.log('step 4!');
      }
    }

    onAdvanceToStep(step) {
      if (step === 2) {
        this.initialGameForm.clearValidators();
        this.initialGameForm.updateValueAndValidity();
        this.secondGameForm = this.isJoinGridVisible ? this.joinGridIronGameForm : this.setupGridGameForm;
        this.secondGameForm.valueChanges.subscribe(data => this.onValidateGridForm(this.secondGameForm, data));
        this.onValidateGridForm(this.secondGameForm);

        this.step1.completed = true;
        this.step2.select();
      } else if (step === 3) {
        this.step3.select();
      } else if (step === 4) {
      }
    }

    onSubmit() {
      console.log('on submit');
    }
}
