document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Mobile Menu Toggle
    const nav = document.querySelector('.main-nav');
    const navLinks = document.querySelector('.nav-links');
    
    if (nav && navLinks) {
        // Inject Mobile Button
        const mobileBtn = document.createElement('button');
        mobileBtn.className = 'mobile-menu-btn';
        mobileBtn.setAttribute('aria-label', 'Toggle menu');
        mobileBtn.innerHTML = '☰';
        
        // Insert before nav-actions if exists, else append
        const navActions = document.querySelector('.nav-actions');
        if (navActions) {
            nav.insertBefore(mobileBtn, navActions);
        } else {
            nav.appendChild(mobileBtn);
        }

        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileBtn.innerHTML = navLinks.classList.contains('active') ? '✕' : '☰';
        });
    }

    // 2. Sticky Header
    const header = document.querySelector('.site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
        // Check initial state
        if (window.scrollY > 50) header.classList.add('scrolled');
    }

    // 3. Scroll Reveal Animation (Intersection Observer)
    const elementsToReveal = document.querySelectorAll(`
        .section-title, .hero-content, .hero-badge, .hero-visual,
        .stat-card, .feature-card, .speaker-card, .timeline-item, 
        .pricing-card, .testimonial-card, .gallery-img, .faq-item,
        .history-item, .audience-card, .team-card, .contact-card
    `);

    elementsToReveal.forEach((el, index) => {
        el.classList.add('reveal');
        // Add staggering for grids based on dom order if they are siblings, but CSS nth-child is tricky.
        // We'll just rely on the intersection observer triggering them sequentially.
    });

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // If it's a stat card, trigger counter
                const statNumber = entry.target.querySelector('.stat-number');
                if (statNumber && !statNumber.classList.contains('counted')) {
                    animateCounter(statNumber);
                    statNumber.classList.add('counted');
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    elementsToReveal.forEach(el => {
        revealObserver.observe(el);
    });

    // 4. Number Counter Animation
    function animateCounter(el) {
        const text = el.innerText;
        // Extract numbers and non-numbers (like 'k', '+')
        const match = text.match(/([\d\.]+)(.*)/);
        if (!match) return;
        
        const targetNumber = parseFloat(match[1]);
        const suffix = match[2] || '';
        
        let start = 0;
        const duration = 2000;
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out quart
            const easeProgress = 1 - Math.pow(1 - progress, 4);
            
            const currentNumber = (easeProgress * targetNumber).toFixed(targetNumber % 1 !== 0 ? 1 : 0);
            el.innerText = currentNumber + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.innerText = text; // Ensure exact final text
            }
        }
        
        requestAnimationFrame(update);
    }

    // 5. Basic Tab/Pill Switching Logic (for Speakers and Schedule)
    const pills = document.querySelectorAll('.pill, .tab-btn');
    pills.forEach(pill => {
        pill.addEventListener('click', (e) => {
            // Find sibling pills in the same container
            const parent = e.target.parentElement;
            const siblings = parent.querySelectorAll('.pill, .tab-btn');
            
            siblings.forEach(s => {
                s.classList.remove('active', 'bg-dark', 'text-white');
                if (s.classList.contains('pill')) {
                    s.classList.add('bg-white', 'text-muted');
                } else {
                    s.classList.add('text-muted');
                }
                s.setAttribute('aria-pressed', 'false');
            });
            
            e.target.classList.add('active');
            e.target.setAttribute('aria-pressed', 'true');
            
            if (e.target.classList.contains('pill')) {
                e.target.classList.remove('bg-white', 'text-muted');
                e.target.classList.add('bg-dark', 'text-white');
            } else {
                e.target.classList.remove('text-muted');
                e.target.classList.add('bg-dark', 'text-white');
            }
        });
    });

});
