import { createContext, useContext, useEffect, useState } from "react";
import {
  startRegisterRequest,
  confirmRegisterRequest,
  loginRequest,
  updateMeRequest,
  googleAuth,
  logoutRequest,
  getMeRequest,
  changePasswordRequest,
  refreshSessionRequest,
} from "../../shared/api/auth";
import {
  AUTH_USER_KEY,
  AUTH_TOKENS_KEY,
  clearAuthStorage,
  saveAuthTokens,
} from "../../shared/api/http";

const STORAGE_KEY = AUTH_USER_KEY;
const TOKENS_KEY = AUTH_TOKENS_KEY;

const AuthContext = createContext(null);

/* =========================
   Helpers
========================= */

function parseStorage(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error("Storage parse error", e);
    return null;
  }
}

function normalizeTokens(data) {
  const access =
    data?.access ||
    data?.access_token ||
    data?.tokens?.access ||
    null;

  const refresh =
    data?.refresh ||
    data?.refresh_token ||
    data?.tokens?.refresh ||
    null;

  return access || refresh ? { access, refresh } : null;
}

function normalizeUser(data, fallbackEmail = "") {
  const backendUser =
    data?.user ||
    data?.profile ||
    data?.me ||
    data;

  return {
    id: backendUser?.uid || backendUser?.id || fallbackEmail || Date.now(),
    fullName:
      backendUser?.name ||
      backendUser?.full_name ||
      backendUser?.fullName ||
      "Пользователь",
    email:
      backendUser?.email ||
      backendUser?.username ||
      fallbackEmail ||
      "",
    username:
      backendUser?.username ||
      backendUser?.email ||
      fallbackEmail ||
      "",
    role: backendUser?.role || "client",
    profile: backendUser || {},
  };
}

function decodeJwtPayload(token) {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const normalized = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");

    const json = atob(normalized);
    return JSON.parse(json);
  } catch (error) {
    console.error("JWT decode error:", error);
    return null;
  }
}

function isTokenExpiredOrClose(token, bufferSeconds = 30) {
  if (!token) return true;

  const payload = decodeJwtPayload(token);
  const exp = payload?.exp;

  if (!exp) return true;

  const now = Math.floor(Date.now() / 1000);
  return exp <= now + bufferSeconds;
}

export function isProfileCompleted(user) {
  const profile = user?.profile || user || {};

  return Boolean(
    (profile.name || user?.fullName) &&
      profile.date_of_birth &&
      profile.gender
  );
}

