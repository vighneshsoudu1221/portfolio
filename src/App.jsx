import { useEffect, useRef } from "react";
import { Link, NavLink, Route, Routes, useLocation } from "react-router-dom";

const navigation = [
  ["Home", "/"],
  ["Skills", "/skills"],
  ["Experience", "/experience"],
  ["Projects", "/projects"],
  ["Education", "/education"],
  ["Contact", "/contact"],
];

function SiteEffects() {
  const { pathname } = useLocation();
  const loaderRef = useRef(null);
  const canvasRef = useRef(null);
  const cursorRingRef = useRef(null);
  const cursorDotRef = useRef(null);

  useEffect(() => {
    const loaderTimer = window.setTimeout(() => {
      loaderRef.current?.classList.add("done");
    }, 2000);
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    const cursorDot = cursorDotRef.current;
    const cursorRing = cursorRingRef.current;
    const colors = ["#6366f1", "#ec4899", "#22d3ee", "#f59e0b"];
    let particles = [];
    let width = 0;
    let height = 0;
    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let animationFrame = 0;

    const resize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      particles = Array.from(
        { length: Math.min(90, Math.floor((width * height) / 18000)) },
        () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
        }),
      );
    };

    const onMouseMove = (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      if (cursorDot) {
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
      }
    };

    const draw = () => {
      if (!context) return;
      context.clearRect(0, 0, width, height);
      for (let index = 0; index < particles.length; index += 1) {
        const particle = particles[index];
        particle.x += particle.vx;
        particle.y += particle.vy;
        if (particle.x < 0 || particle.x > width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > height) particle.vy *= -1;
        context.beginPath();
        context.arc(particle.x, particle.y, 1.6, 0, Math.PI * 2);
        context.fillStyle = colors[index % colors.length];
        context.globalAlpha = 0.7;
        context.fill();

        for (
          let otherIndex = index + 1;
          otherIndex < particles.length;
          otherIndex += 1
        ) {
          const other = particles[otherIndex];
          const distance = Math.hypot(
            particle.x - other.x,
            particle.y - other.y,
          );
          if (distance < 130) {
            context.globalAlpha = (1 - distance / 130) * 0.25;
            context.strokeStyle = colors[index % colors.length];
            context.lineWidth = 0.6;
            context.beginPath();
            context.moveTo(particle.x, particle.y);
            context.lineTo(other.x, other.y);
            context.stroke();
          }
        }
      }
      context.globalAlpha = 1;
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      if (cursorRing) {
        cursorRing.style.left = `${ringX}px`;
        cursorRing.style.top = `${ringY}px`;
      }
      animationFrame = window.requestAnimationFrame(draw);
    };

    const onPointerOver = (event) => {
      if (event.target.closest("a, button, .chip, .proj, .info, .btn")) {
        cursorRing?.classList.add("hover");
      }
    };
    const onPointerOut = (event) => {
      if (event.target.closest("a, button, .chip, .proj, .info, .btn")) {
        cursorRing?.classList.remove("hover");
      }
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("pointerover", onPointerOver);
    document.addEventListener("pointerout", onPointerOut);
    return () => {
      window.clearTimeout(loaderTimer);
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("pointerout", onPointerOut);
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in");
          if (entry.target.classList.contains("bar-fill")) {
            entry.target.style.width = `${entry.target.dataset.w}%`;
          }
        });
      },
      { threshold: 0.2 },
    );
    document.querySelectorAll(".tl-item, .proj, .bar-fill").forEach((item) => {
      observer.observe(item);
    });
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <>
      <div id="loader" ref={loaderRef}>
        <div className="loader-init">SV</div>
        <div className="loader-bar" />
      </div>
      <canvas id="particles" ref={canvasRef} />
      <div className="noise" />
      <div className="cursor-ring" ref={cursorRingRef} />
      <div className="cursor-dot" ref={cursorDotRef} />
    </>
  );
}

