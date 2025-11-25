// Language Toggle - Supports ES, EN, PT with Dropdown
let currentLang = 'es';
const languages = ['es', 'en', 'pt'];
const langData = {
    'es': { flag: '🇪🇸', code: 'ES', name: 'Español' },
    'en': { flag: '🇺🇸', code: 'EN', name: 'English' },
    'pt': { flag: '🇧🇷', code: 'PT', name: 'Português' }
};

const langToggle = document.getElementById('lang-toggle');
const langDropdown = document.getElementById('lang-dropdown');
const languageSelector = document.querySelector('.language-selector');
const langOptions = document.querySelectorAll('.lang-option');

// Toggle dropdown
if (langToggle) {
    langToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        languageSelector.classList.toggle('active');
    });
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!languageSelector.contains(e.target)) {
        languageSelector.classList.remove('active');
    }
});

// Handle language selection
langOptions.forEach(option => {
    option.addEventListener('click', () => {
        const selectedLang = option.getAttribute('data-lang');
        changeLanguage(selectedLang);
        languageSelector.classList.remove('active');
    });
});

function changeLanguage(lang) {
    currentLang = lang;
    const langInfo = langData[lang];
    
    // Update button
    const flagSpan = langToggle.querySelector('.lang-flag');
    const codeSpan = langToggle.querySelector('.lang-code');
    
    if (flagSpan) flagSpan.textContent = langInfo.flag;
    if (codeSpan) codeSpan.textContent = langInfo.code;
    
    // Update active option
    langOptions.forEach(opt => {
        opt.classList.remove('active');
        if (opt.getAttribute('data-lang') === lang) {
            opt.classList.add('active');
        }
    });
    
    updateLanguage();
    document.documentElement.lang = lang;
}

function updateLanguage() {
    // Update all elements with language attributes
    const elements = document.querySelectorAll('[data-es][data-en][data-pt]');
    elements.forEach(element => {
        const text = element.getAttribute(`data-${currentLang}`);
        if (text) {
            element.textContent = text;
        }
    });
    
    // Update placeholders
    const originInput = document.getElementById('origin-input');
    if (originInput) {
        const placeholders = {
            'es': 'Ingresa el origen',
            'en': 'Enter origin',
            'pt': 'Digite a origem'
        };
        originInput.placeholder = placeholders[currentLang] || placeholders['es'];
    }

    const destinationInput = document.getElementById('destination-input');
    if (destinationInput) {
        const placeholders = {
            'es': 'Ingresa el destino',
            'en': 'Enter destination',
            'pt': 'Digite o destino'
        };
        destinationInput.placeholder = placeholders[currentLang] || placeholders['es'];
    }
    
    const costInput = document.getElementById('cost-per-km');
    if (costInput) {
        const placeholders = {
            'es': 'Costo por km',
            'en': 'Cost per km',
            'pt': 'Custo por km'
        };
        costInput.placeholder = placeholders[currentLang] || placeholders['es'];
    }
}

// Google Maps Integration using Microservice
const GOOGLE_MAPS_API_KEY = 'AIzaSyBH7tiKRSqqZ43cSs20mZqkmYacJOO3rgY';
let map = null;
let directionsRenderer = null;
let originAutocomplete = null;
let destinationAutocomplete = null;

// Initialize Google Maps when page loads
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize Google Maps Service
    if (typeof GoogleMapsService !== 'undefined') {
        GoogleMapsService.initialize({
            apiKey: GOOGLE_MAPS_API_KEY,
            language: 'es',
            region: 'CL'
        });

        // Wait for Google Maps to load
        try {
            await GoogleMapsService.loadGoogleMapsScript(GOOGLE_MAPS_API_KEY, 'es', 'CL');
            initMap();
            initAutocomplete();
        } catch (error) {
            console.error('Error inicializando Google Maps:', error);
        }
    }
});

// Initialize map
function initMap() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer || !window.google || !window.google.maps) return;

    map = new google.maps.Map(mapContainer, {
        center: { lat: -33.4489, lng: -70.6693 }, // Santiago, Chile
        zoom: 10,
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true
    });

    directionsRenderer = new google.maps.DirectionsRenderer({
        map: map,
        suppressMarkers: false
    });

    console.log('[Google Maps] Mapa inicializado correctamente');
}

// Initialize autocomplete
function initAutocomplete() {
    if (!window.google || !window.google.maps || !window.google.maps.places) return;

    const originInput = document.getElementById('origin-input');
    if (originInput) {
        originAutocomplete = new google.maps.places.Autocomplete(originInput, {
            types: ['geocode', 'establishment'],
            componentRestrictions: { country: 'cl' }
        });
    }

    const destinationInput = document.getElementById('destination-input');
    if (destinationInput) {
        destinationAutocomplete = new google.maps.places.Autocomplete(destinationInput, {
            types: ['geocode', 'establishment'],
            componentRestrictions: { country: 'cl' }
        });
    }
}

// Fare Calculator with Google Maps
const calculateBtn = document.getElementById('calculate-btn');
const originInput = document.getElementById('origin-input');
const destinationInput = document.getElementById('destination-input');
const costPerKmInput = document.getElementById('cost-per-km');
const fareResult = document.getElementById('fare-result');
const routeInfo = document.getElementById('route-info');
const routeDistance = document.getElementById('route-distance');
const routeDuration = document.getElementById('route-duration');

