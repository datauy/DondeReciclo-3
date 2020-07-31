import { environment } from './../../environments/environment';
import { Base } from './base.model';

export class News extends Base {
    //id is inherited from Resource
    title: string;
    summary: string;
    information: string;
    images: string;
    created_at: string;
    video: string;
}
