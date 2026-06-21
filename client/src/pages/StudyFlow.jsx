import ReactMarkdown from "react-markdown";
import { useEffect, useMemo, useState } from "react";
import { chatWithAgent } from "../services/agentService";
import { toast } from "react-hot-toast";
import {
  generateStudyPlan,
  getLatestStudyPlan,
  replanStudyPlan,
  updateStudySessionStatus,
} from "../services/agentService";

const initialForm = {
  title: "",
  examDate: "",
  dailyStudyHours: 3,
  subjectsText: "",
  weakTopicsText: "",
  syllabusText: "",
};

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function StudyFlow() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [planLoading, setPlanLoading] = useState(true);
  const [studyData, setStudyData] = useState({
    plan: null,
    planDoc: null,
    sessions: [],
  });

  const loadLatestPlan = async () => {
    try {
      setPlanLoading(true);
      const data = await getLatestStudyPlan();
      setStudyData({
        plan: data.plan || null,
        planDoc: data.planDoc || null,
        sessions: data.sessions || [],
      });
    } catch (error) {
      console.log("No latest plan found yet.");
      setStudyData({
        plan: null,
        planDoc: null,
        sessions: [],
      });
    } finally {
      setPlanLoading(false);
    }
  };

  useEffect(() => {
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
      setStudyData({
        plan: data.plan || null,
        planDoc: data.planDoc || null,
        sessions: data.sessions || [],
      });
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to generate plan");
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const sessions = studyData.sessions || [];
    return {
      total: sessions.length,
      completed: sessions.filter((session) => session.status === "completed").length,
      missed: sessions.filter((session) => session.status === "missed").length,
      pending: sessions.filter((session) => session.status === "pending").length,
    };
  }, [studyData.sessions]);

  const handleSessionStatusChange = async (sessionId, status) => {
    try {
      await updateStudySessionStatus(sessionId, status);
      toast.success(`Session marked as ${status}`);
      await loadLatestPlan();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to update session");
    }
  };

  const handleReplan = async () => {
    try {
      const data = await replanStudyPlan();
      toast.success("Plan recalculated successfully");
      setStudyData({
        plan: data.plan || studyData.plan,
        planDoc: data.planDoc || studyData.planDoc,
        sessions: data.sessions || [],
      });
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to recalculate plan");
    }
  };

  const plan = studyData.plan;
  const planDoc = studyData.planDoc;
  const sessions = studyData.sessions || [];
  const [prompt, setPrompt] = useState("");
const [messages, setMessages] = useState([]);
const [chatLoading, setChatLoading] = useState(false);
  const handleSend = async () => {
  if (!prompt.trim()) return;

  const userMessage = {
    role: "user",
    text: prompt,
  };

  setMessages((prev) => [...prev, userMessage]);
  setChatLoading(true);

  try {
    const res = await chatWithAgent(prompt);

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        text: res.response,
      },
    ]);
  } catch (err) {
    console.log(err);
    toast.error("Failed to get AI response");
  } finally {
    setPrompt("");
    setChatLoading(false);
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
            Enter your exam details, subjects, weak topics, and study hours. The agent will create a structured plan and sessions.
          </p>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
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
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Generated plan
                </h2>

                {plan && (
                  <button
                    onClick={handleReplan}
                    className="rounded-2xl border border-indigo-200 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50 dark:border-indigo-900 dark:text-indigo-300 dark:hover:bg-indigo-950"
                  >
                    Recalculate plan
                  </button>
                )}
              </div>

              {planLoading ? (
                <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                  Loading latest plan...
                </p>
              ) : !plan ? (
                <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                  No study plan generated yet.
                </p>
              ) : (
                <div className="mt-4 space-y-4">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Title</p>
                    <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
                      {planDoc?.title || plan.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      Exam date: {planDoc?.examDate ? formatDate(planDoc.examDate) : "-"}
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                      <p className="text-sm text-slate-500 dark:text-slate-400">Total Days</p>
                      <h4 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
                        {plan.totalDays || "-"}
                      </h4>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                      <p className="text-sm text-slate-500 dark:text-slate-400">Daily Hours</p>
                      <h4 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
                        {plan.dailyStudyHours || "-"}
                      </h4>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                      <p className="text-sm text-slate-500 dark:text-slate-400">Weak Topics</p>
                      <h4 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
                        {plan.summary?.weakTopicsCount ?? 0}
                      </h4>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Subject-wise plan
                    </p>
                    <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                      {(plan.subjectWisePlan || []).map((item, index) => (
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
                      {(plan.dayWisePlan || []).slice(0, 3).map((day) => (
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

            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                Study sessions
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Mark sessions completed or missed. Missed sessions will be rescheduled.
              </p>

              <div className="mt-4 grid gap-4 md:grid-cols-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Total</p>
                  <h4 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
                    {stats.total}
                  </h4>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Completed</p>
                  <h4 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
                    {stats.completed}
                  </h4>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Pending</p>
                  <h4 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
                    {stats.pending}
                  </h4>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Missed</p>
                  <h4 className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">
                    {stats.missed}
                  </h4>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {!sessions.length ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    No sessions available yet.
                  </p>
                ) : (
                  sessions.map((session) => (
                    <div
                      key={session._id}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800"
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white">
                            {session.title}
                          </h3>
                          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            {session.subject} • {session.focus} • {session.durationMinutes} min
                          </p>
                          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Planned: {formatDate(session.plannedDate)}
                          </p>
                          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Status: {session.status}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleSessionStatusChange(session._id, "completed")}
                            className="rounded-full border border-emerald-200 px-3 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-50 dark:border-emerald-900 dark:text-emerald-300 dark:hover:bg-emerald-950"
                          >
                            Completed
                          </button>
                          <button
                            onClick={() => handleSessionStatusChange(session._id, "missed")}
                            className="rounded-full border border-amber-200 px-3 py-1 text-xs font-medium text-amber-700 hover:bg-amber-50 dark:border-amber-900 dark:text-amber-300 dark:hover:bg-amber-950"
                          >
                            Missed
                          </button>
                          <button
                            onClick={() => handleSessionStatusChange(session._id, "pending")}
                            className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"
                          >
                            Reset
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
        <div className="mt-8 rounded-3xl border border-slate-100 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
    StudyFlow AI Assistant
  </h2>

  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
    Ask anything about your studies, revision, timetable or exam preparation.
  </p>

  <div className="mt-6 h-64 overflow-y-auto space-y-4 rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
    {messages.map((message, index) => (
      <div
        key={index}
        className={
          message.role === "user"
            ? "ml-auto max-w-[75%] rounded-2xl bg-indigo-600 p-4 text-white whitespace-pre-wrap"
            : "max-w-[75%] rounded-2xl bg-slate-100 p-4 dark:bg-slate-800 whitespace-pre-wrap"
        }
      >
        <ReactMarkdown>
        {message.text}
        </ReactMarkdown>
      </div>
    ))}

    {chatLoading && (
      <div className="rounded-2xl bg-slate-100 p-4 dark:bg-slate-800">
        Thinking...
      </div>
    )}
  </div>

  <div className="mt-6 flex gap-3">
    <input
      value={prompt}
      onChange={(e) => setPrompt(e.target.value)}
      placeholder="Ask StudyFlow AI anything..."
      className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-700 dark:bg-slate-900"
    />

    <button
      onClick={handleSend}
      className="rounded-2xl bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700"
    >
      Send
    </button>
  </div>
</div>
      </div>
    </div>
  );
}