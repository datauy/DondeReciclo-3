import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EmpresasPage } from './empresas.page';

describe('EmpresasPage', () => {
  let component: EmpresasPage;
  let fixture: ComponentFixture<EmpresasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpresasPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EmpresasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
