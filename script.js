// ---------- Theme ----------
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme');
if (savedTheme) root.setAttribute('data-theme', savedTheme);
themeToggle.addEventListener('click', () => {
  const current = root.getAttribute('data-theme') === 'light' ? 'light' :
                  (root.getAttribute('data-theme') === 'dark' ? 'dark' :
                  (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'));
  const next = current === 'light' ? 'dark' : 'light';
  root.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

// ---------- CV link (single source of truth) ----------
const CV_URL = 'Abdullah_Al_Mahmud_Joy_CV.pdf';
['navCvBtn','heroCvBtn','ctaCvBtn','sideCvBtn'].forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;
  el.setAttribute('href', CV_URL);
  el.setAttribute('target', '_blank');
  el.setAttribute('rel', 'noopener');
});

// ---------- Nav scroll state + active link + progress bar ----------
const nav = document.getElementById('nav');
const progressBar = document.getElementById('progressBar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('main > section[id], .hero[id]');

function onScroll() {
  nav.classList.toggle('scrolled', window.scrollY > 10);
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
  progressBar.style.width = pct + '%';

  let currentId = 'home';
  const scrollPos = window.scrollY + 140;
  sections.forEach(sec => {
    if (sec.offsetTop <= scrollPos) currentId = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
  });
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ---------- JS-driven anchor scroll (bulletproof against CSS scroll-margin cache/support issues) ----------
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const navHeight = nav.getBoundingClientRect().height;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    history.pushState(null, '', '#' + id);
  });
});

// ---------- Mobile menu ----------
const hamburger = document.getElementById('hamburger');
const navLinksWrap = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinksWrap.classList.toggle('open');
  hamburger.classList.toggle('open');
});
navLinksWrap.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => navLinksWrap.classList.remove('open'))
);

// ---------- Hero cursor glow ----------
const heroBg = document.querySelector('.hero-bg');
if (heroBg && window.matchMedia('(hover: hover)').matches) {
  document.querySelector('.hero').addEventListener('mousemove', (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    heroBg.style.setProperty('--mx', x + '%');
    heroBg.style.setProperty('--my', y + '%');
  });
}

// ---------- Scroll reveal ----------
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ---------- Animated stat counters ----------
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseFloat(el.dataset.count);
    const isDecimal = el.dataset.decimal === 'true';
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = (isDecimal ? value.toFixed(2) : Math.round(value)) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    statObserver.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-num').forEach(el => statObserver.observe(el));

