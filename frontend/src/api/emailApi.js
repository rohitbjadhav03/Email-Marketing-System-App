import axiosClient from "./axiosClient";

export const sendEmail = (payload) =>
  axiosClient.post("/emails/send", payload);

// marketer: own logs
export const getMyLogs = () => axiosClient.get("/emails/logs");

// admin: all logs (same endpoint, backend filters by role)
export const getAllLogs = () => axiosClient.get("/emails/logs");
