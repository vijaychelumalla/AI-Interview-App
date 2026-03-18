const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const Interview = require("../models/Interview");
const { OpenAI } = require("openai");

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});


// ================= GET USER INTERVIEWS =================
router.get("/my", protect, async (req, res) => {
  try {

    const interviews = await Interview
      .find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.json(interviews);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// ================= SUBMIT INTERVIEW =================
router.post("/submit", protect, async (req, res) => {
  try {

    const { role, difficulty, answers, questions } = req.body;

    if (!answers || !Array.isArray(answers) || !questions || !Array.isArray(questions)) {
      return res.status(400).json({ message: "Answers or questions missing" });
    }
    
    if (answers.length !== questions.length) {
      return res.status(400).json({ message: "Answers and questions count mismatch" });
    }

    let marks = [];
    let feedback = [];
    let totalScore = 0;

    const prompt = `You are an expert ${role} interviewer. Evaluate the candidate's answers based on the difficulty level: ${difficulty}.
Provide a score out of 5 for each answer, and short feedback (1-3 sentences mentioning strengths, weak points, or improvement tips).

Questions and Answers:
${questions.map((q, i) => `Q${i + 1}: ${q}\nA${i + 1}: ${answers[i] || "No answer provided"}`).join("\n\n")}

Return the evaluations STRICTLY as a JSON array of objects in this exact format:
[
  { "mark": number (0 to 5), "feedback": "Short feedback string" },
  ...
]
Ensure the array length exactly matches the number of questions (${questions.length}). Do not wrap in markdown blocks, just raw JSON.`;

    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
    });

    try {
      const responseContent = chatCompletion.choices[0]?.message?.content?.trim() || "[]";
      let evaluations;
      if (responseContent.startsWith("\`\`\`json")) {
        evaluations = JSON.parse(responseContent.replace(/\`\`\`json\n?/, '').replace(/\n?\`\`\`/, ''));
      } else {
        evaluations = JSON.parse(responseContent);
      }

      if (!Array.isArray(evaluations) || evaluations.length !== questions.length) {
        throw new Error("Invalid evaluation format returned by API");
      }

      evaluations.forEach(eval => {
        const mark = Number(eval.mark) || 0;
        marks.push(mark);
        feedback.push(eval.feedback || "No feedback provided.");
        totalScore += mark;
      });
      
    } catch (parseError) {
      console.error("Failed to parse Groq response:", parseError, chatCompletion.choices[0]?.message?.content);
      answers.forEach(ans => {
        marks.push(0);
        feedback.push("Evaluation failed. Please review manually.");
        totalScore += 0;
      });
    }

    const interview = await Interview.create({
      user: req.user.id,
      role,
      difficulty,
      questions,
      answers,
      feedback,
      marks,
      totalScore
    });

    res.json({
      message: "Interview evaluated and submitted successfully",
      interview
    });

  } catch (err) {
    console.error("Submit Error:", err);
    res.status(500).json({ message: "Server error during submission" });
  }
});
// ================= GET INTERVIEW SESSIONS =================
router.get("/sessions", protect, async (req, res) => {

  try {
    const questions = {

      Frontend: [
        "What is React?",
        "Difference between state and props?",
        "Explain useEffect hook",
        "What is Virtual DOM?",
        "What are React hooks?",
        "Explain component lifecycle",
        "What is JSX?",
        "Controlled vs uncontrolled components?",
        "What is Redux and why use it?",
        "How do you optimize React performance?"
      ],

      Backend: [
        "What is REST API?",
        "Difference between SQL and NoSQL?",
        "What is middleware in Express?",
        "Explain JWT authentication",
        "What is Node.js?",
        "Explain Express.js framework",
        "What is MVC architecture?",
        "What is API rate limiting?",
        "Authentication vs Authorization?",
        "How do you handle backend errors?"
      ],

      Fullstack: [
        "Explain MERN stack",
        "How frontend communicates with backend?",
        "What is CORS?",
        "Steps to deploy a fullstack app",
        "What is REST API?",
        "How to connect React with Node.js?",
        "What are environment variables?",
        "Explain database schema design",
        "How do you secure a MERN application?",
        "Explain authentication in fullstack apps"
      ],

      HR: [
        "Tell me about yourself",
        "Why should we hire you?",
        "What are your strengths?",
        "What are your weaknesses?",
        "Where do you see yourself in 5 years?",
        "Tell me about a challenge you faced",
        "Why do you want to join our company?",
        "Describe a team project experience",
        "How do you handle pressure?",
        "What motivates you?"
      ],

      DSA: [
        "What is time complexity?",
        "Explain recursion",
        "Reverse a linked list",
        "Difference between BFS and DFS",
        "What is a stack?",
        "What is a queue?",
        "Explain binary search",
        "What is dynamic programming?",
        "Explain hash tables",
        "Difference between array and linked list"
      ]
    };

    const sessions = Object.keys(questions).map(role => ({
      title: `${role} Interview`,
      role,
      questions: questions[role].length,
      status: "Active"
    }));

    res.json(sessions);

  } catch (err) {

    res.status(500).json({ message: "Server error" });

  }

});

// ================= GENERATE QUESTIONS =================
router.post("/generate", protect, async (req, res) => {

  try {

    const { role, difficulty, questionCount } = req.body;

    const questions = {

      Frontend: [
        "What is React?",
        "Difference between state and props?",
        "Explain useEffect hook",
        "What is Virtual DOM?",
        "What are React hooks?",
        "Explain component lifecycle",
        "What is JSX?",
        "Controlled vs uncontrolled components?",
        "What is Redux and why use it?",
        "How do you optimize React performance?"
      ],

      Backend: [
        "What is REST API?",
        "Difference between SQL and NoSQL?",
        "What is middleware in Express?",
        "Explain JWT authentication",
        "What is Node.js?",
        "Explain Express.js framework",
        "What is MVC architecture?",
        "What is API rate limiting?",
        "Authentication vs Authorization?",
        "How do you handle backend errors?"
      ],

      Fullstack: [
        "Explain MERN stack",
        "How frontend communicates with backend?",
        "What is CORS?",
        "Steps to deploy a fullstack app",
        "What is REST API?",
        "How to connect React with Node.js?",
        "What are environment variables?",
        "Explain database schema design",
        "How do you secure a MERN application?",
        "Explain authentication in fullstack apps"
      ],

      HR: [
        "Tell me about yourself",
        "Why should we hire you?",
        "What are your strengths?",
        "What are your weaknesses?",
        "Where do you see yourself in 5 years?",
        "Tell me about a challenge you faced",
        "Why do you want to join our company?",
        "Describe a team project experience",
        "How do you handle pressure?",
        "What motivates you?"
      ],

      DSA: [
        "What is time complexity?",
        "Explain recursion",
        "Reverse a linked list",
        "Difference between BFS and DFS",
        "What is a stack?",
        "What is a queue?",
        "Explain binary search",
        "What is dynamic programming?",
        "Explain hash tables",
        "Difference between array and linked list"
      ]
    };

    const selectedQuestions = (questions[role] || [])
      .sort(() => 0.5 - Math.random())
      .slice(0, questionCount || 5);

    res.json({
      role,
      difficulty,
      totalQuestions: selectedQuestions.length,
      questions: selectedQuestions
    });

  } catch (error) {

    res.status(500).json({ message: "Failed to generate questions" });

  }

});

module.exports = router;








// const express = require("express");
// const router = express.Router();
// const protect = require("../middleware/authMiddleware");
// const Interview = require("../models/Interview");


// // ================= SAVE INTERVIEW =================
// router.post("/save", protect, async (req, res) => {
//   try {
//     const { role, difficulty, answers, score } = req.body;

//     const interview = new Interview({
//       user: req.user.id,
//       role,
//       difficulty,
//       answers,
//       score
//     });

//     await interview.save();

//     res.json({ message: "Interview saved successfully" });

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });


// // ================= GET USER INTERVIEWS =================
// router.get("/my", protect, async (req, res) => {
//   try {

//     const interviews = await Interview
//       .find({ user: req.user.id })
//       .sort({ createdAt: -1 });

//     res.json(interviews);

//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// });


// // ================= SUBMIT INTERVIEW =================
// router.post("/submit", protect, async (req, res) => {
//   try {

//     const { role, difficulty, answers } = req.body;

//     if (!answers || !Array.isArray(answers)) {
//       return res.status(400).json({ message: "Answers missing" });
//     }

//     let score = 0;

//     answers.forEach(ans => {

//       if (!ans || ans.trim() === "") {
//         score += 0;
//       }

//       else if (ans.trim().length >= 20) {
//         score += 5;
//       }

//       else {
//         score += 2;
//       }

//     });

//     const interview = await Interview.create({
//       user: req.user.id,
//       role,
//       difficulty,
//       answers,
//       score
//     });

//     res.json({
//       message: "Interview submitted successfully",
//       interview
//     });

//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Server error" });
//   }
// });


// // ================= GENERATE QUESTIONS =================
// router.post("/generate", protect, async (req, res) => {

//   try {

//     const { role, difficulty, questionCount } = req.body;

//     const questions = {

//       Frontend: [
//         "What is React?",
//         "Difference between state and props?",
//         "Explain useEffect hook",
//         "What is Virtual DOM?",
//         "What are React hooks?",
//         "Explain component lifecycle",
//         "What is JSX?",
//         "Controlled vs uncontrolled components?",
//         "What is Redux and why use it?",
//         "How do you optimize React performance?"
//       ],

//       Backend: [
//         "What is REST API?",
//         "Difference between SQL and NoSQL?",
//         "What is middleware in Express?",
//         "Explain JWT authentication",
//         "What is Node.js?",
//         "Explain Express.js framework",
//         "What is MVC architecture?",
//         "What is API rate limiting?",
//         "Authentication vs Authorization?",
//         "How do you handle backend errors?"
//       ],

//       Fullstack: [
//         "Explain MERN stack",
//         "How frontend communicates with backend?",
//         "What is CORS?",
//         "Steps to deploy a fullstack app",
//         "What is REST API?",
//         "How to connect React with Node.js?",
//         "What are environment variables?",
//         "Explain database schema design",
//         "How do you secure a MERN application?",
//         "Explain authentication in fullstack apps"
//       ],

//       HR: [
//         "Tell me about yourself",
//         "Why should we hire you?",
//         "What are your strengths?",
//         "What are your weaknesses?",
//         "Where do you see yourself in 5 years?",
//         "Tell me about a challenge you faced",
//         "Why do you want to join our company?",
//         "Describe a team project experience",
//         "How do you handle pressure?",
//         "What motivates you?"
//       ],

//       DSA: [
//         "What is time complexity?",
//         "Explain recursion",
//         "Reverse a linked list",
//         "Difference between BFS and DFS",
//         "What is a stack?",
//         "What is a queue?",
//         "Explain binary search",
//         "What is dynamic programming?",
//         "Explain hash tables",
//         "Difference between array and linked list"
//       ]
//     };

//     const selectedQuestions = (questions[role] || [])
//       .sort(() => 0.5 - Math.random())
//       .slice(0, questionCount || 5);

//     res.json({
//       role,
//       difficulty,
//       totalQuestions: selectedQuestions.length,
//       questions: selectedQuestions
//     });

//   } catch (error) {

//     res.status(500).json({ message: "Failed to generate questions" });

//   }

// });

// module.exports = router;








