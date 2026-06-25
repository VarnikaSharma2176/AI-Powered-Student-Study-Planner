const DAY_IN_MS = 24 * 60 * 60 * 1000;

/*
|--------------------------------------------------------------------------
| Revision Interval Calculator (Spaced Repetition)
|--------------------------------------------------------------------------
*/

export const calculateRevisionInterval = (revisionCount = 1) => {
  switch (revisionCount) {
    case 1:
      return 1;

    case 2:
      return 2;

    case 3:
      return 4;

    case 4:
      return 7;

    case 5:
      return 14;

    default:
      return 30;
  }
};

/*
|--------------------------------------------------------------------------
| Next Revision Date
|--------------------------------------------------------------------------
*/

export const calculateNextRevisionDate = (
  revisionCount = 1,
  confidence = "Medium"
) => {
  let interval = calculateRevisionInterval(revisionCount);

  if (confidence === "Low") {
    interval = Math.max(1, Math.floor(interval / 2));
  }

  if (confidence === "High") {
    interval = Math.ceil(interval * 1.5);
  }

  const nextDate = new Date();

  nextDate.setHours(9, 0, 0, 0);

  nextDate.setTime(nextDate.getTime() + interval * DAY_IN_MS);

  return nextDate;
};

/*
|--------------------------------------------------------------------------
| Confidence Helpers
|--------------------------------------------------------------------------
*/

export const increaseConfidence = (confidence) => {
  if (confidence === "Low") return "Medium";

  if (confidence === "Medium") return "High";

  return "High";
};

export const decreaseConfidence = (confidence) => {
  if (confidence === "High") return "Medium";

  if (confidence === "Medium") return "Low";

  return "Low";
};

/*
|--------------------------------------------------------------------------
| Memory Score
|--------------------------------------------------------------------------
*/

export const increaseMemoryScore = (score = 50) => {
  return Math.min(100, score + 10);
};

export const decreaseMemoryScore = (score = 50) => {
  return Math.max(0, score - 15);
};

/*
|--------------------------------------------------------------------------
| Completion Rate
|--------------------------------------------------------------------------
*/

export const calculateCompletionRate = (
  completedCount = 0,
  missedCount = 0
) => {
  const total = completedCount + missedCount;

  if (total === 0) return 100;

  return Math.round((completedCount / total) * 100);
};

/*
|--------------------------------------------------------------------------
| Learning Trend
|--------------------------------------------------------------------------
*/

export const calculateLearningTrend = (
  memoryScore,
  completionRate
) => {
  if (memoryScore >= 75 && completionRate >= 80) {
    return "Improving";
  }

  if (memoryScore < 45 || completionRate < 50) {
    return "Declining";
  }

  return "Stable";
};

/*
|--------------------------------------------------------------------------
| Priority Calculator
|--------------------------------------------------------------------------
*/

export const calculatePriority = (
  confidence,
  memoryScore
) => {
  if (
    confidence === "Low" ||
    memoryScore < 45
  ) {
    return "High";
  }

  if (
    confidence === "Medium" ||
    memoryScore < 70
  ) {
    return "Medium";
  }

  return "Low";
};

/*
|--------------------------------------------------------------------------
| Tag Generator
|--------------------------------------------------------------------------
*/

export const generateTags = ({
  confidence,
  memoryScore,
  missedCount,
}) => {
  const tags = [];

  if (confidence === "Low") {
    tags.push("Weak");
  }

  if (memoryScore < 50) {
    tags.push("LowMemory");
  }

  if (missedCount >= 2) {
    tags.push("FrequentlyMissed");
  }

  if (confidence === "High") {
    tags.push("Strong");
  }

  tags.push("Revision");

  return [...new Set(tags)];
};

/*
|--------------------------------------------------------------------------
| AI Recommendation Generator
|--------------------------------------------------------------------------
*/

export const generateAIRecommendation = ({
  subject,
  focusArea,
  confidence,
  memoryScore,
  missedCount,
}) => {
  if (
    confidence === "Low" ||
    memoryScore < 40
  ) {
    return `Prioritize ${focusArea} in ${subject}. Schedule an immediate revision session and solve practice questions.`;
  }

  if (missedCount >= 2) {
    return `You have missed this topic multiple times. Allocate extra study time for ${focusArea}.`;
  }

  if (confidence === "Medium") {
    return `Revise ${focusArea} within the next few days to strengthen retention.`;
  }

  return `Your understanding of ${focusArea} is strong. Maintain it with light revision.`;
};

/*
|--------------------------------------------------------------------------
| Build New Revision Log
|--------------------------------------------------------------------------
*/

