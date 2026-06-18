import mongoose from "mongoose";

const revisionLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    studyPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudyPlan",
      required: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    focusArea: {
      type: String,
      required: true,
      trim: true,
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    confidence: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    memoryScore: {
      type: Number,
      default: 50,
      min: 0,
      max: 100,
    },

    learningTrend: {
    type: String,
    enum: ["Improving", "Stable", "Declining"],
    default: "Stable",
    },

    revisionCount: {
      type: Number,
      default: 1,
      min: 0,
    },

    completedCount: {
      type: Number,
      default: 1,
      min: 0,
    },

    missedCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    completionRate: {
      type: Number,
      default: 100,
      min: 0,
      max: 100,
    },

    revisionInterval: {
      type: Number,
      default: 1,
      min: 1,
    },

    lastRevisionDate: {
      type: Date,
      default: Date.now,
    },

    nextRevisionDate: {
      type: Date,
      required: true,
    },

    aiRecommendation: {
      type: String,
      default: "",
      trim: true,
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    status: {
      type: String,
      enum: ["pending", "completed", "overdue"],
      default: "pending",
    },

    remarks: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

/*
Example document

{
  subject: "DBMS",

  focusArea: "Normalization",

  priority: "High",

  confidence: "Low",

  memoryScore: 42,

  revisionCount: 4,

  completedCount: 3,

  missedCount: 1,

  completionRate: 75,

  revisionInterval: 7,

  lastRevisionDate: "...",

  nextRevisionDate: "...",

  aiRecommendation:
    "Revise Normalization before SQL Queries.",

  tags: [
    "Weak",
    "ExamSoon",
    "Revision"
  ],

  status: "pending"
}
*/

const RevisionLog = mongoose.model(
  "RevisionLog",
  revisionLogSchema
);

export default RevisionLog;