import { environment } from '../../environments/environment';
import { Base } from './base.model';

export class Subprogram extends Base {
    //id is inherited from Resource
    subprogram: string;
    subprogram_id: number;
    lat: number;
    long: number;
    location: string;
}