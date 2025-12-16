import { cookies } from "next/headers";

export async function getSessionFromBackend() {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  const cookieHeader = allCookies.map(c => `${c.name}=${c.value}`).join("; ");

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  
  try {

    const response = await fetch(`${backendUrl}/api/auth/get-session`, {
      method: "GET",
      headers: {
        "Cookie": cookieHeader,
        "Content-Type": "application/json",
      },
      credentials: "include",
      cache: "no-store",
    });
    
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data;
  } catch {
    return null;
  }
}

export async function getOrganizationsFromBackend() {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  const cookieHeader = allCookies.map(c => `${c.name}=${c.value}`).join("; ");

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  
  try {
    const response = await fetch(`${backendUrl}/api/auth/organization/list`, {
      method: "GET",
      headers: {
        "Cookie": cookieHeader,
        "Content-Type": "application/json",
      },
      credentials: "include",
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}