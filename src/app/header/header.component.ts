import { Component, Output, OnInit,EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IUser } from '../shared/models/IUser';
import { AuthenticationService } from '../shared/services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  currentUser: IUser;

  constructor(private router: Router, 
              private authenticationService: AuthenticationService) { }

  ngOnInit() {

    if (this.authenticationService.getCurrentUser() != null) {
      this.currentUser = this.authenticationService.getCurrentUser();
    }
    this.authenticationService.userChangeEvent.subscribe(user => this.onUserChanged(user));
  }

  public logout(){
    this.authenticationService.logout();
    this.router.navigate(['/home']);
  }

  private onUserChanged(user: IUser) {
    this.currentUser = user;
  }

}
