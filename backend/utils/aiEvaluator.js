const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function evaluateAnswer(question, answer) {
  try {
    const prompt = `
You are a technical interviewer.

Question: ${question}

Candidate Answer: ${answer}

Evaluate the answer and return JSON:

{
 "score": number between 0 and 5,
 "feedback": "short feedback"
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: prompt }],
    });

    return JSON.parse(response.choices[0].message.content);

  } catch (err) {
    console.log(err);
    return { score: 0, feedback: "Evaluation failed" };
  }
}

module.exports = evaluateAnswer;