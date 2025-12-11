# Portfolio Website (Bootstrap + Vanilla JS)

This repository contains a professional responsive portfolio website built with HTML5, Bootstrap 5, modern CSS (variables), and vanilla JavaScript (ES6+).

Default placeholders in the code:
- NAME, ROLE, LOCATION, SHORT BIO
- GITHUB_USERNAME: `Kundan16082001`
- WHATSAPP_NUMBER: `7378997339` (replace with full international number, e.g., `919XXXXXXXXX`)

Files included:
- `index.html` — main single-page website
- `assets/css/style.css` — custom styles and dark-mode variables
- `assets/js/main.js` — GitHub integration, UI interactions
- `assets/img/profile-placeholder.svg` — placeholder profile image
- `assets/img/project-placeholder.svg` — placeholder project image
- `resume.pdf` — placeholder resume (replace with your resume PDF)
- `.gitignore` — example to ignore system files

Features
- Sticky navbar with links (Home, About, Projects, Skills, Contact, Resume)
- Hero section with CTA and social icons
- About & Skills sections with badges and progress bars
- Projects section that dynamically fetches public repositories from GitHub (max 12, non-forks)
- Project details modal for expanded info
- Contact form with client-side validation and mailto fallback
- Floating WhatsApp contact button (uses `https://wa.me/`)
- Dark mode toggle persisted in `localStorage`
- Accessible markup and basic animations

GitHub API integration
The site fetches repositories from:

```
https://api.github.com/users/Kundan16082001/repos?sort=updated&per_page=12
```

Only non-fork repositories are displayed. The UI handles API errors and rate limiting by showing an informative message.

If you need to show private repositories:
1. Create a GitHub Personal Access Token (PAT) with `repo` scope.
2. DO NOT embed the token in client-side code for public sites.
3. Prefer a server-side proxy or serverless function to add the Authorization header:
   - Example header: `Authorization: token YOUR_TOKEN`
4. See "Netlify/Serverless" section below for a simple proxy recipe.

Customization
- Replace all placeholder text: NAME, ROLE, SHORT BIO, LOCATION, email address, and social links.
- Replace `assets/img/profile-placeholder.svg` with your real headshot (optimize to ~200–300 KB or less).
- Replace `resume.pdf` with your actual resume.
- Edit `assets/css/style.css` to change accent colors (CSS variables near top of file).
- Update `assets/js/main.js` constants if you need to change the GitHub username or WhatsApp number.

Deployment

GitHub Pages
1. Create a GitHub repository and push the project.
2. In the repo settings > Pages, set the source to the `main` branch (root).
3. The site will be available at `https://<your-username>.github.io/<repo>/`.

Netlify
1. Drag & drop the project folder to Netlify (or connect via Git).
2. Configure deploy settings (build command not needed for static site).
3. Add environment variables if using a serverless function for private repo access.

Netlify serverless (optional) — proxy for GitHub private repos
- Create a Netlify function that calls the GitHub API with a PAT stored as an environment variable.
- Fetch from the function (server-side) instead of client-side to avoid revealing the token.

Accessibility & Performance
- The site uses semantic HTML, aria attributes for modal and dynamic controls.
- Images should be optimized and served in modern formats (WebP) for performance.
- Minify CSS/JS for production or use a bundler.
- Use Lighthouse in Chrome DevTools to test accessibility and performance.

Security
- Never commit personal tokens or secrets. Use environment variables in CI or serverless functions.

Production tips
- Gzip or Brotli compress assets on the server.
- Use a CDN for static files (optional).
- Minify and combine CSS/JS for faster load times.

License & Attribution
- Free to use and customize.
- Fonts from Google Fonts (Inter) — follow Google Fonts license.
- Bootstrap & Bootstrap Icons via CDN.

If you'd like, I can:
- Generate a minified production build,
- Add a simple Netlify function example for private repo access,
- Or push the project to a GitHub repo (if you provide repository details).

Happy to help further!