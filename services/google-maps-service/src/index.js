/**
 * Google Maps Microservice
 * Adaptado de @operations/google-maps-service
 * Compatible con web usando Google Maps JavaScript API
 */

(function(global) {
    'use strict';

    // Configuración global
    let globalConfig = null;
    let googleMapsLoadingPromise = null;

    /**
     * Inicializa el microservicio de Google Maps
     * @param {Object} config - Configuración con API key y opciones regionales
     * @param {string} config.apiKey - API key de Google Maps
     * @param {string} [config.language='es'] - Idioma para respuestas
     * @param {string} [config.region='CL'] - Código de región
     */
    function initialize(config) {
        globalConfig = {
            apiKey: config.apiKey,
            language: config.language || 'es',
            region: config.region || 'CL'
        };

        // Cargar el script de Google Maps
        loadGoogleMapsScript(
            globalConfig.apiKey,
            globalConfig.language,
            globalConfig.region
        ).catch((error) => {
            console.error('Error inicializando Google Maps:', error);
        });
    }

    /**
     * Carga el script de Google Maps dinámicamente
     * @param {string} apiKey - API key de Google Maps
     * @param {string} language - Idioma
     * @param {string} region - Región
     * @returns {Promise<void>}
     */
    function loadGoogleMapsScript(apiKey, language = 'es', region = 'CL') {
        // Si ya está cargada, resolver inmediatamente
        if (window.google && window.google.maps) {
            return Promise.resolve();
        }

        // Si ya hay una carga en progreso, retornar esa promesa
        if (googleMapsLoadingPromise) {
            return googleMapsLoadingPromise;
        }

        // Verificar si ya existe un script de Google Maps
        const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
        if (existingScript) {
            // Esperar a que el script existente se cargue
            googleMapsLoadingPromise = new Promise((resolve) => {
                const checkGoogle = setInterval(() => {
                    if (window.google && window.google.maps) {
                        clearInterval(checkGoogle);
                        resolve();
                    }
                }, 100);
                
                // Timeout después de 10 segundos
                setTimeout(() => {
                    clearInterval(checkGoogle);
                    resolve();
                }, 10000);
            });
            return googleMapsLoadingPromise;
        }

        // Crear nueva promesa de carga
        googleMapsLoadingPromise = new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&language=${language}&region=${region}`;
            script.defer = true;
            script.id = 'google-maps-script';
            
            script.onload = () => {
                const checkInterval = setInterval(() => {
                    if (window.google?.maps) {
                        clearInterval(checkInterval);
                        if (window.google.maps.places) {
                            resolve();
                        } else {
                            console.warn('Places API no está disponible. Asegúrate de que Places API esté habilitada.');
                            resolve();
                        }
                    }
                }, 50);
                
                setTimeout(() => {
                    clearInterval(checkInterval);
                    if (window.google?.maps) {
                        resolve();
                    } else {
                        reject(new Error('Google Maps no se inicializó correctamente después de 10 segundos'));
                    }
                }, 10000);
            };
            
            script.onerror = () => {
                googleMapsLoadingPromise = null;
                reject(new Error('Error cargando Google Maps API. Verifica tu API key y que las APIs estén habilitadas.'));
            };
            
            document.head.appendChild(script);
        });

        return googleMapsLoadingPromise;
    }

    /**
     * Mapea el modo de viaje
     */
    function mapTravelMode(mode) {
        const modeMap = {
            'DRIVING': google.maps.TravelMode.DRIVING,
            'WALKING': google.maps.TravelMode.WALKING,
            'BICYCLING': google.maps.TravelMode.BICYCLING,
            'TRANSIT': google.maps.TravelMode.TRANSIT
        };
        return modeMap[mode] || google.maps.TravelMode.DRIVING;
    }

    /**
     * Calcula una ruta entre dos puntos
     * @param {Object} options - Opciones de origen, destino y modo de viaje
     * @param {string|Object} options.origin - Origen como string o coordenadas {lat, lng}
     * @param {string|Object} options.destination - Destino como string o coordenadas {lat, lng}
     * @param {string} [options.travelMode='DRIVING'] - Modo de transporte
     * @returns {Promise<Object|null>} Información de la ruta o null si hay error
     */
    async function calculateRoute(options) {
        if (!globalConfig) {
            throw new Error('Google Maps no está inicializado. Llama a initialize() primero.');
        }

        // Esperar a que Google Maps esté cargado
        await loadGoogleMapsScript(
            globalConfig.apiKey,
            globalConfig.language,
            globalConfig.region
        );

        if (!window.google || !window.google.maps) {
            console.error('Google Maps API no está cargada');
            return null;
        }

        if (!window.google.maps.DirectionsService) {
            console.error('Directions Service no está disponible. Habilita Directions API en Google Cloud Console.');
            return null;
        }

        try {
            const directionsService = new window.google.maps.DirectionsService();

            const request = {
                origin: typeof options.origin === 'string' 
                    ? options.origin 
                    : new window.google.maps.LatLng(options.origin.lat, options.origin.lng),
                destination: typeof options.destination === 'string'
                    ? options.destination
                    : new window.google.maps.LatLng(options.destination.lat, options.destination.lng),
                travelMode: mapTravelMode(options.travelMode || 'DRIVING'),
                provideRouteAlternatives: options.alternatives || false,
                unitSystem: google.maps.UnitSystem.METRIC
            };

            return new Promise((resolve) => {
                directionsService.route(request, (result, status) => {
                    if (status === window.google.maps.DirectionsStatus.OK && result) {
                        const route = result.routes[0];
                        if (route.legs && route.legs.length > 0) {
                            const leg = route.legs[0];
                            
                            if (leg.distance && leg.duration) {
                                const distance = leg.distance.value / 1000;
                                const duration = leg.duration.value / 60;

                                resolve({
                                    distance,
                                    duration,
                                    distanceText: leg.distance.text,
                                    durationText: leg.duration.text,
                                    route: result
                                });
                                return;
                            }
                        }
                    }
                    
                    console.error('Error calculando ruta:', status);
                    if (status === window.google.maps.DirectionsStatus.REQUEST_DENIED) {
                        console.error('La API key no tiene permisos. Habilita Directions API en Google Cloud Console.');
                    } else if (status === window.google.maps.DirectionsStatus.ZERO_RESULTS) {
                        console.error('No se encontró ruta entre los puntos especificados.');
                    } else if (status === window.google.maps.DirectionsStatus.NOT_FOUND) {
                        console.error('Uno o ambos puntos de origen/destino no se encontraron.');
                    }
                    
                    resolve(null);
                });
            });
        } catch (error) {
            console.error('Error al calcular ruta:', error);
            return null;
        }
    }

    /**
     * Busca lugares usando autocompletado
     * @param {string} query - Texto de búsqueda
     * @returns {Promise<Array>} Lista de predicciones de lugares
     */
    async function searchPlaces(query) {
        if (!globalConfig) {
            throw new Error('Google Maps no está inicializado. Llama a initialize() primero.');
        }

        await loadGoogleMapsScript(
            globalConfig.apiKey,
            globalConfig.language,
            globalConfig.region
        );

        if (!window.google || !window.google.maps || !window.google.maps.places) {
            console.error('Google Maps Places API no está cargada');
            return [];
        }

        return new Promise((resolve) => {
            const service = new window.google.maps.places.AutocompleteService();
            service.getPlacePredictions(
                {
                    input: query,
                    language: globalConfig.language,
                    region: globalConfig.region,
                    componentRestrictions: { country: globalConfig.region.toLowerCase() }
                },
                (predictions, status) => {
                    if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
                        resolve(
                            predictions.map((p) => ({
                                placeId: p.place_id,
                                description: p.description,
                                mainText: p.structured_formatting.main_text,
                                secondaryText: p.structured_formatting.secondary_text || ''
                            }))
                        );
                    } else {
                        resolve([]);
                    }
                }
            );
        });
    }

    /**
     * Obtiene detalles de un lugar por su placeId
     * @param {string} placeId - ID del lugar
     * @returns {Promise<Object|null>} Detalles del lugar o null si hay error
     */
    async function getPlaceDetails(placeId) {
        if (!globalConfig) {
            throw new Error('Google Maps no está inicializado. Llama a initialize() primero.');
        }

        await loadGoogleMapsScript(
            globalConfig.apiKey,
            globalConfig.language,
            globalConfig.region
        );

        if (!window.google || !window.google.maps || !window.google.maps.places) {
            console.error('Google Maps Places API no está cargada');
            return null;
        }

        return new Promise((resolve) => {
            const service = new window.google.maps.places.PlacesService(
                document.createElement('div')
            );
            service.getDetails(
                { placeId, fields: ['place_id', 'formatted_address', 'geometry', 'name', 'types'] },
                (place, status) => {
                    if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
                        resolve({
                            placeId: place.place_id || placeId,
                            formattedAddress: place.formatted_address || '',
                            location: {
                                lat: place.geometry?.location?.lat() || 0,
                                lng: place.geometry?.location?.lng() || 0
                            },
                            name: place.name,
                            types: place.types
                        });
                    } else {
                        resolve(null);
                    }
                }
            );
        });
    }

    // Exportar API pública
    global.GoogleMapsService = {
        initialize,
        calculateRoute,
        searchPlaces,
        getPlaceDetails,
        loadGoogleMapsScript
    };

})(window);

