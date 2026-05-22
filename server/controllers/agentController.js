import StudyPlan from "../models/StudyPlan.js";
import { generateStudyPlan } from "../services/plannerService.js";

export const createStudyPlan = async (req, res) => {
  try {
    const {
      title,
      examDate,
      dailyStudyHours,
      subjects,
      weakTopics,
      syllabusText,
    } = req.body;

    if (!title || !examDate || !dailyStudyHours) {
      return res.status(400).json({
        message: "Title, exam date, and daily study hours are required",
      });
    }

    const parsedSubjects = Array.isArray(subjects)
      ? subjects
      : typeof subjects === "string" && subjects.trim()
      ? subjects
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
          .map((name) => ({ name, weight: 1 }))
      : [];

    const parsedWeakTopics = Array.isArray(weakTopics)
      ? weakTopics
      : typeof weakTopics === "string" && weakTopics.trim()
      ? weakTopics
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      : [];

    const plan = generateStudyPlan({
      title,
      examDate,
      dailyStudyHours: Number(dailyStudyHours),
      subjects: parsedSubjects,
      weakTopics: parsedWeakTopics,
      syllabusText: syllabusText || "",
    });

    const savedPlan = await StudyPlan.create({
      user: req.user._id,
      title,
      examDate,
      dailyStudyHours: Number(dailyStudyHours),
      subjects: parsedSubjects,
      weakTopics: parsedWeakTopics,
      syllabusText: syllabusText || "",
      plan,
    });

    res.status(201).json({
      message: "Study plan generated successfully",
      plan: savedPlan.plan,
      savedPlanId: savedPlan._id,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getLatestPlan = async (req, res) => {
  try {
    const latestPlan = await StudyPlan.findOne({ user: req.user._id }).sort({
      createdAt: -1,
    });

    if (!latestPlan) {
      return res.status(404).json({
        message: "No study plan found",
      });
    }

    res.json(latestPlan);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getInsights = async (req, res) => {
  try {
    const plans = await StudyPlan.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    const latestPlan = plans[0] || null;

    const insights = {
      totalPlans: plans.length,
      latestExamDate: latestPlan?.examDate || null,
      latestTitle: latestPlan?.title || null,
      weakTopics:
        latestPlan?.weakTopics?.length > 0 ? latestPlan.weakTopics : [],
      recentPlans: plans.slice(0, 3).map((plan) => ({
        id: plan._id,
        title: plan.title,
        examDate: plan.examDate,
        createdAt: plan.createdAt,
      })),
    };

    res.json(insights);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};