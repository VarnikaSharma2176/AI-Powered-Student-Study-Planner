import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-3xl bg-white p-6 shadow-soft border border-slate-100">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-slate-500">Welcome back</p>
              <h1 className="text-3xl font-semibold text-slate-900">
                {user?.name || "Student"} Dashboard
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Manage your study tasks, plans, and productivity.
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
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl bg-white p-5 shadow-soft border border-slate-100">
            <p className="text-sm text-slate-500">Total Tasks</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">0</h2>
          </div>
          <div className="rounded-3xl bg-white p-5 shadow-soft border border-slate-100">
            <p className="text-sm text-slate-500">Completed</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">0</h2>
          </div>
          <div className="rounded-3xl bg-white p-5 shadow-soft border border-slate-100">
            <p className="text-sm text-slate-500">Pending</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">0</h2>
          </div>
        </div>

        <div className="mt-6 rounded-3xl bg-white p-6 shadow-soft border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-900">Next step</h3>
          <p className="mt-2 text-sm text-slate-500">
            We will connect this dashboard to real backend task data next.
          </p>
        </div>
      </div>
    </div>
  );
}