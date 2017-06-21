import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Http } from '@angular/http';
import { AuthenticationService } from '../shared/services/authentication.service';
import { IUser} from '../shared/models/IUser';
import { MdSnackBar} from '@angular/material';
import { ILoginResponse } from '../shared/models/ilogin-response';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading: Boolean = false;
  returnUrl: string;
  isErrorState: Boolean = false;
  errorMessage: String = '';
  formErrors = {
    'username': '',
    'password': ''
  };
  validationMessages = {
    'name': {
      'required':      'UserName is required.',
      'minlength':     'UserName must be at least 5 characters long.',
    },
    'password': {
      'required': 'Password is required.',
      'minlength':     'Password must be at least 6 characters long.'
    }
  };

  constructor(public route: ActivatedRoute, public router: Router, public http: Http,
    public authenticationService: AuthenticationService,
    public fb: FormBuilder,
    private _snackbar: MdSnackBar)
    {
      // reset login status
      this.authenticationService.logout();


  }

  ngOnInit(): void {

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'];
    console.log('Login Return to : ' + this.returnUrl);

    this.buildForm();
  }

  private buildForm(): void {
      this.loginForm = this.fb.group({
        'username': ['', [Validators.required, Validators.minLength(5)]],
        'password': ['', [Validators.required, Validators.minLength(4)]]});

        this.loginForm.valueChanges.subscribe(data => this.onValidateForm(data));
        // resets validation
        this.onValidateForm();
  }

  private onValidateForm(data?: any): boolean {
    let isValidForm = true;
    if (!this.loginForm) {
      return isValidForm;
    }
    const form = this.loginForm;
    const errorFields = [];
    const fields = Object.keys(this.formErrors);

    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];
       // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && !control.valid) {
        const messages = this.validationMessages[field];
        if (messages !== undefined) {
          const fieldErrors = Object.keys(control.errors);
          for (let z = 0; z < fieldErrors.length; z++) {
            this.formErrors[field] += messages[fieldErrors[z]] + ' ';
            errorFields.push(field);
            if (isValidForm) {
              isValidForm = false;
            }
          }
        }
      }
    }
    return isValidForm;
  }

  public onSubmit() {

    // validate form
    const isValidForm = this.onValidateForm();
    console.log('Login isValid=' + isValidForm);

    this.isLoading = true;
    this.authenticationService.login(this.loginForm.value.username, this.loginForm.value.password).subscribe((result) => {
        this.isLoading = false;
        if (result.success) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(result.user));
          localStorage.setItem('currentUser.token', JSON.stringify(result.token));

          if (this.returnUrl !== null && this.returnUrl !== undefined) {
            this.router.navigate([this.returnUrl]);
          } else {
            this.router.navigate(['/']);
          }
        } else {
          this.isErrorState = true;
          this.errorMessage = result.message;
        }
    }, error => {
        this.isLoading = false;
        this.isErrorState = true;
        const response = <ILoginResponse>error;
        if (response) {
          if (response.status === 404) {
            this.errorMessage = response.message;
          }
        }
    });
  }
}