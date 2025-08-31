// Global Variables
let signatures = [];
let currentStep = 1;
let signatureCount = 0;

// Sample initial signatures for demonstration
const initialSignatures = [
    {
        name: "Carlos Rodriguez",
        country: "Colombia", 
        date: new Date().toLocaleDateString('es-ES'),
        comment: "Llevamos años sufriendo con este servidor lleno de lag y hackers"
    },
    {
        name: "Maria González", 
        country: "México",
        date: new Date(Date.now() - 86400000).toLocaleDateString('es-ES'),
        comment: "Es hora de que cierren este servidor problemático"
    },
    {
        name: "Alex Fernández",
        country: "España", 
        date: new Date(Date.now() - 172800000).toLocaleDateString('es-ES'),
        comment: "The Hive es muchísimo mejor que Lifeboat"
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Load initial signatures
    signatures = [...initialSignatures];
    signatureCount = signatures.length;
    
    // Update counters
    updateSignatureCount();
    
    // Setup scroll animations
    setupScrollAnimations();
    
    // Setup form handling
    setupFormHandling();
    
    // Display signatures
    displaySignatures();
    
    // Add particle effects
    createParticleEffects();
    
    // Setup accessibility
    setupAccessibility();
    
    console.log('Petition website initialized successfully');
}

// Signature Counter Functions
function updateSignatureCount() {
    const counters = document.querySelectorAll('.counter-number');
    const progressBars = document.querySelectorAll('.progress-fill');
    
    // Animate counter
    animateCounter(signatureCount);
    
    // Update progress bars
    const progressPercentage = Math.min((signatureCount / 100) * 100, 100);
    progressBars.forEach(bar => {
        bar.style.width = `${progressPercentage}%`;
    });
}

function animateCounter(targetCount) {
    const counters = document.querySelectorAll('.counter-number');
    const duration = 1000; // 1 second
    const steps = 30;
    const increment = targetCount / steps;
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= targetCount) {
            current = targetCount;
            clearInterval(timer);
        }
        
        counters.forEach(counter => {
            counter.textContent = Math.floor(current);
        });
    }, duration / steps);
}

// Scroll Animation Functions
function setupScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Navigation Functions - Fixed
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 20;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
        return true;
    }
    console.warn('Section not found:', sectionId);
    return false;
}

// Form Handling Functions - Fixed
function setupFormHandling() {
    const form = document.getElementById('signatureForm');
    
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
        
        // Setup real-time validation
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => clearFieldError(input));
        });
        
        console.log('Form handling setup complete');
    } else {
        console.error('Signature form not found');
    }
}

function nextStep() {
    console.log('Next step called, current step:', currentStep);
    
    if (!validateCurrentStep()) {
        console.log('Current step validation failed');
        return false;
    }
    
    if (currentStep < 3) {
        // Hide current step
        const currentStepEl = document.querySelector(`.form-step[data-step="${currentStep}"]`);
        const currentProgressEl = document.querySelector(`.progress-step[data-step="${currentStep}"]`);
        
        if (currentStepEl) currentStepEl.classList.remove('active');
        if (currentProgressEl) currentProgressEl.classList.remove('active');
        
        // Show next step
        currentStep++;
        const nextStepEl = document.querySelector(`.form-step[data-step="${currentStep}"]`);
        const nextProgressEl = document.querySelector(`.progress-step[data-step="${currentStep}"]`);
        
        if (nextStepEl) {
            nextStepEl.classList.add('active');
            console.log('Showing step', currentStep);
        }
        if (nextProgressEl) {
            nextProgressEl.classList.add('active');
        }
        
        return true;
    }
    return false;
}

function prevStep() {
    console.log('Previous step called, current step:', currentStep);
    
    if (currentStep > 1) {
        // Hide current step
        const currentStepEl = document.querySelector(`.form-step[data-step="${currentStep}"]`);
        const currentProgressEl = document.querySelector(`.progress-step[data-step="${currentStep}"]`);
        
        if (currentStepEl) currentStepEl.classList.remove('active');
        if (currentProgressEl) currentProgressEl.classList.remove('active');
        
        // Show previous step
        currentStep--;
        const prevStepEl = document.querySelector(`.form-step[data-step="${currentStep}"]`);
        const prevProgressEl = document.querySelector(`.progress-step[data-step="${currentStep}"]`);
        
        if (prevStepEl) prevStepEl.classList.add('active');
        if (prevProgressEl) prevProgressEl.classList.add('active');
        
        return true;
    }
    return false;
}

