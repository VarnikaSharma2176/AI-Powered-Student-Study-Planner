import mongoose from "mongoose";

const studySessionSchema = new mongoose.Schema(
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
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    durationMinutes: {
      type: Number,
      required: true,
      min: 15,
    },
    focus: {
      type: String,
      default: "Core study",
      trim: true,
    },
    sessionType: {
      type: String,
      enum: ["study", "revision"],
      default: "study",
    },
    plannedDate: {
      type: Date,
      required: true,
    },
    originalDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "missed", "rescheduled"],
      default: "pending",
    },
    rescheduledFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudySession",
      default: null,
    },
    rescheduledTo: {
      type: Date,
      default: null,
    },
    order: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const StudySession = mongoose.model("StudySession", studySessionSchema);

export default StudySession;