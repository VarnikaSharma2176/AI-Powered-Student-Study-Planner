import mongoose from "mongoose";

const studyPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    examDate: {
      type: Date,
      required: true,
    },
    dailyStudyHours: {
      type: Number,
      required: true,
      min: 1,
    },
    subjects: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        weight: {
          type: Number,
          default: 1,
          min: 1,
        },
      },
    ],
    weakTopics: [
      {
        type: String,
        trim: true,
      },
    ],
    syllabusText: {
      type: String,
      default: "",
    },
    plan: {
      type: Object,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const StudyPlan = mongoose.model("StudyPlan", studyPlanSchema);

export default StudyPlan;