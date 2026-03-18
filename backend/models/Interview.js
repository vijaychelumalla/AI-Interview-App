
const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    role: {
      type: String,
      required: true
    },
    difficulty: {
      type: String,
      required: true
    },
    answers: {
      type: [String],
      required: true
    },
    questions: {
      type: [String],
      required: true
    },
    feedback: {
      type: [String],
      required: true
    },
    marks: {
      type: [Number],
      required: true
    },
    totalScore: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Interview", interviewSchema);




// const mongoose = require("mongoose");

// const interviewSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User"
//     },
//     role: String,
//     difficulty: String,
//     answers: [String],
//     score: Number
  
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Interview", interviewSchema);
