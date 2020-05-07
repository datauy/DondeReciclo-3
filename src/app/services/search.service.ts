import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';

import {HttpClient} from '@angular/common/http';

import {AutoCompleteService} from 'ionic4-auto-complete';

@Injectable()
export class SearchService implements AutoCompleteService {
  labelAttribute = 'name';
  formValueAttribute = 'name';

  constructor(private http:HttpClient) {

  }

  getResults(keyword:string) {
     if (!keyword || keyword.length < 2) { return false; }

     return this.http.get('https://restcountries.eu/rest/v2/name/' + keyword).pipe(map(
        (result: any[]) => {
           console.log(result)
           return result.filter(
              (item) => {
                 return item.name.toLowerCase().startsWith(
                    keyword.toLowerCase()
                 );
              }
           );
        }
     ));
  }
}
