const API_BASE = `${process.env.NEXT_PUBLIC_API_HOST}`;

export async function register(data: {
  email: string;
  password: string;
  confirmPassword: string;
}) {
  console.log("🚀 ~ register ~ API_BASE:", API_BASE);
  const res = await fetch(`${API_BASE}/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw err;
  }

  return res.json();
}

export async function login(data: { email: string; password: string }) {
  const res = await fetch(`${API_BASE}/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw err;
  }

  return res.json();
}

export async function me(token: string) {
  const res = await fetch(`${API_BASE}/me/`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Unauthorized");
  return res.json();
}

export async function logout(refreshToken: string, accessToken: string) {
  const res = await fetch(`${API_BASE}/logout/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  if (!res.ok) throw new Error("Logout failed");
  return res.json();
}
