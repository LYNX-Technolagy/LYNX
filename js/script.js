// ============================================================
// LYNX Technology — Main JavaScript
// Organized & Modular
// ============================================================

// ============================================================
// 1. CONFIGURATION
// ============================================================
const CONFIG = {
    GITHUB_USERNAME: 'LYNX-Technolagy',
    SCREENSHOT_API: {
        // Primary: ScreenshotOne (free tier, reliable)
        primary: (url) => `https://api.screenshotone.com/take?url=${encodeURIComponent(url)}&viewport_width=1200&viewport_height=630&format=jpg&image_quality=85`,
        // Fallback 1: PagePeeker (simple, free)
        fallback1: (url) => `http://api.pagepeeker.com/v2/thumbs.php?size=x&url=${encodeURIComponent(url)}`,
        // Fallback 2: s-shot.ru (free, works well)
        fallback2: (url) => `https://s-shot.ru/1920x1080/1024/?${encodeURIComponent(url)}`,
        // Last resort: OpenGraph
        fallback3: (repo) => `https://opengraph.githubassets.com/1/${repo}`
    }
};

// ============================================================
// 2. UTILITY FUNCTIONS
// ============================================================

// Format repository name to title case
function formatRepoName(name) {
    return name
        .replace(/[-_]/g, ' ')
        .replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase());
}

// Get tags from repository topics or language
function getRepoTags(repo) {
    if (repo.topics && repo.topics.length > 0) {
        return repo.topics.slice(0, 4);
    }
    return repo.language ? [repo.language] : ['Code'];
}

// Determine if repo should be featured (based on stars)
function isFeatured(repo) {
    return repo.stargazers_count > 3;
}

// ============================================================
// 3. IMAGE HANDLING — SCREENSHOT API WITH FALLBACKS
// ============================================================

function getProjectImage(repo) {
    // If repo has a homepage/live demo, try to screenshot it
    if (repo.homepage) {
        // Try multiple screenshot services with priority order
        const screenshotServices = [
            CONFIG.SCREENSHOT_API.primary(repo.homepage),
            CONFIG.SCREENSHOT_API.fallback1(repo.homepage),
            CONFIG.SCREENSHOT_API.fallback2(repo.homepage)
        ];
        
        // Return the first one (primary), image onerror will handle fallbacks
        return screenshotServices[0];
    }
    
    // If no homepage, use placeholder or OpenGraph
    const title = formatRepoName(repo.name);
    return `https://placehold.co/600x400/1a1a1a/ffffff?text=${encodeURIComponent(title)}`;
}

// ============================================================
// 4. GITHUB API FUNCTIONS
// ============================================================

// Fetch public repositories from GitHub
async function fetchGitHubProjects(username) {
    try {
        const response = await fetch(
            `https://api.github.com/users/${username}/repos?sort=updated&per_page=100&type=public`
        );
        
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching GitHub projects:', error);
        return [];
    }
}

// Convert GitHub repos to project data
function convertReposToProjects(repos) {
    return repos
        .filter(repo => !repo.fork && !repo.archived)
        .map(repo => ({
            id: repo.id,
            title: formatRepoName(repo.name),
            description: repo.description || 'No description provided.',
            image: getProjectImage(repo),
            tags: getRepoTags(repo),
            link: repo.html_url,
            featured: isFeatured(repo),
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            language: repo.language,
            homepage: repo.homepage,
            full_name: repo.full_name
        }));
}

// ============================================================
// 5. RENDER FUNCTIONS
// ============================================================