function validateCurrentStep() {
    const currentStepElement = document.querySelector(`.form-step[data-step="${currentStep}"]`);
    if (!currentStepElement) {
        console.error('Current step element not found:', currentStep);
        return false;
    }
    
    const requiredFields = currentStepElement.querySelectorAll('[required]');
    let isValid = true;
    
    console.log('Validating step', currentStep, 'with', requiredFields.length, 'required fields');
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
            console.log('Field validation failed:', field.id || field.name);
        }
    });
    
    console.log('Step validation result:', isValid);
    return isValid;
}

function validateField(field) {
    if (!field) return false;
    
    const errorElement = field.closest('.form-group')?.querySelector('.form-error');
    let isValid = true;
    let errorMessage = '';
    
    // Check if field is required and empty
    if (field.hasAttribute('required')) {
        if (field.type === 'checkbox') {
            if (!field.checked) {
                errorMessage = 'Este campo es obligatorio';
                isValid = false;
            }
        } else if (!field.value || !field.value.trim()) {
            errorMessage = 'Este campo es obligatorio';
            isValid = false;
        }
    }
    
    // Email validation
    if (field.type === 'email' && field.value && field.value.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value.trim())) {
            errorMessage = 'Ingresa un email válido';
            isValid = false;
        }
    }
    
    // Name validation
    if (field.id === 'fullName' && field.value && field.value.trim()) {
        if (field.value.trim().length < 2) {
            errorMessage = 'El nombre debe tener al menos 2 caracteres';
            isValid = false;
        }
    }
    
    // Show/hide error
    if (errorElement) {
        if (!isValid) {
            errorElement.textContent = errorMessage;
            errorElement.classList.add('show');
            field.style.borderColor = '#FF6B9D';
        } else {
            errorElement.classList.remove('show');
            field.style.borderColor = '';
        }
    }
    
    return isValid;
}

function clearFieldError(field) {
    if (!field) return;
    
    const errorElement = field.closest('.form-group')?.querySelector('.form-error');
    if (errorElement) {
        errorElement.classList.remove('show');
        field.style.borderColor = '';
    }
}

function handleFormSubmit(event) {
    event.preventDefault();
    console.log('Form submit handler called');
    
    if (!validateCurrentStep()) {
        console.log('Final step validation failed');
        return;
    }
    
    // Get form data
    const signature = {
        name: document.getElementById('fullName')?.value || '',
        country: document.getElementById('country')?.value || '',
        gamertag: document.getElementById('gamertag')?.value || '',
        email: document.getElementById('email')?.value || '',
        comment: document.getElementById('comment')?.value || '',
        date: new Date().toLocaleDateString('es-ES')
    };
    
    console.log('Adding signature:', signature);
    
    // Add signature
    addSignature(signature);
    
    // Show success modal
    showSuccessModal();
    
    // Reset form
    resetForm();
    
    // Track signature submission
    trackSignature(signature);
}

function addSignature(signature) {
    signatures.unshift(signature); // Add to beginning of array
    signatureCount++;
    
    console.log('Signature added. New count:', signatureCount);
    
    // Update UI
    updateSignatureCount();
    displaySignatures();
}

function resetForm() {
    const form = document.getElementById('signatureForm');
    if (form) {
        form.reset();
    }
    
    // Reset to first step
    document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
    document.querySelectorAll('.progress-step').forEach(step => step.classList.remove('active'));
    
    currentStep = 1;
    const firstStep = document.querySelector('.form-step[data-step="1"]');
    const firstProgress = document.querySelector('.progress-step[data-step="1"]');
    
    if (firstStep) firstStep.classList.add('active');
    if (firstProgress) firstProgress.classList.add('active');
    
    // Clear any errors
    document.querySelectorAll('.form-error').forEach(error => error.classList.remove('show'));
    document.querySelectorAll('.form-control').forEach(field => field.style.borderColor = '');
    
    console.log('Form reset to step 1');
}

