import StudyPlan from "../models/StudyPlan.js";
import StudySession from "../models/StudySession.js";
import RevisionLog from "../models/RevisionLog.js";

import { generateStudyPlan } from "../services/plannerService.js";

import {
  buildSessionsFromPlan,
  buildRescheduledSession,
  getNextRescheduledDate,
} from "../services/reschedulerService.js";

import {
  buildRevisionLog,
  buildRevisionSuggestion,
  shouldSuggestRevision,
  updateRevisionAfterCompletion,
  updateRevisionAfterMiss,
} from "../services/revisionService.js";

/*
|--------------------------------------------------------------------------
| Helper Functions
|--------------------------------------------------------------------------
*/

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
      .map((name) => ({
        name,
        weight: 1,
      }));
  }

  if (typeof syllabusText === "string" && syllabusText.trim()) {
    return syllabusText
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .map((name) => ({
        name,
        weight: 1,
      }));
  }

  return [];
};

const normalizeWeakTopics = (weakTopics) => {
  if (Array.isArray(weakTopics)) {
    return weakTopics
      .map((item) => String(item).trim())
      .filter(Boolean);
  }

  if (typeof weakTopics === "string" && weakTopics.trim()) {
    return weakTopics
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

/*
|--------------------------------------------------------------------------
| Create Study Plan
|--------------------------------------------------------------------------
*/

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
        message:
          "Title, exam date and daily study hours are required.",
      });
    }

    const parsedSubjects = normalizeSubjects(
      subjects,
      syllabusText
    );

    const parsedWeakTopics =
      normalizeWeakTopics(weakTopics);

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

    const sessionsPayload =
      buildSessionsFromPlan({
        userId: req.user._id,
        studyPlanId: savedPlan._id,
        plan: savedPlan.plan,
      });

    const sessions =
      sessionsPayload.length > 0
        ? await StudySession.insertMany(
            sessionsPayload
          )
        : [];

    res.status(201).json({
      message:
        "Study plan generated successfully",

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
/*
|--------------------------------------------------------------------------
| Get Latest Study Plan
|--------------------------------------------------------------------------
*/

export const getLatestPlan = async (req, res) => {
  try {
    const latestPlan = await StudyPlan.findOne({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    if (!latestPlan) {
      return res.status(404).json({
        message: "No study plan found.",
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

/*
|--------------------------------------------------------------------------
| Dashboard Insights
|--------------------------------------------------------------------------
*/

export const getInsights = async (req, res) => {
  try {
    const [plans, sessions, revisions] = await Promise.all([
      StudyPlan.find({
        user: req.user._id,
      }).sort({
        createdAt: -1,
      }),

      StudySession.find({
        user: req.user._id,
      }),

      RevisionLog.find({
        user: req.user._id,
      }),
    ]);

    const latestPlan = plans[0] || null;

    const completedSessions = sessions.filter(
      (session) => session.status === "completed"
    ).length;

    const pendingSessions = sessions.filter(
      (session) => session.status === "pending"
    ).length;

    const missedSessions = sessions.filter(
      (session) => session.status === "missed"
    ).length;

    const rescheduledSessions = sessions.filter(
      (session) => session.status === "rescheduled"
    ).length;

    const averageMemoryScore =
      revisions.length > 0
        ? Math.round(
            revisions.reduce(
              (sum, revision) =>
                sum + revision.memoryScore,
              0
            ) / revisions.length
          )
        : 0;

    const highPriorityTopics = revisions.filter(
      (revision) => revision.priority === "High"
    ).length;

    const revisionDue = revisions.filter(
      shouldSuggestRevision
    ).length;

    res.json({
      totalPlans: plans.length,

      totalSessions: sessions.length,

      completedSessions,

      pendingSessions,

      missedSessions,

      rescheduledSessions,

      totalRevisionTopics: revisions.length,

      revisionDue,

      averageMemoryScore,

      highPriorityTopics,

      latestExamDate:
        latestPlan?.examDate || null,

      latestTitle:
        latestPlan?.title || null,

      weakTopics:
        latestPlan?.weakTopics || [],

      recentPlans: plans
        .slice(0, 3)
        .map((plan) => ({
          id: plan._id,
          title: plan.title,
          examDate: plan.examDate,
          createdAt: plan.createdAt,
        })),

      recentRevisionTopics: revisions
        .slice(0, 5)
        .map((revision) => ({
          subject: revision.subject,
          focusArea: revision.focusArea,
          confidence: revision.confidence,
          priority: revision.priority,
          memoryScore: revision.memoryScore,
          nextRevisionDate:
            revision.nextRevisionDate,
        })),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
/*
|--------------------------------------------------------------------------
| Update Study Session Status
|--------------------------------------------------------------------------
*/

export const updateStudySessionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (
      !["pending", "completed", "missed", "rescheduled"].includes(status)
    ) {
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

    let revisionLog = await RevisionLog.findOne({
      user: req.user._id,
      studyPlan: session.studyPlan,
      subject: session.subject,
      focusArea: session.focus,
    });

    /*
    |--------------------------------------------------------------------------
    | Session Completed
    |--------------------------------------------------------------------------
    */

    if (status === "completed") {
      session.revisionCount += 1;

      session.revisionLevel += 1;

      if (!revisionLog) {
        revisionLog = await RevisionLog.create(
          buildRevisionLog({
            userId: req.user._id,
            studyPlanId: session.studyPlan,
            session,
          })
        );
      } else {
        updateRevisionAfterCompletion(revisionLog);
        await revisionLog.save();
      }

      session.confidence = revisionLog.confidence;

      session.nextRevisionDate =
        revisionLog.nextRevisionDate;
    }

    /*
    |--------------------------------------------------------------------------
    | Session Missed
    |--------------------------------------------------------------------------
    */

    if (status === "missed") {
      if (!revisionLog) {
        revisionLog = await RevisionLog.create({
          ...buildRevisionLog({
            userId: req.user._id,
            studyPlanId: session.studyPlan,
            session,
          }),

          confidence: "Low",

          priority: "High",

          memoryScore: 30,

          remarks:
            "Generated automatically after missed session.",
        });
      } else {
        updateRevisionAfterMiss(revisionLog);
        await revisionLog.save();
      }

      session.confidence = revisionLog.confidence;

      session.nextRevisionDate =
        revisionLog.nextRevisionDate;

      const existingReschedule =
        await StudySession.findOne({
          user: req.user._id,
          studyPlan: session.studyPlan,
          rescheduledFrom: session._id,
        });

      if (!existingReschedule) {
        const nextDate =
          getNextRescheduledDate(
            new Date(),
            1
          );

        session.rescheduledTo = nextDate;

        await StudySession.create(
          buildRescheduledSession({
            userId: req.user._id,
            studyPlanId:
              session.studyPlan,

            session,

            plannedDate:
              nextDate,

            order:
              session.order +
              1000,
          })
        );
      }
    }

    /*
    |--------------------------------------------------------------------------
    | Pending Reset
    |--------------------------------------------------------------------------
    */

    if (status === "pending") {
      session.rescheduledTo = null;
    }

    await session.save();

    res.json({
      message:
        "Study session updated successfully.",

      session,

      revisionLog,

      revisionSuggestion:
        revisionLog
          ? buildRevisionSuggestion(
              revisionLog
            )
          : null,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
/*
|--------------------------------------------------------------------------
| Replan Study Plan
|--------------------------------------------------------------------------
*/

export const replanStudyPlan = async (req, res) => {
  try {
    const latestPlan = await StudyPlan.findOne({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    if (!latestPlan) {
      return res.status(404).json({
        message: "No study plan found to replan.",
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

    for (let index = 0; index < missedSessions.length; index++) {
      const session = missedSessions[index];

      const alreadyExists =
        await StudySession.findOne({
          user: req.user._id,
          studyPlan: latestPlan._id,
          rescheduledFrom: session._id,
        });

      if (alreadyExists) {
        continue;
      }

      const nextDate =
        getNextRescheduledDate(
          new Date(),
          index + 1
        );

      session.rescheduledTo = nextDate;

      await session.save();

      const newSession =
        await StudySession.create(
          buildRescheduledSession({
            userId: req.user._id,

            studyPlanId:
              latestPlan._id,

            session,

            plannedDate:
              nextDate,

            order:
              session.order +
              1000 +
              index,
          })
        );

      createdReschedules.push(
        newSession
      );

      /*
      ------------------------------------------------------------
      Update Revision Memory
      ------------------------------------------------------------
      */

      let revisionLog =
        await RevisionLog.findOne({
          user: req.user._id,
          studyPlan:
            latestPlan._id,
          subject:
            session.subject,
          focusArea:
            session.focus,
        });

      if (revisionLog) {
        updateRevisionAfterMiss(
          revisionLog
        );

        await revisionLog.save();
      }
    }

    const sessions =
      await StudySession.find({
        user: req.user._id,
        studyPlan:
          latestPlan._id,
      }).sort({
        order: 1,
        plannedDate: 1,
      });

    const revisions =
      await RevisionLog.find({
        user: req.user._id,
        studyPlan:
          latestPlan._id,
      });

    const dueRevisionCount =
      revisions.filter(
        shouldSuggestRevision
      ).length;

    const highPriorityTopics =
      revisions.filter(
        (item) =>
          item.priority ===
          "High"
      ).length;

    res.json({
      message:
        "Study plan replanned successfully.",

      createdReschedules,

      sessions,

      plan:
        latestPlan.plan,

      planDoc:
        latestPlan,

      revisionSummary: {
        totalTopics:
          revisions.length,

        dueRevisionCount,

        highPriorityTopics,
      },
    });
  } catch (error) {
    res.status(500).json({
      message:
        error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get Revision Logs
|--------------------------------------------------------------------------
*/

export const getRevisionLogs = async (req, res) => {
  try {
    const revisionLogs = await RevisionLog.find({
      user: req.user._id,
    }).sort({
      nextRevisionDate: 1,
      priority: -1,
    });

    res.status(200).json({
      count: revisionLogs.length,
      revisionLogs,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get Revision Suggestions
|--------------------------------------------------------------------------
*/

export const getRevisionSuggestions = async (req, res) => {
  try {
    const revisionLogs = await RevisionLog.find({
      user: req.user._id,
    });

    const suggestions = revisionLogs
      .filter((log) => shouldSuggestRevision(log))
      .map((log) => buildRevisionSuggestion(log));

    res.status(200).json({
      count: suggestions.length,
      suggestions,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
/*
|--------------------------------------------------------------------------
| Mark Revision Complete
|--------------------------------------------------------------------------
*/

export const markRevisionComplete = async (req, res) => {
  try {
    const { id } = req.params;

    const revisionLog = await RevisionLog.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!revisionLog) {
      return res.status(404).json({
        message: "Revision log not found",
      });
    }

    updateRevisionAfterCompletion(revisionLog);

    revisionLog.status = "completed";

    revisionLog.lastRevisionDate = new Date();

    await revisionLog.save();

    const relatedSessions = await StudySession.find({
      user: req.user._id,
      studyPlan: revisionLog.studyPlan,
      subject: revisionLog.subject,
      focus: revisionLog.focusArea,
    }).sort({
      plannedDate: -1,
    });

    if (relatedSessions.length > 0) {
      const latestSession = relatedSessions[0];

      latestSession.confidence =
        revisionLog.confidence;

      latestSession.revisionCount =
        revisionLog.revisionCount;

      latestSession.revisionLevel += 1;

      latestSession.nextRevisionDate =
        revisionLog.nextRevisionDate;

      await latestSession.save();
    }

    const suggestion =
      buildRevisionSuggestion(
        revisionLog
      );

    res.json({
      message:
        "Revision marked as completed successfully.",

      revisionLog,

      suggestion,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| End of File
|--------------------------------------------------------------------------
*/