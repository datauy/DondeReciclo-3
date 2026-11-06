import { of, Subject, throwError } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { ClusterContainer, Container } from 'src/app/models/basic_models.model';
import { ApiService } from 'src/app/services/api.service';
import { ClusterModalComponent } from './cluster-modal.component';

describe('ClusterModalComponent', () => {
  let api: jasmine.SpyObj<ApiService>;
  let modal: jasmine.SpyObj<ModalController>;
  let component: ClusterModalComponent;

  beforeEach(() => {
    api = jasmine.createSpyObj('ApiService', ['getClusterContainers']);
    modal = jasmine.createSpyObj('ModalController', ['dismiss']);
    component = new ClusterModalComponent(modal, api);
    component.ids = [1, 2];
    component.count = 2;
  });

  it('loads members on opening and selects a loaded container', () => {
    const result = new Subject<ClusterContainer[]>();
    api.getClusterContainers.and.returnValue(result);
    component.ngOnInit();
    expect(api.getClusterContainers).toHaveBeenCalledWith([1, 2]);
    expect(component.loading).toBe(true);

    const member: ClusterContainer = Object.assign(new Container(), {
      id: 1, sub_program_id: 7, sub_program_name: 'Programa local'
    });
    result.next([member]);
    expect(component.loading).toBe(false);
    expect(component.containers).toEqual([member]);
    component.select(member);
    expect(modal.dismiss).toHaveBeenCalledWith(member);
  });

  it('shows an error and allows retrying', () => {
    spyOn(console, 'error');
    api.getClusterContainers.and.returnValues(throwError(new Error('offline')), of([]));
    component.ngOnInit();
    expect(component.loadFailed).toBe(true);
    expect(component.loading).toBe(false);
    component.loadContainers();
    expect(component.loadFailed).toBe(false);
    expect(api.getClusterContainers.calls.count()).toBe(2);
  });

  it('unsubscribes from member loading on destruction', () => {
    const result = new Subject<ClusterContainer[]>();
    api.getClusterContainers.and.returnValue(result);
    component.ngOnInit();
    component.ngOnDestroy();
    result.next([]);
    expect(component.containers).toEqual([]);
  });
});
