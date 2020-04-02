import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { Mapa2Page } from './mapa2.page';

describe('Mapa2Page', () => {
  let component: Mapa2Page;
  let fixture: ComponentFixture<Mapa2Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Mapa2Page ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(Mapa2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
