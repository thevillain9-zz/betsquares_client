import { Component, OnInit, ViewChild, Output, EventEmitter  } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import {MdMenuTrigger} from '@angular/material';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit {

  @Output() onCloseSideNav = new EventEmitter();

  constructor(private router: Router) { }

  ngOnInit() {
  }

  public routeAndClose(route: string): void {
    if(this.onCloseSideNav != null) {
        this.onCloseSideNav.emit([]);
    }
    this.router.navigate([route]);

  }

}
