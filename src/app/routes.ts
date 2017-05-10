import { ModuleWithProviders } from '@angular/core'
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './login/login.component';
import { JoinGridComponent } from './join-grid/join-grid.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { RegisterComponent } from './register/register.component';
import { GamesComponent } from './games/games.component';

export const appRoutes: Routes = [
    // order matters
    { path: '', component: HomeComponent},
    { path: 'home', component: HomeComponent},
    { path: 'games', component: GamesComponent},
    // { path: 'games/:gameid', component: GamesComponent},
    { path: 'join/:gameid', component: JoinGridComponent},
    { path: 'login', component: LoginComponent},
    { path: 'register', component: RegisterComponent},
    { path: 'about', component: AboutComponent},
    { path: '**', component: NotFoundComponent},
];

export const appRouting: ModuleWithProviders = RouterModule.forRoot(appRoutes);