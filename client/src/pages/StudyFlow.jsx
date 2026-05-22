import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  generateStudyPlan,
  getLatestStudyPlan,
} from "../services/agentService";

const initialForm = {
  title: "",
  examDate: "",
  dailyStudyHours: 3,
  subjectsText: "",
  weakTopicsText: "",
  syllabusText: "",
};

export default function StudyFlow() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [latestPlan, setLatestPlan] = useState(null);

  useEffect(() => {
    const loadLatestPlan = async () => {
      try {
        const data = await getLatestStudyPlan();
        setLatestPlan(data.plan);
      } catch (error) {
        console.log("No latest plan found yet.");
      }
    };

    loadLatestPlan();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const subjects = form.subjectsText
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
        .map((name) => ({ name, weight: 1 }));

      const weakTopics = form.weakTopicsText
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      const data = await generateStudyPlan({
        title: form.title,
        examDate: form.examDate,
        dailyStudyHours: Number(form.dailyStudyHours),
        subjects,
        weakTopics,
        syllabusText: form.syllabusText,
      });

      toast.success("Study plan generated successfully");
      setLatestPlan(data.plan);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to generate plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-7xl p-4 md:p-8">
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-500 dark:text-slate-400">StudyFlow AI Agent</p>
          <h1 className="mt-1 text-3xl font-semibold text-slate-900 dark:text-white">
            Generate your adaptive study plan
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
            Enter your exam details, subjects, weak topics, and study hours. The agent will create a structured plan.
          </p>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Plan input
            </h2>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Exam name / title
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  placeholder="Example: DBMS Final Exam"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Exam date
                </label>
                <input
                  type="date"
                  name="examDate"
                  value={form.examDate}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Daily study hours
                </label>
                <input
                  type="number"
                  name="dailyStudyHours"
                  value={form.dailyStudyHours}
                  onChange={handleChange}
                  min="1"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Subjects
                </label>
                <input
                  type="text"
                  name="subjectsText"
                  value={form.subjectsText}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  placeholder="DBMS, Java, OS, DSA"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Weak topics
                </label>
                <input
                  type="text"
                  name="weakTopicsText"
                  value={form.weakTopicsText}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  placeholder="Normalization, Threads, Memory management"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Syllabus / notes
                </label>
                <textarea
                  name="syllabusText"
                  value={form.syllabusText}
                  onChange={handleChange}
                  rows="4"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  placeholder="Paste syllabus text or topic list here"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-indigo-600 px-4 py-3 font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Generating..." : "Generate Study Plan"}
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                Generated plan
              </h2>

              {!latestPlan ? (
                <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                  No study plan generated yet.
                </p>
              ) : (
                <div className="mt-4 space-y-4">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Title</p>
                    <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
                      {latestPlan.title}
                    </h3>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                      <p className="text-sm text-slate-500 dark:text-slate-400">Total Days</p>
                      <h4 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
                        {latestPlan.plan?.totalDays || "-"}
                      </h4>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                      <p className="text-sm text-slate-500 dark:text-slate-400">Daily Hours</p>
                      <h4 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
                        {latestPlan.plan?.dailyStudyHours || "-"}
                      </h4>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                      <p className="text-sm text-slate-500 dark:text-slate-400">Weak Topics</p>
                      <h4 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
                        {latestPlan.plan?.summary?.weakTopicsCount ?? 0}
                      </h4>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Subject-wise plan
                    </p>
                    <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                      {(latestPlan.plan?.subjectWisePlan || []).map((item, index) => (
                        <li key={index} className="flex items-center justify-between">
                          <span>{item.subject}</span>
                          <span>{item.priority}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Day-wise preview
                    </p>
                    <div className="mt-3 space-y-3">
                      {(latestPlan.plan?.dayWisePlan || []).slice(0, 3).map((day) => (
                        <div
                          key={day.day}
                          className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900"
                        >
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            Day {day.day} • {day.label}
                          </p>
                          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {day.note}
                          </p>
                          <ul className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-300">
                            {day.tasks.slice(0, 2).map((task, index) => (
                              <li key={index}>
                                {task.subject} — {task.focus} ({task.durationMinutes} min)
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}