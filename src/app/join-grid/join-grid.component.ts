import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, ValidatorFn, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Params, Router, RouterStateSnapshot } from '@angular/router';
import { MdSnackBar} from '@angular/material';
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

    setupGridGameForm: FormGroup;
    joinGridIronGameForm: FormGroup;

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
    private _snackbar: MdSnackBar,
    @Inject(GamesServiceToken) private gamesDataService: IGamesService,
    @Inject(GridGamesServiceToken) private gridGamesDataService: IGridGamesService,
    @Inject(UsersServiceToken) private usersService: IUsersService) {
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
      this.setupGridGameForm = this.fb.group({
        'name': [gridGameName, [Validators.required, Validators.minLength(5)]],
        'password': ['', [Validators.required, Validators.minLength(6)]],
        'passwordConfirm': ['', [Validators.required, Validators.minLength(6)]],
        'fee': ['10']
      }, {validator: (x) => PasswordValidation.MatchPassword(x, 'password', 'passwordConfirm', 'validateEqual')});

      this.joinGridIronGameForm = this.fb.group({
        'gridIronGameId': ['test', [Validators.required, Validators.minLength(6)]],
        'joinPassword': ['', [Validators.required, Validators.minLength(6)]],
      });

      this.setupGridGameForm.valueChanges.subscribe(data => this.onValidateGridForm(this.setupGridGameForm, data));
      this.joinGridIronGameForm.valueChanges.subscribe(data => this.onValidateGridForm(this.joinGridIronGameForm, data));

      // resets validation
      this.onValidateGridForm(this.setupGridGameForm);
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
      if (!environment.production) {
        console.log('joinGame('+ step + ',' + isExistingGame + ')');
      }



      if (step === 1) {
        if (isExistingGame) {
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
      // if (step === 2) {
      //   this.step1.active = false;
      //   this.step1.disabled = true;
      //   this.step1.state = StepState.Complete;
      //   this.step1.close();

      //   this.step2.disabled = false;
      //   this.step2.toggle();
      // } else if (step === 3) {
      //   this.step2.active = false;
      //   this.step2.disabled = true;
      //   this.step2.state = StepState.Complete;
      //   this.step2.close();

      //   this.step3.disabled = false;
      //   this.step3.toggle();
      // } else if (step === 4) {
      //   this.step3.active = false;
      //   this.step3.disabled = true;
      //   this.step3.state = StepState.Complete;
      //   this.step3.close();

      //   this.step4.disabled = false;
      //   this.step4.toggle();
      // }
    }

    onSubmit() {
      console.log('on submit');
    }
}
