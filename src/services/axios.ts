import axios from "axios";
import router from "../router";
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
instance.interceptors.request.use(
  async function (config) {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);
instance.interceptors.response.use(
  async function (res) {
    // await delay(1000);
    return res;
  },
  function (error) {
    // Do something with request error
    if (401 === error.response.status) {
      router.replace("/");
    }
    return Promise.reject(error);
  }
);

export default instance;