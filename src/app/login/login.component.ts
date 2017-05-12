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
  errorMessage: string = "";

  constructor(public route: ActivatedRoute, public router: Router, public http: Http, 
    public authenticationService: AuthenticationService,
    public fb: FormBuilder,
    private _snackbar: MdSnackBar)
    {
      // reset login status
      this.authenticationService.logout();

      // get return url from route parameters or default to '/'
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'];
  }

  ngOnInit() : void {
    this.buildForm();
  }

  private buildForm(): void {
      this.loginForm = this.fb.group({
        "username": ["", Validators.required], 
        "password": ["", Validators.required]});

        this.loginForm.valueChanges.subscribe(data => this.onValidateForm(data));
        // resets validation
        this.onValidateForm();
  }

  private onValidateForm(data?: any) : boolean {
    let isValidForm = true;
    if (!this.loginForm) { return isValidForm; }
    
    const form = this.loginForm;
    let errorFields = [];
    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);

      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        if(messages != undefined) {
          for (const key in control.errors) {
            this.formErrors[field] += messages[key] + ' ';
            errorFields.push(field);
            if(isValidForm) {
              isValidForm = false;
            }
          }
        }
      }
    }
    if(errorFields.length > 0) {
      this.isErrorState = true;
      this.errorMessage = "Please fix the following fields: " + errorFields.join(',');
    }
    else {
      this.isErrorState = false;
      this.errorMessage = "";
    }
      
    return isValidForm;
  }

  public onSubmit() {

    // validate form
    let isValidForm = this.onValidateForm();
    if(!isValidForm) {
      return;
    }

    this.isLoading = true;
    this.authenticationService.login(this.loginForm.value.username, this.loginForm.value.password).subscribe((result)=>
    {
        this.isLoading = false;
        if (result.success) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify(result.user));
          localStorage.setItem('currentUser.token', JSON.stringify(result.token));
          this.router.navigate(['/about']);
        }
        else {
          this.isErrorState = true;
          this.errorMessage = result.message;
        }
    }, error => {
        
        this.isLoading = false;
        this.isErrorState = true;
        let response = <ILoginResponse>error;
        if(response) {
          if(response.status == 404) {
            this.errorMessage = response.message;
          }
        }
    });
  }

  formErrors = {
    'username': '',
    'password': ''
  };
  
  validationMessages = {
    'name': {
      'required':      'UserName is required.',
      'minlength':     'Name must be at least 4 characters long.',
    },
    'password': {
      'required': 'Password is required.'
    }
  };
  
}