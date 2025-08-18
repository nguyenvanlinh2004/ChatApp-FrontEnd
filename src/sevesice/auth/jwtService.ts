// import axios, { AxiosError, type AxiosResponse } from "axios";
// import { jwtDecode } from "jwt-decode";

// interface JwtDecodedToken {
//   exp: number;
// }

// interface User {
//   _id: string;
//   username: string;
//   email: string;
// }

// interface Conversation {
//   _id: string;
//   name?: string;
//   isGroup: boolean;
//   members: { _id: string; username: string }[];
//   lastMessage?: { text: string };
// }
// class jwtService{
//     private listeners: Record<string, Function[]> = {};

//   emit = (event: string, data?: any): void => {
//     if (this.listeners[event]) {
//       this.listeners[event].forEach((callback) => callback(data));
//     }
//   };

//   on = (event: string, callback: Function): void => {
//     if (!this.listeners[event]) {
//       this.listeners[event] = [];
//     }
//     this.listeners[event].push(callback);
//   };

//   off = (event: string, callback: Function): void => {
//     if (this.listeners[event]) {
//       this.listeners[event] = this.listeners[event].filter(
//         (cb) => cb !== callback
//       );
//     }
//   };

//   constructor() {
//     // super();
//     this.init();
//   }

//   init(): void {
//     this.setInterceptors();
//     this.handleAuthentication();
//   }

//   setInterceptors = (): void => {
//     axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

//     axios.interceptors.response.use(
//       (response: AxiosResponse) => response,
//       (error: AxiosError) => {
//         if (error.response?.status === 401) {
//           this.emit("onAutoLogout", "Invalid access_token");
//         } else if (error.response?.status === 500) {
//           this.emit("serverError", "Server Error");
//         } else if (error.response?.status === 400) {
//           this.emit("badRequest", "Bad Request");
//         }

//         return Promise.reject(error); // ✅ Phải có dòng này để lỗi đến được .catch()
//       }
//     );
//   };

//   setSession = (access_token: string | null): void => {
//     if (access_token) {
//       localStorage.setItem("jwt_access_token", access_token);
//       axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;
//     } else {
//       localStorage.removeItem("jwt_access_token");
//       delete axios.defaults.headers.common.Authorization;
//     }
//   };

//    handleAuthentication = (): void => {
//     const access_token = this.getToken();

//     if (!access_token) {
//       this.emit("onNoAccessToken");
//       return;
//     }

//     if (this.isAuthTokenValid(access_token)) {
//       this.setSession(access_token);
//       this.emit("onAutoLogin", true);
//     } else {
//       this.setSession(null);
//       console.log("Sign Out", access_token);
//       this.emit("onAutoLogout", "access_token expired");
//     }
//   };
//    isAuthTokenValid = (access_token: string): boolean => {
//     if (!access_token) {
//       return false;
//     }
//     const decoded = jwtDecode<JwtDecodedToken>(access_token);
//     const currentTime = Date.now() / 1000;
//     if (decoded?.exp < currentTime) {
//       console.warn("access token expired");
//       return false;
//     }
//     return true;
//   };

//   public getToken(): string | null {
//     return window.localStorage.getItem("jwt_access_token");
//   }
// }