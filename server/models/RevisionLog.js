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

    topic: {
      type: String,
      required: true,
      trim: true,
    },

    confidence: {
      type: String,
      enum: [
        "Low",
        "Medium",
        "High",
      ],
      default: "Medium",
    },

    revisionCount: {
      type: Number,
      default: 1,
    },

    missedCount: {
      type: Number,
      default: 0,
    },

    completedCount: {
      type: Number,
      default: 1,
    },

    lastRevisionDate: {
      type: Date,
      default: Date.now,
    },

    nextRevisionDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "completed",
      ],
      default: "pending",
    },

    remarks: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const RevisionLog = mongoose.model(
  "RevisionLog",
  revisionLogSchema
);

export default RevisionLog;