import Task from "../models/Task.js";

const getRecommendations = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id });

    const now = new Date();

    const priorityScore = {
      Urgent: 4,
      High: 3,
      Medium: 2,
      Low: 1,
    };

    const difficultyScore = {
      High: 3,
      Medium: 2,
      Low: 1,
    };

    const recommendations = tasks
      .filter((task) => task.status !== "Completed")
      .map((task) => {
        const deadline = new Date(task.deadline);
        const daysLeft = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));

        let score = 0;
        score += (priorityScore[task.priority] || 1) * 25;
        score += (difficultyScore[task.difficulty] || 1) * 10;

        if (daysLeft < 0) {
          score += 60;
        } else if (daysLeft === 0) {
          score += 50;
        } else if (daysLeft <= 2) {
          score += 35;
        } else if (daysLeft <= 5) {
          score += 20;
        }

        if (task.status === "In Progress") {
          score += 10;
        }

        let title = "Continue working on this task";
        let reason = "This task is still pending and needs attention.";
        let action = "Study this task today for 45–60 minutes.";

        if (daysLeft < 0) {
          title = "Overdue task detected";
          reason = "This task has already passed its deadline.";
          action = "Complete this task immediately or reschedule it.";
        } else if (daysLeft === 0) {
          title = "Due today";
          reason = "This task is due today and should be prioritized.";
          action = "Start this task as your first study block.";
        } else if (daysLeft <= 2) {
          title = "High priority task";
          reason = "This task is due very soon.";
          action = "Focus on it before starting lower priority work.";
        } else if (task.difficulty === "High") {
          title = "Difficult subject recommendation";
          reason = "This task is marked high difficulty.";
          action = "Break it into smaller study sessions.";
        }

        return {
          id: task._id,
          taskTitle: task.title,
          subject: task.subject,
          deadline: task.deadline,
          priority: task.priority,
          difficulty: task.difficulty,
          status: task.status,
          score,
          title,
          reason,
          action,
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    if (recommendations.length === 0) {
      return res.json([
        {
          id: "no-tasks",
          title: "All tasks completed",
          reason: "You currently have no pending tasks.",
          action: "Add a new task to get personalized recommendations.",
          score: 0,
        },
      ]);
    }

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export { getRecommendations };