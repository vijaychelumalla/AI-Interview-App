import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

// ─── Styles ────────────────────────────────────────────────────────────────────
const styles = {
  dash: {
    display: "flex",
    height: "100vh",
    background: "#F7F6F3",
    fontFamily: "'DM Sans', sans-serif",
  },
  sidebar: {
    width: 220,
    background: "#FFFFFF",
    borderRight: "1px solid #EDECEA",
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
  },
  sidebarHeader: {
    padding: "20px 16px 16px",
    borderBottom: "1px solid #EDECEA",
  },
  brand: {
    fontSize: 14,
    fontWeight: 500,
    color: "#1a1a1a",
    display: "flex",
    alignItems: "center",
    gap: 9,
  },
  brandIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    background: "#1D9E75",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  navSection: { padding: "12px 8px 4px" },
  navLabel: {
    fontSize: 10,
    fontWeight: 500,
    color: "#B0ADA6",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    padding: "0 8px",
    marginBottom: 4,
  },
  navItem: (active) => ({
    display: "flex",
    alignItems: "center",
    gap: 9,
    padding: "7px 10px",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 13,
    fontWeight: active ? 500 : 400,
    color: active ? "#0F6E56" : "#6B6863",
    background: active ? "#E8F7F1" : "transparent",
    transition: "all 0.12s",
    userSelect: "none",
  }),
  main: {
    flex: 1,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    background: "#F7F6F3",
  },
  topbar: {
    padding: "16px 24px",
    borderBottom: "1px solid #EDECEA",
    background: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topbarTitle: { fontSize: 15, fontWeight: 500, color: "#1a1a1a" },
  topbarSub:   { fontSize: 11, color: "#9D9A95", marginTop: 2 },
  adminBadge: {
    fontSize: 11,
    background: "#E8F7F1",
    color: "#0F6E56",
    padding: "3px 10px",
    borderRadius: 99,
    fontWeight: 500,
  },
  content: { padding: "20px 24px", flex: 1 },
  statGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0,1fr))",
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    background: "#FFFFFF",
    borderRadius: 10,
    padding: "14px 16px",
    border: "1px solid #EDECEA",
  },
  statLabel: { fontSize: 11, color: "#9D9A95", marginBottom: 6 },
  statVal:   { fontSize: 26, fontWeight: 500, color: "#1a1a1a" },
  statSub:   { fontSize: 11, color: "#B0ADA6", marginTop: 3 },
  sectionCard: {
    background: "#FFFFFF",
    border: "1px solid #EDECEA",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
  },
  sectionHead: {
    padding: "14px 18px",
    borderBottom: "1px solid #EDECEA",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionHeadTitle: { fontSize: 13, fontWeight: 500, color: "#1a1a1a" },
  sectionHeadSub:   { fontSize: 11, color: "#9D9A95" },
  table: { width: "100%", borderCollapse: "collapse", fontSize: 12, tableLayout: "fixed" },
  th: {
    padding: "9px 14px",
    textAlign: "left",
    fontWeight: 500,
    color: "#9D9A95",
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    borderBottom: "1px solid #EDECEA",
    background: "#FAFAF8",
  },
  td: {
    padding: "11px 14px",
    color: "#1a1a1a",
    borderBottom: "1px solid #F3F2EF",
    verticalAlign: "middle",
  },
  avatar: {
    width: 27,
    height: 27,
    borderRadius: "50%",
    background: "#E8F7F1",
    color: "#0F6E56",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 10,
    fontWeight: 500,
    marginRight: 8,
    verticalAlign: "middle",
  },
  roleBadge: (role) => ({
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: 99,
    fontSize: 10,
    fontWeight: 500,
    background: role === "admin" ? "#EEEDFE" : role === "Draft" ? "#FEF3E2" : "#E8F7F1",
    color:      role === "admin" ? "#534AB7" : role === "Draft" ? "#854F0B" : "#0F6E56",
  }),
  btnDelete: {
    border: "1px solid #E8E6E0",
    background: "transparent",
    color: "#6B6863",
    padding: "4px 10px",
    borderRadius: 7,
    fontSize: 11,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  qItem: {
    padding: "10px 16px",
    borderBottom: "1px solid #F3F2EF",
    fontSize: 12,
    display: "flex",
    gap: 10,
    alignItems: "flex-start",
  },
  qNum: {
    width: 20,
    height: 20,
    borderRadius: "50%",
    background: "#F3F2EF",
    color: "#6B6863",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 10,
    fontWeight: 500,
    flexShrink: 0,
    marginTop: 1,
  },
};

// ─── Constants ─────────────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard",  label: "Dashboard",           section: "Overview"   },
  { id: "users",      label: "User Management",      section: "Management" },
  { id: "interviews", label: "Interview Management", section: "Management" },
];

