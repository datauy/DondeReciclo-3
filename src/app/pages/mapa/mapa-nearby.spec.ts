import { EMPTY, of, Subject, throwError } from 'rxjs';
import { MapContainer } from 'src/app/models/basic_models.model';
import { ApiService } from 'src/app/services/api.service';
import { MapService } from 'src/app/services/map.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { SessionService } from 'src/app/services/session.service';
import { MapaPage } from './mapa.page';

describe('Map nearby searches', () => {
  let page: MapaPage;
  let map: MapService;
  let api: jasmine.SpyObj<ApiService>;
  let notification: jasmine.SpyObj<NotificationsService>;
  let zoom: jasmine.Spy;
  let mapChanges: Subject<boolean>;
  let initialData: Subject<boolean>;
  const bounds = ['-35,-57', '-34,-56'];

  beforeEach(() => {
    page = Object.create(MapaPage.prototype);
    map = Object.create(MapService.prototype);
    map.map = jasmine.createSpyObj('leaflet map', ['getZoom']);
    zoom = map.map.getZoom as jasmine.Spy;
    spyOn(map, 'getBoundingCoords').and.returnValue(bounds);
    spyOn(map, 'loadMarkers');
    mapChanges = new Subject<boolean>();
    Object.defineProperties(map, {
      mapChanged: { value: mapChanges },
      pinClicked: { value: EMPTY },
      zoneClicked: { value: EMPTY },
      userPositionChanged: { value: EMPTY }
    });
    api = jasmine.createSpyObj('ApiService', ['loadNearbyContainers']);
    api.loadNearbyContainers.and.returnValue(of([]));
    initialData = new Subject<boolean>();
    Object.defineProperty(api, 'initialDataLoaded', { value: initialData });
    notification = jasmine.createSpyObj('NotificationsService', ['showNotification', 'closeNotificationId']);
    page.map = map;
    page.api = api;
    page.session = Object.create(SessionService.prototype);
    page.session.isShowSlider = () => Promise.resolve(false);
    page.session.watchSlider = () => {};
    Object.defineProperty(page.session, 'countryChanged', { value: EMPTY });
    Object.defineProperty(page, 'notification', { value: notification });
    Object.defineProperty(page, 'router', { value: { url: '/', events: EMPTY } });
    page.list = 0;
    page.ngOnInit();
  });

  [4, 13, 14, 15].forEach(level => {
    it('requests nearby results at zoom ' + level + ', clustered only below 14', () => {
      zoom.and.returnValue(level);
      mapChanges.next(true);
      expect(api.loadNearbyContainers).toHaveBeenCalledWith(bounds, level < 14);
      expect(map.loadMarkers).toHaveBeenCalledWith([], false);
      expect(notification.showNotification).not.toHaveBeenCalled();
    });
  });

  [[13, 14], [14, 13]].forEach(levels => {
    it('cancels the previous response when zoom changes from ' + levels[0] + ' to ' + levels[1], () => {
      const previous = new Subject<MapContainer[]>();
      const current = new Subject<MapContainer[]>();
      api.loadNearbyContainers.and.returnValues(previous, current);
      zoom.and.returnValue(levels[0]);
      mapChanges.next(true);
      zoom.and.returnValue(levels[1]);
      mapChanges.next(true);
      expect(api.loadNearbyContainers.calls.argsFor(0)).toEqual([bounds, levels[0] < 14]);
      expect(api.loadNearbyContainers.calls.argsFor(1)).toEqual([bounds, levels[1] < 14]);
      previous.next([]);
      expect(map.loadMarkers).not.toHaveBeenCalled();
      current.next([]);
      expect(map.loadMarkers).toHaveBeenCalledTimes(1);
    });
  });

  it('starts location routing only after initial data is loaded', () => {
    const routing = spyOn(page, 'mapaRouter');
    const renderer = jasmine.createSpyObj('Renderer2', ['createText', 'createElement', 'appendChild']);
    Object.defineProperty(page, 'renderer', { value: renderer });
    Object.defineProperty(page, 'stylesDist', { value: { nativeElement: {} } });
    initialData.next(false);
    expect(routing).not.toHaveBeenCalled();
    initialData.next(true);
    expect(routing).toHaveBeenCalled();
  });

  it('reports nearby search errors without showing a zoom warning', () => {
    api.loadNearbyContainers.and.returnValue(throwError(new Error('offline')));
    spyOn(console, 'error');
    zoom.and.returnValue(14);
    mapChanges.next(true);
    expect(notification.showNotification.calls.mostRecent().args[0].id).toBe('nearbyError');
  });
});