// Render project cards
function renderProjects(projects, containerId = 'projectsContainer') {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';

    if (projects.length === 0) {
        container.innerHTML = `
            <div style="grid-column:1/-1;text-align:center;padding:3rem 0;color:#737373;">
                <p>No public repositories found. Check back soon!</p>
            </div>
        `;
        return;
    }

    // Show first 6 projects
    const limitedProjects = projects.slice(0, 6);

    limitedProjects.forEach((project) => {
        const card = document.createElement('div');
        card.className = 'fade-up showcase-card';

        const tagsHTML = project.tags.map(tag =>
            `<span>${tag}</span>`
        ).join('');

        // Build image with fallback chain
        const imageHTML = `
            <img src="${project.image}" 
                 alt="${project.title}" 
                 loading="lazy"
                 onerror="this.onerror=null; this.src='${getFallbackImage(project)}'">
        `;

        card.innerHTML = `
            <div class="image-wrapper">
                ${imageHTML}
            </div>
            <div class="content">
                <div class="tags">${tagsHTML}</div>
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="stats">
                    ${project.language ? `<span>💻 ${project.language}</span>` : ''}
                    ${project.stars ? `<span>⭐ ${project.stars}</span>` : ''}
                    ${project.forks ? `<span>🔀 ${project.forks}</span>` : ''}
                </div>
                <a href="${project.link}" target="_blank" rel="noopener" class="link">View Repository →</a>
            </div>
        `;

        container.appendChild(card);
    });

    // Trigger fade-up animation
    setTimeout(() => {
        document.querySelectorAll('.showcase-card.fade-up').forEach(el => {
            el.classList.add('visible');
        });
    }, 100);
}

// ============================================================
// 6. IMAGE FALLBACK CHAIN
// ============================================================

function getFallbackImage(project) {
    // Try different screenshot APIs in order
    if (project.homepage) {
        const fallbackServices = [
            `http://api.pagepeeker.com/v2/thumbs.php?size=x&url=${encodeURIComponent(project.homepage)}`,
            `https://s-shot.ru/1920x1080/1024/?${encodeURIComponent(project.homepage)}`,
            `https://opengraph.githubassets.com/1/${project.full_name}`
        ];
        
        // Return the first fallback
        return fallbackServices[0];
    }
    
    // Ultimate fallback: placeholder
    return `https://placehold.co/600x400/1a1a1a/ffffff?text=${encodeURIComponent(project.title)}`;
}

// ============================================================
// 7. MAIN FUNCTION — Load Projects
// ============================================================

