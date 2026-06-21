import {
  Brain,
  AlertTriangle,
  BookOpen,
  TrendingUp,
} from "lucide-react";

export default function AgentInsightCards({
  insights,
  loading,
}) {
  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-36 animate-pulse rounded-3xl bg-slate-200 dark:bg-slate-800"
          />
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Memory Score",
      value: `${insights?.averageMemoryScore ?? 0}%`,
      icon: Brain,
      description: "Average retention level",
    },
    {
      title: "Revision Due",
      value: insights?.revisionDue ?? 0,
      icon: AlertTriangle,
      description: "Topics needing revision",
    },
    {
      title: "Revision Topics",
      value: insights?.totalRevisionTopics ?? 0,
      icon: BookOpen,
      description: "Topics being tracked",
    },
    {
  title: "Learning Trend",
  value:
    (insights?.totalRevisionTopics ?? 0) === 0
      ? "Getting Started"
      : insights?.averageMemoryScore >= 75
      ? "Improving"
      : insights?.averageMemoryScore >= 50
      ? "Stable"
      : "Needs Focus",
  icon: TrendingUp,
  description: "Current learning progress",
},
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {card.title}
              </h3>

              <Icon
                size={22}
                className="text-indigo-600 dark:text-indigo-400"
              />
            </div>

            <h2 className="mt-5 text-3xl font-bold text-slate-900 dark:text-white">
              {card.value}
            </h2>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {card.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}