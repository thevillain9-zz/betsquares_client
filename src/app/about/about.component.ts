import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { IUsersService } from '../shared/services/users.service.interface';
import { UsersServiceToken } from '../shared/services/users.service.token';
import { IGame } from '../shared/models/IGame';
import { IUser } from '../shared/models/IUser';


@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
    users: IUser[] = [];
    currentUser: IUser;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        @Inject(UsersServiceToken) private usersService: IUsersService) { 
     }

  ngOnInit() {
    if(this.usersService.getCurrentUser() != null) {
        this.currentUser = this.usersService.getCurrentUser();
    }

    // this.usersService.getAllUsers().subscribe(users => { 
    //     this.users = users; 
    // });
  }

}
