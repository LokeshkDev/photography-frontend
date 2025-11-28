import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";

/* MUI */
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
} from "@mui/material";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post("/api/auth/login", { username, password });

      console.log("LOGIN RESPONSE:", res.data);

      if (!res.data.user || res.data.user.role !== "admin") {
        return setError("Access denied. Admins only.");
      }

      // SAVE ADMIN AUTH
      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("adminRole", res.data.user.role);
      localStorage.setItem("adminId", res.data.user._id);
      localStorage.setItem("adminName", res.data.user.username);

      navigate("/admin/dashboard");
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "94vh",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          width: "350px",
          borderRadius: 2,
        }}
      >
        <Typography
          variant="h5"
          align="center"
          sx={{ mb: 2, fontWeight: "bold" }}
        >
          Admin Login
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleLogin}>
          <TextField
            label="Username"
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <TextField
            label="Password"
            fullWidth
            type="password"
            variant="outlined"
            sx={{ mb: 3 }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            size="large"
            sx={{ textTransform: "none" }}
          >
            Login
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
