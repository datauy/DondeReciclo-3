import * as L from 'leaflet';
import { Container, ContainerCluster } from 'src/app/models/basic_models.model';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { MapService } from './map.service';

describe('Map marker loading', () => {
  let service: MapService;
  let render: jasmine.Spy;

  beforeEach(() => {
    service = Object.create(MapService.prototype);
    service.map = Object.create(L.Map.prototype);
    spyOn(service.map, 'invalidateSize');
    render = spyOn(service, 'renderMarkers');
  });

  it('refreshes the map size before rendering and fitting bounds', () => {
    const marker = new Container();
    marker.latitude = -34;
    marker.longitude = -56;
    const fly = spyOn(service, 'flyToBounds');
    service.loadMarkers([marker], true);
    expect(service.map.invalidateSize).toHaveBeenCalledBefore(render);
    expect(render).toHaveBeenCalledBefore(fly);
    expect(fly).toHaveBeenCalledWith([[-34, -56]]);
  });

  it('renders all results without the previous saturation cap', () => {
    const markers = Array.from({ length: environment.pinSaturation + 5 }, () => new Container());
    const layer: L.LayerGroup = Object.create(L.LayerGroup.prototype);
    spyOn(layer, 'addTo');
    spyOn(L, 'layerGroup').and.returnValue(layer);
    const createPin = spyOn(service, 'createPin').and.returnValue(null);
    render.and.callThrough();
    service.loadMarkers(markers, false);
    expect(createPin.calls.count()).toBe(markers.length);
  });

  it('centers on the stored user position when there are no nearby pins', () => {
    service.userPosition = [-34, -56];
    spyOn(service, 'createUserMarker');
    const fly = spyOn(service, 'flyToBounds');
    service.loadMarkers([], true);
    expect(service.createUserMarker).toHaveBeenCalled();
    expect(fly).toHaveBeenCalledWith([[-34, -56]]);
  });

  it('opens the modal with the cluster when its pin is clicked', () => {
    const cluster: ContainerCluster = { cluster: true, latitude: -34, longitude: -56, count: 2, ids: [1, 2] };
    const open = spyOn(service, 'openCluster');
    service.createClusterPin(cluster).fire('click');
    expect(open).toHaveBeenCalledWith(cluster);
  });

  it('selects a container returned by the cluster modal', async () => {
    const cluster: ContainerCluster = { cluster: true, latitude: -34, longitude: -56, count: 2, ids: [1, 2] };
    const member = new Container();
    const modal: HTMLIonModalElement = Object.create(null);
    modal.present = jasmine.createSpy('present').and.returnValue(Promise.resolve());
    modal.onDidDismiss = jasmine.createSpy('onDidDismiss').and.returnValue(Promise.resolve({ data: member }));
    const controller = jasmine.createSpyObj<ModalController>('ModalController', ['create']);
    controller.create.and.returnValue(Promise.resolve(modal));
    Object.defineProperty(service, 'modalController', { value: controller });
    Object.defineProperty(service, '_pinClick', { value: new BehaviorSubject<boolean>(false) });
    await service.openCluster(cluster);
    expect(controller.create.calls.mostRecent().args[0].componentProps).toEqual({ ids: [1, 2], count: 2 });
    expect(modal.present).toHaveBeenCalled();
    expect(service.currentContainer).toBe(member);
  });
});
