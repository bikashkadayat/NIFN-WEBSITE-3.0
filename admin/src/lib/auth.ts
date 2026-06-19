import type { LoginResponse, User } from "./types";
import apiClient from "./api";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}

export function setToken(token: string): void {
  localStorage.setItem("auth_token", token);
  document.cookie = `auth_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
}

export function removeToken(): void {
  localStorage.removeItem("auth_token");
  document.cookie = "auth_token=; path=/; max-age=0";
}

export function getUser(): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("auth_user");
  if (!raw) return null;
  try {
    const user = JSON.parse(raw) as User;
    const roleName = (user.role as string) || user.role_name || "";
    const isSuperAdmin = roleName === "Super Admin" || roleName === "super-admin" || roleName === "super_admin";
    return {
      ...user,
      role_name: user.role_name || roleName,
      permissions: user.permissions?.length ? user.permissions : (isSuperAdmin ? ["*"] : []),
    } as User;
  } catch {
    return null;
  }
}

export function setUser(user: User): void {
  localStorage.setItem("auth_user", JSON.stringify(user));
}

export function removeUser(): void {
  localStorage.removeItem("auth_user");
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export async function login(email: string, password: string): Promise<User> {
  const response = await apiClient.post<{ success: boolean; token: string; user: User }>("/auth/login", {
    email,
    password,
  });

  const { token, user } = response.data;
  setToken(token);
  setUser(user);

  return user;
}

export function logout(): void {
  removeToken();
  removeUser();
  window.location.href = "/login";
}