if (calculateBtn) {
    calculateBtn.addEventListener('click', async () => {
        const origin = originInput?.value.trim();
        const destination = destinationInput?.value.trim();
        const costPerKm = parseFloat(costPerKmInput?.value) || 1500;

        if (!origin || !destination) {
            const messages = {
                'es': 'Por favor ingresa origen y destino',
                'en': 'Please enter origin and destination',
                'pt': 'Por favor, digite origem e destino'
            };
            alert(messages[currentLang] || messages['es']);
            return;
        }

        if (!GoogleMapsService || !window.google || !window.google.maps) {
            const messages = {
                'es': 'Google Maps aún no está cargado. Por favor espera unos segundos.',
                'en': 'Google Maps is still loading. Please wait a few seconds.',
                'pt': 'Google Maps ainda está carregando. Por favor, aguarde alguns segundos.'
            };
            alert(messages[currentLang] || messages['es']);
            return;
        }

        try {
            calculateBtn.disabled = true;
            const btnTexts = {
                'es': 'Calculando...',
                'en': 'Calculating...',
                'pt': 'Calculando...'
            };
            calculateBtn.textContent = btnTexts[currentLang] || btnTexts['es'];

            // Calculate route using microservice
            const routeInfoData = await GoogleMapsService.calculateRoute({
                origin: origin,
                destination: destination,
                travelMode: 'DRIVING'
            });

            calculateBtn.disabled = false;
            const btnTextsDone = {
                'es': 'Calcular Ruta',
                'en': 'Calculate Route',
                'pt': 'Calcular Rota'
            };
            calculateBtn.textContent = btnTextsDone[currentLang] || btnTextsDone['es'];

            if (routeInfoData) {
                // Display route on map
                if (directionsRenderer && routeInfoData.route) {
                    directionsRenderer.setDirections(routeInfoData.route);
                }

                // Update route info
                routeDistance.textContent = routeInfoData.distanceText;
                routeDuration.textContent = routeInfoData.durationText;
                routeInfo.style.display = 'block';

                // Calculate fare
                const total = routeInfoData.distance * costPerKm;
                fareResult.textContent = `$${Math.round(total).toLocaleString('es-CL')}`;
                fareResult.style.animation = 'none';
                setTimeout(() => {
                    fareResult.style.animation = 'pulse 0.5s ease';
                }, 10);
            } else {
                const messages = {
                    'es': 'Error al calcular la ruta. Verifica las direcciones e intenta nuevamente.',
                    'en': 'Error calculating route. Please verify addresses and try again.',
                    'pt': 'Erro ao calcular a rota. Verifique os endereços e tente novamente.'
                };
                alert(messages[currentLang] || messages['es']);
                fareResult.textContent = '$0';
                routeInfo.style.display = 'none';
            }

        } catch (error) {
            console.error('[Calculator] Error:', error);
            calculateBtn.disabled = false;
            const btnTexts = {
                'es': 'Calcular Ruta',
                'en': 'Calculate Route',
                'pt': 'Calcular Rota'
            };
            calculateBtn.textContent = btnTexts[currentLang] || btnTexts['es'];
            
            const messages = {
                'es': 'Error al calcular la ruta. Verifica las direcciones e intenta nuevamente.',
                'en': 'Error calculating route. Please verify addresses and try again.',
                'pt': 'Erro ao calcular a rota. Verifique os endereços e tente novamente.'
            };
            alert(messages[currentLang] || messages['es']);
        }
    });
}

// Booking Form
const bookingForm = document.getElementById('booking-form');

if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(bookingForm);
        const data = Object.fromEntries(formData);
        
        const subjects = {
            'es': 'Nueva Reserva - Transportes Edimburgo',
            'en': 'New Booking - Transportes Edimburgo',
            'pt': 'Nova Reserva - Transportes Edimburgo'
        };
        
        const subject = encodeURIComponent(subjects[currentLang] || subjects['es']);
        const body = encodeURIComponent(`
Nombre: ${data[''] || 'N/A'}
Teléfono: ${data[''] || 'N/A'}
Email: ${data[''] || 'N/A'}
Fecha: ${data[''] || 'N/A'}
Servicio: ${data[''] || 'N/A'}
Mensaje: ${data[''] || 'N/A'}
        `);
        
        window.location.href = `mailto:transportesedimburgo@icloud.com?subject=${subject}&body=${body}`;
        
        const messages = {
            'es': 'Redirigiendo a tu cliente de correo...',
            'en': 'Redirecting to your email client...',
            'pt': 'Redirecionando para seu cliente de e-mail...'
        };
        
        alert(messages[currentLang] || messages['es']);
    });
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

if (navbar) {
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.2)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
            navbar.style.backdropFilter = 'blur(10px)';
        }
        
        lastScroll = currentScroll;
    });
}

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe sections
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    observer.observe(section);
});

// Initialize language on page load
updateLanguage();

// Add pulse animation for result value
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
    }
`;
document.head.appendChild(style);

