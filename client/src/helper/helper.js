import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

//auth function
export async function authenticate(username) {
  try {
    return await axios.post("/api/authenticate", { username });
  } catch (error) {
    return { error: "Username doesn't exist" };
  }
}

//getuser detail function
export async function getUser({ username }) {
  try {
    const { data } = await axios.get(`/api/user/${username}`);
    return data;
  } catch (error) {
    return { error: "Password doesn't match" };
  }
}

//register user function

export async function registerUser(credentials) {
  try {
    let { data, status } = await axios.post(`/api/register`, credentials);
  } catch (error) {
    return { error: error.message };
  }
}

//login function
export async function verifyPassword({ username, password }) {
  try {
    if (username) {
      let { data } = await axios.post("/api/login", { username, password });
      return data;
    }
  } catch (error) {
    return { error: error.message };
  }
}

//update user profile function

export async function updateUser(response) {
  try {
    const token = localStorage.getItem("token");
    let data = await axios.put("/api/update-user", response, {
      headers: { Authorization: `bearer ${token}` },
    });
    return data;
  } catch (error) {
    return { error: error.message };
  }
}

//generate otp
export async function generateOTP(username) {
  try {
    const data = await axios.get("/api/generate-otp", { params: { username } });
    return data;
  } catch (error) {
    return { error: error.message };
  }
}

//verify otp
export async function verifyOTP({ username, code }) {
  try {
    const { data, status } = await axios.get("/api/verify-otp", {
      params: { username, code },
    });
    return { data, status };
  } catch (error) {
    return { error: error.message };
  }
}

//reset-password function

export async function resetPassword({ username, password }) {
  try {
    const { data, status } = await axios.put("/api/reset-password", {
      username,
      password,
    });
    return { data, status };
  } catch (error) {
    return { error: error.message };
  }
}
