import { Base } from './base.model';

export class Dimension {
  id: number;
  name: string;
  color: string;
  information: string;
  materials: number[];
}
export class Material extends Base {
    //id is inherited from Resource
    name: string;
    color: string;
    contrast_color: string;
    icon: string;
    class: string;
}
export class Weekdays {
    //id is inherited from Resource
    1: string = 'Lunes';
    2: string = 'Martes';
    3: string = 'Miercoles';
    4: string = 'Jueves';
    5: string = 'Viernes';
    6: string = 'Sábado';
    7: string = 'Domingo';
}
export class Container extends Base {
    //id is inherited from Resource
    program_id: number;
    latitude: number;
    longitude: number;
    site: string;
    address: string;
    location: string;
    state: string;
    type_id: number;
    public: boolean;
    materials: number[];
    wastes: number[];
    photos: string[];
    class: string;
    type_icon: string;
    program_icon: string;
    program: string;
    receives: Material[];
    reception_conditions: string;
    receives_no: string;
    schedules: any[];
    main_material: number;
    information: string;
    receives_text: string;
    custom_icon: string;
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
export class Supporters {
  name: string;
  url: string;
}
export class Program extends Base {
  name: string;
  responsable: string;
  responsable_url: string;
  more_info: string;
  reception_conditions: string;
  contact: string;
  information: string;
  benefits: string;
  lifecycle: string;
  receives: string;
  receives_no: string;
  shortname:string;
  logo_url: string;
  materials_arr: number[];
  wastes_arr: number[];
  supporters_arr: Supporters[];
  locations_arr: string[];
  icon: string;
  materials: number[];
  wastes: number[];
  sub_programs_arr: number[];
  sub_programs: number[];
}

export interface SearchItem {
    id: number;
    type: string;
    name: string;
    class: string;
    deposition: string;
    icon: string;
    ids: string;
    color: string;
    contrast_color: string;
}