function Navigation() {
  return (
    <nav aria-label="Main navigation">
      <Link className="logo" to="/" aria-label="Soudu Vighnesh home">
        SV.
      </Link>
      {navigation.map(([label, path]) => (
        <NavLink
          key={path}
          to={path}
          end={path === "/"}
          className={({ isActive }) => (isActive ? "active" : undefined)}
        >
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

function PageHeading({ eyebrow, title, accent, lead }) {
  return (
    <>
      <div className="eyebrow">{eyebrow}</div>
      <h1 className="title">
        {title} <span>{accent}</span>
      </h1>
      {lead && <p className="lead">{lead}</p>}
    </>
  );
}

function HomePage() {
  return (
    <section id="hero">
      <div>
        <div className="hero-tag">// AI · FULL-STACK · DATA SCIENCE</div>
        <h1 className="hero-name">
          Soudu
          <br />
          Vighnesh
        </h1>
        <p className="hero-sub">
          Recent CSE graduate passionate about AI and full-stack development. I
          build production-grade systems that blend computer vision, backend
          rigor, and clean UX.
        </p>
        <div className="ctas">
          <Link to="/projects" className="btn primary">
            View Projects →
          </Link>
          <Link to="/contact" className="btn">
            Get in touch
          </Link>
          <a
            href="https://github.com/vighneshsoudu2004-glitch"
            target="_blank"
            rel="noreferrer"
            className="btn"
          >
            GitHub
          </a>
        </div>
      </div>
      <div className="profile-photo-wrap">
        <div className="profile-photo-container">
          <img
            src="/assets/ChatGPT Image Sep 12, 2026, 07_36_05 PM.png"
            alt="Soudu Vighnesh"
            className="profile-photo-img"
          />
        </div>
      </div>
    </section>
  );
}

const skills = [
  ["Python", 90],
  ["JavaScript", 85],
  ["React.js", 82],
  ["Node / Express", 78],
  ["SQL / MongoDB", 80],
  ["ML / Computer Vision", 75],
];

const technologies = [
  "Python",
  "JavaScript",
  "SQL",
  "React.js",
  "HTML",
  "CSS",
  "Bootstrap",
  "Node.js",
  "Express.js",
  "Flask",
  "MySQL",
  "MongoDB",
  "Git",
  "GitHub",
  "REST APIs",
];

function SkillsPage() {
  return (
    <section id="skills">
      <PageHeading
        eyebrow="// 02 — Toolkit"
        title="Skills &"
        accent="Stack"
        lead="A blend of frontend craft, backend rigor, and AI-driven thinking."
      />
      <div className="skills-grid">
        <div>
          {skills.map(([name, value]) => (
            <div className="skill-row" key={name}>
              <div className="skill-head">
                <span>{name}</span>
                <span>{value}%</span>
              </div>
              <div className="bar">
                <div className="bar-fill" data-w={value} />
              </div>
            </div>
          ))}
        </div>
        <div>
          <h2 className="tech-heading">Tech I work with</h2>
          <div className="chips">
            {technologies.map((technology) => (
              <span className="chip" key={technology}>
                {technology}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const experience = [
  {
    role: "Data Science & ML Intern",
    date: "2 Weeks",
    organization: "Ybi Foundation · Remote",
    details: [
      "Completed structured internship focused on applied data science and ML workflows.",
      "Worked on real ML tasks: data preprocessing, model training, and evaluation.",
      "Earned ISO-certified recognition upon successful completion.",
    ],
  },
  {
    role: "GenAI Powered Data Analytics — Job Simulation",
    date: "Sep 2025",
    organization: "Tata Consultancy Services · Forage Platform",
    details: [
      "Practical tasks in EDA, risk profiling, and predicting delinquency with AI.",
      "Produced a business report with data storytelling for collections strategy.",
      "Implemented an AI-driven collections strategy simulation end-to-end.",
    ],
  },
  {
    role: "Bharatiya Antariksh Hackathon 2025",
    date: "2025",
    organization: "National-level innovation challenge · H2S",
    details: [
      "Participated in a national-level hackathon on space and technology.",
      "Collaborated on AI-driven solutions for real-world space-tech challenges.",
    ],
  },
];

function ExperiencePage() {
  return (
    <section id="experience">
      <PageHeading
        eyebrow="// 03 — Journey"
        title="Experience &"
        accent="Internships"
        lead="Hands-on training across AI, ML, and applied analytics."
      />
      <div className="timeline">
        {experience.map((item) => (
          <article className="tl-item" key={item.role}>
            <div className="tl-card">
              <div className="tl-meta">
                <h2 className="role">{item.role}</h2>
                <div className="date">{item.date}</div>
              </div>
              <div className="tl-org">{item.organization}</div>
              <ul>
                {item.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

const projects = [
  {
    icon: "🚦",
    name: "Smart City Traffic Monitoring",
    description:
      "Real-time vehicle detection & tracking on live video using YOLOv8 + Deep SORT, with traffic density, speed estimation, congestion classification, and an interactive analytics dashboard.",
    tags: [
      "Python",
      "Flask",
      "React",
      "MySQL",
      "YOLOv8",
      "Deep SORT",
      "OpenCV",
    ],
  },
  {
    icon: "✅",
    name: "Professional Todo Application",
    description:
      "Full-stack task management app with JWT authentication, bcrypt-hashed passwords, category filtering, RESTful APIs, and a fully responsive mobile-first UI.",
    tags: ["Node.js", "Express", "MySQL", "JavaScript", "Bootstrap", "JWT"],
  },
  {
    icon: "🤖",
    name: "GenAI Collections Strategy",
    description:
      "AI-driven collections strategy simulation built during the Tata × Forage program, combining EDA, risk profiling, and delinquency prediction into a business-ready report.",
    tags: ["GenAI", "Python", "EDA", "Storytelling"],
  },
];

function ProjectsPage() {
  return (
    <section id="projects">
      <PageHeading
        eyebrow="// 04 — Selected Work"
        title="Featured"
        accent="Projects"
        lead="Production-grade systems blending computer vision, full-stack engineering, and clean UX."
      />
      <div className="projects">
        {projects.map((project) => (
          <article className="proj" key={project.name}>
            <span className="emoji" aria-hidden="true">
              {project.icon}
            </span>
            <h2>{project.name}</h2>
            <p>{project.description}</p>
            <div className="tags">
              {project.tags.map((tag) => (
                <span className="tag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function EducationPage() {
  return (
    <section id="education">
      <PageHeading
        eyebrow="// 05 — Background"
        title="Education &"
        accent="Languages"
      />
      <div className="two-col">
        <article className="edu-card">
          <h2>B.Tech — Computer Science & Engineering</h2>
          <div className="school">
            Jyothishmathi Institute of Technology and Science · Karimnagar,
            Telangana
          </div>
          <p className="education-summary">
            Final-year student focused on AI, full-stack development, and data
            science. Active in hackathons and applied research projects.
          </p>
          <div className="edu-meta">
            <span>2022 — 2026</span>
            <span>
              CGPA · <strong>7.65 / 10</strong>
            </span>
          </div>
        </article>
        <div className="education-details">
          <article className="lang-card">
            <h2>Languages</h2>
            <div className="badges">
              <span className="badge">English · Professional</span>
              <span className="badge">Telugu · Native</span>
            </div>
          </article>
          <article className="lang-card">
            <h2>Certifications</h2>
            <div className="badges">
              <span className="badge">Tata GenAI · Forage</span>
              <span className="badge">Ybi Foundation · ISO</span>
              <span className="badge">Python · CodeTantra</span>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

const contacts = [
  ["Email", "vigneshsoudu2004@gmail.com", "mailto:vigneshsoudu2004@gmail.com"],
  ["Phone", "+91 79937 82587", "tel:+917993782587"],
  ["LinkedIn", "soudu-vignesh", "https://www.linkedin.com/in/vighneshsoudu/"],
  [
    "GitHub",
    "@vigneshsoudu2004-glitch",
    "https://github.com/vighneshsoudu2004-glitch",
  ],
];

function ContactPage() {
  return (
    <section id="contact">
      <PageHeading
        eyebrow="// 06 — Let's Talk"
        title="Get in"
        accent="Touch"
        lead="Open to internships, full-time roles, and collaborative builds in AI and web."
      />
      <div className="contact-grid">
        <div className="avatar-wrap">
          <div className="avatar">SV</div>
        </div>
        <div className="info-cards">
          {contacts.map(([label, value, href]) => (
            <a
              className="info"
              href={href}
              key={label}
              target={href.startsWith("https:") ? "_blank" : undefined}
              rel={href.startsWith("https:") ? "noreferrer" : undefined}
            >
              <div className="lbl">{label}</div>
              <div className="val">{value}</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function NotFoundPage() {
  return (
    <section>
      <PageHeading title="Page" accent="not found" />
      <Link className="btn" to="/">
        Back home
      </Link>
    </section>
  );
}

function App() {
  const location = useLocation();
  useEffect(() => {
    const pageNames = {
      "/": "Home",
      "/skills": "Skills",
      "/experience": "Experience",
      "/projects": "Projects",
      "/education": "Education",
      "/contact": "Contact",
    };
    document.title = `${pageNames[location.pathname] ?? "Page Not Found"} | Soudu Vighnesh`;
  }, [location.pathname]);

  return (
    <>
      <SiteEffects />
      <Navigation />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/experience" element={<ExperiencePage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/education" element={<EducationPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <footer>
        © 2026 Soudu Vighnesh · Crafted with ⚡ and lots of coffee
      </footer>
    </>
  );
}

export default App;
