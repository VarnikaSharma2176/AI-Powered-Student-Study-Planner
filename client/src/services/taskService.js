import API from "./api";

export const getTasks = async (params = {}) => {
  const { data } = await API.get("/api/tasks", { params });
  return data;
};

export const createTask = async (taskData) => {
  const { data } = await API.post("/api/tasks", taskData);
  return data;
};

export const updateTask = async (taskId, taskData) => {
  const { data } = await API.put(`/api/tasks/${taskId}`, taskData);
  return data;
};

export const deleteTask = async (taskId) => {
  const { data } = await API.delete(`/api/tasks/${taskId}`);
  return data;
};