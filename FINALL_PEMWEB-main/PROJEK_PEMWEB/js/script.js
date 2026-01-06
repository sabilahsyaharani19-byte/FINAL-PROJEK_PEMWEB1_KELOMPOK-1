document.addEventListener('DOMContentLoaded', function() {
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });

    const galleryTabs = document.querySelectorAll('#galleryTabs .nav-link');
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryTabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();            
            galleryTabs.forEach(t => t.classList.remove('active'));            
            this.classList.add('active');   
            const filterValue = this.getAttribute('data-filter');            
            galleryItems.forEach(item => {
                if (filterValue === 'all') {
                    item.style.display = 'block';
                    item.classList.add('fade-in');
                } else if (item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    item.classList.add('fade-in');
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="loading"></span> Sending...';
            submitBtn.disabled = true;            
            setTimeout(() => {
                alert('Thank you for your message! We will get back to you soon.');
                contactForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }

    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();           
            if (!this.checkValidity()) {
                e.stopPropagation();
                this.classList.add('was-validated');
                return;
            }

            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="loading"></span> Processing...';
            submitBtn.disabled = true;
            setTimeout(() => {
                alert('Booking submitted successfully! We will send you a confirmation email shortly.');
                window.location.href = 'index.html';
            }, 2000);
        });

        const destinationSelect = bookingForm.querySelector('select[class*="form-select"]:first-child');
        const adultsSelect = bookingForm.querySelectorAll('select[class*="form-select"]')[4];
        const checkboxes = bookingForm.querySelectorAll('input[type="checkbox"]:not(#terms)');

        if (destinationSelect) {
            destinationSelect.addEventListener('change', updateBookingSummary);
        }
        if (adultsSelect) {
            adultsSelect.addEventListener('change', updateBookingSummary);
        }
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', updateBookingSummary);
        });
    }

    function updateBookingSummary() {
        const basePrice = 1299;
        let additionalServices = 0;
        const asuransi = document.getElementById('asuransi');
        const visa = document.getElementById('visa');
        const mobil = document.getElementById('mobil');
        const pemandu = document.getElementById('pemandu');

        if (asuransi && asuransi.checked) additionalServices = 300000;
        if (visa && visa.checked) additionalServices = 500000;
        if (mobil && mobil.checked) additionalServices = 1500000;
        if (pemandu && pemandu.checked) additionalServices = 100000;

        const tax = Math.round((basePrice + additionalServices) * 0);
        const total = basePrice + additionalServices + tax;
        console.log('Updated booking:', { basePrice, additionalServices, tax, total });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                document.querySelector(href).scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
 
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    document.querySelectorAll('.card').forEach(card => {
        observer.observe(card);
    });

    const departureDateInput = document.querySelector('input[type="date"]');
    if (departureDateInput) {
        const today = new Date().toISOString().split('T')[0];
        departureDateInput.setAttribute('min', today);
        
        const returnDateInput = document.querySelectorAll('input[type="date"]')[1];
        if (returnDateInput) {
            returnDateInput.setAttribute('min', today);
            departureDateInput.addEventListener('change', function() {
                returnDateInput.setAttribute('min', this.value);
            });
        }
    }

    const images = document.querySelectorAll('img[loading="lazy"]');
    if ('loading' in HTMLImageElement.prototype) {
        console.log('Lazy loading supported');
    } else {
        images.forEach(img => {
            img.src = img.dataset.src || img.src;
        });
    }

    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 992 && navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        });
    });

    console.log('DiegoTheTravel website loaded successfully!');
});

function searchDestinations(query) {
    console.log('Searching for:', query);
}

function calculatePrice(destination, adults, children, services) {
    const basePrices = {
        'bali': 3000,
        'paris': 27000,
        'swiss': 27000,
        'maldives': 12000,
        'tokyo': 17000
    };
    
    let basePrice = basePrices[destination.toLowerCase()] || 1000;
    let total = basePrice * adults + (basePrice * 0.7 * children);
    
    services.forEach(service => {
        total += service.price;
    });
    
    return total;
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
    }).format(amount);
}
