import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { UsersService } from '../shared/services/users.service'
import { AuthenticationService } from '../shared/services/authentication.service'
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
        private userService: UsersService,
        private authenticationService: AuthenticationService) { 

        
     }

  ngOnInit() {
    if(this.authenticationService.getCurrentUser() != null) {
        this.currentUser = this.authenticationService.getCurrentUser();
    }

    this.userService.getAll().subscribe(users => { 
        this.users = users; 
    });
    
  }

}
