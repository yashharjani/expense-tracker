import { API_BASE_URL } from "../config";

export async function fetchExpenses() {
  const token = localStorage.getItem("idToken");
  const response = await fetch(`${API_BASE_URL}/fetch-expenses`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Failed to fetch expenses");

  return response.json();
}