const TITLES = {
  dashboard:  ["Dashboard overview",      "Welcome back, Admin"],
  users:      ["User management",         "View and manage registered accounts"],
  interviews: ["Interview management",    "View interviews and manage questions"],
};





function initials(name) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

// ─── Sub-components ────────────────────────────────────────────────────────────
function Sidebar({ active, setActive }) {
  const sections = [...new Set(NAV.map((n) => n.section))];
  return (
    <aside style={styles.sidebar}>
      <div style={styles.sidebarHeader}>
        <div style={styles.brand}>
          <div style={styles.brandIcon}>
            <svg width={14} height={14} viewBox="0 0 16 16" fill="white">
              <path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8z" />
              <path d="M8 4a1 1 0 011 1v3h2a1 1 0 010 2H8a1 1 0 01-1-1V5a1 1 0 011-1z" />
            </svg>
          </div>
          Admin Panel
        </div>
      </div>

      {sections.map((sec) => (
        <div key={sec} style={styles.navSection}>
          <div style={styles.navLabel}>{sec}</div>
          {NAV.filter((n) => n.section === sec).map((n) => (
            <div
              key={n.id}
              style={styles.navItem(active === n.id)}
              onClick={() => setActive(n.id)}
            >
              {n.label}
            </div>
          ))}
        </div>
      ))}
    </aside>
  );
}

function StatCard({ label, value, sub }) {
  return (
    <div style={styles.statCard}>
      <div style={styles.statLabel}>{label}</div>
      <div style={styles.statVal}>{value}</div>
      <div style={styles.statSub}>{sub}</div>
    </div>
  );
}

// ─── Dashboard Panel ───────────────────────────────────────────────────────────
function DashboardPanel({ userCount  ,  interviews}) {
  
  return (
    <>
      <div style={styles.statGrid}>
        <StatCard label="Total users"      value={userCount} sub="Registered accounts"  />
        <StatCard label="Total interviews" value={interviews}        sub="Created sessions"      />
        
      </div>

     
    </>
  );
}

