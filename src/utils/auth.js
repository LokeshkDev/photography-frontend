import axios from "axios";

//const API_URL = "https://your-backend-url.com/api/auth";

const API_URL = "http://localhost:5000/api/";

export const login = async (username, password) => {
  try {
    const res = await axios.post(
      `${API_URL}/login`,
      { username, password },    
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};
