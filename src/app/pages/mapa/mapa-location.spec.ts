import { of } from 'rxjs';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { ApiService } from 'src/app/services/api.service';
import { MapService } from 'src/app/services/map.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { SessionService } from 'src/app/services/session.service';
import { MapaPage } from './mapa.page';

describe('Map location', () => {
  let page: MapaPage;
  let map: MapService;
  let geo: jasmine.SpyObj<Geolocation>;
  let notification: jasmine.SpyObj<NotificationsService>;

  beforeEach(() => {
    jasmine.clock().install();
    page = Object.create(MapaPage.prototype);
    map = Object.create(MapService.prototype);
    spyOn(map, 'setUserPosition').and.callFake(position => { map.userPosition = position; });
    page.map = map;
    page.geoLocationActive = false;
    geo = jasmine.createSpyObj('Geolocation', ['getCurrentPosition']);
    Object.defineProperty(page, 'geo', { value: geo });
    notification = jasmine.createSpyObj('NotificationsService', ['closeNotificationId']);
    Object.defineProperty(page, 'notification', { value: notification });
    const api = jasmine.createSpyObj<ApiService>('ApiService', ['getCountryByLocation']);
    api.getCountryByLocation.and.returnValue(of('Uruguay'));
    page.api = api;
    page.session = Object.create(SessionService.prototype);
    spyOn(page.session, 'setCountry');
    spyOn(page, 'loadPosition').and.returnValue(Promise.resolve(true));
  });

  afterEach(() => jasmine.clock().uninstall());

  it('stores the position and loads nearby results after country lookup', async () => {
    geo.getCurrentPosition.and.returnValue(Promise.resolve({
      timestamp: 0,
      coords: { latitude: -34, longitude: -56, accuracy: 1, altitude: null, altitudeAccuracy: null, heading: null, speed: null }
    }));
    page.gotoLocation();
    await Promise.resolve();
    expect(map.setUserPosition).toHaveBeenCalledWith([-34, -56]);
    expect(page.api.getCountryByLocation).toHaveBeenCalledWith([-34, -56]);
    expect(page.loadPosition).toHaveBeenCalledWith(true);
    expect(notification.closeNotificationId).toHaveBeenCalledWith('noLoc');
  });

  it('uses the existing fallback when location permission fails', async () => {
    geo.getCurrentPosition.and.returnValue(Promise.reject(new Error('denied')));
    spyOn(page, 'noLocation');
    page.gotoLocation();
    await Promise.resolve();
    await Promise.resolve();
    expect(page.noLocation).toHaveBeenCalledWith(true);
    expect(page.geoLocationActive).toBe(false);
  });
});
