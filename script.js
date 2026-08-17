/* ========================================
   LYNX Technology — Global JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ——— Navigation Scroll Effect ———
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 80) {
        navbar.classList.add('nav-blur', 'border-b', 'border-white/5');
      } else {
        navbar.classList.remove('nav-blur', 'border-b', 'border-white/5');
      }
    }, { passive: true });
  }

  // ——— Mobile Menu Toggle ———
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuLines = menuToggle ? menuToggle.querySelectorAll('.menu-line') : [];
  let menuOpen = false;

  function toggleMenu(open) {
    menuOpen = typeof open === 'boolean' ? open : !menuOpen;
    mobileMenu.classList.toggle('open', menuOpen);
    document.body.style.overflow = menuOpen ? 'hidden' : '';

    if (menuOpen) {
      menuLines[0].style.transform = 'rotate(45deg) translateY(4px)';
      menuLines[1].style.opacity = '0';
      menuLines[2].style.transform = 'rotate(-45deg) translateY(-4px)';
      menuLines[2].style.width = '1.5rem';
    } else {
      menuLines[0].style.transform = '';
      menuLines[1].style.opacity = '1';
      menuLines[2].style.transform = '';
      menuLines[2].style.width = '';
    }
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', () => toggleMenu());
  }

  // Close mobile menu on link click
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // ——— Intersection Observer: Fade-Up Animations ———
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));

  // ——— Counter Animation ———
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '';
        const duration = 2000;
        const start = performance.now();

        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // Ease-out-quart
          const eased = 1 - Math.pow(1 - progress, 4);
          const current = Math.round(eased * target);
          el.textContent = current + suffix;
          if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

  // ——— Card Glow: Follow Mouse ———
  document.querySelectorAll('.card-glow').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', x + '%');
      card.style.setProperty('--mouse-y', y + '%');
    });
  });

  // ——— Contact Form Handling ———
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const btn = document.getElementById('submitBtn');
      const success = document.getElementById('formSuccess');

      btn.textContent = 'Sending...';
      btn.disabled = true;

      setTimeout(() => {
        btn.style.display = 'none';
        success.classList.remove('hidden');
        this.reset();
      }, 1500);
    });
  }

  // ——— Smooth Scroll for Anchor Links ———
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ============================================================
  // FETCH PROJECTS FROM GITHUB API
  // ============================================================
  async function fetchGitHubProjects(username) {
    try {
      // Fetch public repositories from the GitHub API
      const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const repos = await response.json();
      return repos;
    } catch (error) {
      console.error('Error fetching GitHub projects:', error);
      return [];
    }
  }

  // ============================================================
  // CONVERT GITHUB REPOS TO PROJECT CARDS
  // ============================================================
  function convertReposToProjects(repos) {
    return repos.map(repo => {
      // Extract topics as tags (GitHub topics are perfect for this)
      const tags = repo.topics && repo.topics.length > 0
        ? repo.topics.slice(0, 4)
        : [repo.language || 'Code'].filter(Boolean);

      return {
        id: repo.id,
        title: repo.name.replace(/-/g, ' ').replace(/_/g, ' '),
        description: repo.description || 'No description provided.',
        // Use the repo's OG image or a placeholder
        image: `https://opengraph.githubassets.com/1/${repo.full_name}`,
        tags: tags,
        link: repo.html_url,
        featured: repo.stargazers_count > 5, // Feature repos with more than 5 stars
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        updated: repo.updated_at
      };
    });
  }

  // ============================================================
  // RENDER FUNCTION - Updated for GitHub data
  // ============================================================
  async function renderProjectsFromGitHub(username, containerId = 'projectsContainer') {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container with id "${containerId}" not found.`);
      return;
    }

    // Show loading state
    container.innerHTML = `
        <div class="loading-projects" style="grid-column: 1/-1; text-align: center; padding: 3rem 0;">
            <div style="display: inline-block; width: 40px; height: 40px; border: 2px solid rgba(255,255,255,0.1); border-top-color: #fff; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
            <p style="color: #737373; margin-top: 1rem;">Loading projects from GitHub...</p>
        </div>
        <style>
            @keyframes spin { to { transform: rotate(360deg); } }
        </style>
    `;

    try {
      const repos = await fetchGitHubProjects(username);

      if (!repos || repos.length === 0) {
        container.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 3rem 0; color: #737373;">
                    <p>No public repositories found.</p>
                </div>
            `;
        return;
      }

      // Convert and render projects
      const projects = convertReposToProjects(repos);
      renderProjects(projects, containerId);

      // Update project count
      updateProjectCount(projects);

    } catch (error) {
      container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem 0; color: #737373;">
                <p>⚠️ Could not load projects. Please try again later.</p>
            </div>
        `;
    }
  }

  // ============================================================
  // RENDER FUNCTION - Creates the project cards from data
  // ============================================================
  function renderProjects(projects, containerId = 'projectsContainer') {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Clear existing content
    container.innerHTML = '';

    // Build the project cards HTML
    projects.forEach((project, index) => {
      const card = document.createElement('div');
      card.className = 'fade-up project-card';
      card.setAttribute('data-index', index);
      card.style.setProperty('--i', index);

      // Create tags HTML
      const tagsHTML = project.tags.map(tag =>
        `<span class="project-tag">${tag}</span>`
      ).join('');

      // Create stars/forks info
      const statsHTML = `
            <div class="project-stats">
                ${project.stars !== undefined ? `<span>⭐ ${project.stars}</span>` : ''}
                ${project.forks !== undefined ? `<span>🔀 ${project.forks}</span>` : ''}
            </div>
        `;

      card.innerHTML = `
            <div class="project-image-wrapper">
                <img src="${project.image}" alt="${project.title}" class="project-image" loading="lazy" 
                     onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22600%22 height=%22400%22%3E%3Crect width=%22600%22 height=%22400%22 fill=%22%23111111%22/%3E%3Ctext x=%22300%22 y=%22200%22 text-anchor=%22middle%22 fill=%22%23525252%22 font-family=%22sans-serif%22 font-size=%2224%22%3E${project.title}%3C/text%3E%3C/svg%3E'">
                ${project.featured ? '<span class="project-featured-badge">Featured</span>' : ''}
                <div class="project-image-overlay">
                    <a href="${project.link}" target="_blank" rel="noopener noreferrer" class="project-link-btn">View on GitHub →</a>
                </div>
            </div>
            <div class="project-content">
                <div class="project-tags">
                    ${tagsHTML}
                </div>
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                ${statsHTML}
                <a href="${project.link}" target="_blank" rel="noopener noreferrer" class="project-link">View Repository →</a>
            </div>
        `;

      container.appendChild(card);
    });

    // Trigger fade-up animation after render
    setTimeout(() => {
      document.querySelectorAll('.project-card.fade-up').forEach(el => {
        el.classList.add('visible');
      });
    }, 100);
  }

  const GITHUB_USERNAME = 'LYNX-Technolagy';

  // Render projects from GitHub
  renderProjectsFromGitHub(GITHUB_USERNAME);

});