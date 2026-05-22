import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import { getTasks } from "../services/taskService";

const PIE_COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#06b6d4", "#a855f7"];

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function groupTasksByDate(tasks) {
  const map = new Map();

  tasks.forEach((task) => {
    const key = task.createdAt ? formatDate(task.createdAt) : "Unknown";
    map.set(key, (map.get(key) || 0) + 1);
  });

  return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
    completionRate: 0,
  });
  const [loading, setLoading] = useState(true);

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    navigate("/login");
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [tasksResponse, statsResponse, recommendationsResponse] = await Promise.all([
          getTasks(),
          API.get("/api/tasks/stats"),
          API.get("/api/recommendations"),
        ]);

        setTasks(tasksResponse);
        setStats(statsResponse.data);
        setRecommendations(recommendationsResponse.data);
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statusData = useMemo(() => {
    return [
      { name: "Completed", value: stats.completedTasks },
      { name: "Pending", value: stats.pendingTasks },
      { name: "Overdue", value: stats.overdueTasks },
    ];
  }, [stats]);

  const subjectData = useMemo(() => {
    const subjectMap = new Map();

    tasks.forEach((task) => {
      const subject = task.subject || "Unspecified";
      subjectMap.set(subject, (subjectMap.get(subject) || 0) + 1);
    });

    return Array.from(subjectMap.entries()).map(([name, value]) => ({
      name,
      value,
    }));
  }, [tasks]);

  const timelineData = useMemo(() => groupTasksByDate(tasks), [tasks]);

  const recentTasks = useMemo(() => {
    return [...tasks]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  }, [tasks]);

  const upcomingTasks = useMemo(() => {
    return [...tasks]
      .filter((task) => task.status !== "Completed")
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
      .slice(0, 3);
  }, [tasks]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-8">
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Welcome back</p>
              <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
                {user?.name || "Student"} Dashboard
              </h1>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Track tasks, productivity, and academic progress in one place.
              </p>
            </div>

            <div className="flex gap-3">
              <Link
                to="/tasks"
                className="rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white hover:bg-indigo-700"
              >
                Open Tasks
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm text-slate-500 dark:text-slate-400">Total Tasks</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
              {loading ? "..." : stats.totalTasks}
            </h2>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm text-slate-500 dark:text-slate-400">Completed</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
              {loading ? "..." : stats.completedTasks}
            </h2>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm text-slate-500 dark:text-slate-400">Pending</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
              {loading ? "..." : stats.pendingTasks}
            </h2>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm text-slate-500 dark:text-slate-400">Completion Rate</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
              {loading ? "..." : `${stats.completionRate}%`}
            </h2>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Task Status</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Completed, pending, and overdue task distribution
            </p>

            <div className="mt-6 h-72">
              {loading ? (
                <div className="flex h-full items-center justify-center text-sm text-slate-500 dark:text-slate-400">
                  Loading chart...
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={100}
                      innerRadius={55}
                      paddingAngle={4}
                    >
                      {statusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={PIE_COLORS[index % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Subject Breakdown</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Number of tasks per subject
            </p>

            <div className="mt-6 h-72">
              {loading ? (
                <div className="flex h-full items-center justify-center text-sm text-slate-500 dark:text-slate-400">
                  Loading chart...
                </div>
              ) : subjectData.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-slate-500 dark:text-slate-400">
                  No subject data yet.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={subjectData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Task Timeline</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Tasks created over time
            </p>

            <div className="mt-6 h-72">
              {loading ? (
                <div className="flex h-full items-center justify-center text-sm text-slate-500 dark:text-slate-400">
                  Loading chart...
                </div>
              ) : timelineData.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-slate-500 dark:text-slate-400">
                  No timeline data yet.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" strokeWidth={3} dot />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">AI Recommendations</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Smart suggestions based on deadline, priority, and difficulty
            </p>

            <div className="mt-6 space-y-4">
              {loading ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">Loading recommendations...</p>
              ) : recommendations.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">No recommendations yet.</p>
              ) : (
                recommendations.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800"
                  >
                    <h3 className="font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {item.taskTitle ? `${item.taskTitle} • ` : ""}
                      {item.subject || "General"}
                    </p>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.reason}</p>
                    <p className="mt-2 text-sm font-medium text-indigo-600 dark:text-indigo-300">
                      {item.action}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Upcoming Deadlines</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                The next tasks that need attention
              </p>
            </div>

            <Link
              to="/tasks"
              className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-300"
            >
              View all
            </Link>
          </div>

          <div className="mt-6 space-y-4">
            {loading ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">Loading upcoming tasks...</p>
            ) : upcomingTasks.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">No upcoming tasks.</p>
            ) : (
              upcomingTasks.map((task) => (
                <div
                  key={task._id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800"
                >
                  <h3 className="font-semibold text-slate-900 dark:text-white">{task.title}</h3>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {task.subject} • {task.priority} • {task.status}
                  </p>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    Deadline: {formatDate(task.deadline)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Recent Tasks</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Latest tasks from your planner
              </p>
            </div>

            <Link
              to="/tasks"
              className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-300"
            >
              View all
            </Link>
          </div>

          <div className="mt-6 space-y-4">
            {loading ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">Loading recent tasks...</p>
            ) : recentTasks.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">No tasks added yet.</p>
            ) : (
              recentTasks.map((task) => (
                <div
                  key={task._id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800"
                >
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">{task.title}</h3>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {task.subject} • {task.priority} • {task.status}
                      </p>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {formatDate(task.deadline)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}