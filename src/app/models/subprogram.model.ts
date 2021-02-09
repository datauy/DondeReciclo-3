export interface Subprogram {
  id: number;
  name: string;
  full_name: string;
  program_id: number;
  program_icon: string;
  program: string;
  email: string;
  phone: string,
  state: string,
  city: string,
  neighbor: string,
  address: string,
  reception_conditions: string,
  icon: string,
  locations: string[],
  receives: string,
  zone: {
    distance: number,
    is_route:  boolean,
    location: any,
    name: string,
    pick_up_type: string
  }
}