// ─── User Management Panel ────────────────────────────────────────────────────
function UsersPanel({ users, setUsers }) {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get("/api/admin/users");
        setUsers(data);
      } catch (err) {
        alert("Not authorized");
        navigate("/login");
      }
    };
    fetchUsers();
  }, [navigate, setUsers]);

  const deleteUser = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"?`)) return;
    try {
      await axios.delete(`/api/admin/users/${id}`);
      const { data } = await axios.get("/api/admin/users");
      setUsers(data);
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div style={styles.sectionCard}>
      <div style={styles.sectionHead}>
        <div>
          <div style={styles.sectionHeadTitle}>All users</div>
          <div style={styles.sectionHeadSub}>
            {users.length} registered account{users.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      <table style={styles.table}>
        <colgroup>
          <col style={{ width: "33%" }} />
          <col style={{ width: "30%" }} />
          <col style={{ width: "16%" }} />
          <col style={{ width: "21%" }} />
        </colgroup>
        <thead>
          <tr>
            {["Name", "Email", "Role", "Action"].map((h) => (
              <th key={h} style={styles.th}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ ...styles.td, textAlign: "center", color: "#9D9A95", padding: 32 }}>
                No users found
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user._id}>
                <td style={styles.td}>
                  <span style={styles.avatar}>{initials(user.name)}</span>
                  {user.name}
                </td>
                <td style={{ ...styles.td, color: "#6B6863" }}>{user.email}</td>
                <td style={styles.td}>
                  <span style={styles.roleBadge(user.role)}>{user.role}</span>
                </td>
                <td style={styles.td}>
                  {user.role !== "admin" ? (
                    <button
                      style={styles.btnDelete}
                      onClick={() => deleteUser(user._id, user.name)}
                    >
                      Delete
                    </button>
                  ) : (
                    <span style={{ color: "#B0ADA6" }}>—</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// ─── Interview Management Panel ───────────────────────────────────────────────
// function InterviewsPanel() {
//   return (
//     <div style={styles.sectionCard}>
//       <div style={styles.sectionHead}>
//         <div>
//           <div style={styles.sectionHeadTitle}>Interviews</div>
//           <div style={styles.sectionHeadSub}>3 active sessions</div>
//         </div>
//       </div>

//       <table style={styles.table}>
//         <colgroup>
//           <col style={{ width: "38%" }} />
//           <col style={{ width: "24%" }} />
//           <col style={{ width: "18%" }} />
//           <col style={{ width: "20%" }} />
//         </colgroup>

//         <thead>
//           <tr>
//             {["Title", "Created by", "Questions", "Status"].map((h) => (
//               <th key={h} style={styles.th}>{h}</th>
//             ))}
//           </tr>
//         </thead>

//         <tbody>
//           {MOCK_INTERVIEWS.map((iv) => (
//             <tr key={iv._id}>
//               <td style={styles.td}>{iv.title}</td>
//               <td style={{ ...styles.td, color: "#6B6863" }}>admin</td>
//               <td style={styles.td}>{iv.questions}</td>
//               <td style={styles.td}>
//                 <span style={styles.roleBadge(iv.status)}>
//                   {iv.status}
//                 </span>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }


function InterviewsPanel() {

  const [sessions, setSessions] = useState([]);

  useEffect(() => {

    const fetchSessions = async () => {

      try {

        const { data } = await axios.get("/api/interview/sessions");

        setSessions(data);

      } catch (err) {

        console.log(err);

      }

    };

    fetchSessions();

  }, []);

  return (
    <div style={styles.sectionCard}>
      <div style={styles.sectionHead}>
        <div>
          <div style={styles.sectionHeadTitle}>Interview Sessions</div>
          <div style={styles.sectionHeadSub}>
            {sessions.length} active sessions
          </div>
        </div>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Title</th>
            <th style={styles.th}>Role</th>
            <th style={styles.th}>Questions</th>
            <th style={styles.th}>Status</th>
          </tr>
        </thead>

        <tbody>

          {sessions.map((iv, i) => (
            <tr key={i}>
              <td style={styles.td}>{iv.title}</td>
              <td style={styles.td}>{iv.role}</td>
              <td style={styles.td}>{iv.questions}</td>
              <td style={styles.td}>{iv.status}</td>
            </tr>
          ))}

        </tbody>
      </table>
    </div>
  );

}
// function InterviewsPanel() {

//   const [interviews, setInterviews] = useState([]);
//   const [questions, setQuestions] = useState([]);

//   useEffect(() => {

//     const fetchInterviews = async () => {
//       try {

//         const { data } = await axios.get("/api/admin/interviews");

//         setInterviews(data);

//         if (data.length > 0) {
//           setQuestions(data[0].questions);
//         }

//       } catch (err) {
//         console.log(err);
//       }
//     };

//     fetchInterviews();

//   }, []);

//   return (
//     <>
//       <div style={styles.sectionCard}>
//         <div style={styles.sectionHead}>
//           <div>
//             <div style={styles.sectionHeadTitle}>Interviews</div>
//             <div style={styles.sectionHeadSub}>
//               {interviews.length} active sessions
//             </div>
//           </div>
//         </div>

//         <table style={styles.table}>
//           <thead>
//             <tr>
//               <th style={styles.th}>Title</th>
//               <th style={styles.th}>Created By</th>
//               <th style={styles.th}>Questions</th>
//               <th style={styles.th}>Status</th>
//             </tr>
//           </thead>

//           <tbody>
//             {interviews.map((iv) => (
//               <tr key={iv._id}>
//                 <td style={styles.td}>{iv.title}</td>
//                 <td style={styles.td}>{iv.createdBy?.name || "admin"}</td>
//                 <td style={styles.td}>{iv.questions.length}</td>
//                 <td style={styles.td}>
//                   <span style={styles.roleBadge(iv.status)}>
//                     {iv.status}
//                   </span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* QUESTIONS */}
//       <div style={styles.sectionCard}>
//         <div style={styles.sectionHead}>
//           <div>
//             <div style={styles.sectionHeadTitle}>Interview Questions</div>
//           </div>
//         </div>

//         {questions.map((q, i) => (
//           <div key={i} style={styles.qItem}>
//             <div style={styles.qNum}>{i + 1}</div>
//             <div>{q.question}</div>
//           </div>
//         ))}
//       </div>
//     </>
//   );
// }

// ─── Main Component ───────────────────────────────────────────────────────────
// function AdminDashboard() {
//   const [active, setActive] = useState("dashboard");
//   const [users, setUsers]   = useState([]);

//   const [title, sub] = TITLES[active];

//   return (
//     <div style={styles.dash}>
//       <Sidebar active={active} setActive={setActive} />

//       <div style={styles.main}>
//         <div style={styles.topbar}>
//           <div>
//             <div style={styles.topbarTitle}>{title}</div>
//             <div style={styles.topbarSub}>{sub}</div>
//           </div>
//           <span style={styles.adminBadge}>Admin</span>
//         </div>

//         <div style={styles.content}>
//           {active === "dashboard"  && <DashboardPanel  userCount={users.length} />}
//           {active === "users"      && <UsersPanel      users={users} setUsers={setUsers} />}
//           {active === "interviews" && <InterviewsPanel />}
//         </div>
//       </div>
//     </div>
//   );
// }

function AdminDashboard() {
  const [active, setActive] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    interviews: 0,
    results: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get("/api/admin/stats");
        setStats({
          interviews: data.interviews,
          results: data.results,
        });
      } catch (err) {
        console.log(err);
      }
    };

    fetchStats();
  }, []);

  const [title, sub] = TITLES[active];

  return (
    <div style={styles.dash}>
      <Sidebar active={active} setActive={setActive} />

      <div style={styles.main}>
        <div style={styles.topbar}>
          <div>
            <div style={styles.topbarTitle}>{title}</div>
            <div style={styles.topbarSub}>{sub}</div>
          </div>
          <span style={styles.adminBadge}>Admin</span>
        </div>

        <div style={styles.content}>
          {active === "dashboard" && (
            <DashboardPanel
              userCount={users.length}
              interviews={stats.interviews}
              results={stats.results}
            />
          )}

          {active === "users" && (
            <UsersPanel users={users} setUsers={setUsers} />
          )}

          {active === "interviews" && <InterviewsPanel />}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;






















// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "../api/axios";

// // ─── Styles ────────────────────────────────────────────────────────────────────
// const styles = {
//   dash: {
//     display: "flex",
//     height: "100vh",
//     background: "#F7F6F3",
//     fontFamily: "'DM Sans', sans-serif",
//   },
//   sidebar: {
//     width: 220,
//     background: "#FFFFFF",
//     borderRight: "1px solid #EDECEA",
//     display: "flex",
//     flexDirection: "column",
//     flexShrink: 0,
//   },
//   sidebarHeader: {
//     padding: "20px 16px 16px",
//     borderBottom: "1px solid #EDECEA",
//   },
//   brand: {
//     fontSize: 14,
//     fontWeight: 500,
//     color: "#1a1a1a",
//     display: "flex",
//     alignItems: "center",
//     gap: 9,
//   },
//   brandIcon: {
//     width: 28,
//     height: 28,
//     borderRadius: 8,
//     background: "#1D9E75",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   navSection: { padding: "12px 8px 4px" },
//   navLabel: {
//     fontSize: 10,
//     fontWeight: 500,
//     color: "#B0ADA6",
//     textTransform: "uppercase",
//     letterSpacing: "0.08em",
//     padding: "0 8px",
//     marginBottom: 4,
//   },
//   navItem: (active) => ({
//     display: "flex",
//     alignItems: "center",
//     gap: 9,
//     padding: "7px 10px",
//     borderRadius: 8,
//     cursor: "pointer",
//     fontSize: 13,
//     fontWeight: active ? 500 : 400,
//     color: active ? "#0F6E56" : "#6B6863",
//     background: active ? "#E8F7F1" : "transparent",
//     transition: "all 0.12s",
//     userSelect: "none",
//   }),
//   main: {
//     flex: 1,
//     overflowY: "auto",
//     display: "flex",
//     flexDirection: "column",
//     background: "#F7F6F3",
//   },
//   topbar: {
//     padding: "16px 24px",
//     borderBottom: "1px solid #EDECEA",
//     background: "#FFFFFF",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   topbarTitle: { fontSize: 15, fontWeight: 500, color: "#1a1a1a" },
//   topbarSub:   { fontSize: 11, color: "#9D9A95", marginTop: 2 },
//   adminBadge: {
//     fontSize: 11,
//     background: "#E8F7F1",
//     color: "#0F6E56",
//     padding: "3px 10px",
//     borderRadius: 99,
//     fontWeight: 500,
//   },
//   content: { padding: "20px 24px", flex: 1 },
//   statGrid: {
//     display: "grid",
//     gridTemplateColumns: "repeat(3, minmax(0,1fr))",
//     gap: 12,
//     marginBottom: 20,
//   },
//   statCard: {
//     background: "#FFFFFF",
//     borderRadius: 10,
//     padding: "14px 16px",
//     border: "1px solid #EDECEA",
//   },
//   statLabel: { fontSize: 11, color: "#9D9A95", marginBottom: 6 },
//   statVal:   { fontSize: 26, fontWeight: 500, color: "#1a1a1a" },
//   statSub:   { fontSize: 11, color: "#B0ADA6", marginTop: 3 },
//   sectionCard: {
//     background: "#FFFFFF",
//     border: "1px solid #EDECEA",
//     borderRadius: 12,
//     overflow: "hidden",
//     marginBottom: 16,
//   },
//   sectionHead: {
//     padding: "14px 18px",
//     borderBottom: "1px solid #EDECEA",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   sectionHeadTitle: { fontSize: 13, fontWeight: 500, color: "#1a1a1a" },
//   sectionHeadSub:   { fontSize: 11, color: "#9D9A95" },
//   table: { width: "100%", borderCollapse: "collapse", fontSize: 12, tableLayout: "fixed" },
//   th: {
//     padding: "9px 14px",
//     textAlign: "left",
//     fontWeight: 500,
//     color: "#9D9A95",
//     fontSize: 10,
//     textTransform: "uppercase",
//     letterSpacing: "0.05em",
//     borderBottom: "1px solid #EDECEA",
//     background: "#FAFAF8",
//   },
//   td: {
//     padding: "11px 14px",
//     color: "#1a1a1a",
//     borderBottom: "1px solid #F3F2EF",
//     verticalAlign: "middle",
//   },
//   avatar: {
//     width: 27,
//     height: 27,
//     borderRadius: "50%",
//     background: "#E8F7F1",
//     color: "#0F6E56",
//     display: "inline-flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontSize: 10,
//     fontWeight: 500,
//     marginRight: 8,
//     verticalAlign: "middle",
//   },
//   roleBadge: (role) => ({
//     display: "inline-block",
//     padding: "2px 8px",
//     borderRadius: 99,
//     fontSize: 10,
//     fontWeight: 500,
//     background: role === "admin" ? "#EEEDFE" : role === "Draft" ? "#FEF3E2" : "#E8F7F1",
//     color:      role === "admin" ? "#534AB7" : role === "Draft" ? "#854F0B" : "#0F6E56",
//   }),
//   btnDelete: {
//     border: "1px solid #E8E6E0",
//     background: "transparent",
//     color: "#6B6863",
//     padding: "4px 10px",
//     borderRadius: 7,
//     fontSize: 11,
//     cursor: "pointer",
//     fontFamily: "inherit",
//   },
//   qItem: {
//     padding: "10px 16px",
//     borderBottom: "1px solid #F3F2EF",
//     fontSize: 12,
//     display: "flex",
//     gap: 10,
//     alignItems: "flex-start",
//   },
//   qNum: {
//     width: 20,
//     height: 20,
//     borderRadius: "50%",
//     background: "#F3F2EF",
//     color: "#6B6863",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     fontSize: 10,
//     fontWeight: 500,
//     flexShrink: 0,
//     marginTop: 1,
//   },
// };

// // ─── Constants ─────────────────────────────────────────────────────────────────
// const NAV = [
//   { id: "dashboard",  label: "Dashboard",           section: "Overview"   },
//   { id: "users",      label: "User Management",      section: "Management" },
//   { id: "interviews", label: "Interview Management", section: "Management" },
// ];

// const TITLES = {
//   dashboard:  ["Dashboard overview",      "Welcome back, Admin"],
//   users:      ["User management",         "View and manage registered accounts"],
//   interviews: ["Interview management",    "View interviews and manage questions"],
// };

// const MOCK_INTERVIEWS = [
//   { _id: "i1", title: "Frontend developer screen", questions: 8,  status: "Active" },
//   { _id: "i2", title: "Backend API knowledge",     questions: 10, status: "Active" },
//   { _id: "i3", title: "UI/UX portfolio review",    questions: 6,  status: "Draft"  },
// ];

// const MOCK_QUESTIONS = [
//   "Explain the difference between var, let, and const in JavaScript.",
//   "What is the virtual DOM and how does React use it?",
//   "Describe how CSS specificity works with an example.",
//   "What are React hooks and why were they introduced?",
// ];

// function initials(name) {
//   return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
// }

// // ─── Sub-components ────────────────────────────────────────────────────────────
// function Sidebar({ active, setActive }) {
//   const sections = [...new Set(NAV.map((n) => n.section))];
//   return (
//     <aside style={styles.sidebar}>
//       <div style={styles.sidebarHeader}>
//         <div style={styles.brand}>
//           <div style={styles.brandIcon}>
//             <svg width={14} height={14} viewBox="0 0 16 16" fill="white">
//               <path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8z" />
//               <path d="M8 4a1 1 0 011 1v3h2a1 1 0 010 2H8a1 1 0 01-1-1V5a1 1 0 011-1z" />
//             </svg>
//           </div>
//           Admin Panel
//         </div>
//       </div>

//       {sections.map((sec) => (
//         <div key={sec} style={styles.navSection}>
//           <div style={styles.navLabel}>{sec}</div>
//           {NAV.filter((n) => n.section === sec).map((n) => (
//             <div
//               key={n.id}
//               style={styles.navItem(active === n.id)}
//               onClick={() => setActive(n.id)}
//             >
//               {n.label}
//             </div>
//           ))}
//         </div>
//       ))}
//     </aside>
//   );
// }

// function StatCard({ label, value, sub }) {
//   return (
//     <div style={styles.statCard}>
//       <div style={styles.statLabel}>{label}</div>
//       <div style={styles.statVal}>{value}</div>
//       <div style={styles.statSub}>{sub}</div>
//     </div>
//   );
// }

// // ─── Dashboard Panel ───────────────────────────────────────────────────────────
// function DashboardPanel({ userCount  ,  interviews}) {
  
//   return (
//     <>
//       <div style={styles.statGrid}>
//         <StatCard label="Total users"      value={userCount} sub="Registered accounts"  />
//         <StatCard label="Total interviews" value={interviews}        sub="Created sessions"      />
        
//       </div>

     
//     </>
//   );
// }

// // ─── User Management Panel ────────────────────────────────────────────────────
// function UsersPanel({ users, setUsers }) {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const { data } = await axios.get("/api/admin/users");
//         setUsers(data);
//       } catch (err) {
//         alert("Not authorized");
//         navigate("/login");
//       }
//     };
//     fetchUsers();
//   }, [navigate, setUsers]);

//   const deleteUser = async (id, name) => {
//     if (!window.confirm(`Delete user "${name}"?`)) return;
//     try {
//       await axios.delete(`/api/admin/users/${id}`);
//       const { data } = await axios.get("/api/admin/users");
//       setUsers(data);
//     } catch (err) {
//       alert("Delete failed");
//     }
//   };

//   return (
//     <div style={styles.sectionCard}>
//       <div style={styles.sectionHead}>
//         <div>
//           <div style={styles.sectionHeadTitle}>All users</div>
//           <div style={styles.sectionHeadSub}>
//             {users.length} registered account{users.length !== 1 ? "s" : ""}
//           </div>
//         </div>
//       </div>

//       <table style={styles.table}>
//         <colgroup>
//           <col style={{ width: "33%" }} />
//           <col style={{ width: "30%" }} />
//           <col style={{ width: "16%" }} />
//           <col style={{ width: "21%" }} />
//         </colgroup>
//         <thead>
//           <tr>
//             {["Name", "Email", "Role", "Action"].map((h) => (
//               <th key={h} style={styles.th}>{h}</th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {users.length === 0 ? (
//             <tr>
//               <td colSpan={4} style={{ ...styles.td, textAlign: "center", color: "#9D9A95", padding: 32 }}>
//                 No users found
//               </td>
//             </tr>
//           ) : (
//             users.map((user) => (
//               <tr key={user._id}>
//                 <td style={styles.td}>
//                   <span style={styles.avatar}>{initials(user.name)}</span>
//                   {user.name}
//                 </td>
//                 <td style={{ ...styles.td, color: "#6B6863" }}>{user.email}</td>
//                 <td style={styles.td}>
//                   <span style={styles.roleBadge(user.role)}>{user.role}</span>
//                 </td>
//                 <td style={styles.td}>
//                   {user.role !== "admin" ? (
//                     <button
//                       style={styles.btnDelete}
//                       onClick={() => deleteUser(user._id, user.name)}
//                     >
//                       Delete
//                     </button>
//                   ) : (
//                     <span style={{ color: "#B0ADA6" }}>—</span>
//                   )}
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// // ─── Interview Management Panel ───────────────────────────────────────────────
// function InterviewsPanel() {
//   return (
//     <>
//       <div style={styles.sectionCard}>
//         <div style={styles.sectionHead}>
//           <div>
//             <div style={styles.sectionHeadTitle}>Interviews</div>
//             <div style={styles.sectionHeadSub}>3 active sessions</div>
//           </div>
//         </div>
//         <table style={styles.table}>
//           <colgroup>
//             <col style={{ width: "38%" }} />
//             <col style={{ width: "24%" }} />
//             <col style={{ width: "18%" }} />
//             <col style={{ width: "20%" }} />
//           </colgroup>
//           <thead>
//             <tr>
//               {["Title", "Created by", "Questions", "Status"].map((h) => (
//                 <th key={h} style={styles.th}>{h}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {MOCK_INTERVIEWS.map((iv) => (
//               <tr key={iv._id}>
//                 <td style={styles.td}>{iv.title}</td>
//                 <td style={{ ...styles.td, color: "#6B6863" }}>admin</td>
//                 <td style={styles.td}>{iv.questions}</td>
//                 <td style={styles.td}>
//                   <span style={styles.roleBadge(iv.status)}>{iv.status}</span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div style={styles.sectionCard}>
//         <div style={styles.sectionHead}>
//           <div>
//             <div style={styles.sectionHeadTitle}>Manage questions</div>
//             <div style={styles.sectionHeadSub}>Frontend developer screen</div>
//           </div>
//         </div>
//         {MOCK_QUESTIONS.map((q, i) => (
//           <div key={i} style={{ ...styles.qItem, borderBottom: i < MOCK_QUESTIONS.length - 1 ? "1px solid #F3F2EF" : "none" }}>
//             <div style={styles.qNum}>{i + 1}</div>
//             <div style={{ color: "#3a3835", lineHeight: 1.5, fontSize: 12 }}>{q}</div>
//           </div>
//         ))}
//       </div>
//     </>
//   );
// }
// // function InterviewsPanel() {

// //   const [interviews, setInterviews] = useState([]);
// //   const [questions, setQuestions] = useState([]);

// //   useEffect(() => {

// //     const fetchInterviews = async () => {
// //       try {

// //         const { data } = await axios.get("/api/admin/interviews");

// //         setInterviews(data);

// //         if (data.length > 0) {
// //           setQuestions(data[0].questions);
// //         }

// //       } catch (err) {
// //         console.log(err);
// //       }
// //     };

// //     fetchInterviews();

// //   }, []);

// //   return (
// //     <>
// //       <div style={styles.sectionCard}>
// //         <div style={styles.sectionHead}>
// //           <div>
// //             <div style={styles.sectionHeadTitle}>Interviews</div>
// //             <div style={styles.sectionHeadSub}>
// //               {interviews.length} active sessions
// //             </div>
// //           </div>
// //         </div>

// //         <table style={styles.table}>
// //           <thead>
// //             <tr>
// //               <th style={styles.th}>Title</th>
// //               <th style={styles.th}>Created By</th>
// //               <th style={styles.th}>Questions</th>
// //               <th style={styles.th}>Status</th>
// //             </tr>
// //           </thead>

// //           <tbody>
// //             {interviews.map((iv) => (
// //               <tr key={iv._id}>
// //                 <td style={styles.td}>{iv.title}</td>
// //                 <td style={styles.td}>{iv.createdBy?.name || "admin"}</td>
// //                 <td style={styles.td}>{iv.questions.length}</td>
// //                 <td style={styles.td}>
// //                   <span style={styles.roleBadge(iv.status)}>
// //                     {iv.status}
// //                   </span>
// //                 </td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       </div>

// //       {/* QUESTIONS */}
// //       <div style={styles.sectionCard}>
// //         <div style={styles.sectionHead}>
// //           <div>
// //             <div style={styles.sectionHeadTitle}>Interview Questions</div>
// //           </div>
// //         </div>

// //         {questions.map((q, i) => (
// //           <div key={i} style={styles.qItem}>
// //             <div style={styles.qNum}>{i + 1}</div>
// //             <div>{q.question}</div>
// //           </div>
// //         ))}
// //       </div>
// //     </>
// //   );
// // }

// // ─── Main Component ───────────────────────────────────────────────────────────
// // function AdminDashboard() {
// //   const [active, setActive] = useState("dashboard");
// //   const [users, setUsers]   = useState([]);

// //   const [title, sub] = TITLES[active];

// //   return (
// //     <div style={styles.dash}>
// //       <Sidebar active={active} setActive={setActive} />

// //       <div style={styles.main}>
// //         <div style={styles.topbar}>
// //           <div>
// //             <div style={styles.topbarTitle}>{title}</div>
// //             <div style={styles.topbarSub}>{sub}</div>
// //           </div>
// //           <span style={styles.adminBadge}>Admin</span>
// //         </div>

// //         <div style={styles.content}>
// //           {active === "dashboard"  && <DashboardPanel  userCount={users.length} />}
// //           {active === "users"      && <UsersPanel      users={users} setUsers={setUsers} />}
// //           {active === "interviews" && <InterviewsPanel />}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// function AdminDashboard() {
//   const [active, setActive] = useState("dashboard");
//   const [users, setUsers] = useState([]);
//   const [stats, setStats] = useState({
//     interviews: 0,
//     results: 0,
//   });

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         const { data } = await axios.get("/api/admin/stats");
//         setStats({
//           interviews: data.interviews,
//           results: data.results,
//         });
//       } catch (err) {
//         console.log(err);
//       }
//     };

//     fetchStats();
//   }, []);

//   const [title, sub] = TITLES[active];

//   return (
//     <div style={styles.dash}>
//       <Sidebar active={active} setActive={setActive} />

//       <div style={styles.main}>
//         <div style={styles.topbar}>
//           <div>
//             <div style={styles.topbarTitle}>{title}</div>
//             <div style={styles.topbarSub}>{sub}</div>
//           </div>
//           <span style={styles.adminBadge}>Admin</span>
//         </div>

//         <div style={styles.content}>
//           {active === "dashboard" && (
//             <DashboardPanel
//               userCount={users.length}
//               interviews={stats.interviews}
//               results={stats.results}
//             />
//           )}

//           {active === "users" && (
//             <UsersPanel users={users} setUsers={setUsers} />
//           )}

//           {active === "interviews" && <InterviewsPanel />}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AdminDashboard;




