// ---------- Data: Featured Testing Projects ----------
const featuredProjects = [
  {
    icon: '📱',
    title: 'DMoney Manual Testing',
    category: 'QA',
    desc: 'Manual QA validation for a FinTech application flow focused on user journeys, functional coverage, and defect documentation.',
    points: [
      'Functional, exploratory, and acceptance-based testing',
      'Bug reporting with evidence-backed defect analysis',
      'Repository: github.com/almahmudjoy/DMoney-Manual-Testing'
    ],
    tags: ['Manual Testing', 'Bug Reporting', 'FinTech'],
    link: 'https://github.com/almahmudjoy/DMoney-Manual-Testing'
  },
  {
    icon: '🔗',
    title: 'DMoney API Integration Testing',
    category: 'QA',
    desc: 'Stateful backend validation covering onboarding, deposits, transfers, merchant payments, and balance verification in an API-driven workflow.',
    points: [
      'Mocha, Chai, and Axios integration test coverage',
      'Workflow validation across transaction lifecycle',
      'Repository: github.com/almahmudjoy/dmoney-api-integration-testing'
    ],
    tags: ['API Testing', 'Integration', 'Node.js'],
    link: 'https://github.com/almahmudjoy/dmoney-api-integration-testing'
  },
  {
    icon: '🧩',
    title: 'Blog REST API',
    category: 'QA',
    desc: 'API reliability testing for a blog service focusing on REST endpoints, validation, and functional behavior under common test scenarios.',
    points: [
      'Endpoint validation and request-response checking',
      'REST API quality assurance workflow',
      'Repository: github.com/almahmudjoy/blog-rest-api'
    ],
    tags: ['REST API', 'Postman', 'Backend Testing'],
    link: 'https://github.com/almahmudjoy/blog-rest-api'
  },
  {
    icon: '🗃️',
    title: 'Database Project',
    category: 'QA',
    desc: 'Database-focused project covering schema understanding, data validation, and query-driven verification for backend reliability.',
    points: [
      'Database validation and query review',
      'Data integrity and consistency checks',
      'Repository: github.com/almahmudjoy/database-project'
    ],
    tags: ['SQL', 'Database', 'Data Validation'],
    link: 'https://github.com/almahmudjoy/database-project'
  },
  {
    icon: '📝',
    title: 'Blog Management Application',
    category: 'QA',
    desc: 'Workflow-based software testing project for blog content management, covering user actions and end-to-end validation of application behavior.',
    points: [
      'Application workflow testing',
      'Feature validation and defect analysis',
      'Repository: github.com/almahmudjoy/blog-management-application'
    ],
    tags: ['Web App', 'Workflow Testing', 'UI Validation'],
    link: 'https://github.com/almahmudjoy/blog-management-application'
  },
  {
    icon: '⚡',
    title: 'Dmoney K6 Testing',
    category: 'QA',
    desc: 'Performance and load-aware API testing using K6 to evaluate responsiveness and stability under expected traffic conditions.',
    points: [
      'Load and performance-oriented API checks',
      'Traffic simulation and response analysis',
      'Repository: github.com/almahmudjoy/Dmoney-K6-Testing'
    ],
    tags: ['K6', 'Performance Testing', 'Load Testing'],
    link: 'https://github.com/almahmudjoy/Dmoney-K6-Testing'
  },
  {
    icon: '💸',
    title: 'DMoney API Testing',
    category: 'QA',
    desc: 'API-focused quality assurance project for a DMoney-style service covering authentication, business flows, and validation checks.',
    points: [
      'Automated API validation for core business flows',
      'Request/response validation and assertion coverage',
      'Repository: github.com/almahmudjoy/DMoney-API-Testing'
    ],
    tags: ['Postman', 'Newman', 'REST API'],
    link: 'https://github.com/almahmudjoy/DMoney-API-Testing'
  },
  {
    icon: '🎭',
    title: 'Automation on Playwright',
    category: 'QA',
    desc: 'Browser automation project focused on automated UI workflow validation for modern web application interaction and regression coverage.',
    points: [
      'Playwright-based UI automation',
      'Regression and interaction validation',
      'Repository: github.com/almahmudjoy/Automation-on-Playwright'
    ],
    tags: ['Playwright', 'Automation', 'UI Testing'],
    link: 'https://github.com/almahmudjoy/Automation-on-Playwright'
  }
];

const otherProjects = [
  { icon: '🦷', title: 'Dental Clinic Portal', category: 'Web', desc: 'Web portal for dental clinic appointments, patient feedback, and clinic management.', tags: ['PHP', 'HTML/CSS', 'MySQL'], link: '#' },
  { icon: '🗂️', title: 'Student Attendance System', category: 'Desktop', desc: 'GUI-based CRUD application for managing student attendance with data export.', tags: ['Python', 'GUI', 'CRUD'], link: '#' },
  { icon: '📝', title: 'Online Quiz System', category: 'Web', desc: 'MCQ platform with real-time leaderboard and quiz management features.', tags: ['Java', 'Quiz', 'Leaderboard'], link: '#' },
  { icon: '🧮', title: 'OOP Calculator', category: 'Desktop', desc: 'Object-oriented calculator demonstrating core OOP principles.', tags: ['C++', 'OOP'], link: '#' },
  { icon: '☕', title: 'Cafe Management System', category: 'Web', desc: 'Complete order, inventory, and billing management system.', tags: ['Java', 'MySQL'], link: '#' },
  { icon: '🗺️', title: 'Tour Guide App', category: 'Mobile', desc: 'Travel assistant with itinerary planning and destination recommendations.', tags: ['Android', 'Node.js'], link: '#' },
  { icon: '🏠', title: 'IoT Smart Home Automation', category: 'IoT', desc: 'Sensor-based home automation for security, lighting, and temperature.', tags: ['Arduino', 'Raspberry Pi', 'Python'], link: '#' }
];

