import axiosClient from "./axiosClient";

export const login = (email, password) =>
  axiosClient.post("/auth/login", { email, password });

export const register = (email, password, role) =>
  axiosClient.post("/auth/register", { email, password, role });

export const getMe = () => axiosClient.get("/auth/me");
