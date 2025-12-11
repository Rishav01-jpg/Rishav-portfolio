// src/App.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import "./index.css";
import profileImg from "./assets/rishav-photo.jpg";

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);

  // --- Desktop-only welcome voice (React) ---
  const spokenRef = useRef(false); // prevents repeated speak without rerender

  const isDesktop = (() => {
    const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
    const isMobileUA = /Mobi|Android|iPhone|iPad|iPod|Windows Phone|webOS/i.test(ua);
    const hasTouch = typeof window !== "undefined" && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
    // treat devices with touch + mobile UA as mobile; keeps most laptops considered desktop
    return !isMobileUA && !hasTouch;
  })();

  const speakDesktopOnce = useCallback(() => {
    if (spokenRef.current) return;
    spokenRef.current = true;

    // try resume WebAudio and make a tiny silent poke (helps some browsers)
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        const ctx = new AudioContext();
        if (ctx.state === "suspended") ctx.resume().catch(() => {});
        try {
          const buffer = ctx.createBuffer(1, 1, ctx.sampleRate || 44100);
          const src = ctx.createBufferSource();
          src.buffer = buffer;
          src.connect(ctx.destination);
          src.start(0);
          setTimeout(() => {
            try { src.stop?.(); } catch (e) {}
            try { ctx.close?.(); } catch (e) {}
          }, 40);
        } catch (e) {}
      }
    } catch (e) {}

    // warm voices (helps some browsers)
    try { window.speechSynthesis.getVoices(); } catch (e) {}

    // speak
    const utter = new SpeechSynthesisUtterance("Welcome to Rishav Mishra portfolio");
    utter.lang = "en-IN";
    utter.rate = 1;
    utter.pitch = 1;

    requestAnimationFrame(() => {
      setTimeout(() => {
        try { window.speechSynthesis.cancel(); } catch (e) {}
        try { window.speechSynthesis.speak(utter); } catch (e) {}
      }, 20);
    });
  }, []);

  useEffect(() => {
    if (!isDesktop) return; // run only on desktop/laptop

    let triggered = false;
    function handler(ev) {
      if (triggered) return;
      triggered = true;
      speakDesktopOnce();
      window.removeEventListener("pointerdown", handler);
      window.removeEventListener("click", handler);
      window.removeEventListener("scroll", handler);
      window.removeEventListener("wheel", handler);
    }

    // warm-up voices immediately (optional)
    try { window.speechSynthesis.getVoices(); } catch (e) {}

    window.addEventListener("pointerdown", handler, { passive: true });
    window.addEventListener("click", handler, { passive: true });
    window.addEventListener("scroll", handler, { passive: true });
    window.addEventListener("wheel", handler, { passive: true });

    return () => {
      window.removeEventListener("pointerdown", handler);
      window.removeEventListener("click", handler);
      window.removeEventListener("scroll", handler);
      window.removeEventListener("wheel", handler);
    };
  }, [isDesktop, speakDesktopOnce]);
  // --- end desktop-only voice block ---

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="logo">
          R<span>M</span>
        </div>

        {/* Hamburger button (mobile only) */}
        <button
          className="menu-toggle"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          <span />
          <span />
          <span />
        </button>

        {/* Navigation */}
        <nav className={`nav ${isMenuOpen ? "nav-open" : ""}`}>
          <a href="#home" onClick={closeMenu}>
            Home
          </a>
          <a href="#about" onClick={closeMenu}>
            About
          </a>
          <a href="#services" onClick={closeMenu}>
            Services
          </a>
          <a href="#projects" onClick={closeMenu}>
            Projects
          </a>
          <a href="#contact" onClick={closeMenu}>
            Contact
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <main id="home" className="hero">
        <div className="hero-content">
          <p className="hero-tagline">Future-ready • AI-powered • Full Stack</p>

          <h1 className="hero-title">
            <span className="glow-text">Rishav</span> Mishra
          </h1>

          <h2 className="hero-subtitle">
            AI-Driven <span>Full Stack Developer</span>
          </h2>

          <p className="hero-about">
            I am a <span>highly resourceful and results-oriented</span>{" "}
            <span>AI-Driven Full-Stack Solutions Architect</span> specializing in the rapid
            design, development, and deployment of{" "}
            <span>end-to-end SaaS applications</span>. I focus on delivering{" "}
            <span>functional, scalable products</span> by orchestrating the entire system
            — from UI to secure deployment.
          </p>

          <div className="hero-buttons">
            <a
              href="#projects"
              className="btn primary-btn"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("projects")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              View Projects
            </a>

            <a href="#services" className="btn ghost-btn">
              What I Do
            </a>
          </div>
        </div>

        {/* Profile Photo */}
        <div className="hero-photo">
          <div className="photo-glow" />
          <div className="photo-frame">
            <img src={profileImg} alt="Rishav Mishra" />
          </div>
        </div>
      </main>

      {/* About Section */}
      <section id="about" className="section">
        <h3 className="section-title">About Me</h3>
        <p className="section-text">
          I am an AI-driven full-stack developer focused on building intelligent, scalable digital products that solve real-world problems. I specialize in turning complex requirements into clean, efficient systems by combining modern frontend experiences with robust backend architecture.

          My work spans the entire development lifecycle — from designing intuitive user interfaces and crafting high-performance APIs to integrating AI-powered automation and deploying secure, production-ready applications. I place a strong emphasis on clean code, system scalability, and long-term maintainability.

          I enjoy working on products that feel fast, responsive, and purposeful, where every feature adds measurable value. Whether it’s a SaaS platform, internal tool, or AI-enabled workflow, my goal is to engineer solutions that are reliable today and adaptable for the future.
        </p>
      </section>

      {/* Services Section */}
      <section id="services" className="section">
        <h3 className="section-title">What I Do</h3>

        <div className="services-grid">
          <div className="service-card">
            <h4>Frontend Development</h4>
            <p>React, modern UI, animations, performance-focused designs.</p>
          </div>

          <div className="service-card">
            <h4>Backend Development</h4>
            <p>APIs, databases, authentication, scalable architecture.</p>
          </div>

          <div className="service-card">
            <h4>AI & Automation</h4>
            <p>AI-powered workflows, smart tools, and automation systems.</p>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="section">
        <h3 className="section-title">Projects</h3>
        <p className="section-text">
          Selected projects showcasing my work in full-stack development,
          automation, and intelligent systems.
        </p>
        <div className="projects-grid">
          <article className="project-card">
            <h4>Ring Ring CRM</h4>
            <p>
              Full-stack CRM with authentication, lead management, CSV
              import/export, and automated calling workflows.
            </p>
            <a href="https://ring-ring-1.onrender.com/" target="_blank" rel="noreferrer">
              View Project →
            </a>
          </article>

          <article className="project-card">
            <h4>bloombyte</h4>
            <p>
              Best School Management Software
    Your all-in-one solution for best school management.
    Harnessing AI and cloud technology..
            </p>
            <a href="https://bloombyte.io/school-management-software/" target="_blank" rel="noreferrer">
              View Project →
            </a>
          </article>

          <article className="project-card">
            <h4>leadsquared</h4>
            <p>
              Collections CRM for Debt Recovery
    Empower your teams to track and follow-up with defaulters efficiently, predict debt recovery and enable faster collections.
            </p>
            <a href="https://www.leadsquared.com/collections-crm/" target="_blank" rel="noreferrer">
              View Project →
            </a>
          </article>
        </div>

      </section>
      <section id="contact" className="section">
        <h3 className="section-title">Contact</h3>
        <div className="services-grid">
          <div className="service-card">
            <h4>Phone</h4>
            <p>
              <a href="tel:+910000000000" style={{ color: "var(--neon-blue)", textDecoration: "none" }}>+91 8210690050</a>
            </p>
          </div>
          <div className="service-card">
            <h4>Email</h4>
            <p>
              <a href="mailto:contact@example.com" style={{ color: "var(--neon-blue)", textDecoration: "none" }}>rishav9234821@gmail.com</a>
            </p>
          </div>
          <div className="service-card">
            <h4>Addresses</h4>
            <p>Jamshedpur, Jharkhand, 831007</p>
            <p>India</p>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-left">
            <h4 className="footer-logo">
              R<span>M</span>
            </h4>
            <p className="footer-text">
              Building intelligent, futuristic digital experiences with
              AI-powered full-stack development.
            </p>
          </div>

          <div className="footer-right">
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#services">Services</a>
            <a href="#projects">Projects</a>
            <a href="#contact">Contact</a>
          </div>
        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} Rishav Mishra. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
