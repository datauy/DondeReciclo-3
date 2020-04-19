import { Base } from './base.model';

export interface Serializer {
    fromJson(json: any): Base;
    toJson(base: Base): any;    
}