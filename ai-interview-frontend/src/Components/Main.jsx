import { useEffect, useRef } from "react";
import "./Main.css";

const STEPS = [
  {
    num: "01",
    icon: "🎯",
    title: "Pick a Topic",
    desc: "Select from DSA, System Design, HR, ML, Frontend or Backend. Customize by difficulty and company.",
    delay: 0
  },
  {
    num: "02",
    icon: "💬",
    title: "Answer Questions",
    desc: "Type your answers at your own pace or in timed mode. Think out loud — the process matters as much as the answer.",
    delay: 110,
    active: true
  },
  {
    num: "03",
    icon: "🤖",
    title: "Get AI Feedback",
    desc: "Our AI analyzes your response for depth, accuracy, structure and clarity — just like a real interviewer would.",
    delay: 220
  },
  {
    num: "04",
    icon: "📊",
    title: "Track & Improve",
    desc: "Review your performance dashboard, revisit weak areas, and watch your confidence grow over time.",
    delay: 330
  }
];

export default function HowItWorks() {
  const cardRefs = useRef([]);

  useEffect(() => {
    const observers = cardRefs.current.map((el, i) => {
      if (!el) return null;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              el.classList.add("visible");
            }, STEPS[i].delay);
            obs.disconnect();
          }
        },
        { threshold: 0.2 }
      );

      obs.observe(el);
      return obs;
    });

    return () => observers.forEach(o => o && o.disconnect());
  }, []);

  return (
    <>
   

      {/* Section */}
      <div className="section">
        <div className="section-tag">
          <span className="dot" /> How It Works
        </div>

        <h2 className="section-title">
          Four steps to your <br />
          <span className="c">dream offer</span>
        </h2>

        <p className="section-desc">
          A structured, research-backed process that mirrors real interviews
          and builds lasting confidence.
        </p>

        <div className="steps-grid">
          {STEPS.map((s, i) => (
            <div
              key={i}
              className={`step-card${s.active ? " active-card" : ""}`}
              ref={(el) => (cardRefs.current[i] = el)}
            >
              <div className="step-num">{s.num}</div>
              <span className="step-icon">{s.icon}</span>
              <div className="step-title">{s.title}</div>
              <p className="step-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
         <footer className="footer">
        <div className="footer-left">© 2025 AI Interview Prep · Built with ❤️ for ambitious engineers</div>
       <div className="footer-links">
        <a href="/privacy">Privacy</a>
        <a href="/terms">Terms</a>
        <a href="/blog">Blog</a>
        <a href="/contact">Contact</a>
        </div>
      </footer>
    </>
  );
}