function renderFeatured(list, container) {
  container.innerHTML = list.map((p, i) => `
    <article class="project-card reveal" data-cat="${p.category}" style="transition-delay:${(i % 3) * 90}ms">
      <div class="project-cover">${p.icon}</div>
      <div class="project-body">
        <div class="project-top">
          <h3>${p.title}</h3>
          <span class="project-cat">${p.category}</span>
        </div>
        <p class="project-desc">${p.desc}</p>
        <ul class="project-points">${p.points.map(pt => `<li>${pt}</li>`).join('')}</ul>
        <div class="project-tags">${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
        ${p.link && p.link !== '#' ? `<a class="project-link" href="${p.link}" target="_blank" rel="noopener">View on GitHub →</a>` : ''}
      </div>
    </article>
  `).join('');
}

function renderOther(list, container) {
  container.innerHTML = list.map((p, i) => `
    <article class="project-card reveal" data-cat="${p.category}" style="transition-delay:${(i % 4) * 80}ms">
      <div class="project-cover">${p.icon}</div>
      <div class="project-body">
        <div class="project-top">
          <h3>${p.title}</h3>
          <span class="project-cat">${p.category}</span>
        </div>
        <p class="project-desc">${p.desc}</p>
        <div class="project-tags">${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
        ${p.link && p.link !== '#' ? `<a class="project-link" href="${p.link}" target="_blank" rel="noopener">View on GitHub →</a>` : ''}
      </div>
    </article>
  `).join('');
}

renderFeatured(featuredProjects, document.getElementById('featuredProjects'));
renderOther(otherProjects, document.getElementById('otherProjects'));

const researchProjects = [
  {
    icon: '🧠',
    title: 'Brain Tumor Classification Using MRI',
    category: 'AI/ML',
    desc: 'Compared CNN architectures for MRI-based brain tumor classification and evaluated model performance across multiple deep learning baselines.',
    points: [
      'Experimental comparison of CNN architectures for tumor recognition',
      'Strong focus on quantitative evaluation and model interpretability',
      'Published in IEEE COMPAS 2025'
    ],
    tags: ['Featured Research', 'CNN', 'MRI', 'Deep Learning', 'Comparative Analysis'],
    link: 'https://ieeexplore.ieee.org/document/11381807'
  },
  {
    icon: '🌾',
    title: 'CropNet-XAI',
    category: 'AI/ML',
    desc: 'Explainable 1D-CNN framework for transparent crop yield prediction with model reasoning in agricultural forecasting.',
    points: [
      '1D-CNN architecture for crop yield prediction',
      'Explainable AI support for transparent decision-making',
      'Published in IEEE ICECTE 2026'
    ],
    tags: ['XAI', '1D-CNN', 'Crop Yield', 'Explainability'],
    link: 'https://ieeexplore.ieee.org/abstract/document/11429350'
  },
  {
    icon: '🌱',
    title: 'XAI-Crop',
    category: 'AI/ML',
    desc: 'Explainable counterfactual crop recommendation system using ensemble learning for transparent agricultural decision support.',
    points: [
      'Counterfactual recommendation framework',
      'Ensemble-based crop recommendation pipeline',
      'Published in IEEE ICECTE 2026'
    ],
    tags: ['Counterfactual AI', 'Ensemble Learning', 'Recommendation', 'Agriculture'],
    link: 'https://ieeexplore.ieee.org/abstract/document/11429373'
  },
  {
    icon: '🛣️',
    title: 'Pothole Detection Using Deep Learning',
    category: 'AI/ML',
    desc: 'Computer vision pipeline for detecting potholes using convolutional neural networks and transfer learning.',
    points: [
      'CNN and transfer-learning-based detection',
      'Road damage identification using image classification',
      'Published in IEEE ICECTE 2026'
    ],
    tags: ['Transfer Learning', 'Computer Vision', 'CNN', 'Road Safety'],
    link: 'https://ieeexplore.ieee.org/abstract/document/11429287'
  },
  {
    icon: '🍅',
    title: 'Potato and Mango Leaf Disease Classification',
    category: 'AI/ML',
    desc: 'Featured research project proposing an explainable ensemble learning framework for potato and mango leaf disease classification.',
    points: [
      'Combined PlantVillage potato and Kaggle mango datasets',
      'Soft-voting ensemble with MobileNetV3Small, EfficientNetV2B0, and ConvNeXtTiny',
      'Accepted for oral presentation; publication pending'
    ],
    tags: ['Featured Research', 'Grad-CAM', 'Ensemble Learning', 'Plant Disease'],
    link: 'https://github.com/almahmudjoy/Potato-and-Mango-Leaf-Disease-Classification'
  }
];

