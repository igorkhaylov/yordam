import { api } from "./http";
import { getApiPrefix } from "../i18n/apiLang";

export async function startRegisterRequest({ fullName, email, password }) {
  const prefix = getApiPrefix();

  const response = await api.post(
    `${prefix}/users/users/register/`,
    {
      username: email,
      password,
      name: fullName,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}

export async function confirmRegisterRequest({ email, code }) {
  const prefix = getApiPrefix();

  const response = await api.post(
    `${prefix}/users/users/register/confirm/`,
    {
      username: email,
      code,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}

export async function loginRequest({ email, password }) {
  const prefix = getApiPrefix();

  const response = await api.post(
    `${prefix}/users/sessions/login/`,
    {
      username: email,
      password,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}

export async function logoutRequest(refreshToken) {
  const prefix = getApiPrefix();

  const response = await api.post(
    `${prefix}/users/sessions/logout/`,
    refreshToken ? { refresh: refreshToken } : {},
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}

export async function refreshSessionRequest(refreshToken) {
  const prefix = getApiPrefix();

  const response = await api.post(
    `${prefix}/users/sessions/refresh/`,
    {
      refresh: refreshToken,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}

export async function getMeRequest() {
  const prefix = getApiPrefix();

  const response = await api.get(`${prefix}/users/users/me/`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
}

export async function updateMeRequest({ name, dateOfBirth, gender, picture }) {
  const prefix = getApiPrefix();

  const formData = new FormData();

  if (name !== undefined && name !== null && name !== "") {
    formData.append("name", name);
  }

  if (
    dateOfBirth !== undefined &&
    dateOfBirth !== null &&
    dateOfBirth !== ""
  ) {
    formData.append("date_of_birth", dateOfBirth);
  }

  if (gender !== undefined && gender !== null && gender !== "") {
    formData.append("gender", gender);
  }

  if (picture instanceof File) {
    formData.append("picture", picture);
  }

  const response = await api.patch(`${prefix}/users/users/me/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

export async function googleAuth(idToken) {
  const prefix = getApiPrefix();

  const response = await api.post(
    `${prefix}/users/users/google-auth/`,
    {
      id_token: idToken,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}