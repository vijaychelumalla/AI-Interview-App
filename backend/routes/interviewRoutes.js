const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const Interview = require("../models/Interview");
const { OpenAI } = require("openai");

const getGroqClient = () => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({
    apiKey,
    baseURL: "https://api.groq.com/openai/v1"
  });
};

const VALID_ROLES = ["Frontend", "Backend", "Fullstack", "HR", "DSA"];
const VALID_DIFFICULTIES = ["Easy", "Medium", "Hard"];

const QUESTION_BANK = {
  Frontend: [
    "What is React and how does the Virtual DOM work?",
    "What is the difference between state and props in React?",
    "Explain the purpose and dependency array behavior of the useEffect hook.",
    "What are controlled vs uncontrolled components in React?",
    "How does CSS Flexbox differ from CSS Grid, and when would you use each?",
    "Explain event delegation and event bubbling in JavaScript.",
    "What are React hooks, and what rules must be followed when using them?",
    "How do you optimize rendering performance in a large React application?",
    "Explain the difference between useMemo and useCallback.",
    "What is Redux or Zustand, and why is centralized state management needed?"
  ],
  Backend: [
    "What are the key constraints of a RESTful API architecture?",
    "Explain the difference between SQL and NoSQL databases with concrete trade-offs.",
    "What is middleware in Express.js and how does the request-response cycle work?",
    "Explain how JWT authentication works, including token generation, signing, and verification.",
    "What is the Node.js event loop and how does it achieve non-blocking I/O?",
    "How do you protect a backend API against SQL injection and NoSQL injection attacks?",
    "What is API rate limiting and how do you implement it in Express?",
    "Explain authentication vs authorization and how role-based access control (RBAC) works.",
    "How do database indexes improve query performance, and what are their drawbacks?",
    "How do you handle unhandled promise rejections and centralized error logging in Node.js?"
  ],
  Fullstack: [
    "Explain the end-to-end architecture of a modern MERN stack application.",
    "How does client-server communication work, and what role does CORS play?",
    "What security precautions should be taken when deploying a fullstack app to production?",
    "How do environment variables protect secrets across frontend and backend environments?",
    "Explain database schema design, normalization, and relational referencing in Mongoose.",
    "How do you handle file uploads and static asset storage in a web application?",
    "What is optimistic UI updating and how does it improve user experience?",
    "Explain the difference between client-side rendering (CSR) and server-side rendering (SSR).",
    "How do you prevent Cross-Site Scripting (XSS) and Cross-Site Request Forgery (CSRF)?",
    "Describe the complete CI/CD pipeline steps for building and deploying a web app."
  ],
  HR: [
    "Tell me about yourself, your technical background, and your key career milestones.",
    "Why are you interested in this position and what makes you a great fit for our company?",
    "What are your greatest professional strengths, and what is an area you are actively improving?",
    "Describe a challenging situation or project deadline you faced and how you navigated it.",
    "How do you handle disagreement or constructive criticism from teammates or managers?",
    "Tell me about a time you had to learn a completely new technology or tool on a tight deadline.",
    "Where do you envision yourself professionally in three to five years?",
    "Describe a successful collaborative project you contributed to and your specific role.",
    "How do you prioritize competing deadlines and manage work-related stress?",
    "What motivates and inspires you to do your best work on a day-to-day basis?"
  ],
  DSA: [
    "What is asymptotic time and space complexity, and how do you compute Big-O notation?",
    "Explain recursion, the call stack, and how to avoid stack overflow errors.",
    "How do you reverse a singly linked list in-place in O(n) time and O(1) space?",
    "What is the difference between Breadth-First Search (BFS) and Depth-First Search (DFS)?",
    "Explain how a hash map handles collisions and what the average vs worst-case lookup time is.",
    "What is dynamic programming, and how does memoization differ from tabulation?",
    "Explain the binary search algorithm, its prerequisites, and its time complexity.",
    "What is the difference between a stack (LIFO) and a queue (FIFO), and where are they used?",
    "How does quicksort or mergesort work, and what are their comparative trade-offs?",
    "Explain the properties of a Binary Search Tree (BST) and how searching works."
  ]
};

// ================= GET USER INTERVIEWS =================
router.get("/my", protect, async (req, res) => {
  try {
    const interviews = await Interview
      .find({ user: req.user.id })
      .sort({ createdAt: -1 });

    return res.json(interviews);
  } catch (error) {
    console.error("Fetch user interviews error:", error);
    return res.status(500).json({ message: "Server error fetching interviews" });
  }
});

// ================= GET INTERVIEW SESSIONS =================
router.get("/sessions", protect, async (req, res) => {
  try {
    const sessions = Object.keys(QUESTION_BANK).map(role => ({
      title: `${role} Interview`,
      role,
      questions: QUESTION_BANK[role].length,
      status: "Active"
    }));

    return res.json(sessions);
  } catch (err) {
    return res.status(500).json({ message: "Server error fetching sessions" });
  }
});

