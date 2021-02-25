// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  assets: "assets",
  url: 'http://localhost:8100',
  backend: "http://localhost:3000/api/",
  Uruguay: {
    center: {lat: -34.905897, lng: -56.191406},
    code: 'UY',
    id: 1,
    predefinedSearch: [],
    locale: 'es_UY'
  },
  Colombia: {
    center: {lat: 4.65087958676269, lng: -74.05580210009016},
    code: 'COL',
    id: 2,
    predefinedSearch:[],
    locale: 'es_CO'
  },
  geocoder: 'https://nominatim.openstreetmap.org/',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
