import { of, Subject, throwError } from 'rxjs';
import { ClusterContainer, Container, ContainerCluster, Material } from 'src/app/models/basic_models.model';
import { SessionService } from 'src/app/services/session.service';
import { environment } from 'src/environments/environment';
import { ApiService } from './api.service';

describe('Cluster API', () => {
  let api: ApiService;

  beforeEach(() => {
    api = Object.create(ApiService.prototype);
  });

  it('only adds the clustered flag when requested on both bbox endpoints', () => {
    const request = jasmine.createSpyObj('HttpClient', ['get']);
    request.get.and.returnValue(of([]));
    Object.defineProperty(api, 'request', { value: request });
    const bounds = ['-35,-57', '-34,-56'];
    api.getContainers(bounds, true).subscribe();
    api.getContainers4Materials(bounds, 'material_id=1', true).subscribe();
    api.getContainers(bounds).subscribe();
    api.getContainers4Materials(bounds, 'material_id=1').subscribe();
    expect(request.get.calls.argsFor(0)[0]).toContain('&clustered=true');
    expect(request.get.calls.argsFor(1)[0]).toContain('&material_id=1&clustered=true');
    expect(request.get.calls.argsFor(2)[0]).not.toContain('clustered=');
    expect(request.get.calls.argsFor(3)[0]).not.toContain('clustered=');
  });

  it('passes the flag through filtered and unfiltered nearby searches', () => {
    const plain = spyOn(api, 'getContainers').and.returnValue(of([]));
    const filtered = spyOn(api, 'getContainers4Materials').and.returnValue(of([]));
    const session: SessionService = Object.create(SessionService.prototype);
    api.session = session;
    const bounds = ['-35,-57', '-34,-56'];
    session.searchItem = undefined;
    api.loadNearbyContainers(bounds, true);
    expect(plain).toHaveBeenCalledWith(bounds, true);
    session.searchItem = {
      type: 'material_id', id: 1, ids: undefined, name: '', class: '',
      deposition: '', icon: '', color: '', contrast_color: ''
    };
    api.loadNearbyContainers(bounds, true);
    expect(filtered).toHaveBeenCalledWith(bounds, 'material_id=1', true);
  });

  it('formats singles and leaves cluster IDs untouched', () => {
    const format = spyOn(api, 'formatMarker').and.callFake(containers => containers);
    const container = new Container();
    const cluster: ContainerCluster = { cluster: true, latitude: -34, longitude: -56, count: 2, ids: [1, 2] };
    expect(api.formatMapMarkers([container, cluster])).toEqual([container, cluster]);
    expect(format).toHaveBeenCalledWith([container]);
    expect(format.calls.count()).toBe(1);
  });

  it('rejects clusters with incomplete IDs', () => {
    const cluster: ContainerCluster = { cluster: true, latitude: -34, longitude: -56, count: 2, ids: [1] };
    expect(() => api.formatMapMarkers([cluster])).toThrowError('Invalid cluster returned by containers search');
  });

  it('loads batches sequentially and combines members', () => {
    const first = new Subject<ClusterContainer[]>();
    const second: ClusterContainer = Object.assign(new Container(), {
      id: 101, sub_program_id: 8, sub_program_name: 'Segundo programa'
    });
    const request = jasmine.createSpyObj('HttpClient', ['get']);
    request.get.and.returnValues(first, of([second]));
    Object.defineProperty(api, 'request', { value: request });
    const format = spyOn(api, 'formatMarker').and.callFake(containers => containers);
    const ids = Array.from({ length: 101 }, (_, i) => i + 1);
    let result: ClusterContainer[];
    api.getClusterContainers(ids).subscribe(containers => result = containers);
    expect(request.get.calls.count()).toBe(1);
    expect(request.get.calls.first().args[0]).toBe(
      environment.backend + 'cluster_details?version=' + environment.apiVersion + '&container_ids=' + ids.slice(0, 100).join(',')
    );
    const member: ClusterContainer = Object.assign(new Container(), {
      id: 1, sub_program_id: 7, sub_program_name: 'Primer programa'
    });
    first.next([member]);
    first.complete();
    expect(request.get.calls.count()).toBe(2);
    expect(request.get.calls.mostRecent().args[0]).toBe(
      environment.backend + 'cluster_details?version=' + environment.apiVersion + '&container_ids=101'
    );
    expect(result).toEqual([member, second]);
    expect(format.calls.count()).toBe(2);
  });

  it('propagates member fetch errors', () => {
    const request = jasmine.createSpyObj('HttpClient', ['get']);
    request.get.and.returnValue(throwError(new Error('offline')));
    Object.defineProperty(api, 'request', { value: request });
    let error: Error;
    api.getClusterContainers([1]).subscribe(() => fail('unexpected success'), err => error = err);
    expect(error.message).toBe('offline');
  });

  it('formats pin classes while preserving sub-program details', () => {
    const member: ClusterContainer = Object.assign(new Container(), {
      id: 1, main_material: 0, sub_program_id: 7, sub_program_name: 'Programa local'
    });
    const material = new Material();
    material.class = 'plastic';
    const session: SessionService = Object.create(SessionService.prototype);
    session.country = 'Uruguay';
    api.session = session;
    api.materials = { Uruguay: [material] };
    const request = jasmine.createSpyObj('HttpClient', ['get']);
    request.get.and.returnValue(of([member]));
    Object.defineProperty(api, 'request', { value: request });
    let result: ClusterContainer[];
    api.getClusterContainers([1]).subscribe(containers => result = containers);
    expect(result[0].class).toBe('plastic');
    expect(result[0].sub_program_id).toBe(7);
    expect(result[0].sub_program_name).toBe('Programa local');
  });

  it('does not request cluster details for an empty list', () => {
    const request = jasmine.createSpyObj('HttpClient', ['get']);
    Object.defineProperty(api, 'request', { value: request });
    let result: ClusterContainer[];
    api.getClusterContainers([]).subscribe(containers => result = containers);
    expect(result).toEqual([]);
    expect(request.get).not.toHaveBeenCalled();
  });
});
