import { useEffect, useState } from "react";
import { CheckCircle, Brain, AlertTriangle } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  getRevisionLogs,
  getRevisionSuggestions,
  markRevisionComplete,
} from "../services/revisionService";

export default function RevisionAssistant() {
  const [logs, setLogs] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);

      const revisionLogs = await getRevisionLogs();
      const revisionSuggestions =
        await getRevisionSuggestions();

      setLogs(revisionLogs.revisionLogs || []);
      setSuggestions(
        revisionSuggestions.suggestions || []
      );
    } catch (error) {
      toast.error("Failed to load revision data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleComplete = async (id) => {
    try {
      await markRevisionComplete(id);

      toast.success("Revision completed");

      loadData();
    } catch (error) {
      toast.error("Unable to update revision");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl font-bold mb-2 dark:text-white">
          Revision Assistant
        </h1>

        <p className="text-slate-500 mb-8">
          AI-powered revision memory and adaptive learning.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-8">

          <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 shadow">

            <Brain size={30} />

            <h2 className="mt-4 text-lg font-semibold dark:text-white">
              Revision Topics
            </h2>

            <p className="text-4xl mt-3 font-bold dark:text-white">
              {logs.length}
            </p>

          </div>

          <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 shadow">

            <AlertTriangle size={30} />

            <h2 className="mt-4 text-lg font-semibold dark:text-white">
              Revision Due
            </h2>

            <p className="text-4xl mt-3 font-bold dark:text-white">
              {suggestions.length}
            </p>

          </div>

          <div className="rounded-3xl bg-white dark:bg-slate-900 p-6 shadow">

            <CheckCircle size={30} />

            <h2 className="mt-4 text-lg font-semibold dark:text-white">
              Completed
            </h2>

            <p className="text-4xl mt-3 font-bold dark:text-white">
              {
                logs.filter(
                  (item) =>
                    item.status === "completed"
                ).length
              }
            </p>

          </div>

        </div>

        <div className="rounded-3xl bg-white dark:bg-slate-900 shadow p-6">

          <h2 className="text-2xl font-semibold mb-6 dark:text-white">
            AI Revision Suggestions
          </h2>

          {loading ? (
            <p>Loading...</p>
          ) : suggestions.length === 0 ? (
            <p className="text-slate-500">
              No revision suggestions available.
            </p>
          ) : (
            <div className="space-y-4">

              {suggestions.map((item) => (

                <div
                  key={item.id}
                  className="rounded-2xl border p-5 dark:border-slate-700"
                >

                  <div className="flex justify-between">

                    <div>

                      <h3 className="font-semibold text-lg dark:text-white">
                        {item.subject}
                      </h3>

                      <p className="text-slate-500">
                        {item.focusArea}
                      </p>

                      <p className="mt-2">
                        Memory Score:
                        {" "}
                        {item.memoryScore}
                      </p>

                      <p>
                        Confidence:
                        {" "}
                        {item.confidence}
                      </p>

                      <p>
                        Priority:
                        {" "}
                        {item.priority}
                      </p>

                      <p className="mt-3 text-indigo-600">
                        {item.recommendation}
                      </p>

                    </div>

                    <button
                      onClick={() =>
                        handleComplete(item.id)
                      }
                      className="h-fit rounded-xl bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
                    >
                      Complete
                    </button>

                  </div>

                </div>

              ))}

            </div>
          )}

        </div>
                <div className="mt-8 rounded-3xl bg-white dark:bg-slate-900 shadow p-6">

          <h2 className="text-2xl font-semibold mb-6 dark:text-white">
            Revision History
          </h2>

          {logs.length === 0 ? (
            <p className="text-slate-500">
              No revision history available.
            </p>
          ) : (
            <div className="space-y-4">

              {logs.map((item) => (

                <div
                  key={item._id}
                  className="rounded-2xl border p-5 dark:border-slate-700"
                >

                  <h3 className="font-semibold text-lg dark:text-white">
                    {item.subject}
                  </h3>

                  <p className="text-slate-500">
                    {item.focusArea || "General Revision"}
                  </p>

                  <div className="mt-3 grid md:grid-cols-2 gap-3">

                    <p>
                      Memory Score: {item.memoryScore}
                    </p>

                    <p>
                      Confidence: {item.confidence}
                    </p>

                    <p>
                      Priority: {item.priority}
                    </p>

                    <p>
                      Status: {item.status}
                    </p>

                  </div>

                </div>

              ))}

            </div>
          )}

        </div>

      </div>

    </div>
  );
}