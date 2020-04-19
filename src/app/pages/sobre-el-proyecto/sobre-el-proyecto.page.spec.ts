import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SobreElProyectoPage } from './sobre-el-proyecto.page';

describe('SobreElProyectoPage', () => {
  let component: SobreElProyectoPage;
  let fixture: ComponentFixture<SobreElProyectoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SobreElProyectoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SobreElProyectoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
