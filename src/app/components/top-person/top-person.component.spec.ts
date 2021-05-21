import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopPersonComponent } from './top-person.component';

describe('TopPersonComponent', () => {
  let component: TopPersonComponent;
  let fixture: ComponentFixture<TopPersonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopPersonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
