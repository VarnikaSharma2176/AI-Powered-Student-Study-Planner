import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  BookOpen,
  LayoutDashboard,
  ListTodo,
  LogOut,
  Sparkles,
  Brain,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";

const navLinkClass = ({ isActive }) =>
  [
    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
    isActive
      ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
  ].join(" ");

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <aside className="fixed inset-y-0 left-0 hidden w-72 flex-col border-r border-slate-200 bg-white px-5 py-6 dark:border-slate-800 dark:bg-slate-900 md:flex">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-indigo-600 p-3 text-white">
            <Sparkles size={20} />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-white">
              StudyFlow AI Agent
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Adaptive study planning
            </p>
          </div>
        </div>

        <nav className="mt-10 space-y-2">
          <NavLink to="/dashboard" className={navLinkClass}>
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>

          <NavLink to="/tasks" className={navLinkClass}>
            <ListTodo size={18} />
            Tasks
          </NavLink>

          <NavLink to="/agent" className={navLinkClass}>
            <Brain size={18} />
            StudyFlow Agent
          </NavLink>
          <NavLink to="/revision" className={navLinkClass}>
            <RefreshCw size={18} />
            Revision Assistant
        </NavLink>
        </nav>

        <div className="mt-auto rounded-2xl bg-slate-900 p-5 text-white dark:bg-slate-800">
          <div className="flex items-center gap-3">
            <BookOpen size={18} />
            <p className="text-sm font-medium">Study Tip</p>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Focus on urgent tasks first, then split harder subjects into shorter sessions.
          </p>
        </div>
      </aside>

      <div className="md:pl-72">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
          <div className="flex items-center justify-between px-4 py-4 md:px-8">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Signed in as
              </p>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                {user?.name || "Student"}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>

          <div className="flex gap-2 border-t border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-950 md:hidden">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                [
                  "flex-1 rounded-2xl px-4 py-3 text-center text-sm font-medium transition",
                  isActive
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                    : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
                ].join(" ")
              }
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/tasks"
              className={({ isActive }) =>
                [
                  "flex-1 rounded-2xl px-4 py-3 text-center text-sm font-medium transition",
                  isActive
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                    : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
                ].join(" ")
              }
            >
              Tasks
            </NavLink>
          </div>
        </header>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}