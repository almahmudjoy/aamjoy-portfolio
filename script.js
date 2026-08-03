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
    icon: '💸',
    title: 'DMoney API Testing',
    category: 'QA',
    desc: 'Automated API test suite for a DMoney-style mobile financial service — onboarding, deposits, transfers, and merchant payments.',
    points: [
      '30 test cases (18 positive / 12 negative) across 21 requests, 76 passing assertions',
      'Validated commission calculations, service fees, and account balance accuracy',
      'Automated with Postman + Newman, HTML reports via Newman Reporter HTMLExtra'
    ],
    tags: ['Postman', 'Newman', 'Node.js', 'REST API', 'FinTech'],
    link: 'https://github.com/almahmudjoy/DMoney-API-Testing'
  },
  {
    icon: '📱',
    title: 'DMoney Manual Testing',
    category: 'QA',
    desc: 'Manual QA testing across two FinTech apps (dMoney & EasyPay) — exploratory testing, bug reporting, and acceptance criteria.',
    points: [
      'Exploratory testing on transaction limits, commission logic, and float precision',
      'Documented 8 evidence-backed bugs incl. limit-bypass and fee text mismatches',
      'Wrote structured test case matrices and formal acceptance criteria'
    ],
    tags: ['Manual Testing', 'Exploratory Testing', 'Bug Reporting', 'FinTech'],
    link: 'https://github.com/almahmudjoy/DMoney-Manual-Testing'
  },
  {
    icon: '🔌',
    title: 'DummyJSON API Testing',
    category: 'QA',
    desc: 'Real API testing project using hosted DummyJSON endpoints with authentication, negative testing, and performance validation.',
    points: [
      'Tested CRUD, auth, and token refresh on live DummyJSON API',
      'Covered negative scenarios, edge cases, and performance thresholds',
      'Generated HTML reports via Newman CLI execution'
    ],
    tags: ['Postman', 'Newman', 'DummyJSON API', 'REST API'],
    link: '#'
  },
  {
    icon: '🧩',
    title: 'Product API Testing',
    category: 'QA',
    desc: 'End-to-end API testing of product management endpoints using Postman and json-server.',
    points: [
      'Tested CRUD endpoints using Postman and json-server',
      'Validated status codes, response body, and dynamic ID flow',
      'Used Collection Runner / Newman for batch execution'
    ],
    tags: ['Postman', 'json-server', 'Newman', 'API Testing'],
    link: '#'
  },
  {
    icon: '🛒',
    title: 'Alibaba E-commerce Testing',
    category: 'QA',
    desc: 'Manual testing of a large-scale e-commerce platform covering critical user journeys.',
    points: [
      'Created test scenarios for signup, login, cart, and checkout',
      'Reported functional and UI issues with detailed steps',
      'Documented 50+ manual test cases with expected results'
    ],
    tags: ['Manual Testing', 'Test Cases', 'Bug Reporting'],
    link: '#'
  },
  {
    icon: '🚚',
    title: 'SteadFast Courier Mobile Testing',
    category: 'QA',
    desc: 'Comprehensive mobile app testing for a courier tracking and delivery management system.',
    points: [
      'Tested parcel tracking, order placement, and delivery status flows',
      'Verified UI responsiveness across different screen sizes',
      'Identified and documented usability and navigation issues'
    ],
    tags: ['Mobile Testing', 'UI Testing', 'Bug Reporting'],
    link: '#'
  },
  {
    icon: '🔐',
    title: 'Facebook Login Page Testing',
    category: 'QA',
    desc: 'Security-focused testing of social media authentication with boundary and negative test cases.',
    points: [
      'Designed test cases for valid/invalid login scenarios',
      'Tested boundary values, empty fields, and error messages',
      'Validated password masking and session handling behavior'
    ],
    tags: ['Security Testing', 'Functional Testing', 'Test Design'],
    link: '#'
  }
];

const otherProjects = [
  { icon: '🧠', title: 'Brain Tumor Classifier', category: 'AI/ML', desc: 'Multi-class MRI tumor detection using deep learning and convolutional neural networks.', tags: ['Python', 'CNN', 'Deep Learning'], link: '#' },
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

// ---------- Data: Experience ----------
const experience = [
  {
    title: 'Teaching Assistant', org: 'Bangladesh University of Business and Technology', date: 'July 2025 – December 2025',
    badge: 'Academic Role',
    desc: 'Assist faculty members with classroom instruction, grading, and academic support. Contribute to lesson planning, manage student queries, and help maintain a productive and engaging learning environment.',
    highlights: ['Classroom instruction support', 'Grading and assessment', 'Academic student support', 'Lesson planning contribution']
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
  { title: 'Ensemble Deep Learning for Brain Tumor Classification Using MRI: A Comparative Study of CNN Architectures', venue: '2025 IEEE 2nd International Conference on Computing, Applications and Systems (COMPAS)', date: 'October 23, 2025', link: 'https://ieeexplore.ieee.org/abstract/document/11381807' },
  { title: 'XAI-Crop: Explainable Counterfactual Crop Recommendation via Ensemble Learning', venue: '2026 5th International Conference on Electrical, Computer & Telecommunication Engineering (ICECTE)', date: 'January 29, 2026', link: 'https://ieeexplore.ieee.org/abstract/document/11429373' },
  { title: 'CropNet-XAI: An Explainable 1D-CNN Framework for Transparent Crop Yield Prediction', venue: '2026 5th International Conference on Electrical, Computer & Telecommunication Engineering (ICECTE)', date: 'January 29, 2026', link: 'https://ieeexplore.ieee.org/abstract/document/11429350' },
  { title: 'Detecting Potholes with Convolutional Neural Networks and Transfer Learning', venue: '2026 5th International Conference on Electrical, Computer & Telecommunication Engineering (ICECTE)', date: 'January 29, 2026', link: 'https://ieeexplore.ieee.org/abstract/document/11429287' }
];

document.getElementById('pubList').innerHTML = publications.map((p, i) => `
  <div class="pub-item reveal" style="transition-delay:${i * 80}ms">
    <div>
      <div class="pub-title">${p.title}</div>
      <div class="pub-venue">${p.venue}</div>
      <div class="pub-date">${p.date}</div>
    </div>
    <div class="pub-right">
      <span class="pub-status">Published</span>
      <a class="pub-link" href="${p.link}" target="_blank" rel="noopener">View on IEEE Xplore →</a>
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
