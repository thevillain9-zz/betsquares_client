import { ModuleWithProviders } from '@angular/core'
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './login/login.component';
import { RulesComponent } from './rules/rules.component';
import { GridGameComponent } from './grid-game/grid-game.component';
import { JoinGridComponent } from './join-grid/join-grid.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { RegisterComponent } from './register/register.component';
import { GameComponent } from './game/game.component';
import { GamesComponent } from './games/games.component';
import { MyGamesComponent} from './my-games/my-games.component';


export const appRoutes: Routes = [
    // order matters
    { path: '', component: HomeComponent},
    { path: 'home', component: HomeComponent},
    { path: 'games', component: GamesComponent},
    { path: 'games/:gameid', component: GameComponent},
    { path: 'mygames', component: MyGamesComponent},
    { path: 'gridgame/:gridgameid', component: GridGameComponent},
    { path: 'join/game/:gameid', component: JoinGridComponent},
    { path: 'join/gridIronGame/:gridgameid', component: JoinGridComponent},
    { path: 'join', component: JoinGridComponent},
    { path: 'rules', component: RulesComponent},
    { path: 'login', component: LoginComponent},
    { path: 'register', component: RegisterComponent},
    { path: 'about', component: AboutComponent},
    { path: '**', component: NotFoundComponent},
];

export const appRouting: ModuleWithProviders = RouterModule.forRoot(appRoutes);
