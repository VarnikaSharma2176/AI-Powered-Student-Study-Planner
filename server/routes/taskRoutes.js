import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskStats,
} from "../controllers/taskController.js";

const router = express.Router();

router.get("/stats", protect, getTaskStats);
router.route("/").post(protect, createTask).get(protect, getTasks);

router
  .route("/:id")
  .get(protect, getTaskById)
  .put(protect, updateTask)
  .delete(protect, deleteTask);

export default router;