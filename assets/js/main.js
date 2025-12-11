/* Main JavaScript for portfolio
   - Fetches GitHub repos and renders project cards
   - Handles contact form (client-side validation + mailto fallback)
   - Dark mode toggle persisted in localStorage
   - Basic fade-in on scroll for sections
*/

/* Replace these values if you want; defaults follow your request */
const GITHUB_USERNAME = 'Kundan16082001';
const WHATSAPP_NUMBER = '7378997339'; // Replace with full international number if needed
const REPO_API = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=12`;

/* DOM elements */
const projectsGrid = document.getElementById('projects-grid');
const projectsLoading = document.getElementById('projects-loading');
const projectsError = document.getElementById('projects-error');
const projectModal = new bootstrap.Modal(document.getElementById('projectModal'));
const yearEl = document.getElementById('year');

/* Initialize page */
document.addEventListener('DOMContentLoaded', () => {
  yearEl.textContent = new Date().getFullYear();
  enableTooltips();
  initTheme();
  fetchAndRenderRepos();
  initContactForm();
  initScrollReveal();
});

/* Enable Bootstrap tooltips */
function enableTooltips(){
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
}

/* Theme toggle with localStorage persistence */
function initTheme() {
  const root = document.documentElement;
  const current = localStorage.getItem('theme');
  if (current === 'dark') root.classList.add('dark');

  // button
  const btn = document.getElementById('theme-toggle');
  btn.addEventListener('click', () => {
    const isDark = root.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    btn.setAttribute('aria-pressed', String(isDark));
  });
}

/* Fetch repos from GitHub API and render */
async function fetchAndRenderRepos(){
  try {
    const res = await fetch(REPO_API);
    if (!res.ok) {
      // Handle rate limit or other errors gracefully
      throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
    }
    const repos = await res.json();
    const filtered = repos.filter(r => !r.fork);
    if (!filtered.length) {
      projectsGrid.innerHTML = '<div class="col-12"><div class="alert alert-info">No repositories to show.</div></div>';
      return;
    }

    // Clear loading
    projectsLoading?.remove();

    // Render cards
    filtered.forEach(repo => {
      const col = document.createElement('div');
      col.className = 'col-md-6 col-lg-4 fade-in';
      col.innerHTML = createRepoCard(repo);
      projectsGrid.appendChild(col);

      // Hook up details button
      const btn = col.querySelector('.repo-details-btn');
      btn.addEventListener('click', () => openRepoModal(repo));
    });

    // reveal initial fade-in
    setTimeout(() => revealVisible(), 150);

  } catch (err) {
    console.error(err);
    projectsLoading?.remove();
    projectsError.innerHTML = `<div class="alert alert-warning">Unable to load GitHub projects right now. (${err.message})</div>`;
  }
}

/* Create HTML for a repo card (Bootstrap card) */
function createRepoCard(repo){
  const name = escapeHtml(repo.name);
  const desc = escapeHtml(repo.description || 'No description provided.');
  const lang = escapeHtml(repo.language || '—');
  const stars = repo.stargazers_count || 0;
  const homepage = repo.homepage ? repo.homepage : '';
  const repoUrl = repo.html_url;

  return `
    <div class="card h-100">
      <div class="card-body d-flex flex-column">
        <h5 class="card-title">${name}</h5>
        <p class="card-text text-muted mb-3">${desc}</p>
        <div class="mt-auto d-flex justify-content-between align-items-center">
          <small class="text-muted"><i class="bi bi-code-slash"></i> ${lang}</small>
          <small class="text-muted"><i class="bi bi-star-fill text-warning"></i> ${stars}</small>
        </div>
      </div>
      <div class="card-footer bg-transparent border-0 d-flex gap-2">
        <a class="btn btn-sm btn-outline-primary flex-grow-1" href="${repoUrl}" target="_blank" rel="noopener">View Repo</a>
        ${homepage ? `<a class="btn btn-sm btn-primary" href="${homepage}" target="_blank" rel="noopener">Live</a>` : `<button class="btn btn-sm btn-secondary repo-details-btn" type="button">Details</button>`}
      </div>
    </div>
  `;
}

/* Opens the Bootstrap modal with repo details */
function openRepoModal(repo){
  document.getElementById('projectModalLabel').textContent = repo.name;
  document.getElementById('projectModalDescription').textContent = repo.description || 'No description.';
  document.getElementById('projectModalLang').textContent = repo.language || '—';
  document.getElementById('projectModalStars').textContent = repo.stargazers_count || '0';
  const repoLink = document.getElementById('projectModalRepo');
  repoLink.href = repo.html_url;
  const demoLink = document.getElementById('projectModalDemo');
  if (repo.homepage) {
    demoLink.href = repo.homepage;
    demoLink.classList.remove('d-none');
    demoLink.textContent = 'Live demo';
  } else {
    demoLink.href = '#';
    demoLink.classList.add('d-none');
  }
  projectModal.show();
}

/* Simple escape to avoid injecting repo descriptions with markup */
function escapeHtml(unsafe){
  return unsafe
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

/* Contact form: validate and fallback to mailto: */
function initContactForm(){
  const form = document.getElementById('contact-form');
  const result = document.getElementById('contact-result');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic native validation
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');

    [name, email, message].forEach(el => {
      if (!el.checkValidity()) el.classList.add('is-invalid');
      else el.classList.remove('is-invalid');
    });

    if (!form.checkValidity()) {
      result.textContent = 'Please fill all required fields.';
      result.className = 'error';
      return;
    }

    // No backend: build mailto fallback
    const subject = encodeURIComponent(`Portfolio contact from ${name.value}`);
    const body = encodeURIComponent(`${message.value}\n\n— ${name.value}\n${email.value}`);
    const mailto = `mailto:you@example.com?subject=${subject}&body=${body}`;

    // Open user's email client
    window.location.href = mailto;

    result.textContent = 'Opening your email client…';
    result.className = 'success';

    // reset form after small delay
    setTimeout(()=> form.reset(), 900);
  });
}

/* Fade-in on scroll simple implementation */
function initScrollReveal(){
  const nodes = document.querySelectorAll('.fade-in, section');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  nodes.forEach(n => observer.observe(n));
}

/* Reveal any visible fade-in cards */
function revealVisible(){
  document.querySelectorAll('.fade-in').forEach(el => {
    el.classList.add('visible');
  });
}