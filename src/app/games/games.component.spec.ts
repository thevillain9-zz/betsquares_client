import { TestBed, async,  } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule} from '@angular/material';
import { CovalentCoreModule,CovalentLayoutModule, CovalentSearchModule } from '@covalent/core';

import { GamesComponent } from './games.component';

import { AuthenticationService } from '../shared/services/authentication.service';

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
        GamesComponent
      ],
    }).compileComponents();
  }));

  it('should create', async(() => {
    const fixture = TestBed.createComponent(GamesComponent);
    const gamesComponent = fixture.debugElement.componentInstance;
    expect(gamesComponent).toBeTruthy();
  }));
});
