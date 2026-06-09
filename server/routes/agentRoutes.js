import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  createStudyPlan,
  getInsights,
  getLatestPlan,
  replanStudyPlan,
  updateStudySessionStatus,
} from "../controllers/agentController.js";

const router = express.Router();

router.post("/plan", protect, createStudyPlan);
router.get("/plan/latest", protect, getLatestPlan);
router.get("/insights", protect, getInsights);
router.post("/replan", protect, replanStudyPlan);
router.patch("/session/:id/status", protect, updateStudySessionStatus);

export default router;