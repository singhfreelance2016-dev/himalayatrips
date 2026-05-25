/*
 * MAIN APPLICATION LOGIC
 * Handles: rendering destinations & packages, navigation, scroll effects,
 * hero stats counter, and mobile menu.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Hide loading spinner after page loads
    const spinner = document.getElementById('spinnerWrapper');
    if (spinner) {
        window.addEventListener('load', () => {
            spinner.classList.add('hidden');
        });
    }

    // ---------- DESTINATIONS DATA ----------
    const destinations = [
        {
            name: 'Everest Base Camp',
            description: 'Trek to the foot of the world’s highest peak. A challenging 14‑day adventure through Sherpa villages and breathtaking Himalayan panoramas.',
            price: 'From NPR 120,000',
            image: 'images/destinations/everest.jpg',
            fallbackColor: '#2c3e50'
        },
        {
            name: 'Pokhara',
            description: 'Nepal’s lakeside paradise. Paraglide over Phewa Lake, explore caves, and enjoy stunning Annapurna views in a relaxed setting.',
            price: 'From NPR 35,000',
            image: 'images/destinations/pokhara.jpg',
            fallbackColor: '#2980b9'
        },
        {
            name: 'Chitwan National Park',
            description: 'Experience jungle safaris, rhino spotting, and Tharu culture in Nepal’s premier wildlife reserve.',
            price: 'From NPR 25,000',
            image: 'images/destinations/chitwan.jpg',
            fallbackColor: '#27ae60'
        },
        {
            name: 'Annapurna Circuit',
            description: 'The classic Himalayan trek crossing the Thorong La pass (5,416m). Diverse landscapes from lush valleys to arid highlands.',
            price: 'From NPR 90,000',
            image: 'images/destinations/annapurna.jpg',
            fallbackColor: '#8e44ad'
        },
        {
            name: 'Lumbini',
            description: 'The birthplace of Lord Buddha. A UNESCO World Heritage Site with ancient monasteries and a profoundly peaceful atmosphere.',
            price: 'From NPR 20,000',
            image: 'images/destinations/lumbini.jpg',
            fallbackColor: '#d35400'
        },
        {
            name: 'Kathmandu Valley',
            description: 'Explore seven UNESCO heritage sites, medieval durbar squares, and vibrant markets in Nepal’s cultural heart.',
            price: 'From NPR 30,000',
            image: 'images/destinations/kathmandu.jpg',
            fallbackColor: '#c0392b'
        }
    ];

    // ---------- RENDER DESTINATIONS ----------
    const destinationsGrid = document.getElementById('destinationsGrid');
    if (destinationsGrid) {
        destinations.forEach(dest => {
            const card = document.createElement('div');
            card.className = 'destination-card reveal-element';
            card.innerHTML = `
                <div class="destination-img" style="background-image: url('${dest.image}'); background-color: ${dest.fallbackColor};">
                    <div class="destination-overlay"></div>
                    <span class="destination-price">${dest.price}</span>
                </div>
                <div class="destination-info">
                    <h3>${dest.name}</h3>
                    <p>${dest.description}</p>
                    <a href="#booking" class="btn btn-gold btn-sm">Book This Trip</a>
                </div>
            `;
            destinationsGrid.appendChild(card);
        });
    }

    // ---------- PACKAGES DATA ----------
    const packages = [
        {
            name: 'Budget Explorer',
            price: 'NPR 45,000',
            per: 'per person',
            features: [
                '7 days / 6 nights accommodation',
                'Daily breakfast included',
                'Kathmandu city tour',
                'Pokhara lakeside visit',
                'Public transportation',
                'Basic guesthouses'
            ],
            featured: false,
            badge: 'Value Pick'
        },
        {
            name: 'Standard Adventure',
            price: 'NPR 95,000',
            per: 'per person',
            features: [
                '12 days / 11 nights accommodation',
                'All meals during trek',
                'Everest or Annapurna trek',
                'Domestic flights included',
                'Professional English-speaking guide',
                '3-star hotels & tea houses'
            ],
            featured: true,
            badge: 'Most Popular'
        },
        {
            name: 'Premium Luxury',
            price: 'NPR 250,000',
            per: 'per person',
            features: [
                '14 days luxury experience',
                '5-star hotels & luxury lodges',
                'Private helicopter tour',
                'Personal guide & porter',
                'All inclusive meals & drinks',
                'Spa & wellness package'
            ],
            featured: false,
            badge: 'Luxury'
        }
    ];

    // ---------- RENDER PACKAGES ----------
    const packagesGrid = document.getElementById('packagesGrid');
    if (packagesGrid) {
        packages.forEach(pkg => {
            const card = document.createElement('div');
            card.className = `package-card ${pkg.featured ? 'featured' : ''} reveal-element`;
            card.innerHTML = `
                ${pkg.badge ? `<span class="package-badge">${pkg.badge}</span>` : ''}
                <h3 class="package-name">${pkg.name}</h3>
                <div class="package-price">${pkg.price} <span>${pkg.per}</span></div>
                <ul class="package-features">
                    ${pkg.features.map(f => `<li>✓ ${f}</li>`).join('')}
                </ul>
                <a href="#booking" class="btn btn-gold">Choose Package</a>
            `;
            packagesGrid.appendChild(card);
        });
    }

    // ---------- NAVBAR SCROLL EFFECT ----------
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ---------- MOBILE MENU TOGGLE ----------
    const hamburger = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            const isActive = navMenu.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', isActive);
        });
        // Close menu on link click (mobile)
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // ---------- HERO STATS COUNTER ANIMATION ----------
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-count'), 10);
                animateValue(el, 0, target, 2000);
                statsObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(num => statsObserver.observe(num));

    function animateValue(el, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const current = Math.floor(progress * (end - start) + start);
            el.textContent = current.toLocaleString();
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                el.textContent = end.toLocaleString();
            }
        };
        window.requestAnimationFrame(step);
    }

    // Set minimum date for travel date input to today
    const travelDateInput = document.getElementById('travelDate');
    if (travelDateInput) {
        const today = new Date().toISOString().split('T')[0];
        travelDateInput.setAttribute('min', today);
    }
});