export const buildRevisionLog = ({
  userId,
  studyPlanId,
  session,
}) => {
  const revisionCount = 1;

  const completedCount = 1;

  const missedCount = 0;

  const memoryScore = 60;

  const completionRate = 100;

  const priority = calculatePriority(
    session.confidence,
    memoryScore
  );

  return {
    user: userId,

    studyPlan: studyPlanId,

    subject: session.subject,

    focusArea: session.focus,

    priority,

    confidence: session.confidence,

    memoryScore,

    revisionCount,

    completedCount,

    missedCount,

    completionRate,

    revisionInterval:
      calculateRevisionInterval(revisionCount),

    lastRevisionDate: new Date(),

    nextRevisionDate:
      calculateNextRevisionDate(
        revisionCount,
        session.confidence
      ),

    aiRecommendation:
      generateAIRecommendation({
        subject: session.subject,
        focusArea: session.focus,
        confidence: session.confidence,
        memoryScore,
        missedCount,
      }),

    tags: generateTags({
      confidence: session.confidence,
      memoryScore,
      missedCount,
    }),

    learningTrend: calculateLearningTrend(
      memoryScore,
      completionRate
    ),

    status: "completed",

    remarks:
      "Generated automatically after study session completion.",
  };
};

/*
|--------------------------------------------------------------------------
| Update After Completion
|--------------------------------------------------------------------------
*/

export const updateRevisionAfterCompletion = (
  log
) => {
  log.completedCount += 1;

  log.revisionCount += 1;

  log.confidence = increaseConfidence(
    log.confidence
  );

  log.memoryScore = increaseMemoryScore(
    log.memoryScore
  );

  log.completionRate =
    calculateCompletionRate(
      log.completedCount,
      log.missedCount
    );

  log.revisionInterval =
    calculateRevisionInterval(
      log.revisionCount
    );

  log.lastRevisionDate =
    new Date();

    log.status = "completed";
    
  log.nextRevisionDate =
    calculateNextRevisionDate(
      log.revisionCount,
      log.confidence
    );

  log.priority = calculatePriority(
    log.confidence,
    log.memoryScore
  );

  log.learningTrend =
    calculateLearningTrend(
      log.memoryScore,
      log.completionRate
    );

  log.tags = generateTags({
    confidence: log.confidence,
    memoryScore: log.memoryScore,
    missedCount: log.missedCount,
  });

  log.aiRecommendation =
    generateAIRecommendation({
      subject: log.subject,
      focusArea: log.focusArea,
      confidence: log.confidence,
      memoryScore: log.memoryScore,
      missedCount: log.missedCount,
    });

  return log;
};

/*
|--------------------------------------------------------------------------
| Update After Miss
|--------------------------------------------------------------------------
*/

export const updateRevisionAfterMiss = (
  log
) => {
  log.missedCount += 1;

  log.confidence = decreaseConfidence(
    log.confidence
  );

  log.memoryScore = decreaseMemoryScore(
    log.memoryScore
  );

  log.completionRate =
    calculateCompletionRate(
      log.completedCount,
      log.missedCount
    );

  log.revisionInterval = 1;

  log.nextRevisionDate =
    calculateNextRevisionDate(
      1,
      "Low"
    );

  log.priority = "High";

  log.learningTrend =
    calculateLearningTrend(
      log.memoryScore,
      log.completionRate
    );

  log.tags = generateTags({
    confidence: log.confidence,
    memoryScore: log.memoryScore,
    missedCount: log.missedCount,
  });

  log.aiRecommendation =
    generateAIRecommendation({
      subject: log.subject,
      focusArea: log.focusArea,
      confidence: log.confidence,
      memoryScore: log.memoryScore,
      missedCount: log.missedCount,
    });

  return log;
};

/*
|--------------------------------------------------------------------------
| Revision Suggestions
|--------------------------------------------------------------------------
*/

export const shouldSuggestRevision = (revisionLog) => {
  return (
    revisionLog.status !== "completed" &&
    new Date(revisionLog.nextRevisionDate) <= new Date()
  );
};

export const buildRevisionSuggestion = (
  revisionLog
) => {
  return {
    id: revisionLog._id,

    subject: revisionLog.subject,

    focusArea: revisionLog.focusArea,

    priority: revisionLog.priority,

    confidence: revisionLog.confidence,

    memoryScore: revisionLog.memoryScore,

    learningTrend:
      revisionLog.learningTrend,

    nextRevisionDate:
      revisionLog.nextRevisionDate,

    recommendation:
      revisionLog.aiRecommendation,

    tags: revisionLog.tags,
  };
};