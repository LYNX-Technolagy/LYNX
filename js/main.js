// ============================================================
// LYNX Technology — Centralized JavaScript
// ============================================================

(function () {
    'use strict';

    // ============================================================
    // 1. MOBILE MENU
    // ============================================================
    function initMobileMenu() {
        var toggle = document.getElementById('navToggle');
        var menu = document.getElementById('mobileMenu');

        if (!toggle || !menu) return;

        toggle.addEventListener('click', function () {
            var open = menu.classList.toggle('open');
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });

        menu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                menu.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
            });
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && menu.classList.contains('open')) {
                menu.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // ============================================================
    // 2. PROJECTS (Full-Stack page)
    //    Single source of truth — do NOT duplicate this array
    //    inside fullstack.html.
    // ============================================================
    var SELECTED_REPOS = [
        {
            name: 'Reseach Team Template',
            description: 'A modern, mobile-first web template for research teams. Built with vanilla HTML/CSS/JS, no build step, and a live ASCII-art image background rendered to canvas. Drag-and-drop deployable, sub-1MB, accessible, and fully documented for easy customisation.',
            type: 'template',
            tags: ['template', 'HTML', 'CSS', 'Custom Script'],
            screenshot: '/assests/images/thumbnails/research-team-preview.jpg',
            demoUrl: 'https://lynx-technolagy.github.io/research-team-template/',
            stars: 0,
            forks: 0,
        },
        {
            name: 'Korahs Krumbs',
            description: 'This is a small bakery website, featuring a custom CMS and CRM. Users can place orders directly via the website, and the bakery can handle all the orders via the website',
            type: 'web-app',
            tags: ['Custom CMS & CRM', 'HTML', 'CSS'],
            screenshot: '/assests/images/thumbnails/korahs-krumbs-preview.jpg',
            demoUrl: 'https://korahskrumbs.netlify.app/',
            stars: 0,
            forks: 0,
            language: 'JavaScript'
        },
        {
          name: 'STUDIO ASCII',
          description: 'STUDIO ASCII — a modern, mobile-first web template for creative studios. Built with vanilla HTML/CSS/JS, no build step, and a live ASCII-art image background rendered to canvas. Drag-and-drop deployable, sub-1MB, accessible, and fully documented for easy customisation.',
          type: 'template',
          tags: ['template', 'HTML', 'CSS', 'Custom Script'],
          screenshot: '/assests/images/thumbnails/studio-ascii-preview.jpg',
          repoUrl: 'https://github.com/LYNX-Technolagy/STUDIO-ACSII',
          demoUrl: 'https://lynx-technolagy.github.io/STUDIO-ACSII/',
          stars: 0,
          forks: 0,
          Langauge: 'HTML'
        },
        {
            name: 'Smith and Associates',
            description: 'An immersive web template that puts the client experience first.',
            type: 'template',
            tags: ['template', 'HTML', 'CSS'],
            screenshot: '/assests/images/thumbnails/smith-legal-preview.jpg',
            repoUrl: 'https://github.com/luvoxokiyana/legal-firm-landing/',
            demoUrl: 'https://luvoxokiyana.github.io/legal-firm-landing/',
            stars: 0,
            forks: 0,
            language: 'HTML'
        },
        {
            name: 'Huddle',
            description: 'Find pickup games, tournaments, and leagues near you.',
            type: 'web-app',
            tags: ['landing page', 'HTML', 'CSS'],
            screenshot: '/assests/images/thumbnails/huddle-preview.jpg',
            repoUrl: 'https://github.com/LYNX-Technolagy/huddle-landing-page',
            demoUrl: 'https://joinhuddleup.netlify.app/',
            stars: 0,
            forks: 0,
            language: 'HTML'
        },
        {
            name: 'Daily Dose',
            description: 'Education is for everyone.',
            type: 'template',
            tags: ['landing page', 'HTML', 'CSS'],
            screenshot: '/assests/images/thumbnails/dailydose-preview.jpg',
            repoUrl: 'https://github.com/LYNX-Technolagy/dailydose-landing',
            demoUrl: 'https://lynx-technolagy.github.io/dailydose-landing/',
            stars: 0,
            forks: 0,
            language: 'HTML'
        },
        {
            name: 'Fornello',
            description: 'Aesthetic Italian restaurant website template.',
            type: 'template',
            tags: ['landing page', 'HTML', 'CSS'],
            screenshot: '/assests/images/thumbnails/fornello-preview.jpg',
            repoUrl: 'https://github.com/LYNX-Technolagy/italian-website-template',
            demoUrl: 'https://lynx-technolagy.github.io/italian-website-template/',
            stars: 0,
            forks: 0,
            language: 'HTML'
        },
    ];

    function getPlaceholderImage(title) {
        return "data:image/svg+xml," + encodeURIComponent(
            '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400">' +
            '<rect width="600" height="400" fill="#E8F0EA"/>' +
            '<text x="300" y="200" text-anchor="middle" fill="#0F5132" font-family="JetBrains Mono, monospace" font-size="22" font-weight="600">' + title + '</text>' +
            '<text x="300" y="232" text-anchor="middle" fill="#6B6B6B" font-family="Inter, sans-serif" font-size="14">Preview coming soon</text>' +
            '</svg>'
        );
    }

    function renderProjects(filter) {
        var container = document.getElementById('projectsContainer');
        if (!container) return;

        var list = SELECTED_REPOS;

        if (filter && filter !== 'all') {
            list = list.filter(function (p) { return p.type === filter; });
        }

        if (!list.length) {
            container.innerHTML =
                '<div class="no-results">No projects in this category yet.</div>';
            return;
        }

        container.innerHTML = list.map(function (project) {
            var tags = project.tags.map(function (t) {
                return '<span>' + t + '</span>';
            }).join('');

            var imageSrc = project.screenshot || getPlaceholderImage(project.name);

            var actions =
                (project.repoUrl
                    ? '<a class="link" href="' + project.repoUrl + '" target="_blank" rel="noopener noreferrer"><i class="fab fa-github" aria-hidden="true"></i> Repository</a>'
                    : '') +
                (project.demoUrl
                    ? '<a class="link" href="' + project.demoUrl + '" target="_blank" rel="noopener noreferrer"><i class="fas fa-arrow-right" aria-hidden="true"></i> Live Demo</a>'
                    : '');

            var stats = '';
            if (project.language) stats += '<span>' + project.language + '</span>';
            if (project.stars) stats += '<span>' + project.stars + ' stars</span>';

            return (
                '<article class="showcase-card">' +
                    '<div class="image-wrapper">' +
                        '<img src="' + imageSrc + '" alt="' + project.name + '" loading="lazy">' +
                    '</div>' +
                    '<div class="content">' +
                        '<div class="tags">' + tags + '</div>' +
                        '<h3>' + project.name + '</h3>' +
                        '<p>' + project.description + '</p>' +
                        (stats ? '<div class="stats">' + stats + '</div>' : '') +
                        (actions ? '<div class="project-actions">' + actions + '</div>' : '') +
                    '</div>' +
                '</article>'
            );
        }).join('');
    }

    function initFilters() {
        var buttons = document.querySelectorAll('.filter-btn');
        if (!buttons.length) return;

        buttons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                buttons.forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');
                renderProjects(btn.dataset.filter || 'all');
            });
        });
    }

    function initProjects() {
        var container = document.getElementById('projectsContainer');
        if (!container) return;
        renderProjects('all');
        initFilters();
    }

    // ============================================================
    // 3. CONTACT FORM (Formspree)
    // ============================================================
    function initContactForm() {
        var form = document.getElementById('contactForm');
        if (!form) return;

        var submitBtn = form.querySelector('.submit-btn');
        var submitText = document.getElementById('submitText');
        var submitLoading = document.getElementById('submitLoading');
        var success = document.getElementById('formSuccess');
        var error = document.getElementById('formError');
        var errorMessage = document.getElementById('errorMessage');

        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            if (error) error.classList.remove('show');
            if (success) success.classList.remove('show');

            var name = (document.getElementById('name') || {}).value || '';
            var email = (document.getElementById('email') || {}).value || '';
            var message = (document.getElementById('message') || {}).value || '';

            if (!name.trim() || !email.trim() || !message.trim()) {
                if (errorMessage) errorMessage.textContent = 'Please fill in all required fields (Name, Email, Message).';
                if (error) error.classList.add('show');
                return;
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
                if (errorMessage) errorMessage.textContent = 'Please enter a valid email address.';
                if (error) error.classList.add('show');
                return;
            }

            if (submitBtn) submitBtn.disabled = true;
            if (submitText) submitText.style.display = 'none';
            if (submitLoading) submitLoading.style.display = 'inline';

            try {
                var response = await fetch(form.action, {
                    method: 'POST',
                    body: new FormData(form),
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    form.reset();
                    if (success) {
                        success.classList.add('show');
                        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                } else {
                    throw new Error('Submission failed');
                }
            } catch (err) {
                if (errorMessage) errorMessage.textContent = 'Something went wrong. Please try again or email us directly.';
                if (error) error.classList.add('show');
            } finally {
                if (submitBtn) submitBtn.disabled = false;
                if (submitText) submitText.style.display = 'inline';
                if (submitLoading) submitLoading.style.display = 'none';
            }
        });
    }

    // ============================================================
    // 4. INIT
    // ============================================================
    document.addEventListener('DOMContentLoaded', function () {
        initMobileMenu();
        initProjects();
        initContactForm();
    });

})();