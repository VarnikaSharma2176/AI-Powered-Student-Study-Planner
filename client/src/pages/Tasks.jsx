import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "../services/taskService";

const initialForm = {
  title: "",
  subject: "",
  description: "",
  deadline: "",
  estimatedHours: "",
  difficulty: "Medium",
  priority: "Medium",
  status: "Pending",
};

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  return date.toLocaleString();
}

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    subject: "",
  });

  const fetchTasks = async () => {
    try {
      setLoading(true);

      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.status) params.status = filters.status;
      if (filters.subject) params.subject = filters.subject;

      const data = await getTasks(params);
      setTasks(data);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search, filters.status, filters.subject]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.status === "Completed").length;
    const pending = tasks.filter((task) => task.status !== "Completed").length;

    return { total, completed, pending };
  }, [tasks]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...form,
        estimatedHours: form.estimatedHours ? Number(form.estimatedHours) : 1,
      };

      if (editingTaskId) {
        await updateTask(editingTaskId, payload);
        toast.success("Task updated successfully");
      } else {
        await createTask(payload);
        toast.success("Task created successfully");
      }

      setForm(initialForm);
      setEditingTaskId(null);
      await fetchTasks();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (task) => {
    setEditingTaskId(task._id);
    setForm({
      title: task.title || "",
      subject: task.subject || "",
      description: task.description || "",
      deadline: task.deadline ? task.deadline.slice(0, 16) : "",
      estimatedHours: task.estimatedHours ?? "",
      difficulty: task.difficulty || "Medium",
      priority: task.priority || "Medium",
      status: task.status || "Pending",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (taskId) => {
    const confirmDelete = window.confirm("Delete this task?");
    if (!confirmDelete) return;

    try {
      await deleteTask(taskId);
      toast.success("Task deleted successfully");
      await fetchTasks();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to delete task");
    }
  };

  const clearForm = () => {
    setForm(initialForm);
    setEditingTaskId(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-8">
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Task Management</p>
              <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
                Your Study Tasks
              </h1>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Create, update, and track study tasks synced with MongoDB.
              </p>
            </div>

            <div className="flex gap-3">
              <Link
                to="/dashboard"
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Dashboard
              </Link>

              <button
                onClick={clearForm}
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                New Task
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm text-slate-500 dark:text-slate-400">Total Tasks</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
              {stats.total}
            </h2>
          </div>
          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm text-slate-500 dark:text-slate-400">Completed</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
              {stats.completed}
            </h2>
          </div>
          <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm text-slate-500 dark:text-slate-400">Pending</p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
              {stats.pending}
            </h2>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                {editingTaskId ? "Edit Task" : "Add Task"}
              </h2>

              {editingTaskId && (
                <button
                  onClick={clearForm}
                  className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-300"
                >
                  Cancel edit
                </button>
              )}
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  placeholder="Task title"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  placeholder="Subject name"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  placeholder="Task description"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Deadline
                  </label>
                  <input
                    type="datetime-local"
                    name="deadline"
                    value={form.deadline}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Estimated Hours
                  </label>
                  <input
                    type="number"
                    name="estimatedHours"
                    value={form.estimatedHours}
                    onChange={handleChange}
                    min="1"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                    placeholder="1"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Difficulty
                  </label>
                  <select
                    name="difficulty"
                    value={form.difficulty}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={form.priority}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Status
                  </label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-2xl bg-indigo-600 px-4 py-3 font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {saving
                  ? "Saving..."
                  : editingTaskId
                  ? "Update Task"
                  : "Create Task"}
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Filters</h2>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search tasks"
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />

                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                >
                  <option value="">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>

                <input
                  type="text"
                  name="subject"
                  value={filters.subject}
                  onChange={handleFilterChange}
                  placeholder="Filter by subject"
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Task List</h2>
                <button
                  onClick={fetchTasks}
                  className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-300"
                >
                  Refresh
                </button>
              </div>

              <div className="mt-4 space-y-4">
                {loading ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400">Loading tasks...</p>
                ) : tasks.length === 0 ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400">No tasks found.</p>
                ) : (
                  tasks.map((task) => (
                    <div
                      key={task._id}
                      className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800"
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                            {task.title}
                          </h3>
                          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {task.subject} • {task.priority} • {task.difficulty}
                          </p>
                          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                            {task.description || "No description"}
                          </p>
                          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                            Deadline: {formatDate(task.deadline)}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                            {task.status}
                          </span>
                          <button
                            onClick={() => handleEdit(task)}
                            className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(task._id)}
                            className="rounded-full border border-rose-200 px-3 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-300 dark:hover:bg-rose-950"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}