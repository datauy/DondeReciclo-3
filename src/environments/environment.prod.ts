export const environment = {
  production: true,
  assets: "assets",
  url: 'https://mobile.dondereciclo.uy',
  backend: "https://api.dondereciclo.uy/api/",
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
    predefinedSearch: [],
    locale: 'es_CO'
  },
  geocoder: 'https://nominatim.openstreetmap.org/',
  pinSaturation: 200,
  apiVersion: '1.3'
};
