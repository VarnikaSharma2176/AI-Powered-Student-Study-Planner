export const buildSessionsFromPlan = ({ userId, studyPlanId, plan }) => {
  const sessions = [];
  let order = 1;

  (plan.dayWisePlan || []).forEach((day) => {
    const plannedDate = new Date(day.date);

    (day.tasks || []).forEach((task) => {
      sessions.push({
        user: userId,
        studyPlan: studyPlanId,
        title: task.title,
        subject: task.subject,
        durationMinutes: task.durationMinutes,
        focus: task.focus || "Core study",
        sessionType: "study",
        plannedDate,
        originalDate: plannedDate,
        status: "pending",
        order,
        notes: day.note || "",
      });
      order += 1;
    });

    (day.revisionBlocks || []).forEach((block) => {
      sessions.push({
        user: userId,
        studyPlan: studyPlanId,
        title: `Revision: ${block.topic}`,
        subject: block.topic,
        durationMinutes: 30,
        focus: block.slot || "Revision",
        sessionType: "revision",
        plannedDate,
        originalDate: plannedDate,
        status: "pending",
        order,
        notes: "Revision block",
      });
      order += 1;
    });
  });

  return sessions;
};

export const getNextRescheduledDate = (baseDate = new Date(), offsetDays = 1) => {
  const nextDate = new Date(baseDate);
  nextDate.setDate(nextDate.getDate() + offsetDays);
  nextDate.setHours(9, 0, 0, 0);
  return nextDate;
};

export const buildRescheduledSession = ({
  userId,
  studyPlanId,
  session,
  plannedDate,
  order,
}) => {
  return {
    user: userId,
    studyPlan: studyPlanId,
    title: `${session.title} (Rescheduled)`,
    subject: session.subject,
    durationMinutes: session.durationMinutes,
    focus: session.focus,
    sessionType: session.sessionType || "study",
    plannedDate,
    originalDate: session.originalDate || session.plannedDate,
    status: "pending",
    rescheduledFrom: session._id,
    order,
    notes: `Rescheduled from missed session ${session._id}`,
  };
};