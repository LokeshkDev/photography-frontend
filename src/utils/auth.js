import axios from "axios";

// const API_URL = "http://localhost:5000/api/";
const API_URL = "https://photography-backend-ivir.onrender.com/api/";
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
