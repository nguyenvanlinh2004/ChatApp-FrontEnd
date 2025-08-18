import axiosClient from "./axiosConfig";

const userApi = {
  login: (data: { email: string; password: string }) =>
    axiosClient.post("/users/login", data),
  register: (data: { username: string; email: string; password: string }) =>
    axiosClient.post("/users/register", data),
  me: () => axiosClient.get("/users/me"),
  update: () => axiosClient.put("/users/update"),
  all: () => axiosClient.get("/users/all")
};

export default userApi;