function renderResearchProjects(list, container) {
  container.innerHTML = list.map((p, i) => `
    <article class="project-card reveal" data-cat="${p.category}" style="transition-delay:${(i % 3) * 90}ms">
      <div class="project-cover">${p.icon}</div>
      <div class="project-body">
        <div class="project-top">
          <h3>${p.title}</h3>
          <span class="project-cat">${p.category}</span>
        </div>
        <p class="project-desc">${p.desc}</p>
        <ul class="project-points">${p.points.map(pt => `<li>${pt}</li>`).join('')}</ul>
        <div class="project-tags">${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
        <a class="project-link" href="${p.link}" target="_blank" rel="noopener">View Project →</a>
      </div>
    </article>
  `).join('');
}

renderResearchProjects(researchProjects, document.getElementById('researchProjects'));

// ---------- Data: Experience ----------
const experience = [
  {
    title: 'Software Engineer Intern', org: 'ClockoSoft', date: 'November 2026 – Present · Remote',
    badge: 'Professional Experience',
    desc: 'Developing and maintaining product features while ensuring quality through clean, maintainable code, manual and automated testing, and close collaboration with the engineering team.',
    highlights: [
      'Feature development & maintenance',
      'Clean, maintainable code',
      'Manual & automated test cases',
      'Bug identification & debugging',
      'Unit, integration & API testing',
      'Code review & defect fixes'
    ]
  },
  {
    title: '4IR Intern', org: 'Bangladesh Institute of Management (BIM)', date: 'September 2026 – Present',
    badge: 'Professional Experience',
    desc: 'Exploring 4IR technologies with a focus on AI, Machine Learning, and Research.',
    highlights: ['AI and ML exploration', 'Research-oriented learning', 'Emerging technologies']
  },
  {
    title: 'Teaching Assistant', org: 'Bangladesh University of Business and Technology', date: 'July 2025 – December 2025',
    badge: 'Academic Role',
    desc: 'Assisted in conducting undergraduate CSE laboratory sessions, supported student learning and technical understanding, and evaluated assignments with guidance on programming and problem solving.',
    highlights: ['Laboratory support', 'Assignment evaluation', 'Programming guidance', 'Student support']
  },
  {
    title: 'Ad-Hoc Committee Executive Member', org: 'BUBT IT Club', date: 'July 2025 – Present',
    badge: 'Leadership Role',
    desc: 'Serving as an executive member in the Ad-Hoc Committee to support club initiatives, coordinate tech events, and contribute to strategic planning for student engagement in IT and software activities.',
    highlights: ['Strategic planning and execution', 'Tech event coordination', 'Student engagement initiatives', 'IT community building']
  },
  {
    title: 'Volunteer', org: 'ICPC Dhaka Regional Contest', date: 'December 2025',
    badge: 'Volunteer',
    desc: 'Supported event operations and participant management during the regional programming contest; strengthened teamwork and problem-solving under pressure.',
    highlights: ['Event operations support', 'Participant management', 'Programming contest coordination', 'Team collaboration']
  },
  {
    title: 'Volunteer', org: 'Bangladesh Artificial Intelligence Olympiad 2025', date: 'May 2025',
    badge: 'Volunteer',
    desc: 'Managed logistics, participant coordination, and technical sessions at a national AI competition; gained hands-on experience in event operations and exposure to real-world AI applications.',
    highlights: ['Event logistics management', 'Participant coordination', 'Technical session support', 'AI competition exposure']
  },
  {
    title: 'Volunteer', org: 'ICPC Dhaka Regional Contest', date: 'November 2022',
    badge: 'Volunteer',
    desc: 'Supported event operations and participant management during the regional programming contest; strengthened teamwork and problem-solving under pressure.',
    highlights: ['Event operations support', 'Participant management', 'Programming contest coordination', 'Team collaboration']
  }
];

