import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinGridComponent } from './join-grid.component';

describe('JoinGridComponent', () => {
  let component: JoinGridComponent;
  let fixture: ComponentFixture<JoinGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoinGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
