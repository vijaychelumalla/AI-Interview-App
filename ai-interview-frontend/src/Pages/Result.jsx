import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Result.css";

// ── Helper ────────────────────────────────────────────────────────────────────
const getScoreClass = (score, total) => {
  const pct = (score / total) * 100;
  if (pct >= 70) return "high";
  if (pct >= 40) return "mid";
  return "low";
};

// ══════════════════════════════════════════════════════════════════════════════
// RESULT PAGE
// ══════════════════════════════════════════════════════════════════════════════
const ResultPage = ({ selectedResult }) => {
  const location = useLocation();
  const navigate  = useNavigate();
  const result    = selectedResult || location.state;

  // Save to localStorage on first real visit (not when viewing from history)
  useEffect(() => {
    if (!result || selectedResult) return;

    try {
      const stored  = localStorage.getItem("interviewHistory");
      let history   = stored ? JSON.parse(stored) : [];
      if (!Array.isArray(history)) history = [];

      const exists = history.some(item => item._id === result._id);

      if (!exists) {
        const updatedHistory = [
          { ...result, date: new Date().toLocaleString() },
          ...history,
        ];
        localStorage.setItem("interviewHistory", JSON.stringify(updatedHistory));
      }
    } catch (err) {
      console.error("History save error:", err);
      localStorage.removeItem("interviewHistory");
    }
  }, [result, selectedResult]);

  if (!result) {
    return (
      <div className="no-result">
        <h2>No Result Found</h2>
        <button className="btn-primary" onClick={() => navigate("/dashboard")}>
          ← Go to Dashboard
        </button>
      </div>
    );
  }

  const totalMarks = result.questions.length * 5;
  const scoreClass = getScoreClass(result.totalScore, totalMarks);

  return (
    <div className="page">
      {/* Title */}
      <h1>Interview Result 🎉</h1>

      {/* Meta pills */}
      <div className="page-meta">
        <span className="meta-pill"><b>Role:</b> {result.role}</span>
        <span className="meta-pill"><b>Difficulty:</b> {result.difficulty}</span>
      </div>

      {/* Section heading */}
      <div className="section-heading">Question Results</div>

      {/* Questions */}
      {result.questions.map((q, i) => {
        const marks      = result.marks?.[i] ?? 0;
        const isZero     = marks === 0;
        const feedback   = result.feedback?.[i];
        const userAnswer = result.answers?.[i] || "No answer provided";

        return (
          <div key={i} className="question-card">
            <p><b>Q{i + 1}:</b> {q}</p>
            <p><b>Your Answer:</b> {userAnswer}</p>

            {feedback && (
              <div className="insight-block">
                <p><b>AI Insights:</b> {feedback}</p>
              </div>
            )}

            <span className={`marks-pill${isZero ? " zero" : ""}`}>
              Marks: {marks} / 5
            </span>
          </div>
        );
      })}

      {/* Total score */}
      <div className="score-banner">
        🏆 Total Score:&nbsp;
        <span className={`score-badge ${scoreClass}`}>
          {result.totalScore} / {totalMarks}
        </span>
      </div>

      <button className="btn-primary" onClick={() => navigate("/dashboard")}>
        ← Back to Dashboard
      </button>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// HISTORY PAGE
// ══════════════════════════════════════════════════════════════════════════════
const HistoryPage = ({ setPage, setSelectedResult }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("interviewHistory")) || [];
      setHistory(Array.isArray(stored) ? stored : []);
    } catch {
      setHistory([]);
    }
  }, []);

  const clearHistory = () => {
    if (window.confirm("Clear all interview history?")) {
      localStorage.removeItem("interviewHistory");
      setHistory([]);
    }
  };

  const handleView = (item) => {
    setSelectedResult(item);
    setPage("result");
  };

  return (
    <div className="page">
      <h1>Interview History</h1>
      <p className="page-subtitle">All your past AI mock interview sessions</p>

      {history.length === 0 ? (
        <div className="empty-state">
          <p>No interview history yet.<br />Complete an interview to see it here.</p>
        </div>
      ) : (
        <>
          <button className="btn-danger" onClick={clearHistory}>
            🗑 Clear All History
          </button>

          <div className="section-heading">Past Sessions</div>

          {history.map((item, index) => {
            const total      = (item.questions?.length ?? 0) * 5 || 50;
            const scoreClass = getScoreClass(item.totalScore, total);

            return (
              <div key={index} className="history-card">
                <div className="history-card-info">
                  <p><b>Date:</b> {item.date}</p>
                  <p><b>Role:</b> {item.role}</p>
                  <p><b>Difficulty:</b> {item.difficulty}</p>
                  <p>
                    <b>Score: </b>
                    <span className={`score-badge ${scoreClass}`}>
                      {item.totalScore} / {total}
                    </span>
                  </p>
                </div>
                <button
                  className="btn-outline"
                  onClick={() => handleView(item)}
                >
                  View Details →
                </button>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// LAYOUT  (main export)
// ══════════════════════════════════════════════════════════════════════════════
export default function ResultLayout() {
  const [page,           setPage]           = useState("result");
  const [selectedResult, setSelectedResult] = useState(null);
  const [sidebarOpen,    setSidebarOpen]    = useState(false);

  const navigate = useNavigate();

  // Auto-close drawer when viewport goes back to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 900) setSidebarOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      navigate("/");
    }
  };

  // Navigate and close drawer on mobile tap
  const handleNav = (id) => {
    setPage(id);
    setSidebarOpen(false);
  };

  return (
    <div className="app">

      {/* ── Overlay — tap outside to close drawer ── */}
      <div
        className={`sidebar-overlay${sidebarOpen ? " open" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* ── Sidebar ── */}
      <aside className={`sidebar${sidebarOpen ? " open" : ""}`}>
        <div className="logo">🎯 <span>InterviewAI</span></div>

        <nav className="nav">
          <button
            className={`nav-btn ${page === "result" ? "active" : ""}`}
            onClick={() => handleNav("result")}
          >
            Interview Result
          </button>
          <button
            className={`nav-btn ${page === "history" ? "active" : ""}`}
            onClick={() => handleNav("history")}
          >
            Interview History
          </button>
        </nav>

        <button className="logout" onClick={handleLogout}>Logout</button>
      </aside>

      {/* ── Main (flex column: sticky topbar + scroll area) ── */}
      <main className="main">

        {/* Topbar — visible only on ≤ 900px via CSS */}
        <div className="topbar">
          <div className="topbar-logo">🎯 InterviewAI</div>
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

        {/* Scrollable content */}
        <div className="main-scroll">
          {page === "result" && (
            <ResultPage selectedResult={selectedResult} />
          )}
          {page === "history" && (
            <HistoryPage
              setPage={setPage}
              setSelectedResult={setSelectedResult}
            />
          )}
        </div>

      </main>
    </div>
  );
}
// import { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import "./Result.css";

// const getScoreClass = (score, total) => {
//   const pct = (score / total) * 100;
//   if (pct >= 70) return "high";
//   if (pct >= 40) return "mid";
//   return "low";
// };

// /* ── SIDEBAR ── */
// const Sidebar = ({ page, setPage, onLogout }) => (
//   <aside className="sidebar">
//     <div className="logo">🎯 <span>InterviewAI</span></div>
//     <nav className="nav">
//       <button
//         className={`nav-btn ${page === "result" ? "active" : ""}`}
//         onClick={() => setPage("result")}
//       >
//         Interview Result
//       </button>
//       <button
//         className={`nav-btn ${page === "history" ? "active" : ""}`}
//         onClick={() => setPage("history")}
//       >
//         Interview History
//       </button>
//     </nav>
//     <button className="logout" onClick={onLogout}>Logout</button>
//   </aside>
// );

// /* ── RESULT PAGE ── */
// const ResultPage = ({ selectedResult }) => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const result = selectedResult || location.state;

//  useEffect(() => {
//   if (!result || selectedResult) return;

//   try {
//     const stored = localStorage.getItem("interviewHistory");
//     let history = stored ? JSON.parse(stored) : [];

//     if (!Array.isArray(history)) history = [];

//     const exists = history.some(item => item._id === result._id);

//     if (!exists) {
//       const newEntry = {
//         ...result,
//         date: new Date().toLocaleString()
//       };

//       const updatedHistory = [newEntry, ...history];

//       localStorage.setItem(
//         "interviewHistory",
//         JSON.stringify(updatedHistory)
//       );
//     }

//   } catch (err) {
//     console.error("History error:", err);
//     localStorage.removeItem("interviewHistory");
//   }

// }, [result, selectedResult]);

//   if (!result) {
//     return (
//       <div className="no-result">
//         <h2>No Result Found</h2>
//         <button onClick={() => navigate("/dashboard")}>← Go Back</button>
//       </div>
//     );
//   }

//   const totalMarks = result.questions.length * 5;
//   const scoreClass = getScoreClass(result.totalScore, totalMarks);

//   return (
//     <div className="page">
//       <h1>Interview Result 🎉</h1>

//       <p><b>Role:</b> {result.role}</p>
//       <p><b>Difficulty:</b> {result.difficulty}</p>

//       <h3>Question Results</h3>

//       {result.questions.map((q, i) => (
//         <div key={i} className="question-card" style={{ marginBottom: "20px", padding: "15px", border: "1px solid #ccc", borderRadius: "8px" }}>
//           <p><b>Q{i + 1}:</b> {q}</p>
//           <p><b>Your Answer:</b> {result.answers[i] || "No answer provided"}</p>
          
//           {result.feedback && result.feedback[i] && (
//             <div style={{ backgroundColor: "#f9f9fa", padding: "10px", borderRadius: "6px", margin: "10px 0", borderLeft: "4px solid #4a90e2" }}>
//               <p style={{ margin: 0, fontSize: "14px", color: "#333" }}><b>AI Insights:</b> {result.feedback[i]}</p>
//             </div>
//           )}

//           <p style={{ marginTop: "10px" }}>
//             <span className="marks-pill" style={{ fontWeight: "bold", color: "#2c3e50" }}>Marks: {result.marks[i]} / 5</span>
//           </p>
//         </div>
//       ))}

//       <h2>
//         Total Score:{" "}
//         <span className={`score-badge ${scoreClass}`}>
//           {result.totalScore} / {totalMarks}
//         </span>
//       </h2>

//       <button onClick={() => navigate("/dashboard")}>← Back to Dashboard</button>
//     </div>
//   );
// };

// /* ── HISTORY PAGE ── */
// const HistoryPage = ({ setPage, setSelectedResult }) => {
//   const [history, setHistory] = useState([]);

//   useEffect(() => {
//     const stored = JSON.parse(localStorage.getItem("interviewHistory")) || [];
//     setHistory(stored);
//   }, []);

//   const clearHistory = () => {
//     if (window.confirm("Clear all interview history?")) {
//       localStorage.removeItem("interviewHistory");
//       setHistory([]);
//     }
//   };

//   return (
//     <div className="page">
//       <h1>Interview History</h1>
//       <p>All your past AI mock interview sessions</p>

//       {history.length === 0 ? (
//         <div className="empty-state">
//           <p>No interview history yet. Complete an interview to see it here.</p>
//         </div>
//       ) : (
//         <>
//           <button className="btn-danger" onClick={clearHistory}>
//             🗑 Clear All History
//           </button>

//           {history.map((item, index) => {
//             const total = item.questions.length * 5;
//             const scoreClass = getScoreClass(item.totalScore, total);
//             return (
//               <div key={index} className="history-card">
//                 <div className="history-card-info">
//                   <p><b>Date:</b> {item.date}</p>
//                   <p><b>Role:</b> {item.role}</p>
//                   <p><b>Difficulty:</b> {item.difficulty}</p>
//                   <p>
//                     <b>Score: </b>
//                     <span className={`score-badge ${scoreClass}`}>
//                       {item.totalScore} / {total}
//                     </span>
//                   </p>
//                 </div>
//                 <button
//                   className="btn-outline"
//                   onClick={() => {
//                     setSelectedResult(item);
//                     setPage("result");
//                   }}
//                 >
//                   View Details →
//                 </button>
//               </div>
//             );
//           })}
//         </>
//       )}
//     </div>
//   );
// };

// /* ── LAYOUT ── */
// export default function ResultLayout() {
//   const [page, setPage] = useState("result");
//   const [selectedResult, setSelectedResult] = useState(null);
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     if (window.confirm("Are you sure you want to logout?")) {
//       localStorage.clear();
//       navigate("/");
//     }
//   };

//   return (
//     <div className="app">
//       <Sidebar page={page} setPage={setPage} onLogout={handleLogout} />
//       <main className="main">
//         {page === "result" && <ResultPage selectedResult={selectedResult} />}
//         {page === "history" && (
//           <HistoryPage setPage={setPage} setSelectedResult={setSelectedResult} />
//         )}
//       </main>
//     </div>
//   );
// }






























// import { useState, useEffect } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import "./Result.css";

// const getScoreClass = (score, total) => {
//   const pct = (score / total) * 100;
//   if (pct >= 70) return "high";
//   if (pct >= 40) return "mid";
//   return "low";
// };

// /* ── SIDEBAR ── */
// const Sidebar = ({ page, setPage, onLogout }) => (
//   <aside className="sidebar">
//     <div className="logo">🎯 <span>InterviewAI</span></div>
//     <nav className="nav">
//       <button
//         className={`nav-btn ${page === "result" ? "active" : ""}`}
//         onClick={() => setPage("result")}
//       >
//         Interview Result
//       </button>
//       <button
//         className={`nav-btn ${page === "history" ? "active" : ""}`}
//         onClick={() => setPage("history")}
//       >
//         Interview History
//       </button>
//     </nav>
//     <button className="logout" onClick={onLogout}>Logout</button>
//   </aside>
// );

// /* ── RESULT PAGE ── */
// const ResultPage = ({ selectedResult }) => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const result = selectedResult || location.state;

//  useEffect(() => {
//   if (!result || selectedResult) return;

//   try {
//     const stored = localStorage.getItem("interviewHistory");
//     let history = stored ? JSON.parse(stored) : [];

//     if (!Array.isArray(history)) history = [];

//     const exists = history.some(item => item._id === result._id);

//     if (!exists) {
//       const newEntry = {
//         ...result,
//         date: new Date().toLocaleString()
//       };

//       const updatedHistory = [newEntry, ...history];

//       localStorage.setItem(
//         "interviewHistory",
//         JSON.stringify(updatedHistory)
//       );
//     }

//   } catch (err) {
//     console.error("History error:", err);
//     localStorage.removeItem("interviewHistory");
//   }

// }, [result, selectedResult]);

//   if (!result) {
//     return (
//       <div className="no-result">
//         <h2>No Result Found</h2>
//         <button onClick={() => navigate("/dashboard")}>← Go Back</button>
//       </div>
//     );
//   }

//   const totalMarks = result.questions.length * 5;
//   const scoreClass = getScoreClass(result.totalScore, totalMarks);

//   return (
//     <div className="page">
//       <h1>Interview Result 🎉</h1>

//       <p><b>Role:</b> {result.role}</p>
//       <p><b>Difficulty:</b> {result.difficulty}</p>

//       <h3>Question Results</h3>

//       {result.questions.map((q, i) => (
//         <div key={i} className="question-card" style={{ marginBottom: "20px", padding: "15px", border: "1px solid #ccc", borderRadius: "8px" }}>
//           <p><b>Q{i + 1}:</b> {q}</p>
//           <p><b>Your Answer:</b> {result.answers[i] || "No answer provided"}</p>
          
//           {result.feedback && result.feedback[i] && (
//             <div style={{ backgroundColor: "#f9f9fa", padding: "10px", borderRadius: "6px", margin: "10px 0", borderLeft: "4px solid #4a90e2" }}>
//               <p style={{ margin: 0, fontSize: "14px", color: "#333" }}><b>AI Insights:</b> {result.feedback[i]}</p>
//             </div>
//           )}

//           <p style={{ marginTop: "10px" }}>
//             <span className="marks-pill" style={{ fontWeight: "bold", color: "#2c3e50" }}>Marks: {result.marks[i]} / 5</span>
//           </p>
//         </div>
//       ))}

//       <h2>
//         Total Score:{" "}
//         <span className={`score-badge ${scoreClass}`}>
//           {result.totalScore} / {totalMarks}
//         </span>
//       </h2>

//       <button onClick={() => navigate("/dashboard")}>← Back to Dashboard</button>
//     </div>
//   );
// };

// /* ── HISTORY PAGE ── */
// const HistoryPage = ({ setPage, setSelectedResult }) => {
//   const [history, setHistory] = useState([]);

//   useEffect(() => {
//     const stored = JSON.parse(localStorage.getItem("interviewHistory")) || [];
//     setHistory(stored);
//   }, []);

//   const clearHistory = () => {
//     if (window.confirm("Clear all interview history?")) {
//       localStorage.removeItem("interviewHistory");
//       setHistory([]);
//     }
//   };

//   return (
//     <div className="page">
//       <h1>Interview History</h1>
//       <p>All your past AI mock interview sessions</p>

//       {history.length === 0 ? (
//         <div className="empty-state">
//           <p>No interview history yet. Complete an interview to see it here.</p>
//         </div>
//       ) : (
//         <>
//           <button className="btn-danger" onClick={clearHistory}>
//             🗑 Clear All History
//           </button>

//           {history.map((item, index) => {
//             const total = item.questions.length * 5;
//             const scoreClass = getScoreClass(item.totalScore, total);
//             return (
//               <div key={index} className="history-card">
//                 <div className="history-card-info">
//                   <p><b>Date:</b> {item.date}</p>
//                   <p><b>Role:</b> {item.role}</p>
//                   <p><b>Difficulty:</b> {item.difficulty}</p>
//                   <p>
//                     <b>Score: </b>
//                     <span className={`score-badge ${scoreClass}`}>
//                       {item.totalScore} / {total}
//                     </span>
//                   </p>
//                 </div>
//                 <button
//                   className="btn-outline"
//                   onClick={() => {
//                     setSelectedResult(item);
//                     setPage("result");
//                   }}
//                 >
//                   View Details →
//                 </button>
//               </div>
//             );
//           })}
//         </>
//       )}
//     </div>
//   );
// };

// /* ── LAYOUT ── */
// export default function ResultLayout() {
//   const [page, setPage] = useState("result");
//   const [selectedResult, setSelectedResult] = useState(null);
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     if (window.confirm("Are you sure you want to logout?")) {
//       localStorage.clear();
//       navigate("/");
//     }
//   };

//   return (
//     <div className="app">
//       <Sidebar page={page} setPage={setPage} onLogout={handleLogout} />
//       <main className="main">
//         {page === "result" && <ResultPage selectedResult={selectedResult} />}
//         {page === "history" && (
//           <HistoryPage setPage={setPage} setSelectedResult={setSelectedResult} />
//         )}
//       </main>
//     </div>
//   );
// }




