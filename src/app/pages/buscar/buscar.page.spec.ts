import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BuscarPage } from './buscar.page';

describe('BuscarPage', () => {
  let component: BuscarPage;
  let fixture: ComponentFixture<BuscarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuscarPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BuscarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
