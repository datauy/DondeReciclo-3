import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProgramsPage } from './programs.page';

describe('ProgramsPage', () => {
  let component: ProgramsPage;
  let fixture: ComponentFixture<ProgramsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgramsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProgramsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
