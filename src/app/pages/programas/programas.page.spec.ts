import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProgramasPage } from './programas.page';

describe('ProgramasPage', () => {
  let component: ProgramasPage;
  let fixture: ComponentFixture<ProgramasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgramasPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProgramasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
