import { Component, Output, Input, OnInit, EventEmitter, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IUser } from '../shared/models/IUser';
import { IUsersService } from '../shared/services/users.service.interface';
import { UsersServiceToken } from '../shared/services/users.service.token';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  environment: String;
  currentUser: IUser;
  @Output() menuToggle = new EventEmitter();

  constructor(private router: Router,
              @Inject(UsersServiceToken) private usersService: IUsersService) {
                if (!environment.production) {
                  this.environment = environment.name;
                }
  }

  ngOnInit() {

    if (this.usersService.getCurrentUser() != null) {
      this.currentUser = this.usersService.getCurrentUser();
    }
    this.usersService.loggedInUserChangeEvent.subscribe(user => this.onUserChanged(user));
  }

  public toggleMenu() {
    if (this.menuToggle !== null) {
      this.menuToggle.emit();
    }
  }

  public logout() {
    this.usersService.logout();
    this.router.navigate(['/home']);
  }

  private onUserChanged(user: IUser) {
    this.currentUser = user;
  }

}
