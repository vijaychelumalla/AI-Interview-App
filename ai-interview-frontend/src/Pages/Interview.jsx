import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../api/axios";

function Interview() {
  const location = useLocation();
  const navigate = useNavigate();

  const { role, difficulty, questionCount } = location.state || {};

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [errors, setErrors] = useState([]);

  // 🔹 Fetch Questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.post("/api/interview/generate", {
          role,
          difficulty,
          questionCount
        });

        setQuestions(res.data.questions);
        setAnswers(new Array(res.data.questions.length).fill(""));
        setErrors(new Array(res.data.questions.length).fill(false));

      } catch (error) {
        console.error("Error loading questions", error);
      }
    };

    fetchQuestions();
  }, [role, difficulty, questionCount]);

  // 🔹 Handle Answer Change
  const handleChange = (index, value) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);

    const updatedErrors = [...errors];
    updatedErrors[index] = false;
    setErrors(updatedErrors);
  };

  // 🔥 FINAL SUBMIT (FIXED)

const handleFinish = async () => {
  const newErrors = answers.map(ans => ans.trim() === "");
  setErrors(newErrors);

  const hasEmpty = newErrors.some(e => e === true);
  if (hasEmpty) {
    alert("Please fill all answers before finishing.");
    return;
  }

  try {
    const res = await axios.post("/api/interview/submit", {
      role,
      difficulty,
      answers,
      questions
    });

    navigate("/result", {
      state: {
        ...res.data.interview,
        questions
      }
    });

  } catch (err) {
    console.error(err);
    alert("Error saving interview");
  }
};
  return (
    <div style={{ padding: "40px" }}>
      <h2>{role} Interview ({difficulty})</h2>

      {questions.map((q, i) => (
        <div key={i} style={{ marginTop: "20px" }}>
          <p><b>Q{i + 1}:</b> {q}</p>

          <textarea
            rows="3"
            value={answers[i]}
            onChange={(e) => handleChange(i, e.target.value)}
            style={{
              width: "100%",
              border: errors[i] ? "2px solid red" : "1px solid #ccc",
              padding: "8px",
              borderRadius: "6px"
            }}
          />

          {errors[i] && (
            <p style={{ color: "red", fontSize: "14px" }}>
              Answer required
            </p>
          )}
        </div>
      ))}
<button
  style={{
    marginTop: "30px",
    padding: "12px 24px",
    backgroundColor: "#4290ea",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
  }}
  onClick={handleFinish}
  onMouseOver={(e) => (e.target.style.backgroundColor = "#2880d8")}
  onMouseOut={(e) => (e.target.style.backgroundColor = "#50a6e7")}
>
  Finish Interview
</button>
    </div>
  );
}

export default Interview;



// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "../api/axios";

// function Interview() {
//   const location = useLocation();
//   const navigate = useNavigate();


// const { role, difficulty, questionCount } = location.state || {};
//   const [questions, setQuestions] = useState([]);
//   const [answers, setAnswers] = useState([]);
//   const [errors, setErrors] = useState([]);

// useEffect(() => {
//   const fetchQuestions = async () => {
//     try {

//       const res = await axios.post("/api/interview/generate", {
//         role,
//         difficulty,
//         questionCount
//       });

//       setQuestions(res.data.questions);
//       setAnswers(new Array(res.data.questions.length).fill(""));
//       setErrors(new Array(res.data.questions.length).fill(false));

//     } catch (error) {
//       console.error("Error loading questions", error);
//     }
//   };

//   fetchQuestions();
// }, [role, difficulty, questionCount]);

//   const handleChange = (index, value) => {
//     const updated = [...answers];
//     updated[index] = value;
//     setAnswers(updated);

//     const updatedErrors = [...errors];
//     updatedErrors[index] = false;
//     setErrors(updatedErrors);
//   };

//   const handleFinish = async () => {
//   const newErrors = answers.map(ans => ans.trim() === "");
//   setErrors(newErrors);

//   const hasEmpty = newErrors.some(e => e === true);
//   if (hasEmpty) {
//     alert("Please fill all answers before finishing.");
//     return;
//   }

//   // calculate marks
//   const marks = answers.map(ans => ans.trim().length >= 20 ? 5 : 0);
//   const totalScore = marks.reduce((a, b) => a + b, 0);

