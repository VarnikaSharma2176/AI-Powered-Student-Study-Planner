import StudyPlan from "../models/StudyPlan.js";
import StudySession from "../models/StudySession.js";
import { generateStudyPlan } from "../services/plannerService.js";
import {
  buildRescheduledSession,
  buildSessionsFromPlan,
  getNextRescheduledDate,
} from "../services/reschedulerService.js";

const normalizeSubjects = (subjects, syllabusText) => {
  if (Array.isArray(subjects)) {
    return subjects
      .filter((item) => item && item.name)
      .map((item) => ({
        name: String(item.name).trim(),
        weight: Number(item.weight || 1),
      }));
  }

  if (typeof subjects === "string" && subjects.trim()) {
    return subjects
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .map((name) => ({ name, weight: 1 }));
  }

  if (typeof syllabusText === "string" && syllabusText.trim()) {
    return syllabusText
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .map((name) => ({ name, weight: 1 }));
  }

  return [];
};

const normalizeWeakTopics = (weakTopics) => {
  if (Array.isArray(weakTopics)) {
    return weakTopics.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof weakTopics === "string" && weakTopics.trim()) {
    return weakTopics
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

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

    const parsedSubjects = normalizeSubjects(subjects, syllabusText);
    const parsedWeakTopics = normalizeWeakTopics(weakTopics);

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

    const sessionsPayload = buildSessionsFromPlan({
      userId: req.user._id,
      studyPlanId: savedPlan._id,
      plan: savedPlan.plan,
    });

    const sessions = sessionsPayload.length
      ? await StudySession.insertMany(sessionsPayload)
      : [];

    res.status(201).json({
      message: "Study plan generated successfully",
      plan: savedPlan.plan,
      planDoc: savedPlan,
      sessions,
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

    const sessions = await StudySession.find({
      user: req.user._id,
      studyPlan: latestPlan._id,
    }).sort({
      order: 1,
      plannedDate: 1,
    });

    res.json({
      plan: latestPlan.plan,
      planDoc: latestPlan,
      sessions,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getInsights = async (req, res) => {
  try {
    const [plans, sessions] = await Promise.all([
      StudyPlan.find({ user: req.user._id }).sort({ createdAt: -1 }),
      StudySession.find({ user: req.user._id }).sort({ createdAt: -1 }),
    ]);

    const latestPlan = plans[0] || null;

    const completedSessions = sessions.filter(
      (session) => session.status === "completed"
    ).length;

    const missedSessions = sessions.filter(
      (session) => session.status === "missed"
    ).length;

    const rescheduledSessions = sessions.filter(
      (session) => session.status === "rescheduled"
    ).length;

    res.json({
      totalPlans: plans.length,
      totalSessions: sessions.length,
      completedSessions,
      missedSessions,
      rescheduledSessions,
      latestExamDate: latestPlan?.examDate || null,
      latestTitle: latestPlan?.title || null,
      weakTopics: latestPlan?.weakTopics?.length > 0 ? latestPlan.weakTopics : [],
      recentPlans: plans.slice(0, 3).map((plan) => ({
        id: plan._id,
        title: plan.title,
        examDate: plan.examDate,
        createdAt: plan.createdAt,
      })),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateStudySessionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "completed", "missed", "rescheduled"].includes(status)) {
      return res.status(400).json({
        message: "Invalid session status",
      });
    }

    const session = await StudySession.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!session) {
      return res.status(404).json({
        message: "Study session not found",
      });
    }

    session.status = status;
    await session.save();

    let rescheduledSession = null;

    if (status === "missed") {
      const existingReschedule = await StudySession.findOne({
        user: req.user._id,
        studyPlan: session.studyPlan,
        rescheduledFrom: session._id,
      });

      if (!existingReschedule) {
        const rescheduleCount = await StudySession.countDocuments({
          user: req.user._id,
          studyPlan: session.studyPlan,
          rescheduledFrom: session._id,
        });

        const nextDate = getNextRescheduledDate(new Date(), rescheduleCount + 1);

        session.rescheduledTo = nextDate;
        await session.save();

        rescheduledSession = await StudySession.create(
          buildRescheduledSession({
            userId: req.user._id,
            studyPlanId: session.studyPlan,
            session,
            plannedDate: nextDate,
            order: session.order + 1000,
          })
        );
      }
    }

    res.json({
      message: "Session status updated successfully",
      session,
      rescheduledSession,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const replanStudyPlan = async (req, res) => {
  try {
    const latestPlan = await StudyPlan.findOne({ user: req.user._id }).sort({
      createdAt: -1,
    });

    if (!latestPlan) {
      return res.status(404).json({
        message: "No study plan found to replan",
      });
    }

    const missedSessions = await StudySession.find({
      user: req.user._id,
      studyPlan: latestPlan._id,
      status: "missed",
    }).sort({
      order: 1,
      plannedDate: 1,
    });

    const createdReschedules = [];

    for (let index = 0; index < missedSessions.length; index += 1) {
      const session = missedSessions[index];

      const alreadyRescheduled = await StudySession.findOne({
        user: req.user._id,
        studyPlan: latestPlan._id,
        rescheduledFrom: session._id,
      });

      if (alreadyRescheduled) {
        continue;
      }

      const nextDate = getNextRescheduledDate(new Date(), index + 1);

      session.rescheduledTo = nextDate;
      await session.save();

      const rescheduled = await StudySession.create(
        buildRescheduledSession({
          userId: req.user._id,
          studyPlanId: latestPlan._id,
          session,
          plannedDate: nextDate,
          order: session.order + 1000 + index,
        })
      );

      createdReschedules.push(rescheduled);
    }

    const sessions = await StudySession.find({
      user: req.user._id,
      studyPlan: latestPlan._id,
    }).sort({
      order: 1,
      plannedDate: 1,
    });

    res.json({
      message: "Study plan recalculated successfully",
      createdReschedules,
      sessions,
      plan: latestPlan.plan,
      planDoc: latestPlan,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};