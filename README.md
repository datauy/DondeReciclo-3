# Instalación Ionic-base 
Esta app es una versión base para diversos proyectos de Data. Basada en Ionic5 y usando varias otras tecnologías para resolver las necesidades habituales en nuestras apps.

Todo:
* Menú lateral (componente)
* Aplicación web progresiva (PWA)
* Geolocation, Leaflet, Rutes
* Almacenamiento local 
* OAuth
* CRUD/HTTP JSON connection
* Pie de página con publicidad

# Paso seguidos para crear app  
Estos fueron los pasos primeros para la app básica

## Instalar Ionic  
    npm install -g @ionic/cli

## Crear app  
Elegimos template en blanco.

    ionic start ionic-base blank --type=angular  
    cd ionic-base
    
# Instalación

    git clone git@github.com:datauy/ionic-base.git
    cd ionic-base
    npm i
    ionic serve