import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { Mapa3Page } from './mapa3.page';

describe('Mapa3Page', () => {
  let component: Mapa3Page;
  let fixture: ComponentFixture<Mapa3Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Mapa3Page ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(Mapa3Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
