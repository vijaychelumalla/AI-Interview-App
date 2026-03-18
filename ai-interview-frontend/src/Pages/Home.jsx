import React from "react";
import Navbar from "../Components/Navbar";
import Main from "../Components/Main";
import "./Home.css";

function Home() {
  return (
    <>
      <Navbar />
<div className="home">
      <div className="hero-container">
        <h1 className="hero-title">
          Ace Your Next <br />
          <span>AI Interview</span>
        </h1>

        <p className="hero-subtitle">
          Practice with real questions, get instant AI feedback, and
          <br />
          land your dream job.
        </p>

        <div className="scroll-wrap">
        <span className="scroll-label">Scroll</span>
        <div className="scroll-line-track">
          <div className="scroll-line-drop" />
        </div>
      </div>
      </div>
  
      
    </div>
      <Main />
    </>
  );
}

export default Home;
