import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Dashboard.css";
import axios from "../api/axios";

// ── Theme tokens (only for dynamic runtime colors) ────────────────────────────
const T = {
  pageBg:  "#f5f4f0",
  cardBg:  "#ffffff",
  border:  "#e2e0db",
  accent:  "#6366f1",
  text1:   "#1e1b18",
  text2:   "#7c7874",
  text3:   "#a09d9a",
};

// ── Nav items ─────────────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard",   label: "Dashboard",            icon: DashIcon    },
  { id: "preparation", label: "Interview Preparation", icon: PrepIcon    },
  { id: "interview",   label: "AI Interview",          icon: AIIcon      },
  { id: "profile",     label: "My Profile",            icon: ProfileIcon },
];

const OPTION_LABEL = ["A", "B", "C", "D"];

// ── Icons ─────────────────────────────────────────────────────────────────────
function DashIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3"  y="3"  width="7" height="7" rx="1.5" />
      <rect x="14" y="3"  width="7" height="7" rx="1.5" />
      <rect x="3"  y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}
function PrepIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}
function AIIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
      <path d="M12 7v4" />
      <path d="M8 11H5a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2h-3" />
      <path d="M9 20v1m6-1v1" />
    </svg>
  );
}
function ProfileIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
function LogoutIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

// ── MCQ Data ──────────────────────────────────────────────────────────────────
const MCQ_DATA = {
  frontend: {
    label: "Frontend", icon: "🖥️", color: "#6366f1", lightBg: "#eef2ff",
    questions: [
      { q: "What does the CSS box-model consist of?",                           options: ["Content, Padding, Border, Margin","Width, Height, Color, Font","Display, Position, Float, Clear","None of the above"], ans: 0 },
      { q: "Which hook manages state in a React functional component?",         options: ["useEffect","useRef","useState","useContext"], ans: 2 },
      { q: "What is the purpose of useEffect in React?",                        options: ["Manage state","Handle side effects","Create context","Memoize values"], ans: 1 },
      { q: "What does semantic HTML mean?",                                     options: ["Using CSS classes","Using tags that convey meaning","Writing inline styles","Using JavaScript events"], ans: 1 },
      { q: "Which CSS property creates a flex container?",                      options: ["display: block","display: flex","display: grid","display: inline"], ans: 1 },
    ],
  },
  backend: {
    label: "Backend", icon: "⚙️", color: "#f59e0b", lightBg: "#fffbeb",
    questions: [
      { q: "What does REST stand for?",                        options: ["Representational State Transfer","Remote Execution Standard Tool","Request Entity Send Type","None"], ans: 0 },
      { q: "Which HTTP method updates a resource?",            options: ["GET","POST","PUT","DELETE"], ans: 2 },
      { q: "What is middleware in Express.js?",                options: ["A database layer","A function between request and response","A template engine","A caching mechanism"], ans: 1 },
      { q: "What is the purpose of an ORM?",                  options: ["Optimize RAM","Map objects to database tables","Create REST APIs","Handle authentication"], ans: 1 },
      { q: "Which status code means 'Not Found'?",             options: ["200","301","404","500"], ans: 2 },
    ],
  },
  hr: {
    label: "HR", icon: "🤝", color: "#10b981", lightBg: "#f0fdf4",
    questions: [
      { q: "How do you handle conflicts in a team?",       options: ["Avoid the conflict","Communicate openly and find a solution","Escalate immediately","Ignore it"], ans: 1 },
      { q: "Describe yourself in one sentence.",           options: ["I am lazy","I am a fast learner who thrives in teams","I prefer working alone","I do not know"], ans: 1 },
      { q: "What is your greatest strength?",              options: ["Procrastination","Problem-solving and adaptability","Avoiding feedback","None"], ans: 1 },
      { q: "Why do you want to work here?",                options: ["Just for money","I align with the company's mission and values","I have no other options","It's close to home"], ans: 1 },
      { q: "Where do you see yourself in 5 years?",        options: ["Retired","In a leadership role contributing to growth","Doing the same job","Not sure"], ans: 1 },
    ],
  },
  dsa: {
    label: "DSA", icon: "🧮", color: "#ef4444", lightBg: "#fff1f2",
    questions: [
      { q: "Time complexity of binary search?",     options: ["O(n)","O(n²)","O(log n)","O(1)"], ans: 2 },
      { q: "Which data structure uses LIFO?",       options: ["Queue","Stack","Heap","Graph"], ans: 1 },
      { q: "What is a linked list?",                options: ["A fixed-size array","A sequential collection of nodes","A hash table","A binary tree"], ans: 1 },
      { q: "What does BFS stand for?",              options: ["Binary File Search","Breadth First Search","Best First Sort","None"], ans: 1 },
      { q: "Worst-case of quicksort?",              options: ["O(n log n)","O(n)","O(n²)","O(log n)"], ans: 2 },
    ],
  },
  fullstack: {
    label: "Full Stack", icon: "🚀", color: "#8b5cf6", lightBg: "#f5f3ff",
    questions: [
      { q: "Difference between SQL and NoSQL?",                     options: ["No difference","SQL is relational; NoSQL is non-relational","NoSQL is faster always","SQL is newer"], ans: 1 },
      { q: "What is CORS?",                                         options: ["A CSS framework","Cross-Origin Resource Sharing","Client-Object Request System","None"], ans: 1 },
      { q: "Role of a .env file?",                                  options: ["Style components","Store environment variables","Define routes","Compile TypeScript"], ans: 1 },
      { q: "Which is a state management library?",                  options: ["Express","Redux","Mongoose","Axios"], ans: 1 },
      { q: "What does npm run build typically do?",                  options: ["Start the dev server","Bundle the app for production","Install packages","Run tests"], ans: 1 },
    ],
  },
};

const TOPICS = Object.keys(MCQ_DATA);

