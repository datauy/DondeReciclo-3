import { environment } from './../../environments/environment';
import { Base } from './base.model';

export class Novedad extends Base {
    //id is inherited from Resource
    title: string;
    body: string;
    img: string;
}