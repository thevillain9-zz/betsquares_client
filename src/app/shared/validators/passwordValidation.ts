import {AbstractControl} from '@angular/forms';
export class PasswordValidation {

   static MatchPassword(AC: AbstractControl, passwordField: string, passwordMatchField: string, passwordValidationTag: string) {
       const password = AC.get(passwordField).value; // to get value in input tag
       const confirmPassword = AC.get(passwordMatchField).value; // to get value in input tag
        if (password !== confirmPassword) {

            AC.get(passwordMatchField).setErrors({[passwordValidationTag]: true});
        } else {
            return null;
        }
    }
}