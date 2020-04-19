import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MarcasPage } from './marcas.page';

describe('MarcasPage', () => {
  let component: MarcasPage;
  let fixture: ComponentFixture<MarcasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarcasPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MarcasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
