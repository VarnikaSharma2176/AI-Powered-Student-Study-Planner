const DAY = 24 * 60 * 60 * 1000;

export const calculateNextRevisionDate = (
  revisionLevel = 0,
  confidence = "Medium"
) => {
  let interval = 1;

  if (revisionLevel === 0) interval = 1;
  else if (revisionLevel === 1) interval = 2;
  else if (revisionLevel === 2) interval = 4;
  else if (revisionLevel === 3) interval = 7;
  else if (revisionLevel === 4) interval = 14;
  else interval = 30;

  if (confidence === "Low") interval /= 2;

  if (confidence === "High") interval *= 1.5;

  const nextDate = new Date();

  nextDate.setTime(
    nextDate.getTime() + interval * DAY
  );

  return nextDate;
};

export const increaseConfidence = (
  confidence
) => {
  if (confidence === "Low") return "Medium";

  if (confidence === "Medium")
    return "High";

  return "High";
};

export const decreaseConfidence = (
  confidence
) => {
  if (confidence === "High")
    return "Medium";

  if (confidence === "Medium")
    return "Low";

  return "Low";
};

export const buildRevisionLog = ({
  userId,
  studyPlanId,
  session,
}) => {
  return {
    user: userId,

    studyPlan: studyPlanId,

    subject: session.subject,

    topic: session.title,

    confidence: session.confidence,

    revisionCount: 1,

    completedCount: 1,

    missedCount: 0,

    lastRevisionDate: new Date(),

    nextRevisionDate:
      calculateNextRevisionDate(
        session.revisionLevel,
        session.confidence
      ),

    status: "completed",

    remarks: "Automatically generated",
  };
};

export const buildRevisionSuggestion = (
  log
) => {
  return {
    topic: log.topic,

    subject: log.subject,

    confidence: log.confidence,

    revisionCount:
      log.revisionCount,

    nextRevisionDate:
      log.nextRevisionDate,

    priority:
      log.confidence === "Low"
        ? "High"
        : log.confidence === "Medium"
        ? "Medium"
        : "Low",

    message:
      log.confidence === "Low"
        ? "Immediate revision recommended."
        : log.confidence === "Medium"
        ? "Revise soon."
        : "Well retained. Light revision is enough.",
  };
};

export const shouldSuggestRevision = (
  log
) => {
  return (
    new Date(log.nextRevisionDate) <=
    new Date()
  );
};

export const updateRevisionAfterCompletion =
  (log) => {
    log.completedCount += 1;

    log.revisionCount += 1;

    log.confidence =
      increaseConfidence(
        log.confidence
      );

    log.lastRevisionDate =
      new Date();

    log.nextRevisionDate =
      calculateNextRevisionDate(
        log.revisionCount,
        log.confidence
      );

    return log;
  };

export const updateRevisionAfterMiss =
  (log) => {
    log.missedCount += 1;

    log.confidence =
      decreaseConfidence(
        log.confidence
      );

    log.nextRevisionDate =
      calculateNextRevisionDate(
        0,
        "Low"
      );

    return log;
  };