// ================= GENERATE QUESTIONS =================
router.post("/generate", protect, async (req, res) => {
  try {
    const { role, difficulty, questionCount } = req.body;

    if (!role || !VALID_ROLES.includes(role)) {
      return res.status(400).json({
        message: `Invalid role. Allowed roles: ${VALID_ROLES.join(", ")}`
      });
    }

    const diff = difficulty && VALID_DIFFICULTIES.includes(difficulty) ? difficulty : "Medium";
    const requestedCount = Math.min(Math.max(parseInt(questionCount, 10) || 5, 1), 10);

    const roleQuestions = [...(QUESTION_BANK[role] || [])];
    const shuffled = roleQuestions.sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, requestedCount);

    return res.json({
      role,
      difficulty: diff,
      totalQuestions: selectedQuestions.length,
      questions: selectedQuestions
    });
  } catch (error) {
    console.error("Generate error:", error);
    return res.status(500).json({ message: "Failed to generate questions" });
  }
});

// ================= SUBMIT INTERVIEW =================
router.post("/submit", protect, async (req, res) => {
  try {
    const { role, difficulty, answers, questions } = req.body;

    if (!role || !questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: "Questions array is required" });
    }

    if (!answers || !Array.isArray(answers) || answers.length !== questions.length) {
      return res.status(400).json({ message: "Answers count must match questions count" });
    }

    const groqClient = getGroqClient();
    if (!groqClient) {
      return res.status(503).json({
        message: "AI evaluation service unavailable: GROQ_API_KEY is not configured on the server."
      });
    }

    const prompt = `You are an expert technical interviewer evaluating a candidate for a ${role} position at ${difficulty || "Medium"} difficulty.
Evaluate each question and the candidate's answer carefully and objectively.
For each question:
- Assign a score (mark) from 0 to 5 (0 = completely incorrect/empty, 1-2 = poor/superficial, 3 = adequate/average, 4 = good, 5 = comprehensive/expert).
- Provide constructive feedback (1-3 sentences highlighting technical accuracy, key missing points, or concrete improvement tips).

Questions and Candidate Answers:
${questions.map((q, i) => `[Question ${i + 1}]: ${q}\n[Candidate Answer ${i + 1}]: ${answers[i] && answers[i].trim() ? answers[i].trim() : "No answer provided"}`).join("\n\n")}

CRITICAL INSTRUCTION: Return your evaluation strictly as a valid JSON array of objects.
[
  { "mark": 4, "feedback": "Accurate explanation of hooks and lifecycle. Could improve by mentioning cleanup functions." },
  ...
]
The array MUST contain exactly ${questions.length} items. Output only valid JSON.`;

    let chatCompletion;
    try {
      chatCompletion = await groqClient.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: process.env.GROQ_MODEL || "qwen/qwen3.8-27b",
        temperature: 0.1,
      });
    } catch (aiErr) {
      console.error("Groq API Call Error:", aiErr.message);
      return res.status(503).json({
        message: `AI Evaluation provider error: ${aiErr.message || "Failed to reach Groq API"}`
      });
    }

    const rawContent = chatCompletion.choices?.[0]?.message?.content?.trim() || "";
    if (!rawContent) {
      return res.status(502).json({ message: "Empty response received from AI evaluation provider" });
    }

    let evaluations;
    try {
      // Clean possible markdown code fences
      const cleaned = rawContent
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/, "")
        .replace(/\s*```$/, "")
        .trim();

      evaluations = JSON.parse(cleaned);
      if (!Array.isArray(evaluations) || evaluations.length !== questions.length) {
        throw new Error(`Evaluations array length (${evaluations?.length}) does not match question count (${questions.length})`);
      }
    } catch (parseErr) {
      console.error("Failed to parse AI evaluation JSON:", parseErr.message, "Raw content:", rawContent);
      return res.status(502).json({
        message: "Failed to parse evaluation response from AI provider. Please try again."
      });
    }

    const marks = [];
    const feedback = [];
    let totalScore = 0;

    evaluations.forEach((evalItem) => {
      let mark = Math.round(Number(evalItem.mark));
      if (isNaN(mark) || mark < 0) mark = 0;
      if (mark > 5) mark = 5;

      marks.push(mark);
      feedback.push(evalItem.feedback || "Evaluated without additional remarks.");
      totalScore += mark;
    });

    const interview = await Interview.create({
      user: req.user.id,
      role,
      difficulty: difficulty || "Medium",
      questions,
      answers,
      feedback,
      marks,
      totalScore
    });

    return res.status(201).json({
      message: "Interview evaluated and submitted successfully",
      interview
    });

  } catch (err) {
    console.error("Submit Error:", err);
    return res.status(500).json({ message: "Server error during interview submission" });
  }
});

module.exports = router;
