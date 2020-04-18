# Instalación Ionic-base 
Esta app es una versión base para diversos proyectos de Data. Basada en Ionic5, Angular y usando varias otras tecnologías para resolver las necesidades habituales en nuestras apps.

# Incluye

* Menú lateral como componente
* Progresive Web App
* Leaflet OSM, Leaflet Routing Machine, Geolocation
* Busqueda
* Compartir en redes sociales

# Instalación

## Instalar Ionic  

    npm install -g @ionic/cli

## Instalar servidor json de prueba

    npm install json-server
    
## Instalar app

    git clone git@github.com:datauy/ionic-base.git
    cd ionic-base
    npm i

# Usar

    json-server --watch src/assets/db.json &
    ionic serve &