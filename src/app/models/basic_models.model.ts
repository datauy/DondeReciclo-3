import { Base } from './base.model';

export class Material extends Base {
    //id is inherited from Resource
    name: string;
    color: string;
    icon: string;
    class: string;
}
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
    photos: string[];
    address: string;
}

export class ContainerType extends Base {
    //id is inherited from Resource
    name: string;
    icon: string;
}

export class SearchParams extends Base {
    //id is inherited from Resource
    name: string;
    deposition: string;
    type: string;
    material_id: number;
}
