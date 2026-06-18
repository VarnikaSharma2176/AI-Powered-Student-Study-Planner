import API from "./api";

export const getRevisionLogs = async () => {
  const response = await API.get("/api/agent/revisions");
  return response.data;
};

export const getRevisionSuggestions = async () => {
  const response = await API.get(
    "/api/agent/revisions/suggestions"
  );
  return response.data;
};

export const markRevisionComplete = async (id) => {
  const response = await API.patch(
    `/api/agent/revisions/${id}/complete`
  );

  return response.data;
};