// Modal Functions - Fixed
function showSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.remove('hidden');
        console.log('Success modal shown');
        
        // Add confetti effect
        setTimeout(() => {
            createConfettiEffect();
        }, 200);
    } else {
        console.error('Success modal not found');
    }
}

function closeModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.add('hidden');
        console.log('Modal closed');
    }
}

function createConfettiEffect() {
    console.log('Creating confetti effect');
    
    // Simple confetti effect
    const confetti = document.createElement('div');
    confetti.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
    `;
    
    // Create confetti particles
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 8px;
            height: 8px;
            background: ${['#FF6B9D', '#00D4FF', '#FFD700'][Math.floor(Math.random() * 3)]};
            left: ${Math.random() * 100}%;
            top: -10px;
            animation: confettiFall ${2 + Math.random() * 3}s linear forwards;
        `;
        confetti.appendChild(particle);
    }
    
    document.body.appendChild(confetti);
    
    // Remove confetti after animation
    setTimeout(() => {
        if (confetti.parentNode) {
            document.body.removeChild(confetti);
        }
    }, 5000);
}

// Add required styles for confetti and notifications
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    @keyframes confettiFall {
        0% {
            transform: translateY(-10px) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #FF6B9D, #00D4FF);
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: 500;
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        max-width: 300px;
        word-wrap: break-word;
    }
`;
document.head.appendChild(dynamicStyles);

// Signature Display Functions
function displaySignatures() {
    const signaturesList = document.getElementById('signaturesList');
    if (!signaturesList) {
        console.warn('Signatures list element not found');
        return;
    }
    
    // Clear existing signatures
    signaturesList.innerHTML = '';
    
    // Display latest signatures (max 10)
    const recentSignatures = signatures.slice(0, 10);
    
    recentSignatures.forEach((signature, index) => {
        const signatureCard = createSignatureCard(signature, index);
        signaturesList.appendChild(signatureCard);
    });
    
    console.log('Displayed', recentSignatures.length, 'signatures');
}

function createSignatureCard(signature, index) {
    const card = document.createElement('div');
    card.className = 'signature-card animate-on-scroll';
    card.style.animationDelay = `${index * 0.1}s`;
    
    card.innerHTML = `
        <div class="signature-info">
            <div class="signature-name">${escapeHtml(signature.name)}</div>
            <div class="signature-location">${escapeHtml(signature.country)}</div>
            ${signature.comment ? `<div class="signature-comment">"${escapeHtml(signature.comment)}"</div>` : ''}
        </div>
        <div class="signature-date">${signature.date}</div>
    `;
    
    return card;
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Social Media Sharing Functions - Fixed with better feedback
function shareOnSocial() {
    scrollToSection('share-section');
}

function shareOnTwitter() {
    const text = "🎮 Únete a la petición para cerrar Lifeboat por sus problemas técnicos crónicos. ¡Ya basta de lag y hackers! #StopLifeboat";
    const url = window.location.href;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    
    try {
        window.open(twitterUrl, '_blank', 'width=600,height=400');
        showNotification('¡Ventana de Twitter abierta!');
    } catch (error) {
        showNotification('No se pudo abrir Twitter');
        console.error('Twitter share error:', error);
    }
}

function shareOnFacebook() {
    const url = window.location.href;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    
    try {
        window.open(facebookUrl, '_blank', 'width=600,height=400');
        showNotification('¡Ventana de Facebook abierta!');
    } catch (error) {
        showNotification('No se pudo abrir Facebook');
        console.error('Facebook share error:', error);
    }
}

function shareOnWhatsApp() {
    const text = "🎮 Únete a la petición para cerrar Lifeboat por sus problemas técnicos crónicos. ¡Ya basta de lag y hackers!";
    const url = window.location.href;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
    
    try {
        window.open(whatsappUrl, '_blank');
        showNotification('¡WhatsApp abierto!');
    } catch (error) {
        showNotification('No se pudo abrir WhatsApp');
        console.error('WhatsApp share error:', error);
    }
}

function copyLink() {
    const url = window.location.href;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
            showNotification('¡Enlace copiado al portapapeles!');
            console.log('Link copied successfully');
        }).catch(() => {
            console.log('Clipboard API failed, using fallback');
            fallbackCopyToClipboard(url);
        });
    } else {
        console.log('Clipboard API not supported, using fallback');
        fallbackCopyToClipboard(url);
    }
}

function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.cssText = `
        position: fixed;
        left: -999999px;
        top: -999999px;
        opacity: 0;
    `;
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showNotification('¡Enlace copiado al portapapeles!');
        } else {
            showNotification('No se pudo copiar el enlace');
        }
    } catch (err) {
        showNotification('Error al copiar enlace');
        console.error('Copy error:', err);
    }
    
    document.body.removeChild(textArea);
}

function showNotification(message) {
    console.log('Showing notification:', message);
    
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Particle Effects
function createParticleEffects() {
    const particlesContainer = document.querySelector('.particles');
    if (!particlesContainer) {
        console.warn('Particles container not found');
        return;
    }
    
    console.log('Creating particle effects');
    
    // Create additional floating particles
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: ${['#FF6B9D', '#00D4FF', '#FFD700'][Math.floor(Math.random() * 3)]};
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: floatRandom ${10 + Math.random() * 20}s linear infinite;
            opacity: ${0.3 + Math.random() * 0.4};
            pointer-events: none;
        `;
        particlesContainer.appendChild(particle);
    }
}

