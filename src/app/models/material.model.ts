import { Base } from './base.model';

export class Material extends Base {
    //id is inherited from Resource
    name: string;
    color: string;
    icon: string;
    class: string;
}
