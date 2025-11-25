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
langToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    languageSelector.classList.toggle('active');
});

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
    
    // Update elements with only es and en (backward compatibility)
    const elementsOld = document.querySelectorAll('[data-es][data-en]:not([data-pt])');
    elementsOld.forEach(element => {
        if (currentLang === 'pt') {
            // For Portuguese, use Spanish as fallback
            element.textContent = element.getAttribute('data-es');
        } else {
            const text = element.getAttribute(`data-${currentLang}`);
            if (text) {
                element.textContent = text;
            }
        }
    });
    
    // Update placeholders
    const distanceInput = document.getElementById('distance');
    if (distanceInput) {
        const placeholders = {
            'es': 'Ingresa la distancia',
            'en': 'Enter distance',
            'pt': 'Digite a distância'
        };
        distanceInput.placeholder = placeholders[currentLang] || placeholders['es'];
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
    
    // Update textarea placeholder
    const textarea = document.querySelector('textarea[placeholder]');
    if (textarea) {
        const placeholders = {
            'es': 'Detalles adicionales sobre tu viaje...',
            'en': 'Additional details about your trip...',
            'pt': 'Detalhes adicionais sobre sua viagem...'
        };
        textarea.placeholder = placeholders[currentLang] || placeholders['es'];
    }
    
    // Update select options
    const selectOptions = document.querySelectorAll('select option[data-es]');
    selectOptions.forEach(option => {
        const text = option.getAttribute(`data-${currentLang}`);
        if (text && option.value !== '') {
            option.textContent = text;
        }
    });
}

// Fare Calculator
const calculateBtn = document.getElementById('calculate-btn');
const distanceInput = document.getElementById('distance');
const costPerKmInput = document.getElementById('cost-per-km');
const fareResult = document.getElementById('fare-result');

if (calculateBtn) {
    calculateBtn.addEventListener('click', () => {
        const distance = parseFloat(distanceInput.value);
        const costPerKm = parseFloat(costPerKmInput.value) || 1500;
        
        if (distance && distance > 0) {
            const total = distance * costPerKm;
            fareResult.textContent = `$${total.toLocaleString('es-CL')}`;
            fareResult.style.animation = 'none';
            setTimeout(() => {
                fareResult.style.animation = 'pulse 0.5s ease';
            }, 10);
        } else {
            fareResult.textContent = '$0';
            const messages = {
                'es': 'Por favor ingresa una distancia válida',
                'en': 'Please enter a valid distance',
                'pt': 'Por favor, digite uma distância válida'
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
