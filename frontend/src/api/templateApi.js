import axiosClient from "./axiosClient";

export const createTemplate = (data) =>
  axiosClient.post("/templates", data);

export const getTemplates = () =>
  axiosClient.get("/templates");

export const updateTemplate = (id, data) =>
  axiosClient.put(`/templates/${id}`, data);

export const deleteTemplate = (id) =>
  axiosClient.delete(`/templates/${id}`);
