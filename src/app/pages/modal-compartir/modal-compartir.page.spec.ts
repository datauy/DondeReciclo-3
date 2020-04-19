import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalCompartirPage } from './modal-compartir.page';

describe('ModalCompartirPage', () => {
  let component: ModalCompartirPage;
  let fixture: ComponentFixture<ModalCompartirPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCompartirPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalCompartirPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