/* =========================
   Provider
========================= */

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => parseStorage(STORAGE_KEY));
  const [tokens, setTokens] = useState(() => parseStorage(TOKENS_KEY));
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  const saveAuth = ({ user, tokens }) => {
    setUser(user || null);
    setTokens(tokens || null);

    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }

      if (tokens) {
        localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens));
        saveAuthTokens(tokens);
      } else {
        localStorage.removeItem(TOKENS_KEY);
      }
    } catch (e) {
      console.error("Auth save error", e);
    }
  };

  const refreshAccessTokenIfNeeded = async (currentTokens) => {
    if (!currentTokens?.refresh) {
      throw new Error("Нет refresh token");
    }

    if (!isTokenExpiredOrClose(currentTokens?.access)) {
      return currentTokens;
    }

    const refreshed = await refreshSessionRequest(currentTokens.refresh);

    const nextTokens = {
      access:
        refreshed?.access ||
        refreshed?.access_token ||
        refreshed?.tokens?.access ||
        currentTokens.access,
      refresh:
        refreshed?.refresh ||
        refreshed?.refresh_token ||
        refreshed?.tokens?.refresh ||
        currentTokens.refresh,
    };

    saveAuth({
      user,
      tokens: nextTokens,
    });

    return nextTokens;
  };

  useEffect(() => {
    let cancelled = false;

    async function bootstrapAuth() {
      if (!tokens?.access && !tokens?.refresh) {
        setIsBootstrapping(false);
        return;
      }

      try {
        const actualTokens = await refreshAccessTokenIfNeeded(tokens);

        if (cancelled) return;

        const me = await getMeRequest();

        if (cancelled) return;

        const normalizedUser = normalizeUser(me, user?.email || "");

        saveAuth({
          user: normalizedUser,
          tokens: actualTokens,
        });
      } catch (error) {
        console.error("Bootstrap auth failed", error);

        if (!cancelled) {
          clearAuthStorage();
          setUser(null);
          setTokens(null);
        }
      } finally {
        if (!cancelled) {
          setIsBootstrapping(false);
        }
      }
    }

    bootstrapAuth();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = async ({ email, password }) => {
    if (!email || !password) {
      throw new Error("Введите email и пароль");
    }

    try {
      const data = await loginRequest({
        email,
        password,
      });

      const normalizedTokens = normalizeTokens(data);

      if (!normalizedTokens?.access) {
        throw new Error("Сервер не вернул access token");
      }

      saveAuth({
        user: null,
        tokens: normalizedTokens,
      });

      const me = await getMeRequest();
      const normalizedUser = normalizeUser(me, email);

      saveAuth({
        user: normalizedUser,
        tokens: normalizedTokens,
      });

      return normalizedUser;
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      console.error("LOGIN RESPONSE:", error?.response);
      console.error("LOGIN DATA:", error?.response?.data);

      const responseData = error?.response?.data;

      const message =
        responseData?.detail ||
        responseData?.message ||
        responseData?.error ||
        responseData?.non_field_errors?.[0] ||
        responseData?.username?.[0] ||
        responseData?.password?.[0] ||
        error?.message ||
        `Ошибка входа (status: ${error?.response?.status || "unknown"})`;

      throw new Error(message);
    }
  };

  const register = async ({ fullName, email, password, passwordRepeat }) => {
    if (!fullName || !email || !password || !passwordRepeat) {
      throw new Error("Заполните все поля");
    }

    if (password !== passwordRepeat) {
      throw new Error("Пароли не совпадают");
    }

    try {
      const data = await startRegisterRequest({
        fullName,
        email,
        password,
      });

      return data;
    } catch (error) {
      console.error("REGISTER START ERROR:", error);
      console.error("REGISTER START RESPONSE:", error?.response);
      console.error("REGISTER START DATA:", error?.response?.data);

      const responseData = error?.response?.data;

      const message =
        responseData?.detail ||
        responseData?.message ||
        responseData?.error ||
        responseData?.non_field_errors?.[0] ||
        responseData?.username?.[0] ||
        responseData?.password?.[0] ||
        `Ошибка регистрации (status: ${error?.response?.status || "unknown"})`;

      throw new Error(message);
    }
  };

  const confirmRegisterCode = async ({ email, code }) => {
    if (!email || !code) {
      throw new Error("Email и код обязательны");
    }

    try {
      const data = await confirmRegisterRequest({
        email,
        code,
      });

      return data;
    } catch (error) {
      console.error("REGISTER CONFIRM ERROR:", error);
      console.error("REGISTER CONFIRM RESPONSE:", error?.response);
      console.error("REGISTER CONFIRM DATA:", error?.response?.data);

      const responseData = error?.response?.data;

      const message =
        responseData?.detail ||
        responseData?.message ||
        responseData?.error ||
        responseData?.non_field_errors?.[0] ||
        responseData?.code?.[0] ||
        responseData?.username?.[0] ||
        `Ошибка подтверждения (status: ${error?.response?.status || "unknown"})`;

      throw new Error(message);
    }
  };

  const saveProfileSettings = async ({
    name,
    dateOfBirth,
    gender,
    pictureFile,
  }) => {
    try {
      const data = await updateMeRequest({
        name,
        dateOfBirth,
        gender,
        pictureFile,
      });

      const updatedUser = {
        ...(user || {}),
        id: data?.uid || data?.id || user?.id,
        fullName: data?.name || name || user?.fullName || "Пользователь",
        email: data?.email || user?.email || "",
        username: data?.username || user?.username || "",
        role: data?.role || user?.role || "client",
        profile: {
          ...(user?.profile || {}),
          ...data,
        },
      };

      saveAuth({
        user: updatedUser,
        tokens,
      });

      return updatedUser;
    } catch (error) {
      console.error("UPDATE PROFILE ERROR:", error);
      console.error("UPDATE PROFILE RESPONSE:", error?.response);
      console.error("UPDATE PROFILE DATA:", error?.response?.data);

      const responseData = error?.response?.data;

      const message =
        responseData?.detail ||
        responseData?.message ||
        responseData?.error ||
        responseData?.picture?.[0] ||
        responseData?.non_field_errors?.[0] ||
        responseData?.name?.[0] ||
        responseData?.date_of_birth?.[0] ||
        responseData?.gender?.[0] ||
        `Ошибка сохранения профиля (status: ${error?.response?.status || "unknown"})`;

      throw new Error(message);
    }
  };

  const changePassword = async ({ oldPassword, newPassword }) => {
    try {
      const data = await changePasswordRequest({
        oldPassword,
        newPassword,
      });

      return data;
    } catch (error) {
      console.error("CHANGE PASSWORD ERROR:", error);
      console.error("CHANGE PASSWORD RESPONSE:", error?.response);
      console.error("CHANGE PASSWORD DATA:", error?.response?.data);

      const responseData = error?.response?.data;

      const message =
        responseData?.detail ||
        responseData?.message ||
        responseData?.error ||
        responseData?.old_password?.[0] ||
        responseData?.new_password?.[0] ||
        `Ошибка смены пароля (status: ${error?.response?.status || "unknown"})`;

      throw new Error(message);
    }
  };

  const googleLogin = async (idToken) => {
    if (!idToken) {
      throw new Error("Google token не получен");
    }

    try {
      const data = await googleAuth(idToken);

      const normalizedTokens = normalizeTokens(data);

      if (!normalizedTokens?.access) {
        throw new Error("Сервер не вернул access token");
      }

      saveAuth({
        user: null,
        tokens: normalizedTokens,
      });

      const me = await getMeRequest();
      const normalizedUser = normalizeUser(me);

      saveAuth({
        user: normalizedUser,
        tokens: normalizedTokens,
      });

      return normalizedUser;
    } catch (error) {
      const responseData = error?.response?.data;

      const message =
        responseData?.detail ||
        responseData?.message ||
        responseData?.non_field_errors?.[0] ||
        error?.message ||
        "Ошибка входа через Google";

      throw new Error(message);
    }
  };

  const logout = async () => {
    const refreshToken = tokens?.refresh;

    try {
      if (refreshToken) {
        await logoutRequest(refreshToken);
      }
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
    } finally {
      clearAuthStorage();
      saveAuth({ user: null, tokens: null });
    }
  };

  const updateProfile = (profilePatch) => {
    setUser((prev) => {
      if (!prev) return prev;

      const updated = {
        ...prev,
        fullName:
          profilePatch?.name ||
          profilePatch?.full_name ||
          prev.fullName,
        profile: {
          ...(prev.profile || {}),
          ...profilePatch,
        },
      };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error("Auth save error", e);
      }

      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        tokens,
        isAuthenticated: !!user && !!tokens?.access,
        isBootstrapping,
        login,
        register,
        confirmRegisterCode,
        saveProfileSettings,
        changePassword,
        googleLogin,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
} 