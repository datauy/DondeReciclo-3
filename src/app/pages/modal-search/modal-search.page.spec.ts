import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalSearchPage } from './modal-search.page';

describe('ModalSearchPage', () => {
  let component: ModalSearchPage;
  let fixture: ComponentFixture<ModalSearchPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalSearchPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalSearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