// ══════════════════════════════════════════════════════════════════════════════
// DASHBOARD VIEW
// ══════════════════════════════════════════════════════════════════════════════
function DashboardView({ interviews = [] }) {
  const safeScores = interviews.map(i => Number(i.totalScore)).filter(s => !isNaN(s));

  const stats = [
    { label: "Total Interviews", value: interviews.length,                                                                           accent: "#6366f1", icon: "🎯", lightBg: "#eef2ff" },
    { label: "Average Score",    value: safeScores.length ? Math.round(safeScores.reduce((a, s) => a + s, 0) / safeScores.length) : 0, accent: "#10b981", icon: "📊", lightBg: "#f0fdf4" },
    { label: "Highest Score",    value: safeScores.length ? Math.max(...safeScores) : 0,                                             accent: "#f59e0b", icon: "🏆", lightBg: "#fffbeb" },
  ];

  return (
    <div className="view-wrapper">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Overview of your interview activity</p>
      </div>

      <div className="stat-grid">
        {stats.map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-top-bar" style={{ background: s.accent }} />
            <div className="stat-icon" style={{ background: s.lightBg }}>{s.icon}</div>
            <div className="stat-value" style={{ color: s.accent }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PREPARATION VIEW
// ══════════════════════════════════════════════════════════════════════════════
function PreparationView() {
  const [activeTopic, setActiveTopic] = useState("frontend");
  const [selected,    setSelected]    = useState({});
  const [submitted,   setSubmitted]   = useState(false);

  const topic = MCQ_DATA[activeTopic];

  const handleSelect      = (qi, oi) => { if (!submitted) setSelected(p => ({ ...p, [qi]: oi })); };
  const handleSubmit      = ()       => setSubmitted(true);
  const handleReset       = ()       => { setSelected({}); setSubmitted(false); };
  const handleTopicChange = t        => { setActiveTopic(t); setSelected({}); setSubmitted(false); };

  const answered = Object.keys(selected).length;
  const total    = topic.questions.length;
  const score    = submitted ? topic.questions.filter((q, i) => selected[i] === q.ans).length : null;

  const scoreColor  = score === total ? "#16a34a" : score >= 3 ? "#d97706" : "#e11d48";
  const scoreBg     = score === total ? "#f0fdf4" : score >= 3 ? "#fffbeb" : "#fff1f2";
  const scoreBorder = score === total ? "#bbf7d0" : score >= 3 ? "#fde68a" : "#fecdd3";

  return (
    <div className="view-wrapper">
      <div className="page-header">
        <h1 className="page-title">Interview Preparation</h1>
        <p className="page-subtitle">Pick a topic and test your knowledge with 5 MCQs</p>
      </div>

      {/* Topic tabs */}
      <div className="topic-tabs">
        {TOPICS.map(key => {
          const t = MCQ_DATA[key];
          const isActive = activeTopic === key;
          return (
            <button
              key={key}
              onClick={() => handleTopicChange(key)}
              className="topic-tab-btn"
              style={isActive
                ? { background: t.color, color: "#fff", fontWeight: 700, border: "none", boxShadow: `0 4px 14px ${t.color}44` }
                : { background: T.cardBg, color: T.text2, fontWeight: 500, border: `1px solid ${T.border}`, boxShadow: "0 1px 3px #00000010" }
              }
            >
              <span style={{ fontSize: "1rem" }}>{t.icon}</span>
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Active topic banner */}
      <div
        className="topic-banner"
        style={{
          background: `linear-gradient(135deg,${topic.color}18,${topic.color}08)`,
          border: `1px solid ${topic.color}33`,
        }}
      >
        <div className="topic-banner-left">
          <div className="topic-banner-icon" style={{ background: topic.lightBg, border: `1px solid ${topic.color}33` }}>
            {topic.icon}
          </div>
          <div>
            <div className="topic-banner-title">{topic.label}</div>
            <div className="topic-banner-meta">
              {submitted ? "Completed · " : `${answered}/${total} answered · `}
              <span style={{ color: topic.color, fontWeight: 600 }}>{total} questions</span>
            </div>
          </div>
        </div>

        <div className="topic-banner-right">
          {!submitted && (
            <div
              className="progress-ring"
              style={{ background: `conic-gradient(${topic.color} ${(answered / total) * 360}deg, ${topic.color}22 0deg)` }}
            >
              <div className="progress-ring-inner" style={{ color: topic.color }}>
                {answered}/{total}
              </div>
            </div>
          )}
          {submitted && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <div
                className="score-badge-pill"
                style={{ background: scoreBg, color: scoreColor, border: `1px solid ${scoreBorder}` }}
              >
                {score}/{total} correct
              </div>
              <button className="retry-btn" onClick={handleReset}>↺ Retry</button>
            </div>
          )}
        </div>
      </div>

      {/* Questions */}
      <div className="questions-list">
        {topic.questions.map((q, qi) => {
          const isAnswered = selected[qi] !== undefined;
          return (
            <div
              key={`${activeTopic}-${qi}`}
              className="question-card"
              style={{ border: `1px solid ${isAnswered && !submitted ? topic.color + "44" : T.border}` }}
            >
              {/* Header */}
              <div className="question-header">
                <div
                  className="question-num"
                  style={{
                    background: submitted
                      ? (selected[qi] === q.ans ? "#f0fdf4" : "#fff1f2")
                      : (isAnswered ? topic.lightBg : "#f5f4f0"),
                    border: `1.5px solid ${submitted
                      ? (selected[qi] === q.ans ? "#86efac" : "#fca5a5")
                      : (isAnswered ? topic.color + "55" : T.border)}`,
                    color: submitted
                      ? (selected[qi] === q.ans ? "#16a34a" : "#e11d48")
                      : (isAnswered ? topic.color : T.text3),
                  }}
                >
                  {submitted ? (selected[qi] === q.ans ? "✓" : "✗") : qi + 1}
                </div>
                <p className="question-text">{q.q}</p>
              </div>

              {/* Options 2×2 */}
              <div className="options-grid">
                {q.options.map((opt, oi) => {
                  const isSel     = selected[qi] === oi;
                  const isCorrect = q.ans === oi;
                  let bg = "transparent", borderC = "transparent";
                  let textC = T.text1, labelBg = "#f5f4f0", labelC = T.text3;

                  if (submitted) {
                    if (isCorrect) { bg="#f0fdf4"; textC="#15803d"; labelBg="#dcfce7"; labelC="#16a34a"; borderC="#86efac"; }
                    else if (isSel) { bg="#fff1f2"; textC="#be123c"; labelBg="#fecdd3"; labelC="#e11d48"; borderC="#fca5a5"; }
                  } else if (isSel) {
                    bg=topic.lightBg; textC=topic.color; labelBg=topic.color+"22"; labelC=topic.color; borderC=topic.color+"55";
                  }

                  return (
                    <button
                      key={oi}
                      onClick={() => handleSelect(qi, oi)}
                      className={`option-btn${oi % 2 === 1 ? " right-col" : ""}${submitted ? " submitted" : ""}`}
                      style={{
                        background: bg,
                        outline: isSel && !submitted ? `2px solid ${topic.color}44` : "none",
                        outlineOffset: -2,
                      }}
                    >
                      <span
                        className="option-label"
                        style={{ background: labelBg, color: labelC, border: `1.5px solid ${borderC || T.border}` }}
                      >
                        {OPTION_LABEL[oi]}
                      </span>
                      <span
                        className="option-text"
                        style={{ color: textC, fontWeight: isSel || (submitted && isCorrect) ? 600 : 400 }}
                      >
                        {opt}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit / score bar */}
      <div className="submit-bar">
        {!submitted ? (
          <>
            <button
              className="submit-btn"
              onClick={handleSubmit}
              disabled={answered < total}
              style={answered >= total
                ? { background: `linear-gradient(135deg,${topic.color},${topic.color}cc)`, color: "#fff", boxShadow: `0 4px 16px ${topic.color}44` }
                : undefined
              }
            >
              Submit Answers
            </button>
            <span className="submit-hint">
              {answered < total
                ? `${total - answered} question${total - answered > 1 ? "s" : ""} remaining`
                : "All answered — ready to submit!"}
            </span>
          </>
        ) : (
          <div
            className="score-result-bar"
            style={{ background: scoreBg, border: `1px solid ${scoreBorder}` }}
          >
            <div className="score-result-emoji">{score === total ? "🎉" : score >= 3 ? "👍" : "📚"}</div>
            <div>
              <div className="score-result-value" style={{ color: scoreColor }}>
                You scored {score} out of {total}
              </div>
              <div className="score-result-msg">
                {score === total ? "Perfect score! Outstanding work." : score >= 3 ? "Good job! Review the incorrect ones." : "Keep practising — you'll get there!"}
              </div>
            </div>
            <button className="try-again-btn" onClick={handleReset}>↺ Try Again</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// AI INTERVIEW VIEW
// ══════════════════════════════════════════════════════════════════════════════
function AiInterView({ role, setRole, difficulty, setDifficulty, questionCount, setQuestionCount, handleStart }) {
  const roles = [
    { value: "Frontend",  label: "Frontend Developer", icon: "🖥️", color: "#6366f1", lightBg: "#eef2ff" },
    { value: "Backend",   label: "Backend Developer",  icon: "⚙️", color: "#f59e0b", lightBg: "#fffbeb" },
    { value: "Fullstack", label: "Full Stack",          icon: "🚀", color: "#8b5cf6", lightBg: "#f5f3ff" },
    { value: "HR",        label: "HR",                  icon: "🤝", color: "#10b981", lightBg: "#f0fdf4" },
    { value: "DSA",       label: "DSA",                 icon: "🧮", color: "#ef4444", lightBg: "#fff1f2" },
  ];

  const difficulties = [
    { value: "Easy",   label: "Easy",   icon: "🟢", desc: "Beginner-friendly questions",  color: "#16a34a", lightBg: "#f0fdf4", border: "#bbf7d0" },
    { value: "Medium", label: "Medium", icon: "🟡", desc: "Moderate challenge level",      color: "#d97706", lightBg: "#fffbeb", border: "#fde68a" },
    { value: "Hard",   label: "Hard",   icon: "🔴", desc: "Advanced & tricky questions",   color: "#e11d48", lightBg: "#fff1f2", border: "#fecdd3" },
  ];

  const selectedRole = roles.find(r => r.value === role);
  const canStart     = !!(role && difficulty);

  return (
    <div className="view-wrapper">
      <div className="page-header">
        <h1 className="page-title">AI Interview</h1>
        <p className="page-subtitle">Choose your role and difficulty to begin your AI-powered mock interview</p>
      </div>

      {/* Banner */}
      <div
        className="ai-banner"
        style={{
          background: selectedRole
            ? `linear-gradient(135deg,${selectedRole.color}18,${selectedRole.color}08)`
            : "linear-gradient(135deg,#6366f110,#8b5cf608)",
          border: `1px solid ${selectedRole ? selectedRole.color + "33" : "#6366f122"}`,
        }}
      >
        <div
          className="ai-banner-icon"
          style={{
            background: selectedRole ? selectedRole.lightBg : "#eef2ff",
            border: `1px solid ${selectedRole ? selectedRole.color + "33" : "#6366f122"}`,
          }}
        >
          {selectedRole ? selectedRole.icon : "🎯"}
        </div>
        <div>
          <div className="ai-banner-title">
            {selectedRole ? selectedRole.label : "Select a role to begin"}
          </div>
          <div className="ai-banner-meta">
            {canStart
              ? `Ready to start · ${difficulty} difficulty`
              : role ? "Now pick a difficulty level" : "Choose your interview track below"}
          </div>
        </div>
        {canStart && (
          <div
            className="ai-ready-badge"
            style={{
              background: selectedRole.lightBg,
              color: selectedRole.color,
              border: `1px solid ${selectedRole.color}44`,
            }}
          >
            ✓ Ready
          </div>
        )}
      </div>

      {/* Role */}
      <div style={{ marginBottom: 28 }}>
        <div className="section-label">Select Role</div>
        <div className="role-tabs">
          {roles.map(r => {
            const isActive = role === r.value;
            return (
              <button
                key={r.value}
                onClick={() => setRole(r.value)}
                className="role-tab-btn"
                style={isActive
                  ? { background: r.color, color: "#fff", fontWeight: 700, border: "none", boxShadow: `0 4px 14px ${r.color}44` }
                  : { background: T.cardBg, color: T.text2, fontWeight: 500, border: `1px solid ${T.border}`, boxShadow: "0 1px 3px #00000010" }
                }
              >
                <span style={{ fontSize: "1rem" }}>{r.icon}</span>
                {r.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Difficulty */}
      <div style={{ marginBottom: 32 }}>
        <div className="section-label">Select Difficulty</div>
        <div className="difficulty-grid">
          {difficulties.map(d => {
            const isActive = difficulty === d.value;
            return (
              <button
                key={d.value}
                onClick={() => setDifficulty(d.value)}
                className="difficulty-btn"
                style={isActive
                  ? { background: d.lightBg, border: `1.5px solid ${d.border}`, boxShadow: `0 4px 14px ${d.color}18` }
                  : { background: T.cardBg,   border: `1px solid ${T.border}`,   boxShadow: "0 1px 4px #00000009" }
                }
              >
                <div
                  className="difficulty-icon"
                  style={{
                    background: isActive ? d.lightBg : "#f5f4f0",
                    border: `1.5px solid ${isActive ? d.border : T.border}`,
                  }}
                >
                  {d.icon}
                </div>
                <div>
                  <div className="difficulty-label" style={{ color: isActive ? d.color : T.text1 }}>{d.label}</div>
                  <div className="difficulty-desc">{d.desc}</div>
                </div>
                {isActive && <div className="difficulty-check" style={{ background: d.color }}>✓</div>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Question count */}
      <div style={{ marginBottom: 30 }}>
        <div className="section-label">Number of Questions</div>
        <div className="q-count-row">
          {[5, 10].map(n => (
            <button
              key={n}
              onClick={() => setQuestionCount(n)}
              className="q-count-btn"
              style={questionCount === n
                ? { background: T.accent, color: "#fff", border: "none" }
                : { background: T.cardBg, color: T.text2, border: `1px solid ${T.border}` }
              }
            >
              {n} Questions
            </button>
          ))}
        </div>
      </div>

      {/* Start */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <button
          className="start-btn"
          onClick={canStart ? handleStart : undefined}
          disabled={!canStart}
          style={canStart && selectedRole
            ? { background: `linear-gradient(135deg,${selectedRole.color},${selectedRole.color}cc)`, color: "#fff", boxShadow: `0 4px 16px ${selectedRole.color}44` }
            : undefined
          }
        >
          🎙️ Start Interview
        </button>
        {!canStart && (
          <span className="submit-hint">
            {!role ? "Select a role first" : "Select a difficulty to continue"}
          </span>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// PROFILE VIEW
// ══════════════════════════════════════════════════════════════════════════════
function ProfileView({ userName, userEmail, handleLogout }) {
  return (
    <div className="view-wrapper">
      <div className="page-header">
        <h1 className="page-title">My Profile</h1>
        <p className="page-subtitle">Manage your account details</p>
      </div>

      <div className="profile-card">
        {/* Avatar row */}
        <div className="profile-avatar-row">
          <div className="profile-avatar">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div>
            <div className="profile-name">{userName || "—"}</div>
            <div className="profile-role">Interview Candidate</div>
          </div>
        </div>

        {/* Fields */}
        <div className="profile-fields">
          {[
            { label: "Full Name",     value: userName  || "Not set" },
            { label: "Email Address", value: userEmail || "Not set" },
          ].map(({ label, value }) => (
            <div key={label}>
              <div className="profile-field-label">{label}</div>
              <div
                className="profile-field-value"
                style={{ color: value === "Not set" ? T.text3 : T.text1 }}
              >
                {value}
              </div>
            </div>
          ))}
        </div>

        <button className="profile-logout-btn" onClick={handleLogout}>
          <LogoutIcon /> Log Out
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [active,        setActive]        = useState("dashboard");
  const [sidebarOpen,   setSidebarOpen]   = useState(false);
  const [role,          setRole]          = useState("");
  const [difficulty,    setDifficulty]    = useState("");
  const [questionCount, setQuestionCount] = useState(5);
  const [interviews,    setInterviews]    = useState([]);

  const navigate = useNavigate();

  // Fetch interviews once
  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const { data } = await axios.get("/api/interview/my");
        setInterviews(data);
      } catch {
        console.log("Error fetching interviews");
      }
    };
    fetchInterviews();
  }, []);

  // Close drawer when resizing back to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 900) setSidebarOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleStart = () => {
    if (!role || !difficulty) { alert("Please select role and difficulty"); return; }
    navigate("/interview", { state: { role, difficulty, questionCount } });
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      navigate("/");
    }
  };

  // Close drawer + navigate on mobile tap
  const handleNavClick = (id) => {
    setActive(id);
    setSidebarOpen(false);
  };

  const user      = JSON.parse(localStorage.getItem("user") || "{}");
  const userName  = user?.name  || "";
  const userEmail = user?.email || "";

  const renderView = () => {
    switch (active) {
      case "dashboard":   return <DashboardView interviews={interviews} />;
      case "preparation": return <PreparationView />;
      case "interview":
        return (
          <AiInterView
            role={role}               setRole={setRole}
            difficulty={difficulty}   setDifficulty={setDifficulty}
            questionCount={questionCount} setQuestionCount={setQuestionCount}
            handleStart={handleStart}
          />
        );
      case "profile":
        return <ProfileView userName={userName} userEmail={userEmail} handleLogout={handleLogout} />;
      default: return null;
    }
  };

  return (
    <div className="app-wrapper">

      {/* ── Mobile overlay — tap to close drawer ── */}
      <div
        className={`sidebar-overlay${sidebarOpen ? " open" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* ── Sidebar ── */}
      <aside className={`sidebar${sidebarOpen ? " open" : ""}`}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-inner">
            <div className="sidebar-logo-icon">🎯</div>
            <span className="sidebar-logo-text">InterviewAI</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => handleNavClick(id)}
              className={`nav-btn${active === id ? " active" : ""}`}
            >
              <Icon /> {label}
            </button>
          ))}
        </nav>

        <div className="sidebar-user">
          <div className="sidebar-user-card">
            <div className="sidebar-avatar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{userName  || "User"}</div>
              <div className="sidebar-user-email">{userEmail || "email@example.com"}</div>
            </div>
          </div>
          <button className="sidebar-logout-btn" onClick={handleLogout}>
            <LogoutIcon /> Logout
          </button>
        </div>
      </aside>

      {/* ── Main (flex column: topbar on top, scroll area below) ── */}
      <main className="main-content">

        {/* Topbar — visible only on mobile via CSS */}
        <div className="topbar">
          <div className="topbar-logo">
            <div className="topbar-logo-icon">🎯</div>
            <span className="topbar-logo-text">InterviewAI</span>
          </div>
          <button
            className="hamburger-btn"
            onClick={() => setSidebarOpen(o => !o)}
            aria-label="Toggle menu"
          >
            <span className="hamburger-line" />
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>
        </div>

        {/* Page content */}
        <div className="main-scroll">
          {renderView()}
        </div>

      </main>
    </div>
  );
}

// import { useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import "./Dashboard.css";
// import axios from "../api/axios";

// // ── Theme tokens (off-white light mode) ───────────────────────────────────────
// const T = {
//   pageBg: "#f5f4f0",
//   sidebarBg: "#edecea",
//   cardBg: "#ffffff",
//   border: "#e2e0db",
//   accent: "#6366f1",
//   textPrimary: "#1e1b18",
//   textMuted: "#7c7874",
//   textSub: "#a09d9a",
// };

// // ── Nav items ─────────────────────────────────────────────────────────────────
// const NAV = [
//   { id: "dashboard", label: "Dashboard", icon: DashIcon },
//   { id: "preparation", label: "Interview Preparation", icon: PrepIcon },
//   { id: "interview", label: "AI Interview", icon: AIIcon },
//   { id: "profile", label: "My Profile", icon: ProfileIcon },
// ];

// // ── Icons ─────────────────────────────────────────────────────────────────────
// function DashIcon() {
//   return (
//     <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <rect x="3" y="3" width="7" height="7" rx="1.5" />
//       <rect x="14" y="3" width="7" height="7" rx="1.5" />
//       <rect x="3" y="14" width="7" height="7" rx="1.5" />
//       <rect x="14" y="14" width="7" height="7" rx="1.5" />
//     </svg>
//   );
// }
// function PrepIcon() {
//   return (
//     <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
//       <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
//     </svg>
//   );
// }
// function AIIcon() {
//   return (
//     <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <path d="M12 2a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
//       <path d="M12 7v4" />
//       <path d="M8 11H5a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2h-3" />
//       <path d="M9 20v1m6-1v1" />
//     </svg>
//   );
// }
// function ProfileIcon() {
//   return (
//     <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
//       <circle cx="12" cy="7" r="4" />
//     </svg>
//   );
// }
// function LogoutIcon() {
//   return (
//     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
//       <polyline points="16 17 21 12 16 7" />
//       <line x1="21" y1="12" x2="9" y2="12" />
//     </svg>
//   );
// }

// // ── VIEWS ─────────────────────────────────────────────────────────────────────
// function DashboardView({ interviews = [] }) {
// const safeScores = interviews
//   .map(i => Number(i.totalScore))
//   .filter(score => !isNaN(score));

// const stats = [
//   {
//     label: "Total Interviews",
//     value: interviews.length,
//     accent: "#6366f1",
//     icon: "🎯",
//     lightBg: "#eef2ff"
//   },
//   {
//     label: "Average Score",
//     value:
//       safeScores.length > 0
//         ? Math.round(
//             safeScores.reduce((acc, s) => acc + s, 0) /
//               safeScores.length
//           )
//         : 0,
//     accent: "#10b981",
//     icon: "📊",
//     lightBg: "#f0fdf4"
//   },
//   {
//     label: "Highest Score",
//     value:
//       safeScores.length > 0
//         ? Math.max(...safeScores)
//         : 0,
//     accent: "#f59e0b",
//     icon: "🏆",
//     lightBg: "#fffbeb"
//   }
// ];

//   return (
//     <div style={{ animation: "fadeUp 0.4s ease" }}>
//       <div style={{ marginBottom: 32 }}>
//         <h1 style={{
//           fontFamily: "'Syne',sans-serif",
//           fontSize: "1.85rem",
//           fontWeight: 800,
//           color: T.textPrimary,
//           letterSpacing: "-0.03em"
//         }}>
//           Dashboard
//         </h1>
//         <p style={{ color: T.textMuted, marginTop: 6, fontSize: "0.9rem" }}>
//           Overview of your interview activity
//         </p>
//       </div>

//       {/* Stat cards */}
//       <div style={{
//         display: "grid",
//         gridTemplateColumns: "repeat(auto-fit, minmax(155px, 1fr))",
//         gap: 16,
//         marginBottom: 36
//       }}>
//         {stats.map((s) => (
//           <div key={s.label} style={{
//             background: T.cardBg,
//             border: `1px solid ${T.border}`,
//             borderRadius: 16,
//             padding: "22px 20px",
//             position: "relative",
//             overflow: "hidden",
//             transition: "transform 0.2s, box-shadow 0.2s",
//             boxShadow: "0 1px 4px #00000009",
//           }}>
//             <div style={{
//               position: "absolute",
//               top: 0,
//               left: 0,
//               right: 0,
//               height: 3,
//               background: s.accent,
//               borderRadius: "16px 16px 0 0"
//             }} />

//             <div style={{
//               width: 38,
//               height: 38,
//               borderRadius: 10,
//               background: s.lightBg,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               fontSize: "1.2rem",
//               marginBottom: 12
//             }}>
//               {s.icon}
//             </div>

//             {/* ✅ FIXED NUMBER HERE */}
//             <div style={{
//               fontSize: "2rem",
//               fontFamily: "'Syne',sans-serif",
//               fontWeight: 800,
//               color: s.accent,
//               lineHeight: 1
//             }}>
//               {s.value}
//             </div>

//             <div style={{
//               color: T.textMuted,
//               fontSize: "0.8rem",
//               marginTop: 6
//             }}>
//               {s.label}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// // ── MCQ Data ──────────────────────────────────────────────────────────────────
// const MCQ_DATA = {
//   frontend: {
//     label: "Frontend", icon: "🖥️", color: "#6366f1", lightBg: "#eef2ff",
//     questions: [
//       { q: "What does the CSS `box-model` consist of?", options: ["Content, Padding, Border, Margin", "Width, Height, Color, Font", "Display, Position, Float, Clear", "None of the above"], ans: 0 },
//       { q: "Which hook is used to manage state in a React functional component?", options: ["useEffect", "useRef", "useState", "useContext"], ans: 2 },
//       { q: "What is the purpose of `useEffect` in React?", options: ["Manage state", "Handle side effects", "Create context", "Memoize values"], ans: 1 },
//       { q: "What does `semantic HTML` mean?", options: ["Using CSS classes", "Using tags that convey meaning", "Writing inline styles", "Using JavaScript events"], ans: 1 },
//       { q: "Which CSS property is used to make a flex container?", options: ["display: block", "display: flex", "display: grid", "display: inline"], ans: 1 },
//     ],
//   },
//   backend: {
//     label: "Backend", icon: "⚙️", color: "#f59e0b", lightBg: "#fffbeb",
//     questions: [
//       { q: "What does REST stand for?", options: ["Representational State Transfer", "Remote Execution Standard Tool", "Request Entity Send Type", "None"], ans: 0 },
//       { q: "Which HTTP method is used to update a resource?", options: ["GET", "POST", "PUT", "DELETE"], ans: 2 },
//       { q: "What is middleware in Express.js?", options: ["A database layer", "A function between request and response", "A template engine", "A caching mechanism"], ans: 1 },
//       { q: "What is the purpose of an ORM?", options: ["Optimize RAM", "Map objects to database tables", "Create REST APIs", "Handle authentication"], ans: 1 },
//       { q: "Which status code means 'Not Found'?", options: ["200", "301", "404", "500"], ans: 2 },
//     ],
//   },
//   hr: {
//     label: "HR", icon: "🤝", color: "#10b981", lightBg: "#f0fdf4",
//     questions: [
//       { q: "How do you handle conflicts in a team?", options: ["Avoid the conflict", "Communicate openly and find a solution", "Escalate immediately", "Ignore it"], ans: 1 },
//       { q: "Describe yourself in one sentence.", options: ["I am lazy", "I am a fast learner who thrives in teams", "I prefer working alone", "I do not know"], ans: 1 },
//       { q: "What is your greatest strength?", options: ["Procrastination", "Problem-solving and adaptability", "Avoiding feedback", "None"], ans: 1 },
//       { q: "Why do you want to work here?", options: ["Just for money", "I align with the company's mission and values", "I have no other options", "It's close to home"], ans: 1 },
//       { q: "Where do you see yourself in 5 years?", options: ["Retired", "In a leadership role contributing to growth", "Doing the same job", "Not sure"], ans: 1 },
//     ],
//   },
//   dsa: {
//     label: "DSA", icon: "🧮", color: "#ef4444", lightBg: "#fff1f2",
//     questions: [
//       { q: "What is the time complexity of binary search?", options: ["O(n)", "O(n²)", "O(log n)", "O(1)"], ans: 2 },
//       { q: "Which data structure uses LIFO?", options: ["Queue", "Stack", "Heap", "Graph"], ans: 1 },
//       { q: "What is a linked list?", options: ["A fixed-size array", "A sequential collection of nodes", "A hash table", "A binary tree"], ans: 1 },
//       { q: "What does BFS stand for?", options: ["Binary File Search", "Breadth First Search", "Best First Sort", "None"], ans: 1 },
//       { q: "What is the worst-case of quicksort?", options: ["O(n log n)", "O(n)", "O(n²)", "O(log n)"], ans: 2 },
//     ],
//   },
//   fullstack: {
//     label: "Full Stack", icon: "🚀", color: "#8b5cf6", lightBg: "#f5f3ff",
//     questions: [
//       { q: "What is the difference between SQL and NoSQL?", options: ["No difference", "SQL is relational; NoSQL is non-relational", "NoSQL is faster always", "SQL is newer"], ans: 1 },
//       { q: "What is CORS?", options: ["A CSS framework", "Cross-Origin Resource Sharing", "Client-Object Request System", "None"], ans: 1 },
//       { q: "What is the role of a `.env` file?", options: ["Style components", "Store environment variables", "Define routes", "Compile TypeScript"], ans: 1 },
//       { q: "Which of the following is a state management library?", options: ["Express", "Redux", "Mongoose", "Axios"], ans: 1 },
//       { q: "What does `npm run build` typically do?", options: ["Start the dev server", "Bundle the app for production", "Install packages", "Run tests"], ans: 1 },
//     ],
//   },
// };
// const TOPICS = Object.keys(MCQ_DATA);



// function PreparationView() {
//   const [activeTopic, setActiveTopic] = useState("frontend");
//   const [selected, setSelected] = useState({});
//   const [submitted, setSubmitted] = useState(false);

//   const topic = MCQ_DATA[activeTopic];

//   const handleSelect = (qi, oi) => { if (!submitted) setSelected(p => ({ ...p, [qi]: oi })); };
//   const handleSubmit = () => setSubmitted(true);
//   const handleReset = () => { setSelected({}); setSubmitted(false); };
//   const handleTopicChange = (t) => { setActiveTopic(t); setSelected({}); setSubmitted(false); };

//   const answered = Object.keys(selected).length;
//   const total = topic.questions.length;
//   const score = submitted ? topic.questions.filter((q, i) => selected[i] === q.ans).length : null;

//   const scoreColor = score === total ? "#16a34a" : score >= 3 ? "#d97706" : "#e11d48";
//   const scoreBg = score === total ? "#f0fdf4" : score >= 3 ? "#fffbeb" : "#fff1f2";
//   const scoreBorder = score === total ? "#bbf7d0" : score >= 3 ? "#fde68a" : "#fecdd3";
//   const optionLabel = ["A", "B", "C", "D"];



//   return (
//     <div style={{ animation: "fadeUp 0.4s ease" }}>

//       {/* Page header */}
//       <div style={{ marginBottom: 24 }}>
//         <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.85rem", fontWeight: 800, color: T.textPrimary, letterSpacing: "-0.03em" }}>
//           Interview Preparation
//         </h1>
//         <p style={{ color: T.textMuted, marginTop: 5, fontSize: "0.88rem" }}>Pick a topic and test your knowledge with 5 MCQs</p>
//       </div>

//       {/* Topic pill tabs */}
//       <div style={{ display: "flex", gap: 10, marginBottom: 28, flexWrap: "wrap" }}>
//         {TOPICS.map(key => {
//           const t = MCQ_DATA[key];
//           const isActive = activeTopic === key;
//           return (
//             <button key={key} onClick={() => handleTopicChange(key)} style={{
//               display: "flex", alignItems: "center", gap: 8,
//               padding: "10px 20px", borderRadius: 50, cursor: "pointer",
//               background: isActive ? t.color : T.cardBg,
//               color: isActive ? "#fff" : T.textMuted,
//               fontFamily: "'DM Sans',sans-serif", fontSize: "0.85rem", fontWeight: isActive ? 700 : 500,
//               boxShadow: isActive ? `0 4px 14px ${t.color}44` : `0 1px 3px #00000010`,
//               border: isActive ? "none" : `1px solid ${T.border}`,
//               transition: "all 0.2s",
//             }}
//               onMouseEnter={e => { if (!isActive) { e.currentTarget.style.borderColor = t.color; e.currentTarget.style.color = t.color; } }}
//               onMouseLeave={e => { if (!isActive) { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMuted; } }}
//             >
//               <span style={{ fontSize: "1rem" }}>{t.icon}</span>
//               {t.label}
//             </button>
//           );
//         })}
//       </div>

//       {/* Active topic banner */}
//       <div style={{
//         background: `linear-gradient(135deg, ${topic.color}18, ${topic.color}08)`,
//         border: `1px solid ${topic.color}33`,
//         borderRadius: 18, padding: "20px 26px", marginBottom: 24,
//         display: "flex", alignItems: "center", justifyContent: "space-between",
//       }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
//           <div style={{
//             width: 52, height: 52, borderRadius: 14,
//             background: topic.lightBg, border: `1px solid ${topic.color}33`,
//             display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.6rem",
//           }}>{topic.icon}</div>
//           <div>
//             <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1.1rem", color: T.textPrimary }}>{topic.label}</div>
//             <div style={{ fontSize: "0.78rem", color: T.textMuted, marginTop: 3 }}>
//               {submitted ? "Completed · " : `${answered}/${total} answered · `}
//               <span style={{ color: topic.color, fontWeight: 600 }}>{total} questions</span>
//             </div>
//           </div>
//         </div>
//         <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//           {!submitted && (
//             <div style={{
//               width: 52, height: 52, borderRadius: "50%",
//               background: `conic-gradient(${topic.color} ${(answered / total) * 360}deg, ${topic.color}22 0deg)`,
//               display: "flex", alignItems: "center", justifyContent: "center",
//             }}>
//               <div style={{ width: 38, height: 38, borderRadius: "50%", background: T.pageBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 700, color: topic.color, fontFamily: "'Syne',sans-serif" }}>
//                 {answered}/{total}
//               </div>
//             </div>
//           )}
//           {submitted && (
//             <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//               <div style={{ padding: "8px 18px", borderRadius: 50, background: scoreBg, color: scoreColor, border: `1px solid ${scoreBorder}`, fontWeight: 700, fontSize: "0.9rem", fontFamily: "'Syne',sans-serif" }}>
//                 {score}/{total} correct
//               </div>
//               <button onClick={handleReset} style={{
//                 padding: "8px 18px", borderRadius: 50, cursor: "pointer",
//                 background: T.cardBg, border: `1px solid ${T.border}`,
//                 color: T.textMuted, fontFamily: "'DM Sans',sans-serif", fontSize: "0.82rem", fontWeight: 600,
//               }}>↺ Retry</button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Questions */}
//       <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
//         {topic.questions.map((q, qi) => {
//           const isAnswered = selected[qi] !== undefined;
//           return (
//             <div key={`${activeTopic}-${qi}`} style={{
//               background: T.cardBg,
//               border: `1px solid ${isAnswered && !submitted ? topic.color + "44" : T.border}`,
//               borderRadius: 16, overflow: "hidden",
//               boxShadow: "0 2px 8px #00000008",
//               transition: "border-color 0.2s",
//             }}>
//               {/* Question strip */}
//               <div style={{ padding: "18px 22px 14px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "flex-start", gap: 14 }}>
//                 <div style={{
//                   minWidth: 32, height: 32, borderRadius: 10,
//                   background: submitted ? (selected[qi] === q.ans ? "#f0fdf4" : "#fff1f2") : (isAnswered ? topic.lightBg : "#f5f4f0"),
//                   border: `1.5px solid ${submitted ? (selected[qi] === q.ans ? "#86efac" : "#fca5a5") : (isAnswered ? topic.color + "55" : T.border)}`,
//                   display: "flex", alignItems: "center", justifyContent: "center",
//                   fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "0.78rem",
//                   color: submitted ? (selected[qi] === q.ans ? "#16a34a" : "#e11d48") : (isAnswered ? topic.color : T.textSub),
//                   flexShrink: 0,
//                 }}>
//                   {submitted ? (selected[qi] === q.ans ? "✓" : "✗") : qi + 1}
//                 </div>
//                 <p style={{ fontWeight: 600, fontSize: "0.92rem", color: T.textPrimary, lineHeight: 1.55, paddingTop: 4 }}>{q.q}</p>
//               </div>

//               {/* Options 2x2 grid */}
//               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
//                 {q.options.map((opt, oi) => {
//                   const isSel = selected[qi] === oi;
//                   const isCorrect = q.ans === oi;
//                   let bg = "transparent", borderC = "transparent", textC = T.textPrimary, labelBg = "#f5f4f0", labelC = T.textSub;
//                   if (submitted) {
//                     if (isCorrect) { bg = "#f0fdf4"; textC = "#15803d"; labelBg = "#dcfce7"; labelC = "#16a34a"; borderC = "#86efac"; }
//                     else if (isSel && !isCorrect) { bg = "#fff1f2"; textC = "#be123c"; labelBg = "#fecdd3"; labelC = "#e11d48"; borderC = "#fca5a5"; }
//                   } else if (isSel) {
//                     bg = topic.lightBg; textC = topic.color; labelBg = topic.color + "22"; labelC = topic.color; borderC = topic.color + "55";
//                   }
//                   return (
//                     <button key={oi} onClick={() => handleSelect(qi, oi)} style={{
//                       display: "flex", alignItems: "center", gap: 12, padding: "13px 18px",
//                       background: bg, border: "none",
//                       borderTop: `1px solid ${T.border}`,
//                       borderLeft: oi % 2 === 1 ? `1px solid ${T.border}` : "none",
//                       cursor: submitted ? "default" : "pointer",
//                       textAlign: "left", transition: "background 0.15s",
//                       outline: isSel && !submitted ? `2px solid ${topic.color}44` : "none",
//                       outlineOffset: -2,
//                     }}
//                       onMouseEnter={e => { if (!submitted && !isSel) e.currentTarget.style.background = "#00000005"; }}
//                       onMouseLeave={e => { if (!submitted && !isSel) e.currentTarget.style.background = "transparent"; }}
//                     >
//                       <span style={{
//                         minWidth: 26, height: 26, borderRadius: 8,
//                         background: labelBg, color: labelC,
//                         display: "flex", alignItems: "center", justifyContent: "center",
//                         fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "0.72rem",
//                         flexShrink: 0, border: `1.5px solid ${borderC || "#e2e0db"}`,
//                       }}>{optionLabel[oi]}</span>
//                       <span style={{ fontSize: "0.84rem", color: textC, fontWeight: isSel || (submitted && isCorrect) ? 600 : 400, lineHeight: 1.4 }}>{opt}</span>
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Submit / Score bar */}
//       <div style={{ marginTop: 28, display: "flex", alignItems: "center", gap: 14 }}>
//         {!submitted ? (
//           <>
//             <button onClick={handleSubmit} disabled={answered < total} style={{
//               padding: "13px 36px", borderRadius: 12,
//               background: answered < total ? "#e2e0db" : `linear-gradient(135deg, ${topic.color}, ${topic.color}cc)`,
//               color: answered < total ? T.textSub : "#fff",
//               border: "none", cursor: answered < total ? "not-allowed" : "pointer",
//               fontFamily: "'DM Sans',sans-serif", fontSize: "0.92rem", fontWeight: 700,
//               boxShadow: answered < total ? "none" : `0 4px 16px ${topic.color}44`,
//               transition: "all 0.2s",
//             }}>Submit Answers</button>
//             <span style={{ fontSize: "0.82rem", color: T.textSub }}>
//               {answered < total ? `${total - answered} question${total - answered > 1 ? "s" : ""} remaining` : "All answered — ready to submit!"}
//             </span>
//           </>
//         ) : (
//           <div style={{
//             display: "flex", alignItems: "center", gap: 16, padding: "14px 24px",
//             background: scoreBg, border: `1px solid ${scoreBorder}`,
//             borderRadius: 14, width: "100%",
//           }}>
//             <div style={{ fontSize: "2rem" }}>{score === total ? "🎉" : score >= 3 ? "👍" : "📚"}</div>
//             <div>
//               <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1rem", color: scoreColor }}>
//                 You scored {score} out of {total}
//               </div>
//               <div style={{ fontSize: "0.8rem", color: T.textMuted, marginTop: 2 }}>
//                 {score === total ? "Perfect score! Outstanding work." : score >= 3 ? "Good job! Review the incorrect ones." : "Keep practising — you'll get there!"}
//               </div>
//             </div>
//             <button onClick={handleReset} style={{
//               marginLeft: "auto", padding: "9px 20px", borderRadius: 10,
//               background: T.cardBg, border: `1px solid ${T.border}`,
//               color: T.textMuted, cursor: "pointer",
//               fontFamily: "'DM Sans',sans-serif", fontSize: "0.83rem", fontWeight: 600,
//             }}>↺ Try Again</button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
// function AiInterView({
//   role,
//   setRole,
//   difficulty,
//   setDifficulty,
//   questionCount,
//   setQuestionCount,
//   handleStart,
// }) {
//   const roles = [
//     { value: "Frontend", label: "Frontend Developer", icon: "🖥️", color: "#6366f1", lightBg: "#eef2ff" },
//     { value: "Backend", label: "Backend Developer", icon: "⚙️", color: "#f59e0b", lightBg: "#fffbeb" },
//     { value: "Fullstack", label: "Full Stack", icon: "🚀", color: "#8b5cf6", lightBg: "#f5f3ff" },
//     { value: "HR", label: "HR", icon: "🤝", color: "#10b981", lightBg: "#f0fdf4" },
//     { value: "DSA", label: "DSA", icon: "🧮", color: "#ef4444", lightBg: "#fff1f2" },
//   ];

//   const difficulties = [
//     { value: "Easy", label: "Easy", icon: "🟢", desc: "Beginner-friendly questions", color: "#16a34a", lightBg: "#f0fdf4", border: "#bbf7d0" },
//     { value: "Medium", label: "Medium", icon: "🟡", desc: "Moderate challenge level", color: "#d97706", lightBg: "#fffbeb", border: "#fde68a" },
//     { value: "Hard", label: "Hard", icon: "🔴", desc: "Advanced & tricky questions", color: "#e11d48", lightBg: "#fff1f2", border: "#fecdd3" },
//   ];

//   const selectedRole = roles.find(r => r.value === role);
//   const canStart = role && difficulty;

//   return (
//     <div style={{ animation: "fadeUp 0.4s ease" }}>

//       {/* Header */}
//       <div style={{ marginBottom: 28 }}>
//         <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.85rem", fontWeight: 800, color: T.textPrimary, letterSpacing: "-0.03em" }}>
//           AI Interview
//         </h1>
//         <p style={{ color: T.textMuted, marginTop: 5, fontSize: "0.88rem" }}>
//           Choose your role and difficulty to begin your AI-powered mock interview
//         </p>
//       </div>

//       {/* Banner */}
//       <div style={{
//         background: selectedRole
//           ? `linear-gradient(135deg, ${selectedRole.color}18, ${selectedRole.color}08)`
//           : "linear-gradient(135deg, #6366f110, #8b5cf608)",
//         border: `1px solid ${selectedRole ? selectedRole.color + "33" : "#6366f122"}`,
//         borderRadius: 18, padding: "20px 26px", marginBottom: 28,
//         display: "flex", alignItems: "center", gap: 16,
//       }}>
//         <div style={{
//           width: 52, height: 52, borderRadius: 14, fontSize: "1.6rem",
//           background: selectedRole ? selectedRole.lightBg : "#eef2ff",
//           border: `1px solid ${selectedRole ? selectedRole.color + "33" : "#6366f122"}`,
//           display: "flex", alignItems: "center", justifyContent: "center",
//         }}>
//           {selectedRole ? selectedRole.icon : "🎯"}
//         </div>
//         <div>
//           <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1.05rem", color: T.textPrimary }}>
//             {selectedRole ? selectedRole.label : "Select a role to begin"}
//           </div>
//           <div style={{ fontSize: "0.78rem", color: T.textMuted, marginTop: 3 }}>
//             {canStart
//               ? `Ready to start · ${difficulty} difficulty`
//               : role
//                 ? "Now pick a difficulty level"
//                 : "Choose your interview track below"}
//           </div>
//         </div>
//         {canStart && (
//           <div style={{
//             marginLeft: "auto", padding: "6px 16px", borderRadius: 50,
//             background: selectedRole.lightBg,
//             color: selectedRole.color,
//             border: `1px solid ${selectedRole.color}44`,
//             fontSize: "0.78rem", fontWeight: 700,
//           }}>
//             ✓ Ready
//           </div>
//         )}
//       </div>

//       {/* Role Selection */}
//       <div style={{ marginBottom: 28 }}>
//         <div style={{ fontSize: "0.7rem", fontWeight: 700, color: T.accent, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>
//           Select Role
//         </div>
//         <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
//           {roles.map(r => {
//             const isActive = role === r.value;
//             return (
//               <button key={r.value} onClick={() => setRole(r.value)} style={{
//                 display: "flex", alignItems: "center", gap: 8,
//                 padding: "10px 20px", borderRadius: 50, cursor: "pointer",
//                 background: isActive ? r.color : T.cardBg,
//                 color: isActive ? "#fff" : T.textMuted,
//                 fontFamily: "'DM Sans',sans-serif", fontSize: "0.85rem", fontWeight: isActive ? 700 : 500,
//                 boxShadow: isActive ? `0 4px 14px ${r.color}44` : "0 1px 3px #00000010",
//                 border: isActive ? "none" : `1px solid ${T.border}`,
//                 transition: "all 0.2s",
//               }}
//                 onMouseEnter={e => { if (!isActive) { e.currentTarget.style.borderColor = r.color; e.currentTarget.style.color = r.color; } }}
//                 onMouseLeave={e => { if (!isActive) { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMuted; } }}
//               >
//                 <span style={{ fontSize: "1rem" }}>{r.icon}</span>
//                 {r.label}
//               </button>
//             );
//           })}
//         </div>
//       </div>

//       {/* Difficulty Selection */}
//       <div style={{ marginBottom: 32 }}>
//         <div style={{ fontSize: "0.7rem", fontWeight: 700, color: T.accent, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>
//           Select Difficulty
//         </div>
//         <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
//           {difficulties.map(d => {
//             const isActive = difficulty === d.value;
//             return (
//               <button key={d.value} onClick={() => setDifficulty(d.value)} style={{
//                 display: "flex", alignItems: "center", gap: 14,
//                 padding: "16px 18px", borderRadius: 14, cursor: "pointer",
//                 background: isActive ? d.lightBg : T.cardBg,
//                 border: isActive ? `1.5px solid ${d.border}` : `1px solid ${T.border}`,
//                 boxShadow: isActive ? `0 4px 14px ${d.color}18` : "0 1px 4px #00000009",
//                 transition: "all 0.2s", textAlign: "left",
//               }}
//                 onMouseEnter={e => { if (!isActive) { e.currentTarget.style.borderColor = d.border; e.currentTarget.style.background = d.lightBg + "88"; } }}
//                 onMouseLeave={e => { if (!isActive) { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.background = T.cardBg; } }}
//               >
//                 <div style={{
//                   width: 40, height: 40, borderRadius: 10, flexShrink: 0,
//                   background: isActive ? d.lightBg : "#f5f4f0",
//                   border: `1.5px solid ${isActive ? d.border : T.border}`,
//                   display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem",
//                 }}>{d.icon}</div>
//                 <div>
//                   <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.92rem", color: isActive ? d.color : T.textPrimary }}>
//                     {d.label}
//                   </div>
//                   <div style={{ fontSize: "0.73rem", color: T.textMuted, marginTop: 2 }}>{d.desc}</div>
//                 </div>
//                 {isActive && (
//                   <div style={{
//                     marginLeft: "auto", width: 20, height: 20, borderRadius: "50%",
//                     background: d.color, display: "flex", alignItems: "center",
//                     justifyContent: "center", fontSize: "0.65rem", color: "#fff", fontWeight: 800,
//                   }}>✓</div>
//                 )}
//               </button>
//             );
//           })}
//         </div>
//       </div>
//       {/* Question Count Selection */}

//       <div style={{ marginBottom: 30 }}>

//         <div style={{
//           fontSize: "0.7rem",
//           fontWeight: 700,
//           color: T.accent,
//           textTransform: "uppercase",
//           letterSpacing: "0.1em",
//           marginBottom: 10
//         }}>
//           Number of Questions
//         </div>

//         <div style={{ display: "flex", gap: 12 }}>

//           <button
//             onClick={() => setQuestionCount(5)}
//             style={{
//               padding: "10px 22px",
//               borderRadius: 10,
//               border: questionCount === 5 ? "none" : `1px solid ${T.border}`,
//               background: questionCount === 5 ? T.accent : T.cardBg,
//               color: questionCount === 5 ? "#fff" : T.textMuted,
//               fontWeight: 600,
//               cursor: "pointer"
//             }}
//           >
//             5 Questions
//           </button>

//           <button
//             onClick={() => setQuestionCount(10)}
//             style={{
//               padding: "10px 22px",
//               borderRadius: 10,
//               border: questionCount === 10 ? "none" : `1px solid ${T.border}`,
//               background: questionCount === 10 ? T.accent : T.cardBg,
//               color: questionCount === 10 ? "#fff" : T.textMuted,
//               fontWeight: 600,
//               cursor: "pointer"
//             }}
//           >
//             10 Questions
//           </button>

//         </div>

//       </div>
//       {/* Start Button */}
//       <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
//         <button
//           onClick={canStart ? handleStart : undefined}
//           disabled={!canStart}
//           style={{
//             padding: "14px 40px", borderRadius: 12, border: "none",
//             background: canStart
//               ? `linear-gradient(135deg, ${selectedRole.color}, ${selectedRole.color}cc)`
//               : "#e2e0db",
//             color: canStart ? "#fff" : T.textSub,
//             fontFamily: "'DM Sans',sans-serif", fontSize: "0.95rem", fontWeight: 700,
//             cursor: canStart ? "pointer" : "not-allowed",
//             boxShadow: canStart ? `0 4px 16px ${selectedRole.color}44` : "none",
//             transition: "all 0.2s",
//           }}
//         >
//           🎙️ Start Interview
//         </button>
//         {!canStart && (
//           <span style={{ fontSize: "0.82rem", color: T.textSub }}>
//             {!role ? "Select a role first" : "Select a difficulty to continue"}
//           </span>
//         )}
//       </div>

//     </div>
//   );
// }

// function ProfileView({ userName, userEmail, handleLogout }) {
//   return (
//     <div style={{ animation: "fadeUp 0.4s ease" }}>
//       <div style={{ marginBottom: 32 }}>
//         <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.85rem", fontWeight: 800, color: T.textPrimary, letterSpacing: "-0.03em" }}>My Profile</h1>
//         <p style={{ color: T.textMuted, marginTop: 6, fontSize: "0.9rem" }}>Manage your account details</p>
//       </div>

//       <div style={{ background: T.cardBg, border: `1px solid ${T.border}`, borderRadius: 16, padding: 32, maxWidth: 520, boxShadow: "0 1px 4px #00000009" }}>
//         {/* Avatar */}
//         <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 32 }}>
//           <div style={{
//             width: 72, height: 72, borderRadius: "50%",
//             background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
//             display: "flex", alignItems: "center", justifyContent: "center",
//             boxShadow: "0 4px 16px #6366f133",
//           }}>
//             <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//               <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
//               <circle cx="12" cy="7" r="4" />
//             </svg>
//           </div>
//           <div>
//             <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1.15rem", color: T.textPrimary }}>{userName || "—"}</div>
//             <div style={{ color: T.textMuted, fontSize: "0.85rem", marginTop: 3 }}>Interview Candidate</div>
//           </div>
//         </div>

//         {/* Info fields */}
//         <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
//           {[
//             { label: "Full Name", value: userName || "Not set" },
//             { label: "Email Address", value: userEmail || "Not set" },
//           ].map(({ label, value }) => (
//             <div key={label}>
//               <div style={{ fontSize: "0.7rem", fontWeight: 700, color: T.accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{label}</div>
//               <div style={{ background: T.pageBg, border: `1px solid ${T.border}`, borderRadius: 10, padding: "12px 16px", fontSize: "0.9rem", color: value === "Not set" ? T.textSub : T.textPrimary }}>{value}</div>
//             </div>
//           ))}
//         </div>

//         {/* Logout */}
//         <button onClick={handleLogout} style={{
//           width: "100%", padding: "13px", borderRadius: 12,
//           background: "transparent", border: "1px solid #fca5a566",
//           color: "#e11d48", fontFamily: "'DM Sans',sans-serif",
//           fontSize: "0.9rem", fontWeight: 600, cursor: "pointer",
//           display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
//           transition: "all 0.2s",
//         }}
//           onMouseEnter={e => { e.currentTarget.style.background = "#fff1f2"; e.currentTarget.style.borderColor = "#fca5a5"; }}
//           onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "#fca5a566"; }}
//         >
//           <LogoutIcon /> Log Out
//         </button>

//       </div>
//     </div>
//   );
// }

// // ── MAIN APP ──────────────────────────────────────────────────────────────────

// export default function App() {
//   const [active, setActive] = useState("dashboard");
//   const navigate = useNavigate();


//   // ─────────────────────────────────────────────
//   // MAIN APP
//   // ─────────────────────────────────────────────

//   const [role, setRole] = useState("");
//   const [difficulty, setDifficulty] = useState("");
//   const [questionCount, setQuestionCount] = useState(5);
//   const [interviews, setInterviews] = useState([]);

//   // ✅ FIXED: no infinite loop
//   useEffect(() => {
//     const fetchInterviews = async () => {
//       try {
//         const { data } = await axios.get("/api/interview/my");
//         setInterviews(data);
//       } catch {
//         console.log("Error fetching interviews");
//       }
//     };

//     fetchInterviews();
//   }, []);

//   // ── Handlers ──
//   const handleStart = () => {
//     if (!role || !difficulty) {
//       alert("Please select role and difficulty");
//       return;
//     }

//     navigate("/interview", {
//       state: {
//         role,
//         difficulty,
//         questionCount
//       }
//     });
//   };

//   const renderView = () => {
//     if (active === "dashboard") return <DashboardView interviews={interviews} />;

//     if (active === "preparation") return <PreparationView />;

//     if (active === "interview")
//       return (
//         <AiInterView
//           role={role}
//           setRole={setRole}
//           difficulty={difficulty}
//           setDifficulty={setDifficulty}
//           questionCount={questionCount}
//           setQuestionCount={setQuestionCount}
//           handleStart={handleStart}
//         />
//       );

//     if (active === "profile")
//       return (
//         <ProfileView
//           userName={userName}
//           userEmail={userEmail}
//           handleLogout={handleLogout}
//         />
//       );
//   };

//   // logout handler
//   const handleLogout = () => {
//     if (window.confirm("Are you sure you want to logout?")) {
//       localStorage.clear();
//       navigate("/");
//     }
//   };



//   const user = JSON.parse(localStorage.getItem("user"));

//   const userName = user?.name || "";
//   const userEmail = user?.email || "";

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
//         * { box-sizing: border-box; margin: 0; padding: 0; }
//         body { background: #f5f4f0; }
//         @keyframes fadeUp {
//           from { opacity: 0; transform: translateY(14px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }
//         ::-webkit-scrollbar { width: 4px; }
//         ::-webkit-scrollbar-track { background: transparent; }
//         ::-webkit-scrollbar-thumb { background: #d4d0ca; border-radius: 4px; }
//       `}</style>

//       <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'DM Sans',sans-serif", background: T.pageBg }}>

//         {/* ── SIDEBAR ── */}
//         <aside style={{
//           width: 240, minHeight: "100vh", background: T.sidebarBg,
//           borderRight: `1px solid ${T.border}`,
//           display: "flex", flexDirection: "column",
//           position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 10,
//         }}>

//           {/* Logo */}
//           <div style={{ padding: "26px 22px 22px", borderBottom: `1px solid ${T.border}` }}>
//             <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//               <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", boxShadow: "0 2px 10px #6366f133" }}>🎯</div>
//               <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1.1rem", color: T.textPrimary }}>InterviewAI</span>
//             </div>
//           </div>

//           {/* Nav */}
//           <nav style={{ flex: 1, padding: "14px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
//             {NAV.map(({ id, label, icon: Icon }) => {
//               const isActive = active === id;
//               return (
//                 <button key={id} onClick={() => setActive(id)} style={{
//                   display: "flex", alignItems: "center", gap: 12,
//                   padding: "10px 14px", borderRadius: 10, border: "none",
//                   background: isActive ? "#6366f114" : "transparent",
//                   color: isActive ? T.accent : T.textMuted,
//                   fontFamily: "'DM Sans',sans-serif", fontSize: "0.87rem",
//                   fontWeight: isActive ? 600 : 400,
//                   cursor: "pointer", textAlign: "left", width: "100%",
//                   borderLeft: isActive ? `2.5px solid ${T.accent}` : "2.5px solid transparent",
//                   transition: "all 0.15s",
//                 }}
//                   onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = "#00000008"; e.currentTarget.style.color = T.textPrimary; } }}
//                   onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.textMuted; } }}
//                 >
//                   <Icon />
//                   {label}
//                 </button>
//               );
//             })}
//           </nav>

//           {/* User card at bottom */}
//           <div style={{ padding: "14px 14px 22px", borderTop: `1px solid ${T.border}` }}>
//             <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 8px", borderRadius: 10, background: T.cardBg, border: `1px solid ${T.border}`, marginBottom: 10 }}>
//               <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
//                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
//                   <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
//                   <circle cx="12" cy="7" r="4" />
//                 </svg>
//               </div>
//               <div style={{ overflow: "hidden" }}>
//                 <div style={{ fontSize: "0.8rem", fontWeight: 600, color: T.textPrimary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
//                   {userName || "User"}
//                 </div>
//                 <div style={{ fontSize: "0.68rem", color: T.textMuted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
//                   {userEmail || "email@example.com"}
//                 </div>
//               </div>
//             </div>

//             <button onClick={handleLogout} style={{
//               width: "100%", padding: "9px",
//               background: "transparent", border: `1px solid ${T.border}`,
//               borderRadius: 8, color: T.textMuted, fontFamily: "'DM Sans',sans-serif",
//               fontSize: "0.8rem", cursor: "pointer",
//               display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
//               transition: "all 0.15s",
//             }}
//               onMouseEnter={e => { e.currentTarget.style.borderColor = "#fca5a5"; e.currentTarget.style.color = "#e11d48"; e.currentTarget.style.background = "#fff1f2"; }}
//               onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMuted; e.currentTarget.style.background = "transparent"; }}
//             >
//               <LogoutIcon /> Logout
//             </button>
//           </div>
//         </aside>

//         {/* ── MAIN CONTENT ── */}
//         <main style={{ marginLeft: 240, flex: 1, padding: "40px 40px", minHeight: "100vh", overflowY: "auto" }}>
//           {renderView()}
//         </main>
//       </div>
//     </>
//   );
// }













































// import { useNavigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import "./Dashboard.css";
// import axios from "../api/axios";

// // ── Theme tokens (off-white light mode) ───────────────────────────────────────
// const T = {
//   pageBg: "#f5f4f0",
//   sidebarBg: "#edecea",
//   cardBg: "#ffffff",
//   border: "#e2e0db",
//   accent: "#6366f1",
//   textPrimary: "#1e1b18",
//   textMuted: "#7c7874",
//   textSub: "#a09d9a",
// };

// // ── Nav items ─────────────────────────────────────────────────────────────────
// const NAV = [
//   { id: "dashboard", label: "Dashboard", icon: DashIcon },
//   { id: "preparation", label: "Interview Preparation", icon: PrepIcon },
//   { id: "interview", label: "AI Interview", icon: AIIcon },
//   { id: "profile", label: "My Profile", icon: ProfileIcon },
// ];

// // ── Icons ─────────────────────────────────────────────────────────────────────
// function DashIcon() {
//   return (
//     <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <rect x="3" y="3" width="7" height="7" rx="1.5" />
//       <rect x="14" y="3" width="7" height="7" rx="1.5" />
//       <rect x="3" y="14" width="7" height="7" rx="1.5" />
//       <rect x="14" y="14" width="7" height="7" rx="1.5" />
//     </svg>
//   );
// }
// function PrepIcon() {
//   return (
//     <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
//       <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
//     </svg>
//   );
// }
// function AIIcon() {
//   return (
//     <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <path d="M12 2a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
//       <path d="M12 7v4" />
//       <path d="M8 11H5a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2h-3" />
//       <path d="M9 20v1m6-1v1" />
//     </svg>
//   );
// }
// function ProfileIcon() {
//   return (
//     <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
//       <circle cx="12" cy="7" r="4" />
//     </svg>
//   );
// }
// function LogoutIcon() {
//   return (
//     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//       <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
//       <polyline points="16 17 21 12 16 7" />
//       <line x1="21" y1="12" x2="9" y2="12" />
//     </svg>
//   );
// }

// // ── VIEWS ─────────────────────────────────────────────────────────────────────
// function DashboardView({ interviews = [] }) {
// const safeScores = interviews
//   .map(i => Number(i.totalScore))
//   .filter(score => !isNaN(score));

// const stats = [
//   {
//     label: "Total Interviews",
//     value: interviews.length,
//     accent: "#6366f1",
//     icon: "🎯",
//     lightBg: "#eef2ff"
//   },
//   {
//     label: "Average Score",
//     value:
//       safeScores.length > 0
//         ? Math.round(
//             safeScores.reduce((acc, s) => acc + s, 0) /
//               safeScores.length
//           )
//         : 0,
//     accent: "#10b981",
//     icon: "📊",
//     lightBg: "#f0fdf4"
//   },
//   {
//     label: "Highest Score",
//     value:
//       safeScores.length > 0
//         ? Math.max(...safeScores)
//         : 0,
//     accent: "#f59e0b",
//     icon: "🏆",
//     lightBg: "#fffbeb"
//   }
// ];

//   return (
//     <div style={{ animation: "fadeUp 0.4s ease" }}>
//       <div style={{ marginBottom: 32 }}>
//         <h1 style={{
//           fontFamily: "'Syne',sans-serif",
//           fontSize: "1.85rem",
//           fontWeight: 800,
//           color: T.textPrimary,
//           letterSpacing: "-0.03em"
//         }}>
//           Dashboard
//         </h1>
//         <p style={{ color: T.textMuted, marginTop: 6, fontSize: "0.9rem" }}>
//           Overview of your interview activity
//         </p>
//       </div>

//       {/* Stat cards */}
//       <div style={{
//         display: "grid",
//         gridTemplateColumns: "repeat(auto-fit, minmax(155px, 1fr))",
//         gap: 16,
//         marginBottom: 36
//       }}>
//         {stats.map((s) => (
//           <div key={s.label} style={{
//             background: T.cardBg,
//             border: `1px solid ${T.border}`,
//             borderRadius: 16,
//             padding: "22px 20px",
//             position: "relative",
//             overflow: "hidden",
//             transition: "transform 0.2s, box-shadow 0.2s",
//             boxShadow: "0 1px 4px #00000009",
//           }}>
//             <div style={{
//               position: "absolute",
//               top: 0,
//               left: 0,
//               right: 0,
//               height: 3,
//               background: s.accent,
//               borderRadius: "16px 16px 0 0"
//             }} />

//             <div style={{
//               width: 38,
//               height: 38,
//               borderRadius: 10,
//               background: s.lightBg,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               fontSize: "1.2rem",
//               marginBottom: 12
//             }}>
//               {s.icon}
//             </div>

//             {/* ✅ FIXED NUMBER HERE */}
//             <div style={{
//               fontSize: "2rem",
//               fontFamily: "'Syne',sans-serif",
//               fontWeight: 800,
//               color: s.accent,
//               lineHeight: 1
//             }}>
//               {s.value}
//             </div>

//             <div style={{
//               color: T.textMuted,
//               fontSize: "0.8rem",
//               marginTop: 6
//             }}>
//               {s.label}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// // ── MCQ Data ──────────────────────────────────────────────────────────────────
// const MCQ_DATA = {
//   frontend: {
//     label: "Frontend", icon: "🖥️", color: "#6366f1", lightBg: "#eef2ff",
//     questions: [
//       { q: "What does the CSS `box-model` consist of?", options: ["Content, Padding, Border, Margin", "Width, Height, Color, Font", "Display, Position, Float, Clear", "None of the above"], ans: 0 },
//       { q: "Which hook is used to manage state in a React functional component?", options: ["useEffect", "useRef", "useState", "useContext"], ans: 2 },
//       { q: "What is the purpose of `useEffect` in React?", options: ["Manage state", "Handle side effects", "Create context", "Memoize values"], ans: 1 },
//       { q: "What does `semantic HTML` mean?", options: ["Using CSS classes", "Using tags that convey meaning", "Writing inline styles", "Using JavaScript events"], ans: 1 },
//       { q: "Which CSS property is used to make a flex container?", options: ["display: block", "display: flex", "display: grid", "display: inline"], ans: 1 },
//     ],
//   },
//   backend: {
//     label: "Backend", icon: "⚙️", color: "#f59e0b", lightBg: "#fffbeb",
//     questions: [
//       { q: "What does REST stand for?", options: ["Representational State Transfer", "Remote Execution Standard Tool", "Request Entity Send Type", "None"], ans: 0 },
//       { q: "Which HTTP method is used to update a resource?", options: ["GET", "POST", "PUT", "DELETE"], ans: 2 },
//       { q: "What is middleware in Express.js?", options: ["A database layer", "A function between request and response", "A template engine", "A caching mechanism"], ans: 1 },
//       { q: "What is the purpose of an ORM?", options: ["Optimize RAM", "Map objects to database tables", "Create REST APIs", "Handle authentication"], ans: 1 },
//       { q: "Which status code means 'Not Found'?", options: ["200", "301", "404", "500"], ans: 2 },
//     ],
//   },
//   hr: {
//     label: "HR", icon: "🤝", color: "#10b981", lightBg: "#f0fdf4",
//     questions: [
//       { q: "How do you handle conflicts in a team?", options: ["Avoid the conflict", "Communicate openly and find a solution", "Escalate immediately", "Ignore it"], ans: 1 },
//       { q: "Describe yourself in one sentence.", options: ["I am lazy", "I am a fast learner who thrives in teams", "I prefer working alone", "I do not know"], ans: 1 },
//       { q: "What is your greatest strength?", options: ["Procrastination", "Problem-solving and adaptability", "Avoiding feedback", "None"], ans: 1 },
//       { q: "Why do you want to work here?", options: ["Just for money", "I align with the company's mission and values", "I have no other options", "It's close to home"], ans: 1 },
//       { q: "Where do you see yourself in 5 years?", options: ["Retired", "In a leadership role contributing to growth", "Doing the same job", "Not sure"], ans: 1 },
//     ],
//   },
//   dsa: {
//     label: "DSA", icon: "🧮", color: "#ef4444", lightBg: "#fff1f2",
//     questions: [
//       { q: "What is the time complexity of binary search?", options: ["O(n)", "O(n²)", "O(log n)", "O(1)"], ans: 2 },
//       { q: "Which data structure uses LIFO?", options: ["Queue", "Stack", "Heap", "Graph"], ans: 1 },
//       { q: "What is a linked list?", options: ["A fixed-size array", "A sequential collection of nodes", "A hash table", "A binary tree"], ans: 1 },
//       { q: "What does BFS stand for?", options: ["Binary File Search", "Breadth First Search", "Best First Sort", "None"], ans: 1 },
//       { q: "What is the worst-case of quicksort?", options: ["O(n log n)", "O(n)", "O(n²)", "O(log n)"], ans: 2 },
//     ],
//   },
//   fullstack: {
//     label: "Full Stack", icon: "🚀", color: "#8b5cf6", lightBg: "#f5f3ff",
//     questions: [
//       { q: "What is the difference between SQL and NoSQL?", options: ["No difference", "SQL is relational; NoSQL is non-relational", "NoSQL is faster always", "SQL is newer"], ans: 1 },
//       { q: "What is CORS?", options: ["A CSS framework", "Cross-Origin Resource Sharing", "Client-Object Request System", "None"], ans: 1 },
//       { q: "What is the role of a `.env` file?", options: ["Style components", "Store environment variables", "Define routes", "Compile TypeScript"], ans: 1 },
//       { q: "Which of the following is a state management library?", options: ["Express", "Redux", "Mongoose", "Axios"], ans: 1 },
//       { q: "What does `npm run build` typically do?", options: ["Start the dev server", "Bundle the app for production", "Install packages", "Run tests"], ans: 1 },
//     ],
//   },
// };
// const TOPICS = Object.keys(MCQ_DATA);



// function PreparationView() {
//   const [activeTopic, setActiveTopic] = useState("frontend");
//   const [selected, setSelected] = useState({});
//   const [submitted, setSubmitted] = useState(false);

//   const topic = MCQ_DATA[activeTopic];

//   const handleSelect = (qi, oi) => { if (!submitted) setSelected(p => ({ ...p, [qi]: oi })); };
//   const handleSubmit = () => setSubmitted(true);
//   const handleReset = () => { setSelected({}); setSubmitted(false); };
//   const handleTopicChange = (t) => { setActiveTopic(t); setSelected({}); setSubmitted(false); };

//   const answered = Object.keys(selected).length;
//   const total = topic.questions.length;
//   const score = submitted ? topic.questions.filter((q, i) => selected[i] === q.ans).length : null;

//   const scoreColor = score === total ? "#16a34a" : score >= 3 ? "#d97706" : "#e11d48";
//   const scoreBg = score === total ? "#f0fdf4" : score >= 3 ? "#fffbeb" : "#fff1f2";
//   const scoreBorder = score === total ? "#bbf7d0" : score >= 3 ? "#fde68a" : "#fecdd3";
//   const optionLabel = ["A", "B", "C", "D"];



//   return (
//     <div style={{ animation: "fadeUp 0.4s ease" }}>

//       {/* Page header */}
//       <div style={{ marginBottom: 24 }}>
//         <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.85rem", fontWeight: 800, color: T.textPrimary, letterSpacing: "-0.03em" }}>
//           Interview Preparation
//         </h1>
//         <p style={{ color: T.textMuted, marginTop: 5, fontSize: "0.88rem" }}>Pick a topic and test your knowledge with 5 MCQs</p>
//       </div>

//       {/* Topic pill tabs */}
//       <div style={{ display: "flex", gap: 10, marginBottom: 28, flexWrap: "wrap" }}>
//         {TOPICS.map(key => {
//           const t = MCQ_DATA[key];
//           const isActive = activeTopic === key;
//           return (
//             <button key={key} onClick={() => handleTopicChange(key)} style={{
//               display: "flex", alignItems: "center", gap: 8,
//               padding: "10px 20px", borderRadius: 50, cursor: "pointer",
//               background: isActive ? t.color : T.cardBg,
//               color: isActive ? "#fff" : T.textMuted,
//               fontFamily: "'DM Sans',sans-serif", fontSize: "0.85rem", fontWeight: isActive ? 700 : 500,
//               boxShadow: isActive ? `0 4px 14px ${t.color}44` : `0 1px 3px #00000010`,
//               border: isActive ? "none" : `1px solid ${T.border}`,
//               transition: "all 0.2s",
//             }}
//               onMouseEnter={e => { if (!isActive) { e.currentTarget.style.borderColor = t.color; e.currentTarget.style.color = t.color; } }}
//               onMouseLeave={e => { if (!isActive) { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMuted; } }}
//             >
//               <span style={{ fontSize: "1rem" }}>{t.icon}</span>
//               {t.label}
//             </button>
//           );
//         })}
//       </div>

//       {/* Active topic banner */}
//       <div style={{
//         background: `linear-gradient(135deg, ${topic.color}18, ${topic.color}08)`,
//         border: `1px solid ${topic.color}33`,
//         borderRadius: 18, padding: "20px 26px", marginBottom: 24,
//         display: "flex", alignItems: "center", justifyContent: "space-between",
//       }}>
//         <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
//           <div style={{
//             width: 52, height: 52, borderRadius: 14,
//             background: topic.lightBg, border: `1px solid ${topic.color}33`,
//             display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.6rem",
//           }}>{topic.icon}</div>
//           <div>
//             <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1.1rem", color: T.textPrimary }}>{topic.label}</div>
//             <div style={{ fontSize: "0.78rem", color: T.textMuted, marginTop: 3 }}>
//               {submitted ? "Completed · " : `${answered}/${total} answered · `}
//               <span style={{ color: topic.color, fontWeight: 600 }}>{total} questions</span>
//             </div>
//           </div>
//         </div>
//         <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//           {!submitted && (
//             <div style={{
//               width: 52, height: 52, borderRadius: "50%",
//               background: `conic-gradient(${topic.color} ${(answered / total) * 360}deg, ${topic.color}22 0deg)`,
//               display: "flex", alignItems: "center", justifyContent: "center",
//             }}>
//               <div style={{ width: 38, height: 38, borderRadius: "50%", background: T.pageBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontWeight: 700, color: topic.color, fontFamily: "'Syne',sans-serif" }}>
//                 {answered}/{total}
//               </div>
//             </div>
//           )}
//           {submitted && (
//             <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
//               <div style={{ padding: "8px 18px", borderRadius: 50, background: scoreBg, color: scoreColor, border: `1px solid ${scoreBorder}`, fontWeight: 700, fontSize: "0.9rem", fontFamily: "'Syne',sans-serif" }}>
//                 {score}/{total} correct
//               </div>
//               <button onClick={handleReset} style={{
//                 padding: "8px 18px", borderRadius: 50, cursor: "pointer",
//                 background: T.cardBg, border: `1px solid ${T.border}`,
//                 color: T.textMuted, fontFamily: "'DM Sans',sans-serif", fontSize: "0.82rem", fontWeight: 600,
//               }}>↺ Retry</button>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Questions */}
//       <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
//         {topic.questions.map((q, qi) => {
//           const isAnswered = selected[qi] !== undefined;
//           return (
//             <div key={`${activeTopic}-${qi}`} style={{
//               background: T.cardBg,
//               border: `1px solid ${isAnswered && !submitted ? topic.color + "44" : T.border}`,
//               borderRadius: 16, overflow: "hidden",
//               boxShadow: "0 2px 8px #00000008",
//               transition: "border-color 0.2s",
//             }}>
//               {/* Question strip */}
//               <div style={{ padding: "18px 22px 14px", borderBottom: `1px solid ${T.border}`, display: "flex", alignItems: "flex-start", gap: 14 }}>
//                 <div style={{
//                   minWidth: 32, height: 32, borderRadius: 10,
//                   background: submitted ? (selected[qi] === q.ans ? "#f0fdf4" : "#fff1f2") : (isAnswered ? topic.lightBg : "#f5f4f0"),
//                   border: `1.5px solid ${submitted ? (selected[qi] === q.ans ? "#86efac" : "#fca5a5") : (isAnswered ? topic.color + "55" : T.border)}`,
//                   display: "flex", alignItems: "center", justifyContent: "center",
//                   fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "0.78rem",
//                   color: submitted ? (selected[qi] === q.ans ? "#16a34a" : "#e11d48") : (isAnswered ? topic.color : T.textSub),
//                   flexShrink: 0,
//                 }}>
//                   {submitted ? (selected[qi] === q.ans ? "✓" : "✗") : qi + 1}
//                 </div>
//                 <p style={{ fontWeight: 600, fontSize: "0.92rem", color: T.textPrimary, lineHeight: 1.55, paddingTop: 4 }}>{q.q}</p>
//               </div>

//               {/* Options 2x2 grid */}
//               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
//                 {q.options.map((opt, oi) => {
//                   const isSel = selected[qi] === oi;
//                   const isCorrect = q.ans === oi;
//                   let bg = "transparent", borderC = "transparent", textC = T.textPrimary, labelBg = "#f5f4f0", labelC = T.textSub;
//                   if (submitted) {
//                     if (isCorrect) { bg = "#f0fdf4"; textC = "#15803d"; labelBg = "#dcfce7"; labelC = "#16a34a"; borderC = "#86efac"; }
//                     else if (isSel && !isCorrect) { bg = "#fff1f2"; textC = "#be123c"; labelBg = "#fecdd3"; labelC = "#e11d48"; borderC = "#fca5a5"; }
//                   } else if (isSel) {
//                     bg = topic.lightBg; textC = topic.color; labelBg = topic.color + "22"; labelC = topic.color; borderC = topic.color + "55";
//                   }
//                   return (
//                     <button key={oi} onClick={() => handleSelect(qi, oi)} style={{
//                       display: "flex", alignItems: "center", gap: 12, padding: "13px 18px",
//                       background: bg, border: "none",
//                       borderTop: `1px solid ${T.border}`,
//                       borderLeft: oi % 2 === 1 ? `1px solid ${T.border}` : "none",
//                       cursor: submitted ? "default" : "pointer",
//                       textAlign: "left", transition: "background 0.15s",
//                       outline: isSel && !submitted ? `2px solid ${topic.color}44` : "none",
//                       outlineOffset: -2,
//                     }}
//                       onMouseEnter={e => { if (!submitted && !isSel) e.currentTarget.style.background = "#00000005"; }}
//                       onMouseLeave={e => { if (!submitted && !isSel) e.currentTarget.style.background = "transparent"; }}
//                     >
//                       <span style={{
//                         minWidth: 26, height: 26, borderRadius: 8,
//                         background: labelBg, color: labelC,
//                         display: "flex", alignItems: "center", justifyContent: "center",
//                         fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "0.72rem",
//                         flexShrink: 0, border: `1.5px solid ${borderC || "#e2e0db"}`,
//                       }}>{optionLabel[oi]}</span>
//                       <span style={{ fontSize: "0.84rem", color: textC, fontWeight: isSel || (submitted && isCorrect) ? 600 : 400, lineHeight: 1.4 }}>{opt}</span>
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Submit / Score bar */}
//       <div style={{ marginTop: 28, display: "flex", alignItems: "center", gap: 14 }}>
//         {!submitted ? (
//           <>
//             <button onClick={handleSubmit} disabled={answered < total} style={{
//               padding: "13px 36px", borderRadius: 12,
//               background: answered < total ? "#e2e0db" : `linear-gradient(135deg, ${topic.color}, ${topic.color}cc)`,
//               color: answered < total ? T.textSub : "#fff",
//               border: "none", cursor: answered < total ? "not-allowed" : "pointer",
//               fontFamily: "'DM Sans',sans-serif", fontSize: "0.92rem", fontWeight: 700,
//               boxShadow: answered < total ? "none" : `0 4px 16px ${topic.color}44`,
//               transition: "all 0.2s",
//             }}>Submit Answers</button>
//             <span style={{ fontSize: "0.82rem", color: T.textSub }}>
//               {answered < total ? `${total - answered} question${total - answered > 1 ? "s" : ""} remaining` : "All answered — ready to submit!"}
//             </span>
//           </>
//         ) : (
//           <div style={{
//             display: "flex", alignItems: "center", gap: 16, padding: "14px 24px",
//             background: scoreBg, border: `1px solid ${scoreBorder}`,
//             borderRadius: 14, width: "100%",
//           }}>
//             <div style={{ fontSize: "2rem" }}>{score === total ? "🎉" : score >= 3 ? "👍" : "📚"}</div>
//             <div>
//               <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1rem", color: scoreColor }}>
//                 You scored {score} out of {total}
//               </div>
//               <div style={{ fontSize: "0.8rem", color: T.textMuted, marginTop: 2 }}>
//                 {score === total ? "Perfect score! Outstanding work." : score >= 3 ? "Good job! Review the incorrect ones." : "Keep practising — you'll get there!"}
//               </div>
//             </div>
//             <button onClick={handleReset} style={{
//               marginLeft: "auto", padding: "9px 20px", borderRadius: 10,
//               background: T.cardBg, border: `1px solid ${T.border}`,
//               color: T.textMuted, cursor: "pointer",
//               fontFamily: "'DM Sans',sans-serif", fontSize: "0.83rem", fontWeight: 600,
//             }}>↺ Try Again</button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
// function AiInterView({
//   role,
//   setRole,
//   difficulty,
//   setDifficulty,
//   questionCount,
//   setQuestionCount,
//   handleStart,
// }) {
//   const roles = [
//     { value: "Frontend", label: "Frontend Developer", icon: "🖥️", color: "#6366f1", lightBg: "#eef2ff" },
//     { value: "Backend", label: "Backend Developer", icon: "⚙️", color: "#f59e0b", lightBg: "#fffbeb" },
//     { value: "Fullstack", label: "Full Stack", icon: "🚀", color: "#8b5cf6", lightBg: "#f5f3ff" },
//     { value: "HR", label: "HR", icon: "🤝", color: "#10b981", lightBg: "#f0fdf4" },
//     { value: "DSA", label: "DSA", icon: "🧮", color: "#ef4444", lightBg: "#fff1f2" },
//   ];

//   const difficulties = [
//     { value: "Easy", label: "Easy", icon: "🟢", desc: "Beginner-friendly questions", color: "#16a34a", lightBg: "#f0fdf4", border: "#bbf7d0" },
//     { value: "Medium", label: "Medium", icon: "🟡", desc: "Moderate challenge level", color: "#d97706", lightBg: "#fffbeb", border: "#fde68a" },
//     { value: "Hard", label: "Hard", icon: "🔴", desc: "Advanced & tricky questions", color: "#e11d48", lightBg: "#fff1f2", border: "#fecdd3" },
//   ];

//   const selectedRole = roles.find(r => r.value === role);
//   const canStart = role && difficulty;

//   return (
//     <div style={{ animation: "fadeUp 0.4s ease" }}>

//       {/* Header */}
//       <div style={{ marginBottom: 28 }}>
//         <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.85rem", fontWeight: 800, color: T.textPrimary, letterSpacing: "-0.03em" }}>
//           AI Interview
//         </h1>
//         <p style={{ color: T.textMuted, marginTop: 5, fontSize: "0.88rem" }}>
//           Choose your role and difficulty to begin your AI-powered mock interview
//         </p>
//       </div>

//       {/* Banner */}
//       <div style={{
//         background: selectedRole
//           ? `linear-gradient(135deg, ${selectedRole.color}18, ${selectedRole.color}08)`
//           : "linear-gradient(135deg, #6366f110, #8b5cf608)",
//         border: `1px solid ${selectedRole ? selectedRole.color + "33" : "#6366f122"}`,
//         borderRadius: 18, padding: "20px 26px", marginBottom: 28,
//         display: "flex", alignItems: "center", gap: 16,
//       }}>
//         <div style={{
//           width: 52, height: 52, borderRadius: 14, fontSize: "1.6rem",
//           background: selectedRole ? selectedRole.lightBg : "#eef2ff",
//           border: `1px solid ${selectedRole ? selectedRole.color + "33" : "#6366f122"}`,
//           display: "flex", alignItems: "center", justifyContent: "center",
//         }}>
//           {selectedRole ? selectedRole.icon : "🎯"}
//         </div>
//         <div>
//           <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1.05rem", color: T.textPrimary }}>
//             {selectedRole ? selectedRole.label : "Select a role to begin"}
//           </div>
//           <div style={{ fontSize: "0.78rem", color: T.textMuted, marginTop: 3 }}>
//             {canStart
//               ? `Ready to start · ${difficulty} difficulty`
//               : role
//                 ? "Now pick a difficulty level"
//                 : "Choose your interview track below"}
//           </div>
//         </div>
//         {canStart && (
//           <div style={{
//             marginLeft: "auto", padding: "6px 16px", borderRadius: 50,
//             background: selectedRole.lightBg,
//             color: selectedRole.color,
//             border: `1px solid ${selectedRole.color}44`,
//             fontSize: "0.78rem", fontWeight: 700,
//           }}>
//             ✓ Ready
//           </div>
//         )}
//       </div>

//       {/* Role Selection */}
//       <div style={{ marginBottom: 28 }}>
//         <div style={{ fontSize: "0.7rem", fontWeight: 700, color: T.accent, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>
//           Select Role
//         </div>
//         <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
//           {roles.map(r => {
//             const isActive = role === r.value;
//             return (
//               <button key={r.value} onClick={() => setRole(r.value)} style={{
//                 display: "flex", alignItems: "center", gap: 8,
//                 padding: "10px 20px", borderRadius: 50, cursor: "pointer",
//                 background: isActive ? r.color : T.cardBg,
//                 color: isActive ? "#fff" : T.textMuted,
//                 fontFamily: "'DM Sans',sans-serif", fontSize: "0.85rem", fontWeight: isActive ? 700 : 500,
//                 boxShadow: isActive ? `0 4px 14px ${r.color}44` : "0 1px 3px #00000010",
//                 border: isActive ? "none" : `1px solid ${T.border}`,
//                 transition: "all 0.2s",
//               }}
//                 onMouseEnter={e => { if (!isActive) { e.currentTarget.style.borderColor = r.color; e.currentTarget.style.color = r.color; } }}
//                 onMouseLeave={e => { if (!isActive) { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMuted; } }}
//               >
//                 <span style={{ fontSize: "1rem" }}>{r.icon}</span>
//                 {r.label}
//               </button>
//             );
//           })}
//         </div>
//       </div>

//       {/* Difficulty Selection */}
//       <div style={{ marginBottom: 32 }}>
//         <div style={{ fontSize: "0.7rem", fontWeight: 700, color: T.accent, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>
//           Select Difficulty
//         </div>
//         <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
//           {difficulties.map(d => {
//             const isActive = difficulty === d.value;
//             return (
//               <button key={d.value} onClick={() => setDifficulty(d.value)} style={{
//                 display: "flex", alignItems: "center", gap: 14,
//                 padding: "16px 18px", borderRadius: 14, cursor: "pointer",
//                 background: isActive ? d.lightBg : T.cardBg,
//                 border: isActive ? `1.5px solid ${d.border}` : `1px solid ${T.border}`,
//                 boxShadow: isActive ? `0 4px 14px ${d.color}18` : "0 1px 4px #00000009",
//                 transition: "all 0.2s", textAlign: "left",
//               }}
//                 onMouseEnter={e => { if (!isActive) { e.currentTarget.style.borderColor = d.border; e.currentTarget.style.background = d.lightBg + "88"; } }}
//                 onMouseLeave={e => { if (!isActive) { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.background = T.cardBg; } }}
//               >
//                 <div style={{
//                   width: 40, height: 40, borderRadius: 10, flexShrink: 0,
//                   background: isActive ? d.lightBg : "#f5f4f0",
//                   border: `1.5px solid ${isActive ? d.border : T.border}`,
//                   display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem",
//                 }}>{d.icon}</div>
//                 <div>
//                   <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "0.92rem", color: isActive ? d.color : T.textPrimary }}>
//                     {d.label}
//                   </div>
//                   <div style={{ fontSize: "0.73rem", color: T.textMuted, marginTop: 2 }}>{d.desc}</div>
//                 </div>
//                 {isActive && (
//                   <div style={{
//                     marginLeft: "auto", width: 20, height: 20, borderRadius: "50%",
//                     background: d.color, display: "flex", alignItems: "center",
//                     justifyContent: "center", fontSize: "0.65rem", color: "#fff", fontWeight: 800,
//                   }}>✓</div>
//                 )}
//               </button>
//             );
//           })}
//         </div>
//       </div>
//       {/* Question Count Selection */}

//       <div style={{ marginBottom: 30 }}>

//         <div style={{
//           fontSize: "0.7rem",
//           fontWeight: 700,
//           color: T.accent,
//           textTransform: "uppercase",
//           letterSpacing: "0.1em",
//           marginBottom: 10
//         }}>
//           Number of Questions
//         </div>

//         <div style={{ display: "flex", gap: 12 }}>

//           <button
//             onClick={() => setQuestionCount(5)}
//             style={{
//               padding: "10px 22px",
//               borderRadius: 10,
//               border: questionCount === 5 ? "none" : `1px solid ${T.border}`,
//               background: questionCount === 5 ? T.accent : T.cardBg,
//               color: questionCount === 5 ? "#fff" : T.textMuted,
//               fontWeight: 600,
//               cursor: "pointer"
//             }}
//           >
//             5 Questions
//           </button>

//           <button
//             onClick={() => setQuestionCount(10)}
//             style={{
//               padding: "10px 22px",
//               borderRadius: 10,
//               border: questionCount === 10 ? "none" : `1px solid ${T.border}`,
//               background: questionCount === 10 ? T.accent : T.cardBg,
//               color: questionCount === 10 ? "#fff" : T.textMuted,
//               fontWeight: 600,
//               cursor: "pointer"
//             }}
//           >
//             10 Questions
//           </button>

//         </div>

//       </div>
//       {/* Start Button */}
//       <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
//         <button
//           onClick={canStart ? handleStart : undefined}
//           disabled={!canStart}
//           style={{
//             padding: "14px 40px", borderRadius: 12, border: "none",
//             background: canStart
//               ? `linear-gradient(135deg, ${selectedRole.color}, ${selectedRole.color}cc)`
//               : "#e2e0db",
//             color: canStart ? "#fff" : T.textSub,
//             fontFamily: "'DM Sans',sans-serif", fontSize: "0.95rem", fontWeight: 700,
//             cursor: canStart ? "pointer" : "not-allowed",
//             boxShadow: canStart ? `0 4px 16px ${selectedRole.color}44` : "none",
//             transition: "all 0.2s",
//           }}
//         >
//           🎙️ Start Interview
//         </button>
//         {!canStart && (
//           <span style={{ fontSize: "0.82rem", color: T.textSub }}>
//             {!role ? "Select a role first" : "Select a difficulty to continue"}
//           </span>
//         )}
//       </div>

//     </div>
//   );
// }

// function ProfileView({ userName, userEmail, handleLogout }) {
//   return (
//     <div style={{ animation: "fadeUp 0.4s ease" }}>
//       <div style={{ marginBottom: 32 }}>
//         <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.85rem", fontWeight: 800, color: T.textPrimary, letterSpacing: "-0.03em" }}>My Profile</h1>
//         <p style={{ color: T.textMuted, marginTop: 6, fontSize: "0.9rem" }}>Manage your account details</p>
//       </div>

//       <div style={{ background: T.cardBg, border: `1px solid ${T.border}`, borderRadius: 16, padding: 32, maxWidth: 520, boxShadow: "0 1px 4px #00000009" }}>
//         {/* Avatar */}
//         <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 32 }}>
//           <div style={{
//             width: 72, height: 72, borderRadius: "50%",
//             background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
//             display: "flex", alignItems: "center", justifyContent: "center",
//             boxShadow: "0 4px 16px #6366f133",
//           }}>
//             <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//               <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
//               <circle cx="12" cy="7" r="4" />
//             </svg>
//           </div>
//           <div>
//             <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "1.15rem", color: T.textPrimary }}>{userName || "—"}</div>
//             <div style={{ color: T.textMuted, fontSize: "0.85rem", marginTop: 3 }}>Interview Candidate</div>
//           </div>
//         </div>

//         {/* Info fields */}
//         <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
//           {[
//             { label: "Full Name", value: userName || "Not set" },
//             { label: "Email Address", value: userEmail || "Not set" },
//           ].map(({ label, value }) => (
//             <div key={label}>
//               <div style={{ fontSize: "0.7rem", fontWeight: 700, color: T.accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{label}</div>
//               <div style={{ background: T.pageBg, border: `1px solid ${T.border}`, borderRadius: 10, padding: "12px 16px", fontSize: "0.9rem", color: value === "Not set" ? T.textSub : T.textPrimary }}>{value}</div>
//             </div>
//           ))}
//         </div>

//         {/* Logout */}
//         <button onClick={handleLogout} style={{
//           width: "100%", padding: "13px", borderRadius: 12,
//           background: "transparent", border: "1px solid #fca5a566",
//           color: "#e11d48", fontFamily: "'DM Sans',sans-serif",
//           fontSize: "0.9rem", fontWeight: 600, cursor: "pointer",
//           display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
//           transition: "all 0.2s",
//         }}
//           onMouseEnter={e => { e.currentTarget.style.background = "#fff1f2"; e.currentTarget.style.borderColor = "#fca5a5"; }}
//           onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "#fca5a566"; }}
//         >
//           <LogoutIcon /> Log Out
//         </button>

//       </div>
//     </div>
//   );
// }

// // ── MAIN APP ──────────────────────────────────────────────────────────────────

// export default function App() {
//   const [active, setActive] = useState("dashboard");
//   const navigate = useNavigate();


//   // ─────────────────────────────────────────────
//   // MAIN APP
//   // ─────────────────────────────────────────────

//   const [role, setRole] = useState("");
//   const [difficulty, setDifficulty] = useState("");
//   const [questionCount, setQuestionCount] = useState(5);
//   const [interviews, setInterviews] = useState([]);

//   // ✅ FIXED: no infinite loop
//   useEffect(() => {
//     const fetchInterviews = async () => {
//       try {
//         const { data } = await axios.get("/api/interview/my");
//         setInterviews(data);
//       } catch {
//         console.log("Error fetching interviews");
//       }
//     };

//     fetchInterviews();
//   }, []);

//   // ── Handlers ──
//   const handleStart = () => {
//     if (!role || !difficulty) {
//       alert("Please select role and difficulty");
//       return;
//     }

//     navigate("/interview", {
//       state: {
//         role,
//         difficulty,
//         questionCount
//       }
//     });
//   };

//   const renderView = () => {
//     if (active === "dashboard") return <DashboardView interviews={interviews} />;

//     if (active === "preparation") return <PreparationView />;

//     if (active === "interview")
//       return (
//         <AiInterView
//           role={role}
//           setRole={setRole}
//           difficulty={difficulty}
//           setDifficulty={setDifficulty}
//           questionCount={questionCount}
//           setQuestionCount={setQuestionCount}
//           handleStart={handleStart}
//         />
//       );

//     if (active === "profile")
//       return (
//         <ProfileView
//           userName={userName}
//           userEmail={userEmail}
//           handleLogout={handleLogout}
//         />
//       );
//   };

//   // logout handler
//   const handleLogout = () => {
//     if (window.confirm("Are you sure you want to logout?")) {
//       localStorage.clear();
//       navigate("/");
//     }
//   };



//   const user = JSON.parse(localStorage.getItem("user"));

//   const userName = user?.name || "";
//   const userEmail = user?.email || "";

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
//         * { box-sizing: border-box; margin: 0; padding: 0; }
//         body { background: #f5f4f0; }
//         @keyframes fadeUp {
//           from { opacity: 0; transform: translateY(14px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }
//         ::-webkit-scrollbar { width: 4px; }
//         ::-webkit-scrollbar-track { background: transparent; }
//         ::-webkit-scrollbar-thumb { background: #d4d0ca; border-radius: 4px; }
//       `}</style>

//       <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'DM Sans',sans-serif", background: T.pageBg }}>

//         {/* ── SIDEBAR ── */}
//         <aside style={{
//           width: 240, minHeight: "100vh", background: T.sidebarBg,
//           borderRight: `1px solid ${T.border}`,
//           display: "flex", flexDirection: "column",
//           position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 10,
//         }}>

//           {/* Logo */}
//           <div style={{ padding: "26px 22px 22px", borderBottom: `1px solid ${T.border}` }}>
//             <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//               <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", boxShadow: "0 2px 10px #6366f133" }}>🎯</div>
//               <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1.1rem", color: T.textPrimary }}>InterviewAI</span>
//             </div>
//           </div>

//           {/* Nav */}
//           <nav style={{ flex: 1, padding: "14px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
//             {NAV.map(({ id, label, icon: Icon }) => {
//               const isActive = active === id;
//               return (
//                 <button key={id} onClick={() => setActive(id)} style={{
//                   display: "flex", alignItems: "center", gap: 12,
//                   padding: "10px 14px", borderRadius: 10, border: "none",
//                   background: isActive ? "#6366f114" : "transparent",
//                   color: isActive ? T.accent : T.textMuted,
//                   fontFamily: "'DM Sans',sans-serif", fontSize: "0.87rem",
//                   fontWeight: isActive ? 600 : 400,
//                   cursor: "pointer", textAlign: "left", width: "100%",
//                   borderLeft: isActive ? `2.5px solid ${T.accent}` : "2.5px solid transparent",
//                   transition: "all 0.15s",
//                 }}
//                   onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = "#00000008"; e.currentTarget.style.color = T.textPrimary; } }}
//                   onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = T.textMuted; } }}
//                 >
//                   <Icon />
//                   {label}
//                 </button>
//               );
//             })}
//           </nav>

//           {/* User card at bottom */}
//           <div style={{ padding: "14px 14px 22px", borderTop: `1px solid ${T.border}` }}>
//             <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 8px", borderRadius: 10, background: T.cardBg, border: `1px solid ${T.border}`, marginBottom: 10 }}>
//               <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
//                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
//                   <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
//                   <circle cx="12" cy="7" r="4" />
//                 </svg>
//               </div>
//               <div style={{ overflow: "hidden" }}>
//                 <div style={{ fontSize: "0.8rem", fontWeight: 600, color: T.textPrimary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
//                   {userName || "User"}
//                 </div>
//                 <div style={{ fontSize: "0.68rem", color: T.textMuted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
//                   {userEmail || "email@example.com"}
//                 </div>
//               </div>
//             </div>

//             <button onClick={handleLogout} style={{
//               width: "100%", padding: "9px",
//               background: "transparent", border: `1px solid ${T.border}`,
//               borderRadius: 8, color: T.textMuted, fontFamily: "'DM Sans',sans-serif",
//               fontSize: "0.8rem", cursor: "pointer",
//               display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
//               transition: "all 0.15s",
//             }}
//               onMouseEnter={e => { e.currentTarget.style.borderColor = "#fca5a5"; e.currentTarget.style.color = "#e11d48"; e.currentTarget.style.background = "#fff1f2"; }}
//               onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMuted; e.currentTarget.style.background = "transparent"; }}
//             >
//               <LogoutIcon /> Logout
//             </button>
//           </div>
//         </aside>

//         {/* ── MAIN CONTENT ── */}
//         <main style={{ marginLeft: 240, flex: 1, padding: "40px 40px", minHeight: "100vh", overflowY: "auto" }}>
//           {renderView()}
//         </main>
//       </div>
//     </>
//   );
// }



