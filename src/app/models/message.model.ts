export interface Message {
  id: string;
  type: string;
  title: string;
  class: string;
  note: string;
  link?: string;
  link_title?: string;
  link_params?: object;
}
