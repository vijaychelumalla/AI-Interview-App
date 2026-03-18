import { useNavigate } from "react-router-dom";
import "./Navbar.css";

const AIBrainIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="4" fill="white" />
  </svg>
);

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">

      {/* ── Logo ── */}
      <div className="nav-logo">
        <div className="nav-logo-icon">
          <AIBrainIcon />
        </div>
        <div className="nav-logo-text">
          <span className="nav-logo-title">AI Interview</span>
          <span className="nav-logo-sub">Preparation</span>
        </div>
      </div>

      {/* ── CTA ── */}
      <button
        className="nav-cta"
        onClick={() => navigate("/login")}
      >
        Get Started →
      </button>

    </nav>
  );
}
// import { useNavigate } from "react-router-dom";
// import "./Navbar.css";

// const AIBrainIcon = () => (
//   <svg viewBox="0 0 24 24" fill="none">
//     <circle cx="12" cy="12" r="4" fill="white"/>
//   </svg>
// );

// export default function Navbar() {

//    const navigate = useNavigate();
//   return (
//     <>

//       <nav className="navbar">
//         {/* Logo */}
//         <div className="logo">
//           <div className="logo-icon">
//             <AIBrainIcon />
//           </div>
//           <div>
//             <div className="logo-title">AI Interview</div>
//             <div className="logo-sub">Preparation</div>
//           </div>
//         </div>

//         {/* CTA Button */}
//         <button className="btn-get-started" onClick={() => navigate("/login")}>
//           Get Started →
//         </button>
//       </nav>

     
//     </>
//   );
// }