// ============================================================
// LYNX Technology — Centralized JavaScript
// ============================================================

(function() {
    'use strict';

    // ============================================================
    // 1. FADE-UP ANIMATIONS
    // ============================================================
    function initFadeUp() {
        const fadeElements = document.querySelectorAll('.fade-up');
        if (!fadeElements.length) return;

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

        fadeElements.forEach(el => observer.observe(el));

        // Check for elements already in view
        setTimeout(() => {
            fadeElements.forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight) {
                    el.classList.add('visible');
                }
            });
        }, 200);
    }

    // ============================================================
    // 2. NAVIGATION (Mobile Menu)
    // ============================================================
    function initNavigation() {
        const menuToggle = document.getElementById('menuToggle');
        const mobileMenu = document.getElementById('mobileMenu');

        if (menuToggle && mobileMenu) {
            menuToggle.addEventListener('click', function() {
                const isOpen = mobileMenu.classList.toggle('open');
                this.classList.toggle('open');
                this.setAttribute('aria-expanded', isOpen);
                document.body.style.overflow = isOpen ? 'hidden' : '';
            });

            // Close on link click
            mobileMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', function() {
                    mobileMenu.classList.remove('open');
                    menuToggle.classList.remove('open');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                });
            });

            // Close on Escape
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
                    mobileMenu.classList.remove('open');
                    menuToggle.classList.remove('open');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                }
            });
        }
    }

    // ============================================================
    // 3. PRODUCTS DROPDOWN
    // ============================================================
    function initProductsDropdown() {
        // Desktop dropdown
        const dropdownBtn = document.getElementById('productsDropdownBtn');
        const dropdownMenu = document.getElementById('productsDropdownMenu');

        if (dropdownBtn && dropdownMenu) {
            dropdownBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const isOpen = dropdownMenu.classList.toggle('open');
                this.classList.toggle('open');
                this.setAttribute('aria-expanded', isOpen);
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', function(e) {
                if (!dropdownBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
                    dropdownMenu.classList.remove('open');
                    dropdownBtn.classList.remove('open');
                    dropdownBtn.setAttribute('aria-expanded', 'false');
                }
            });

            // Close on Escape
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && dropdownMenu.classList.contains('open')) {
                    dropdownMenu.classList.remove('open');
                    dropdownBtn.classList.remove('open');
                    dropdownBtn.setAttribute('aria-expanded', 'false');
                }
            });
        }

        // Mobile dropdown
        const mobileDropdownBtn = document.getElementById('mobileDropdownBtn');
        const mobileDropdownMenu = document.getElementById('mobileDropdownMenu');

        if (mobileDropdownBtn && mobileDropdownMenu) {
            mobileDropdownBtn.addEventListener('click', function() {
                const isOpen = mobileDropdownMenu.classList.toggle('open');
                this.classList.toggle('open');
                this.setAttribute('aria-expanded', isOpen);
            });
        }
    }

    // ============================================================
    // 4. HERO GLOW EFFECT
    // ============================================================
    function initHeroGlow() {
        const heroSection = document.getElementById('heroSection');
        const heroGlow = document.getElementById('heroGlow');
        const heroGlowTouch = document.getElementById('heroGlowTouch');

        if (heroSection && heroGlow) {
            heroSection.addEventListener('mousemove', function(e) {
                const rect = heroSection.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                heroGlow.style.left = x + 'px';
                heroGlow.style.top = y + 'px';
                heroGlow.classList.add('active');
            });

            heroSection.addEventListener('mouseleave', function() {
                heroGlow.classList.remove('active');
            });
        }

        if (heroSection && heroGlowTouch) {
            heroSection.addEventListener('touchmove', function(e) {
                const touch = e.touches[0];
                const rect = heroSection.getBoundingClientRect();
                const x = touch.clientX - rect.left;
                const y = touch.clientY - rect.top;
                heroGlowTouch.style.left = x + 'px';
                heroGlowTouch.style.top = y + 'px';
                heroGlowTouch.classList.add('active');
            }, { passive: true });

            heroSection.addEventListener('touchend', function() {
                heroGlowTouch.classList.remove('active');
            }, { passive: true });
        }
    }

    // ============================================================
    // 5. SERVICE HERO GLOW (for service pages)
    // ============================================================
    function initServiceHeroGlow() {
        const serviceHero = document.getElementById('serviceHero');
        const heroGlow = document.getElementById('heroGlow');

        if (serviceHero && heroGlow) {
            serviceHero.addEventListener('mousemove', function(e) {
                const rect = serviceHero.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                heroGlow.style.left = x + 'px';
                heroGlow.style.top = y + 'px';
                heroGlow.classList.add('active');
            });

            serviceHero.addEventListener('mouseleave', function() {
                heroGlow.classList.remove('active');
            });
        }
    }

    // ============================================================
    // 6. VENU HERO GLOW (specific to Venu page)
    // ============================================================
    function initVenuHeroGlow() {
        const venuHero = document.getElementById('venuHero');
        const heroGlow = document.getElementById('heroGlow');

        if (venuHero && heroGlow) {
            venuHero.addEventListener('mousemove', function(e) {
                const rect = venuHero.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                heroGlow.style.left = x + 'px';
                heroGlow.style.top = y + 'px';
                heroGlow.classList.add('active');
            });

            venuHero.addEventListener('mouseleave', function() {
                heroGlow.classList.remove('active');
            });
        }
    }

    // ============================================================
    // 7. MOBILE TILT EFFECT (Hero)
    // ============================================================
    function initHeroTilt() {
        const heroSection = document.getElementById('heroSection');
        const heroTiltInner = document.getElementById('heroTiltInner');

        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            if (heroSection && heroTiltInner) {
                let tiltTimeout;

                heroSection.addEventListener('touchmove', function(e) {
                    const touch = e.touches[0];
                    const rect = heroSection.getBoundingClientRect();
                    const x = touch.clientX - rect.left;
                    const y = touch.clientY - rect.top;

                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    const maxTilt = 3;

                    const rotateY = ((x - centerX) / centerX) * maxTilt;
                    const rotateX = ((centerY - y) / centerY) * maxTilt;

                    heroTiltInner.style.setProperty('--rotateX', rotateX + 'deg');
                    heroTiltInner.style.setProperty('--rotateY', rotateY + 'deg');
                }, { passive: true });

                heroSection.addEventListener('touchend', function() {
                    clearTimeout(tiltTimeout);
                    tiltTimeout = setTimeout(function() {
                        heroTiltInner.style.setProperty('--rotateX', '0deg');
                        heroTiltInner.style.setProperty('--rotateY', '0deg');
                    }, 150);
                }, { passive: true });
            }
        }
    }

    // ============================================================
    // 8. LETTER SPLIT ANIMATION
    // ============================================================
    function initLetterAnimation() {
        const target = document.querySelector('.letter-animate');
        if (!target) return;

        const text = target.textContent.trim();
        target.textContent = '';

        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const span = document.createElement('span');

            if (char === ' ') {
                span.innerHTML = '&nbsp;';
                span.style.pointerEvents = 'none';
                span.style.display = 'inline-block';
                span.style.width = '0.35em';
            } else {
                span.textContent = char;
            }

            span.style.setProperty('--i', i);
            target.appendChild(span);
        }
    }

    // ============================================================
    // 9. BACK TO TOP BUTTON
    // ============================================================
    function initBackToTop() {
        const btn = document.getElementById('backToTop');
        if (!btn) return;

        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 400) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        }, { passive: true });

        btn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // Keyboard support
        btn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

    // ============================================================
    // 10. FEATURE TABS (Venu page)
    // ============================================================
    function initFeatureTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        if (!tabBtns.length || !tabContents.length) return;

        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active from all tabs
                tabBtns.forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-selected', 'false');
                });
                tabContents.forEach(c => c.classList.remove('active'));

                // Add active to clicked tab
                this.classList.add('active');
                this.setAttribute('aria-selected', 'true');
                const tabId = this.dataset.tab;
                document.getElementById('tab-' + tabId).classList.add('active');
            });
        });
    }

    // ============================================================
    // 11. WAITLIST FORM (Venu page)
    // ============================================================
    function initWaitlistForm() {
        const form = document.getElementById('waitlistForm');
        if (!form) return;

        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const email = document.getElementById('waitlistEmail');
            const btn = document.getElementById('waitlistBtn');
            const text = document.getElementById('waitlistText');
            const loading = document.getElementById('waitlistLoading');
            const success = document.getElementById('waitlistSuccess');

            if (!email.value || !email.value.includes('@')) {
                email.style.borderColor = 'rgba(239, 68, 68, 0.4)';
                return;
            }

            // Show loading
            btn.disabled = true;
            text.style.display = 'none';
            loading.style.display = 'inline';

            // Simulate submission
            setTimeout(() => {
                btn.disabled = false;
                text.style.display = 'inline';
                loading.style.display = 'none';
                email.value = '';
                email.style.borderColor = '';
                success.classList.add('show');
                btn.style.display = 'none';
            }, 1500);
        });

        // Reset email border on input
        const emailInput = document.getElementById('waitlistEmail');
        if (emailInput) {
            emailInput.addEventListener('input', function() {
                this.style.borderColor = '';
            });
        }
    }

    // ============================================================
    // 12. GITHUB PROJECTS (Full-Stack page)
    // ============================================================
    // Default empty project list — override on Full-Stack page
    let SELECTED_REPOS = [];

    function setProjects(repos) {
        SELECTED_REPOS = repos || [];
    }

    function getPlaceholderImage(title) {
        const colors = ['1a1a2e', '16213e', '0f3460', '533483', 'e94560', 'ff6b6b', '4ecdc4', '45b7d1'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400'%3E%3Crect width='600' height='400' fill='%23${color}'/%3E%3Ctext x='300' y='200' text-anchor='middle' fill='%23ffffff' font-family='Space Grotesk, sans-serif' font-size='28' font-weight='600'%3E${encodeURIComponent(title)}%3C/text%3E%3Ctext x='300' y='240' text-anchor='middle' fill='%23999999' font-family='Space Grotesk, sans-serif' font-size='16'%3EView on GitHub%3C/text%3E%3C/svg%3E`;
    }

    function renderProjects(filter = 'all') {
        const container = document.getElementById('projectsContainer');
        if (!container) return;

        if (!SELECTED_REPOS.length) {
            container.innerHTML = `
                <div class="no-results" style="grid-column:1/-1;text-align:center;padding:3rem 0;color:var(--color-gray-500);">
                    <p>No projects configured. Add your repos in the page script.</p>
                </div>
            `;
            return;
        }

        const filtered = filter === 'all'
            ? SELECTED_REPOS
            : SELECTED_REPOS.filter(p => p.type === filter);

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="no-results" style="grid-column:1/-1;text-align:center;padding:3rem 0;">
                    <p style="font-size: 1.125rem; margin-bottom: var(--space-sm); color: var(--color-gray-400);">🔍 No projects found</p>
                    <p style="color: var(--color-gray-600);">Try selecting a different category.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = '';

        filtered.forEach((project, index) => {
            const card = document.createElement('div');
            card.className = 'fade-up showcase-card';
            card.style.setProperty('--i', index);

            const tagsHTML = project.tags.map(tag =>
                `<span>${tag}</span>`
            ).join('');

            const imageSrc = project.screenshot || getPlaceholderImage(project.name);

            // Build action buttons
            let actionsHTML = `
                <a href="${project.repoUrl}" target="_blank" rel="noopener noreferrer" class="link">
                    <i class="fab fa-github" aria-hidden="true"></i> View Repository
                </a>
            `;

            if (project.demoUrl) {
                actionsHTML += `
                    <a href="${project.demoUrl}" target="_blank" rel="noopener noreferrer" class="link demo-link">
                        <i class="fas fa-external-link-alt" aria-hidden="true"></i> Live Demo
                    </a>
                `;
            }

            card.innerHTML = `
                <div class="image-wrapper">
                    <img src="${imageSrc}" 
                         alt="${project.name}" 
                         loading="lazy"
                         onerror="this.src='${getPlaceholderImage(project.name)}'">
                </div>
                <div class="content">
                    <div class="tags">${tagsHTML}</div>
                    <h3>${project.name}</h3>
                    <p>${project.description}</p>
                    <div class="stats">
                        ${project.language ? `<span>💻 ${project.language}</span>` : ''}
                        ${project.stars ? `<span>⭐ ${project.stars}</span>` : ''}
                        ${project.forks ? `<span>🔀 ${project.forks}</span>` : ''}
                    </div>
                    <div class="project-actions">
                        ${actionsHTML}
                    </div>
                </div>
            `;

            container.appendChild(card);
        });

        // Trigger fade animations after render
        setTimeout(() => {
            document.querySelectorAll('.showcase-card.fade-up').forEach(el => {
                el.classList.add('visible');
            });
        }, 50);
    }

    function initFilters() {
        const buttons = document.querySelectorAll('.filter-btn');
        if (!buttons.length) return;

        buttons.forEach(btn => {
            btn.addEventListener('click', function() {
                buttons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                const filter = this.dataset.filter;
                renderProjects(filter);
            });
        });
    }

    function initProjects(projects) {
        if (projects) {
            SELECTED_REPOS = projects;
        }
        renderProjects('all');
        initFilters();
    }

    // ============================================================
    // 13. INIT ALL — Run everything
    // ============================================================
    document.addEventListener('DOMContentLoaded', function() {
        // Core features (always run)
        initFadeUp();
        initNavigation();
        initProductsDropdown();
        initBackToTop();

        // Feature-specific (run if elements exist)
        initHeroGlow();
        initServiceHeroGlow();
        initVenuHeroGlow();
        initHeroTilt();
        initLetterAnimation();
        initFeatureTabs();
        initWaitlistForm();

        console.log('✅ LYNX Technology — All systems ready');
    });

    // ============================================================
    // EXPOSE FUNCTIONS FOR PAGE-SPECIFIC USE
    // ============================================================
    window.LYNX = {
        initProjects: initProjects,
        setProjects: setProjects,
        renderProjects: renderProjects,
        initFilters: initFilters,
        SELECTED_REPOS: SELECTED_REPOS
    };

})();