import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-games',
  templateUrl: './my-games.component.html',
  styleUrls: ['./my-games.component.css']
})
export class MyGamesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
        // if(this.authenticationService.getCurrentUser() != null)
    // {
    //   this.currentUser = this.authenticationService.getCurrentUser();
    //   this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    //   // load users games
    //   this.gridGamesDataService.getGridGamesByUserId(this.currentUser.userId).subscribe(game3 => {
    //     setTimeout(() => {
    //       this.myGridGames = game3;
    //     }, 2500)
        
    //   }, error => this.router.navigate(['/home']));
    // }

    
  }

}
