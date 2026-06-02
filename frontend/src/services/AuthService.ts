import { isAxiosError } from "axios";
import { apiClient } from "./apiClient";
import type { Role } from "../interfaces/enums/Role";

export async function login(username: string, password: string) {
  const body = new URLSearchParams();
  body.set("username", username);
  body.set("password", password);

  return await apiClient
    .post("/auth/login", body.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      withCredentials: true,
    })
    .then((res) => res.data)
    .catch((e) => {
      console.error("Error Detail:", e.response?.data);
      throw e.response?.data || "Errore di login";
    });
}

export async function register(
  username: string,
  password: string,
  role: Role = "USER",
) {
  const body = new URLSearchParams();
  body.set("username", username);
  body.set("password", password);
  body.set("role", role);

  return await apiClient
    .post("/auth/register", body.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      withCredentials: true,
    })
    .then((res) => res.data)
    .catch((e) => {
      console.error("Error Detail:", e.response?.data);
      throw e.response?.data || "Errore di registrazione";
    });
}

export async function checkAuth() {
  return await apiClient.get("/auth/me", {
    withCredentials: true,
  });
}

export async function logout() {
  try {
    const response = await apiClient.post("/auth/logout", null, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("Error Detail:", error.response?.data || error.message);
      throw error.response?.data || "Logout Error";
    }
    console.error("Error Detail:", error);
    throw error;
  }
}
