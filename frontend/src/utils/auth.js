export const getCurrentUserFromToken = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }

  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));

    return {
      id: decoded.id,
      role: decoded.role,
    };
  } catch (error) {
    return null;
  }
};
