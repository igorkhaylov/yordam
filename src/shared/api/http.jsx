import axios from "axios";

// Публичный префикс, который будет в браузере: /api/...
const API_BASE_RAW = import.meta.env.VITE_API_BASE || "/api";
const API_BASE = API_BASE_RAW.replace(/\/+$/, "");

export const AUTH_USER_KEY = "psyuz_auth_user";
export const AUTH_TOKENS_KEY = "psyuz_auth_tokens";

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 20000,
  headers: {
    "Content-Type": "application/json",
  },
});

function getStoredTokens() {
  try {
    const raw = localStorage.getItem(AUTH_TOKENS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error("Failed to parse stored tokens", error);
    return null;
  }
}

function setStoredTokens(tokens) {
  try {
    if (tokens) {
      localStorage.setItem(AUTH_TOKENS_KEY, JSON.stringify(tokens));
    } else {
      localStorage.removeItem(AUTH_TOKENS_KEY);
    }
  } catch (error) {
    console.error("Failed to save tokens", error);
  }
}

function clearStoredAuth() {
  try {
    localStorage.removeItem(AUTH_TOKENS_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  } catch (error) {
    console.error("Failed to clear auth storage", error);
  }
}

function getRefreshUrl(originalUrl = "") {
  const match = originalUrl.match(/^\/(ru|uz|en)(\/api\/v1.*)?$/);
  const langPrefix = match?.[1] ? `/${match[1]}` : "/ru";
  return `${langPrefix}/api/v1/users/sessions/refresh/`;
}

let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(callback) {
  refreshSubscribers.push(callback);
}

function onRefreshed(newAccessToken) {
  refreshSubscribers.forEach((callback) => callback(newAccessToken));
  refreshSubscribers = [];
}

function onRefreshFailed() {
  refreshSubscribers.forEach((callback) => callback(null));
  refreshSubscribers = [];
}

async function refreshAccessToken(originalRequest) {
  const storedTokens = getStoredTokens();

  if (!storedTokens?.refresh) {
    throw new Error("No refresh token");
  }

  const refreshUrl = getRefreshUrl(originalRequest?.url);

  const response = await axios.post(
    `${API_BASE}${refreshUrl}`,
    {
      refresh: storedTokens.refresh,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data = response.data || {};

  const nextTokens = {
    access:
      data?.access ||
      data?.access_token ||
      data?.tokens?.access ||
      storedTokens?.access ||
      null,
    refresh:
      data?.refresh ||
      data?.refresh_token ||
      data?.tokens?.refresh ||
      storedTokens?.refresh ||
      null,
  };

  if (!nextTokens.access) {
    throw new Error("Refresh did not return access token");
  }

  setStoredTokens(nextTokens);
  return nextTokens;
}

// request interceptor
api.interceptors.request.use(
  (config) => {
    const tokens = getStoredTokens();

    if (tokens?.access) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${tokens.access}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    const status = error?.response?.status;

    const isLoginRequest = originalRequest.url?.includes("/sessions/login/");
    const isRefreshRequest = originalRequest.url?.includes("/sessions/refresh/");
    const isRetryAttempted = originalRequest._retry;

    if (status !== 401 || isLoginRequest || isRefreshRequest || isRetryAttempted) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        subscribeTokenRefresh((newAccessToken) => {
          if (!newAccessToken) {
            reject(error);
            return;
          }

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          resolve(api(originalRequest));
        });
      });
    }

    isRefreshing = true;

    try {
      const nextTokens = await refreshAccessToken(originalRequest);
      isRefreshing = false;
      onRefreshed(nextTokens.access);

      originalRequest.headers.Authorization = `Bearer ${nextTokens.access}`;
      return api(originalRequest);
    } catch (refreshError) {
      isRefreshing = false;
      onRefreshFailed();
      clearStoredAuth();

      if (window.location.pathname !== "/auth/login") {
        window.location.href = "/auth/login";
      }

      return Promise.reject(refreshError);
    }
  }
);

export function getAuthTokens() {
  return getStoredTokens();
}

export function saveAuthTokens(tokens) {
  setStoredTokens(tokens);
}

export function clearAuthStorage() {
  clearStoredAuth();
}