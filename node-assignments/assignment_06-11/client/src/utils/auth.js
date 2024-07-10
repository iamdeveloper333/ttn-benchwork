export const login = (token) => {
  localStorage.setItem("token", token);
};

export const userDetails = (data) => {
  localStorage.setItem("userDetails", JSON.stringify(data));
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const isLoggedIn = () => {
  return localStorage.getItem("token") !== null;
};
