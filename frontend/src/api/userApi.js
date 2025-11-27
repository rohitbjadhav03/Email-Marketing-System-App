import axiosClient from "./axiosClient";

export const getUsers = () => axiosClient.get("/users");

export const updateUserRole = (id, role) =>
  axiosClient.patch(`/users/${id}/role`, { role });

export const deleteUser = (id) => axiosClient.delete(`/users/${id}`);