//   try {

//     // 🔹 SAVE INTERVIEW TO DATABASE
//     await axios.post("/api/interview/submit", {
//       role,
//       difficulty,
//       answers
//     });

//     // 🔹 go to result page
//     navigate("/result", {
//       state: {
//         role,
//         difficulty,
//         questions,
//         answers,
//         marks,
//         totalScore
//       }
//     });

//   } catch (err) {
//     console.error(err);
//     alert("Error saving interview");
//   }
// };

//   return (
//     <div style={{ padding: "40px" }}>
//       <h2>{role} Interview ({difficulty})</h2>

//       {questions.map((q, i) => (
//         <div key={i} style={{ marginTop: "20px" }}>
//           <p><b>Q{i + 1}:</b> {q}</p>

//           <textarea
//             rows="3"
//             value={answers[i]}
//             onChange={(e) => handleChange(i, e.target.value)}
//             style={{
//               width: "100%",
//               border: errors[i] ? "2px solid red" : "1px solid #ccc",
//               padding: "8px",
//               borderRadius: "6px"
//             }}
//           />

//           {errors[i] && (
//             <p style={{ color: "red", fontSize: "14px" }}>
//               Answer required
//             </p>
//           )}
//         </div>
//       ))}

//       <button style={{ marginTop: "30px" }} onClick={handleFinish}>
//         Finish Interview
//       </button>
//     </div>
//   );
// }

// export default Interview;


























// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import axios from "../api/axios";

// function Interview() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const { role, difficulty } = location.state || {};
//   const [questions, setQuestions] = useState([]);
//   const [answers, setAnswers] = useState([]);
//   const [errors, setErrors] = useState([]);

//   useEffect(() => {
//     const fetchQuestions = async () => {
//       const { data } = await axios.post("/api/interview/generate", {
//         role,
//         difficulty
//       });

//       setQuestions(data.questions);
//       setAnswers(new Array(data.questions.length).fill(""));
//       setErrors(new Array(data.questions.length).fill(false));
//     };

//     fetchQuestions();
//   }, [role, difficulty]);

//   const handleChange = (index, value) => {
//     const updated = [...answers];
//     updated[index] = value;
//     setAnswers(updated);

//     const updatedErrors = [...errors];
//     updatedErrors[index] = false;
//     setErrors(updatedErrors);
//   };

//   const handleFinish = async () => {
//   const newErrors = answers.map(ans => ans.trim() === "");
//   setErrors(newErrors);

//   const hasEmpty = newErrors.some(e => e === true);
//   if (hasEmpty) {
//     alert("Please fill all answers before finishing.");
//     return;
//   }

//   // calculate marks
//   const marks = answers.map(ans => ans.trim().length >= 20 ? 5 : 0);
//   const totalScore = marks.reduce((a, b) => a + b, 0);

//   try {

//     // 🔹 SAVE INTERVIEW TO DATABASE
//     await axios.post("/api/interview/submit", {
//       role,
//       difficulty,
//       answers
//     });

//     // 🔹 go to result page
//     navigate("/result", {
//       state: {
//         role,
//         difficulty,
//         questions,
//         answers,
//         marks,
//         totalScore
//       }
//     });

//   } catch (err) {
//     console.error(err);
//     alert("Error saving interview");
//   }
// };

//   return (
//     <div style={{ padding: "40px" }}>
//       <h2>{role} Interview ({difficulty})</h2>

//       {questions.map((q, i) => (
//         <div key={i} style={{ marginTop: "20px" }}>
//           <p><b>Q{i + 1}:</b> {q}</p>

//           <textarea
//             rows="3"
//             value={answers[i]}
//             onChange={(e) => handleChange(i, e.target.value)}
//             style={{
//               width: "100%",
//               border: errors[i] ? "2px solid red" : "1px solid #ccc",
//               padding: "8px",
//               borderRadius: "6px"
//             }}
//           />

//           {errors[i] && (
//             <p style={{ color: "red", fontSize: "14px" }}>
//               Answer required
//             </p>
//           )}
//         </div>
//       ))}

//       <button style={{ marginTop: "30px" }} onClick={handleFinish}>
//         Finish Interview
//       </button>
//     </div>
//   );
// }

// export default Interview;