import axios, { AxiosError } from "axios";

const API_KEY = import.meta.env.VITE_GIPHY_API_KEY;
const BASE_URL = import.meta.env.VITE_GIPHY_BASE_URL;

// Error con mensaje listo para mostrar en pantalla
export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export const giphyApi = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { Accept: "application/json" },
});

// Antes de cada petición: agrega la API key
giphyApi.interceptors.request.use(
  (config) => {
    if (!API_KEY) {
      return Promise.reject(
        new ApiError("Falta VITE_GIPHY_API_KEY en el archivo .env"),
      );
    }
    config.params = { ...config.params, api_key: API_KEY };
    return config;
  },
  (error) => Promise.reject(error),
);

// Al recibir la respuesta: errores globales con mensajes claros
giphyApi.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; meta?: { msg?: string } }>) => {
    // Una petición cancelada NO es un error para el usuario
    if (axios.isCancel(error)) return Promise.reject(error);

    if (error.code === "ECONNABORTED") {
      return Promise.reject(new ApiError("La petición tardó demasiado"));
    }

    // No hubo respuesta: sin internet, DNS o CORS
    if (!error.response) {
      return Promise.reject(
        new ApiError("Sin conexión o el servidor no responde"),
      );
    }

    const status = error.response.status;
    const detail =
      error.response.data?.message ?? error.response.data?.meta?.msg;

    if (status === 401 || status === 403) {
      return Promise.reject(
        new ApiError("API key inválida o sin permisos", status),
      );
    }
    if (status === 429) {
      return Promise.reject(
        new ApiError("Demasiadas peticiones, espera un momento", status),
      );
    }
    if (status >= 500) {
      return Promise.reject(
        new ApiError("GIPHY tuvo un problema, intenta más tarde", status),
      );
    }

    return Promise.reject(new ApiError(detail ?? `Error HTTP ${status}`, status));
  },
);
