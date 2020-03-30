import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidemenuPage } from './sidemenu.page';

describe('SidemenuPage', () => {
  let component: SidemenuPage;
  let fixture: ComponentFixture<SidemenuPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidemenuPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidemenuPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});