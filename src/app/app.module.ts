import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { MaterialModule} from '@angular/material';
//import { FlexLayoutModule } from '@angular/flex-layout';
import { CovalentCoreModule,CovalentLayoutModule, CovalentSearchModule } from '@covalent/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { appRoutes } from './routes';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AboutComponent } from './about/about.component';
import { GameComponent } from './game/game.component';
import { GamesComponent } from './games/games.component';
import { HomeComponent } from './home/home.component';
import { JoinGridComponent } from './join-grid/join-grid.component';
import { LoginComponent } from './login/login.component';
import { ScoreComponent } from './score/score.component';
import { AuthenticationService } from './shared/services/authentication.service';
import { GridGamesService } from './shared/services/grid-games.service';
import { GamesService } from './shared/services/games.service';
import { UsersService } from './shared/services/users.service';
import { NotFoundComponent } from './not-found/not-found.component';
import { RegisterComponent } from './register/register.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { MyGamesComponent } from './my-games/my-games.component';

import {environment} from '../environments/environment';

// import { fakeBackendProvider } from './_helpers/fake-backend';
// import { MockBackend, MockConnection } from '@angular/http/testing';
// import { BaseRequestOptions } from '@angular/http';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AboutComponent,
    GameComponent,
    GamesComponent,
    HomeComponent,
    JoinGridComponent,
    LoginComponent,
    ScoreComponent,
    NotFoundComponent,
    RegisterComponent,
    SideNavComponent,
    MyGamesComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    MaterialModule,
    CovalentCoreModule,
    CovalentLayoutModule,CovalentSearchModule,
    //FlexLayoutModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [AuthenticationService, GridGamesService, GamesService, UsersService, 
    // fakeBackendProvider,
    // MockBackend,
    // BaseRequestOptions
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
 
// TODO:
// use loading of providers dynamically
// http://stackoverflow.com/questions/39942118/how-to-inject-different-service-based-on-certain-build-environment-in-angular2/39942256#39942256