import { Base } from './base.model';

export class Container extends Base {
    //id is inherited from Resource
    program: string;
    program_id: number;
    latitude: number;
    longitude: number;
    location: string;
    type_id: number;
    public: boolean;
    materials: number[];
}
