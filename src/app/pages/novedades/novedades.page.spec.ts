import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NovedadesPage } from './novedades.page';

describe('NovedadesPage', () => {
  let component: NovedadesPage;
  let fixture: ComponentFixture<NovedadesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NovedadesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NovedadesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