// Event Listeners
document.addEventListener('click', function(e) {
    // Handle smooth scroll links
    const target = e.target.closest('a[href^="#"]');
    if (target) {
        e.preventDefault();
        const targetId = target.getAttribute('href').substring(1);
        scrollToSection(targetId);
        return;
    }
    
    // Handle modal clicks
    const modal = document.getElementById('successModal');
    if (e.target === modal) {
        closeModal();
        return;
    }
});

// Keyboard Navigation
document.addEventListener('keydown', function(e) {
    const modal = document.getElementById('successModal');
    
    // Close modal with Escape key
    if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
        closeModal();
        return;
    }
});

// Accessibility Enhancements
function setupAccessibility() {
    // Add ARIA labels
    const form = document.getElementById('signatureForm');
    if (form) {
        form.setAttribute('aria-label', 'Formulario de firma de petición');
    }
    
    // Add skip link
    const skipLink = document.createElement('a');
    skipLink.href = '#signature-form';
    skipLink.textContent = 'Saltar al formulario';
    skipLink.className = 'sr-only';
    skipLink.style.cssText = `
        position: absolute;
        left: -9999px;
        width: 1px;
        height: 1px;
        overflow: hidden;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            background: #FF6B9D;
            color: white;
            padding: 8px 16px;
            text-decoration: none;
            z-index: 10000;
            width: auto;
            height: auto;
            overflow: visible;
        `;
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.cssText = `
            position: absolute;
            left: -9999px;
            width: 1px;
            height: 1px;
            overflow: hidden;
        `;
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    console.log('Accessibility features setup complete');
}

// Analytics/Tracking
function trackEvent(eventName, properties = {}) {
    console.log('Event tracked:', eventName, properties);
}

function trackSignature(signature) {
    trackEvent('signature_submitted', {
        country: signature.country,
        has_comment: !!signature.comment,
        has_gamertag: !!signature.gamertag
    });
}

// Error Handling
window.addEventListener('error', function(e) {
    console.error('Application error:', e.error);
    showNotification('Ha ocurrido un error. Por favor, recarga la página.');
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    e.preventDefault();
});

// Performance optimization
let scrollTimeout;
window.addEventListener('scroll', function() {
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }
    
    scrollTimeout = setTimeout(function() {
        // Optional scroll-based effects can go here
    }, 16); // ~60fps
});

// Export functions for potential testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        addSignature,
        validateField,
        updateSignatureCount,
        scrollToSection,
        nextStep,
        prevStep
    };
}

console.log('Stop Lifeboat petition app loaded successfully! 🎮');
console.log('Initial signature count:', signatureCount);