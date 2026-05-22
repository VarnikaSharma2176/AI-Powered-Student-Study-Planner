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