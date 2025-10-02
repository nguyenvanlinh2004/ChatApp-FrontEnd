import axiosClient from "./axiosConfig";

export interface User {
  _id: string;
  username: string;
  email: string;
  avatar?: string;
}

const userApi = {
  login: (data: { email: string; password: string }) =>
    axiosClient.post<User>("/users/login", data),

  register: (data: { username: string; email: string; password: string }) =>
    axiosClient.post<User>("/users/register", data),

  me: (): Promise<User> => {
    return axiosClient.get<User>("/users/me") as unknown as Promise<User>;
  },

  update: (data: FormData): Promise<User> =>
    axiosClient
      .put<User>("/users/update", data, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data),

  all: () => axiosClient.get<User[]>("/users/all"),
};

export default userApi;
