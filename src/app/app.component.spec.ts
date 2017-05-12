import { TestBed, async,  } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule} from '@angular/material';
import { CovalentCoreModule,CovalentLayoutModule, CovalentSearchModule } from '@covalent/core';

import { HeaderComponent } from './header/header.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { AppComponent } from './app.component';

import { AuthenticationService } from './shared/services/authentication.service';

describe('AppComponent', () => {
  beforeEach(async(() => {

    // stub UserService for test purposes
    const authenticateionServiceStub = {};

    TestBed.configureTestingModule({
      providers: [
        {provide: AuthenticationService, useValue: authenticateionServiceStub }
      ],
      imports : [CovalentCoreModule, CovalentLayoutModule, MaterialModule.forRoot(), RouterTestingModule ],
      declarations: [
        SideNavComponent,
        HeaderComponent,
        AppComponent
      ],
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
