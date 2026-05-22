const PRIORITY_SCORE = {
  Urgent: 4,
  High: 3,
  Medium: 2,
  Low: 1,
};

const buildDayLabel = (date) => {
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

export const generateStudyPlan = ({
  title,
  examDate,
  dailyStudyHours,
  subjects = [],
  weakTopics = [],
  syllabusText = "",
}) => {
  const today = new Date();
  const targetDate = new Date(examDate);

  const diffMs = targetDate.getTime() - today.getTime();
  const totalDays = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

  const subjectList =
    subjects.length > 0
      ? subjects
      : syllabusText
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
          .map((name) => ({ name, weight: 1 }));

  const normalizedSubjects = subjectList.map((subject) => ({
    name: subject.name.trim(),
    weight: Number(subject.weight || 1),
  }));

  const totalWeight = normalizedSubjects.reduce((sum, subject) => sum + subject.weight, 0) || 1;

  const weakTopicSet = new Set(
    weakTopics
      .map((topic) => topic.trim())
      .filter(Boolean)
  );

  const planDays = [];
  const startDate = new Date(today);

  for (let i = 0; i < totalDays; i += 1) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);

    const isRevisionDay = i % 3 === 2 || i >= totalDays - 3;

    const daySubjects = normalizedSubjects.map((subject) => {
      const subjectShare = subject.weight / totalWeight;
      const allocatedMinutes = Math.max(30, Math.round(dailyStudyHours * 60 * subjectShare));

      return {
        subject: subject.name,
        minutes: allocatedMinutes,
        focus: weakTopicSet.has(subject.name)
          ? "Weak topic focus"
          : isRevisionDay
          ? "Revision"
          : "Core study",
      };
    });

    const revisionBlocks = weakTopics.length
      ? weakTopics.slice(0, Math.min(3, weakTopics.length)).map((topic, index) => ({
          topic,
          slot: index === 0 ? "Quick recap" : "Spaced revision",
        }))
      : [];

    planDays.push({
      day: i + 1,
      date: currentDate.toISOString(),
      label: buildDayLabel(currentDate),
      studyHours: dailyStudyHours,
      tasks: daySubjects.map((item) => ({
        title: `${item.subject} - ${item.focus}`,
        subject: item.subject,
        durationMinutes: item.minutes,
        focus: item.focus,
      })),
      revisionBlocks,
      note: isRevisionDay
        ? "Revision-heavy day"
        : "Balanced study day",
    });
  }

  const subjectWisePlan = normalizedSubjects.map((subject) => ({
    subject: subject.name,
    weight: subject.weight,
    priority: subject.weight >= 3 ? "High" : subject.weight === 2 ? "Medium" : "Low",
  }));

  return {
    title,
    examDate: targetDate.toISOString(),
    dailyStudyHours,
    totalDays,
    subjectWisePlan,
    dayWisePlan: planDays,
    revisionSlots: weakTopics,
    workloadDistribution: normalizedSubjects.map((subject) => ({
      subject: subject.name,
      percentage: Math.round((subject.weight / totalWeight) * 100),
    })),
    summary: {
      totalDays,
      dailyStudyHours,
      weakTopicsCount: weakTopics.length,
      subjectCount: normalizedSubjects.length,
    },
  };
};