const education = [
  { title: 'MSc in Computer Science & Engineering', org: 'Military Institute of Science and Technology (MIST)', date: 'April 2026 – Ongoing', badge: 'Ongoing', extra: '' },
  { title: 'BSc in Computer Science & Engineering', org: 'Bangladesh University of Business and Technology (BUBT)', date: 'January 2022 – December 2025', badge: 'CGPA: 3.92', extra: '' },
  { title: 'Higher Secondary Certificate (HSC)', org: 'Birshrestha Munshi Abdur Rouf Public College', date: 'July 2017 – April 2019', badge: 'GPA: 5.00', extra: '' },
  { title: 'Secondary School Certificate (SSC)', org: 'Adarsha High School', date: 'January 2014 – March 2017', badge: 'GPA: 5.00', extra: '' }
];

function renderTimeline(list, container) {
  container.innerHTML = list.map((item, i) => `
    <div class="tl-item reveal" data-type="${item.badge}" style="transition-delay:${Math.min(i,4) * 70}ms">
      <div class="tl-card">
        <div class="tl-top">
          <div>
            <h3>${item.title}</h3>
            <div class="tl-meta"><strong>${item.org}</strong></div>
            <div class="tl-meta">${item.date}</div>
          </div>
          <span class="tl-badge">${item.badge}</span>
        </div>
        ${item.desc ? `<p class="tl-desc">${item.desc}</p>` : ''}
        ${item.highlights ? `
          <div class="tl-highlights">${item.highlights.map(h => `<span>${h}</span>`).join('')}</div>
        ` : ''}
      </div>
    </div>
  `).join('');
}
renderTimeline(experience, document.getElementById('experienceTimeline'));
renderTimeline(education, document.getElementById('educationTimeline'));

// ---------- Data: Publications ----------
const publications = [
  { title: 'Ensemble Deep Learning for Brain Tumor Classification Using MRI: A Comparative Study of CNN Architectures', venue: 'IEEE COMPAS 2025', date: 'October 23, 2025', link: 'https://ieeexplore.ieee.org/document/11381807', status: 'Published', accepted: false },
  { title: 'CropNet-XAI: An Explainable 1D-CNN Framework for Transparent Crop Yield Prediction', venue: 'IEEE ICECTE 2026', date: 'January 29, 2026', link: 'https://ieeexplore.ieee.org/abstract/document/11429350', status: 'Published', accepted: false },
  { title: 'XAI-Crop: Explainable Counterfactual Crop Recommendation via Ensemble Learning', venue: 'IEEE ICECTE 2026', date: 'January 29, 2026', link: 'https://ieeexplore.ieee.org/abstract/document/11429373', status: 'Published', accepted: false },
  { title: 'Detecting Potholes with Convolutional Neural Networks and Transfer Learning', venue: 'IEEE ICECTE 2026', date: 'January 29, 2026', link: 'https://ieeexplore.ieee.org/abstract/document/11429287', status: 'Published', accepted: false },
  { title: 'Explainable Ensemble Learning for Potato and Mango Leaf Disease Classification Using Lightweight and Transfer Learning Models', venue: '5th International Conference on Innovations in Science, Engineering and Technology (ICISET 2026)', date: '08–10 November 2026 • Chittagong, Bangladesh', link: 'https://github.com/almahmudjoy/Potato-and-Mango-Leaf-Disease-Classification', status: 'Accepted – Publication Pending', accepted: true }
];

document.getElementById('pubList').innerHTML = publications.map((p, i) => `
  <div class="pub-item reveal" style="transition-delay:${i * 80}ms">
    <div>
      <div class="pub-title">${p.title}</div>
      <div class="pub-venue">${p.venue}</div>
      <div class="pub-date">${p.date}</div>
    </div>
    <div class="pub-right">
      <span class="pub-status ${p.accepted ? 'accepted' : ''}">${p.status}</span>
      <a class="pub-link" href="${p.link}" target="_blank" rel="noopener">${p.accepted ? 'GitHub Repository →' : 'View on IEEE Xplore →'}</a>
    </div>
  </div>
`).join('');

// re-observe dynamically injected reveal elements
document.querySelectorAll('.reveal, .project-card, .tl-item, .pub-item').forEach(el => revealObserver.observe(el));

// ---------- Contact form (mailto fallback, no backend) ----------
const form = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const name = data.get('name');
  const email = data.get('email');
  const subject = data.get('subject');
  const message = data.get('message');
  const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
  window.location.href = `mailto:abdullahalmahmudjoy39@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  formNote.textContent = 'Opening your email client...';
  setTimeout(() => { formNote.textContent = ''; }, 4000);
});
