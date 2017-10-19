import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, Http } from '@angular/http';
import { RouterModule } from '@angular/router';

import { LocationStrategy, HashLocationStrategy} from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule, MatMenuModule, MatSelectModule, MatTableModule, MatSliderModule,
         MatCardModule, MatIconModule, MatToolbarModule, MatButtonModule, MatListModule, MatInputModule } from '@angular/material'


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


import { GridGamesServiceFactory } from './shared/services/grid-games.service.factory';
import { GridGamesService } from './shared/services/grid-games.service';
import { GridGamesServiceToken } from './shared/services/grid-games.service.token';
import { GamesServiceFactory } from './shared/services/games.service.factory';
import { GamesService } from './shared/services/games.service';
import { GamesServiceToken } from './shared/services/games.service.token';
import { IUsersService } from './shared/services/users.service.interface';
import { UsersServiceToken } from './shared/services/users.service.token';
import { UsersServiceFactory } from './shared/services/users.service.factory';

import { NotFoundComponent } from './not-found/not-found.component';
import { RegisterComponent } from './register/register.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { MyGamesComponent } from './my-games/my-games.component';

import {environment} from '../environments/environment';
import { FooterComponent } from './footer/footer.component';
import { GridGameComponent } from './grid-game/grid-game.component';
import { RulesComponent } from './rules/rules.component';

import { BoxUserPipe } from './shared/pipes/box-user-pipe';

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
    FooterComponent,
    GridGameComponent,
    RulesComponent,
    BoxUserPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    FlexLayoutModule.forRoot(),
    MatSidenavModule, MatMenuModule, MatSelectModule, MatTableModule, MatSliderModule, MatCardModule, MatIconModule,
    MatButtonModule, MatToolbarModule, MatListModule, MatInputModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    {
      provide: UsersServiceToken,
      useFactory: UsersServiceFactory,
      deps: [Http]
    },
    {
      provide: GridGamesServiceToken,
      useFactory: GridGamesServiceFactory,
      deps: [Http]
    },
    {
      provide: GamesServiceToken,
      useFactory: GamesServiceFactory,
      deps: [Http]
    }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
