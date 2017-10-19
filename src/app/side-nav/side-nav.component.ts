import { Input, Output, Component, OnInit, OnDestroy, Inject, EventEmitter} from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { MatMenuTrigger } from '@angular/material';

import { IUser } from '../shared/models/IUser';
import { IUsersService } from '../shared/services/users.service.interface';
import { UsersServiceToken } from '../shared/services/users.service.token';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit {

  @Output() onCloseSideNav = new EventEmitter();
  currentUser: IUser;

  constructor(private router: Router,
              @Inject(UsersServiceToken) private usersService: IUsersService) {
    this.currentUser = usersService.getCurrentUser();
  }

  ngOnInit() {

  }

  public routeAndClose(route: string): void {
    if (this.onCloseSideNav != null) {
        this.onCloseSideNav.emit([]);
    }
    this.router.navigate([route]);

  }

}
