export const getMyProfile = async () => {
  const response = await fetch("/api/profile", {
    method: "GET",
    credentials: "include",
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch profile");
  }

  return data.user;
};
