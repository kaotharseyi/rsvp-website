// ===================== ENVELOPE ANIMATION =====================
document.addEventListener('DOMContentLoaded', function() {
    const envelopeWrapper = document.getElementById('envelope-wrapper');
    const mainContent = document.getElementById('main-content');

    // Check if we are coming from RSVP page
    const cameFromRsvp = document.referrer.includes('rsvp.html');
    
    // If coming from RSVP page, skip envelope
    if (cameFromRsvp) {
        if (envelopeWrapper) {
            envelopeWrapper.style.display = 'none';
        }
        if (mainContent) {
            mainContent.style.display = 'block';
            document.body.style.overflow = 'auto';
        }
        
        // Scroll to the section if there's a hash in the URL
        const hash = window.location.hash;
        if (hash) {
            setTimeout(function() {
                const element = document.querySelector(hash);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        }
    } else {
        // Normal envelope behavior for main page
        if (envelopeWrapper) {
            envelopeWrapper.addEventListener('click', function() {
                this.classList.add('fade-out');
                
                setTimeout(() => {
                    this.style.display = 'none';
                    if (mainContent) {
                        mainContent.style.display = 'block';
                        document.body.style.overflow = 'auto';
                        
                        const heroContent = document.querySelector('.hero-content');
                        if (heroContent) {
                            heroContent.style.animation = 'fadeInUp 1s ease-out';
                        }
                    }
                }, 800);
            });
        }
    }

    // ===================== HAMBURGER MENU =====================
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && navMenu) {
        // Toggle menu when clicking hamburger
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    }

    // ===================== ADD TO CALENDAR FUNCTION =====================
    window.addToCalendar = function() {
        const event = {
            title: 'Yewande & Olaoluwa Wedding',
            description: 'Join us to celebrate the wedding of Yewande and Olaoluwa',
            location: 'PE2 8FD, United Kingdom',
            start: '2026-04-05T12:00:00',
            end: '2026-04-05T18:00:00'
        };

        const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}&dates=${event.start.replace(/[-:]/g, '').replace('T', 'T')}/${event.end.replace(/[-:]/g, '').replace('T', 'T')}`;
        
        const icalData = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Y&O Wedding//EN
BEGIN:VEVENT
UID:${Date.now()}@yandowedding.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:20260405T120000Z
DTEND:20260405T180000Z
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
END:VEVENT
END:VCALENDAR`;

        const googleWindow = window.open(googleCalendarUrl, '_blank');
        
        if (!googleWindow || googleWindow.closed || typeof googleWindow.closed === 'undefined') {
            const blob = new Blob([icalData], { type: 'text/calendar' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'wedding-invitation.ics';
            link.click();
            
            alert('Calendar file downloaded. Please open it to add to your calendar.');
        }
    };

    // ===================== GET DIRECTIONS FUNCTION =====================
    window.getDirections = function() {
        const destination = 'PE2 8FD, United Kingdom';
        const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
        window.open(mapsUrl, '_blank');
    };

    // ===================== RSVP FORM =====================
    const rsvpForm = document.getElementById('rsvpForm');
    
    if (rsvpForm) {
        const attendingRadios = document.querySelectorAll('input[name="attendance"]');
        const guestCountGroup = document.getElementById('guestCountGroup');
        const plusOneRadios = document.querySelectorAll('input[name="plusOne"]');
        
        attendingRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.value === 'Attending') {
                    guestCountGroup.style.display = 'block';
                    plusOneRadios.forEach(radio => {
                        radio.required = true;
                    });
                } else {
                    guestCountGroup.style.display = 'none';
                    plusOneRadios.forEach(radio => {
                        radio.checked = false;
                        radio.required = false;
                    });
                }
            });
        });

        rsvpForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const submitBtn = document.getElementById('submitBtn');
            
            const formData = {
                fullName: document.getElementById('fullName').value.trim(),
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                attendance: document.querySelector('input[name="attendance"]:checked')?.value || '',
                plusOne: document.querySelector('input[name="plusOne"]:checked')?.value || '',
                message: document.getElementById('message').value.trim() || 'No message'
            };

            if (!formData.fullName || !formData.email || !formData.phone || !formData.attendance) {
                alert('Please fill in all required fields');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                alert('Please enter a valid email address');
                return;
            }

            if (formData.phone.length < 10) {
                alert('Please enter a valid phone number');
                return;
            }

            if (formData.attendance === 'Attending' && !formData.plusOne) {
                alert('Please indicate if you\'ll bring a plus one');
                return;
            }

            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Sending...</span>';

            try {
                const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzOHjuRZYxj0diGF2FEf2oh9fefAgwCEKu_CeVMMpaL5NWMNdqnYSbX_HIxvbNPeO6rXg/exec';
                
                await fetch(APPS_SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                rsvpForm.style.display = 'none';
                const successMessage = document.getElementById('successMessage');
                if (successMessage) {
                    successMessage.style.display = 'block';
                    
                    const messageTitle = successMessage.querySelector('h3');
                    const messageText = successMessage.querySelector('p');
                    
                    if (formData.attendance === 'Attending') {
                        messageTitle.textContent = 'Thank You!';
                        messageText.textContent = 'We can\'t wait to celebrate with you. Your Invitation has been sent to your email.';
                    } else {
                        messageTitle.textContent = 'We\'ll Miss You';
                        messageText.textContent = 'Thank you for letting us know.';
                    }
                    
                    successMessage.scrollIntoView({ behavior: 'smooth' });
                }

            } catch (error) {
                console.error('RSVP submission error:', error);
                alert('There was an error submitting your RSVP. Please try again or contact us directly.');
                
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<span>Submit RSVP</span><span class="submit-icon">→</span>';
            }
        });
    }

    // ===================== SCROLL ANIMATIONS =====================
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

    document.querySelectorAll('.wedding-event-card, .contact-card, .rsvp-form-container').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // ===================== SMOOTH SCROLL FOR NAVIGATION =====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
});