async function renderProjectsFromGitHub(username, containerId = 'projectsContainer') {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with id "${containerId}" not found.`);
        return;
    }

    // Show loading state
    container.innerHTML = `
        <div class="loading-projects">
            <div class="spinner"></div>
            <p>Loading projects from GitHub...</p>
        </div>
    `;

    try {
        const repos = await fetchGitHubProjects(username);
        
        if (!repos || repos.length === 0) {
            container.innerHTML = `
                <div style="grid-column:1/-1;text-align:center;padding:3rem 0;color:#737373;">
                    <p>No public repositories found.</p>
                </div>
            `;
            return;
        }

        const projects = convertReposToProjects(repos);
        renderProjects(projects, containerId);

        console.log(`✅ Loaded ${projects.length} projects from GitHub`);

    } catch (error) {
        container.innerHTML = `
            <div style="grid-column:1/-1;text-align:center;padding:3rem 0;color:#737373;">
                <p>⚠️ Could not load projects. Please try again later.</p>
            </div>
        `;
    }
}

// ============================================================
// 8. HERO INTERACTIONS
// ============================================================

function initHeroInteractions() {
    const heroSection = document.getElementById('heroSection');
    const heroGlow = document.getElementById('heroGlow');
    const heroGlowTouch = document.getElementById('heroGlowTouch');
    const heroTiltInner = document.getElementById('heroTiltInner');

    // Desktop: Mouse tracking glow
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

    // Mobile: Touch glow
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

    // Mobile: Tilt effect
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        if (heroSection && heroTiltInner) {
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
                heroTiltInner.style.setProperty('--rotateX', '0deg');
                heroTiltInner.style.setProperty('--rotateY', '0deg');
            }, { passive: true });
        }
    }
}

// ============================================================
// 9. LETTER SPLIT ANIMATION
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
// 10. FADE-UP ANIMATIONS
// ============================================================

function initFadeUpAnimations() {
    const fadeElements = document.querySelectorAll('.fade-up');

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

    // Handle already visible elements
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
// 11. NAVIGATION
// ============================================================

function initNavigation() {
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('open');
        });

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('open');
            });
        });
    }

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 100) {
                navbar.style.background = 'rgba(5, 5, 5, 0.9)';
            } else {
                navbar.style.background = 'rgba(5, 5, 5, 0.7)';
            }
        }, { passive: true });
    }
}

// ============================================================
// 12. SERVICE HERO GLOW (for service pages)
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
// 13. CONTACT FORM HANDLING
// ============================================================

function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const submitBtn = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');
    const submitLoading = document.getElementById('submitLoading');
    const formSuccess = document.getElementById('formSuccess');
    const formError = document.getElementById('formError');
    const errorMessage = document.getElementById('errorMessage');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Reset error
        if (formError) formError.classList.remove('show');

        // Validate required fields
        const name = document.getElementById('name')?.value.trim();
        const email = document.getElementById('email')?.value.trim();
        const message = document.getElementById('message')?.value.trim();

        if (!name || !email || !message) {
            if (errorMessage) {
                errorMessage.textContent = 'Please fill in all required fields (Name, Email, Message).';
            }
            if (formError) formError.classList.add('show');
            return;
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            if (errorMessage) {
                errorMessage.textContent = 'Please enter a valid email address.';
            }
            if (formError) formError.classList.add('show');
            return;
        }

        // Show loading state
        if (submitBtn) submitBtn.disabled = true;
        if (submitText) submitText.style.display = 'none';
        if (submitLoading) submitLoading.style.display = 'inline';

        try {
            // Simulate form submission (replace with actual API call)
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Success
            if (form) form.style.display = 'none';
            if (formSuccess) formSuccess.classList.add('show');

        } catch (error) {
            if (errorMessage) {
                errorMessage.textContent = 'Something went wrong. Please try again later.';
            }
            if (formError) formError.classList.add('show');

        } finally {
            // Reset button
            if (submitBtn) submitBtn.disabled = false;
            if (submitText) submitText.style.display = 'inline';
            if (submitLoading) submitLoading.style.display = 'none';
        }
    });

    // Real-time validation feedback
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.style.borderColor = 'rgba(239, 68, 68, 0.4)';
            } else {
                this.style.borderColor = '';
            }
        });

        input.addEventListener('input', function() {
            if (this.value.trim()) {
                this.style.borderColor = 'rgba(255,255,255,0.15)';
            }
        });
    });
}

// ============================================================
// 14. WAITLIST FORM HANDLING
// ============================================================

function initWaitlistForm() {
    const form = document.getElementById('waitlistForm');
    if (!form) return;

    const emailInput = document.getElementById('waitlistEmail');
    const btn = document.getElementById('waitlistBtn');
    const text = document.getElementById('waitlistText');
    const loading = document.getElementById('waitlistLoading');
    const success = document.getElementById('waitlistSuccess');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        if (!emailInput.value || !emailInput.value.includes('@')) {
            emailInput.style.borderColor = 'rgba(239, 68, 68, 0.4)';
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
            emailInput.value = '';
            success.classList.add('show');
            form.querySelector('.btn-primary').style.display = 'none';
        }, 1500);
    });
}

// ============================================================
// 15. INITIALIZATION — Run on DOM Ready
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize core features
    initNavigation();
    initFadeUpAnimations();
    initLetterAnimation();
    initHeroInteractions();

    // Initialize page-specific features
    initServiceHeroGlow();
    initContactForm();
    initWaitlistForm();

    // Load GitHub projects (if on Full-Stack page)
    const projectsContainer = document.getElementById('projectsContainer');
    if (projectsContainer) {
        renderProjectsFromGitHub(CONFIG.GITHUB_USERNAME);
    }

    // Log completion
    console.log('✅ LYNX Technology — All systems initialized');
});

// ============================================================
// 16. EXPOSE FUNCTIONS GLOBALLY (for inline onclick handlers)
// ============================================================
window.renderProjects = renderProjects;
window.renderProjectsFromGitHub = renderProjectsFromGitHub;
window.filterProjects = filterProjects;
window.CONFIG = CONFIG;