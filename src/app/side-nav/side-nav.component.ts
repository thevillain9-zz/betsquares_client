import { Component, OnInit, ViewChild  } from '@angular/core';
import {MdMenuTrigger} from '@angular/material';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit {

  @ViewChild(MdMenuTrigger) trigger: MdMenuTrigger;

  constructor() { }

  ngOnInit() {
// if(this.trigger  != null) {
//       console.log("open menu");
//       this.trigger.openMenu();
//     }
  }

  ngAfterViewInit() {
    
  }

}
