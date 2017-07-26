import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GridGameComponent } from './grid-game.component';

describe('GridGameComponent', () => {
  let component: GridGameComponent;
  let fixture: ComponentFixture<GridGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GridGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
