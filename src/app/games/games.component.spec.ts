import { TestBed, async,  } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule} from '@angular/material';


import { GamesComponent } from './games.component';


describe('AppComponent', () => {
  beforeEach(async(() => {

    // stub UserService for test purposes
    const authenticateionServiceStub = {};

    TestBed.configureTestingModule({
      providers: [
        {provide: AuthenticationService, useValue: authenticateionServiceStub }
      ],
      imports : [ MaterialModule, RouterTestingModule ],
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
