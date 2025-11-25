# Google Maps Microservice

Microservicio de Google Maps adaptado de [@operations/google-maps-service](https://github.com/cryptohumano/Peranto-Uber-Airbn-Microservices/tree/main/services/google-maps).

## Características

- ✅ Compatible con web usando Google Maps JavaScript API
- ✅ Cálculo de rutas con múltiples modos de transporte
- ✅ Búsqueda de lugares con autocompletado
- ✅ Detalles de lugares
- ✅ Manejo de errores robusto
- ✅ Configuración regional (Chile por defecto)

## Uso

```javascript
// Inicializar el servicio
GoogleMapsService.initialize({
    apiKey: 'TU_API_KEY',
    language: 'es',
    region: 'CL'
});

// Calcular una ruta
const route = await GoogleMapsService.calculateRoute({
    origin: 'Santiago, Chile',
    destination: 'Valparaíso, Chile',
    travelMode: 'DRIVING'
});

// Buscar lugares
const places = await GoogleMapsService.searchPlaces('Aeropuerto de Santiago');

// Obtener detalles de un lugar
const details = await GoogleMapsService.getPlaceDetails(placeId);
```

## APIs Requeridas

- Maps JavaScript API
- Directions API
- Places API
- Geocoding API

## Fuente

Basado en: https://github.com/cryptohumano/Peranto-Uber-Airbn-Microservices

