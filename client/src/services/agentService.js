import API from "./api";

export const generateStudyPlan = async (payload) => {
  const { data } = await API.post("/api/agent/plan", payload);
  return data;
};

export const getLatestStudyPlan = async () => {
  const { data } = await API.get("/api/agent/plan/latest");
  return data;
};

export const getAgentInsights = async () => {
  const { data } = await API.get("/api/agent/insights");
  return data;
};

export const updateStudySessionStatus = async (sessionId, status) => {
  const { data } = await API.patch(`/api/agent/session/${sessionId}`, {
    status,
  });
  return data;
};

export const replanStudyPlan = async () => {
  const { data } = await API.post("/api/agent/replan");
  return data;
};

export const chatWithAgent = async (prompt) => {
  const { data } = await API.post("/api/agent/chat", {
    prompt,
  });

  return data;
};