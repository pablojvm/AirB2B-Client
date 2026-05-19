import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_URL ||
  `${import.meta.env.VITE_SERVER_URL || "http://localhost:5005"}/api`;

const service = axios.create({
  baseURL,
  timeout: 20000,
});

// Adjuntamos el token automáticamente
service.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Si el token está caducado/inválido, lo limpiamos para que la UI fuerce login
service.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      const msg = error.response?.data?.errorMessage || "";
      if (/expirado|no válido|inválido|invalid/i.test(msg)) {
        localStorage.removeItem("authToken");
      }
    }
    return Promise.reject(error);
  }
);

export default service;
