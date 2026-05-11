import { useMemo, useState } from "react";
import { Bell, BookOpen, CalendarDays, CheckCircle2, CircleAlert, Clock3, LayoutDashboard, ListTodo, Sparkles } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";

const sampleTasks = [
  { id: 1, title: "Revise DBMS normalization", subject: "DBMS", priority: "High", status: "Pending", deadline: "Today 8:00 PM" },
  { id: 2, title: "Practice aptitude quiz", subject: "Aptitude", priority: "Medium", status: "Completed", deadline: "Today 6:00 PM" },
  { id: 3, title: "Write OS notes", subject: "OS", priority: "High", status: "Pending", deadline: "Tomorrow 10:00 AM" },
];

function StatCard({ icon: Icon, label, value, note }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-soft border border-slate-100">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-900">{value}</h3>
          <p className="mt-2 text-sm text-slate-500">{note}</p>
        </div>
        <div className="rounded-xl bg-slate-100 p-3 text-slate-700">
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [tasks, setTasks] = useState(sampleTasks);

  const completed = useMemo(() => tasks.filter((t) => t.status === "Completed").length, [tasks]);
  const pending = useMemo(() => tasks.filter((t) => t.status === "Pending").length, [tasks]);
  const productivity = useMemo(() => Math.round((completed / tasks.length) * 100), [completed, tasks.length]);

  const markDone = (id) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, status: "Completed" } : task))
    );
    toast.success("Task marked as completed");
  };

  return (
    <div className="min-h-full bg-slate-50">
      <Toaster position="top-right" />

      <div className="flex min-h-screen">
        <aside className="hidden w-72 flex-col border-r border-slate-200 bg-white px-5 py-6 md:flex">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-indigo-600 p-3 text-white">
              <Sparkles size={20} />
            </div>
            <div>
              <h1 className="text-lg font-semibold">Study Planner AI</h1>
              <p className="text-sm text-slate-500">Productivity dashboard</p>
            </div>
          </div>

          <nav className="mt-10 space-y-2 text-sm">
            <a className="flex items-center gap-3 rounded-xl bg-indigo-50 px-4 py-3 font-medium text-indigo-700" href="#">
              <LayoutDashboard size={18} /> Dashboard
            </a>
            <a className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-600 hover:bg-slate-100" href="#">
              <ListTodo size={18} /> Tasks
            </a>
            <a className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-600 hover:bg-slate-100" href="#">
              <CalendarDays size={18} /> Planner
            </a>
            <a className="flex items-center gap-3 rounded-xl px-4 py-3 text-slate-600 hover:bg-slate-100" href="#">
              <Bell size={18} /> Reminders
            </a>
          </nav>

          <div className="mt-auto rounded-2xl bg-slate-900 p-5 text-white">
            <p className="text-sm text-slate-300">AI Study Tip</p>
            <p className="mt-2 text-sm leading-6">
              Complete the highest priority task first. Then move to revision tasks before starting new topics.
            </p>
          </div>
        </aside>

        <main className="flex-1 p-4 md:p-8">
          <header className="rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white shadow-soft">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm/6 text-indigo-100">Welcome back</p>
                <h2 className="mt-1 text-3xl font-semibold">Your AI Study Planner Dashboard</h2>
                <p className="mt-2 max-w-2xl text-sm text-indigo-100">
                  Track tasks, get smart recommendations, and keep your study plan organized in one place.
                </p>
              </div>
              <button
                onClick={() => toast("AI planner will be connected next")}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-medium text-indigo-700 transition hover:bg-indigo-50"
              >
                <Sparkles size={16} />
                Generate Plan
              </button>
            </div>
          </header>

          <section className="mt-6 grid gap-4 md:grid-cols-3">
            <StatCard icon={ListTodo} label="Total Tasks" value={tasks.length} note="Tasks currently in your planner" />
            <StatCard icon={CheckCircle2} label="Completed" value={completed} note="Tasks finished so far" />
            <StatCard icon={Clock3} label="Pending" value={pending} note="Tasks waiting in queue" />
          </section>

          <section className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
            <div className="rounded-2xl bg-white p-6 shadow-soft border border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Today’s Tasks</h3>
                  <p className="text-sm text-slate-500">Prioritized by urgency and difficulty</p>
                </div>
                <div className="rounded-xl bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
                  Productivity {productivity}%
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {tasks.map((task) => (
                  <div key={task.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h4 className="font-medium text-slate-900">{task.title}</h4>
                      <p className="mt-1 text-sm text-slate-500">
                        {task.subject} • {task.priority} Priority • {task.deadline}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${task.status === "Completed" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                        {task.status}
                      </span>
                      {task.status !== "Completed" && (
                        <button
                          onClick={() => markDone(task.id)}
                          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                        >
                          Mark Done
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl bg-white p-6 shadow-soft border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-violet-50 p-3 text-violet-700">
                    <BookOpen size={18} />
                  </div>
                  <div>
                    <h3 className="font-semibold">AI Recommendation</h3>
                    <p className="text-sm text-slate-500">Suggested next action</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  Start with <strong>OS notes</strong> because it is high priority and due tomorrow morning. After that, revise DBMS for 45 minutes.
                </p>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-soft border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-rose-50 p-3 text-rose-700">
                    <CircleAlert size={18} />
                  </div>
                  <div>
                    <h3 className="font-semibold">Upcoming Deadline</h3>
                    <p className="text-sm text-slate-500">Next due task</p>
                  </div>
                </div>
                <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                  <p className="font-medium text-slate-900">OS notes</p>
                  <p className="mt-1 text-sm text-slate-500">Tomorrow 10:00 AM</p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}