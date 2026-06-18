import express from "express";

import {
  createStudyPlan,
  getLatestPlan,
  getInsights,
  updateStudySessionStatus,
  replanStudyPlan,
  getRevisionLogs,
  getRevisionSuggestions,
  markRevisionComplete,
} from "../controllers/agentController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Study Plan Routes
|--------------------------------------------------------------------------
*/

// Generate a new study plan
router.post("/plan", protect, createStudyPlan);

// Get latest generated study plan
router.get("/latest", protect, getLatestPlan);

// Dashboard insights
router.get("/insights", protect, getInsights);

/*
|--------------------------------------------------------------------------
| Study Session Routes
|--------------------------------------------------------------------------
*/

// Update session status
router.patch(
  "/session/:id",
  protect,
  updateStudySessionStatus
);

// Replan study schedule
router.post(
  "/replan",
  protect,
  replanStudyPlan
);

/*
|--------------------------------------------------------------------------
| Revision Routes
|--------------------------------------------------------------------------
*/

// Get all revision logs
router.get(
  "/revisions",
  protect,
  getRevisionLogs
);

// Get revision suggestions
router.get(
  "/revisions/suggestions",
  protect,
  getRevisionSuggestions
);

// Mark revision as completed
router.patch(
  "/revisions/:id/complete",
  protect,
  markRevisionComplete
);

export default router;