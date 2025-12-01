import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import usePageTitle from "../hooks/usePageTitle";

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
  const [error, setError] = useState("");
  const navigate = useNavigate();
  usePageTitle("Admin Login");
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post("/api/auth/login", { username, password });

      if (!res.data.user || res.data.user.role !== "admin") {
        return setError("Access denied. Admins only.");
      }

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
        height: "100vh",
        width: "100vw",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* BACKGROUND IMAGE */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "url('https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: 1,
        }}
      />

      {/* GRADIENT OVERLAY */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom right, rgba(0,0,0,0.65), rgba(0,0,0,0.25), rgba(0,0,0,0.6))",
          zIndex: 2,
        }}
      />

      {/* LOGO + BRAND TEXT (LEFT SIDE) */}
      <Box
        sx={{
          position: "absolute",
          left: 50,
          top: 50,
          zIndex: 3,
          color: "white",
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {/* OPTIONAL LOGO IMAGE */}
        {/* Replace src with your logo URL */}
        <img
          src="https://cdn-icons-png.flaticon.com/512/685/685655.png"
          alt="Logo"
          style={{
            width: 70,
            height: 70,
            filter: "drop-shadow(0px 3px 6px rgba(0,0,0,0.4))",
          }}
        />

        <Typography
          variant="h3"
          sx={{
            fontWeight: "800",
            letterSpacing: "2px",
            textShadow: "0 3px 8px rgba(0,0,0,0.6)",
          }}
        >
          Albumo-Captura
        </Typography>

        <Typography
          variant="h6"
          sx={{
            fontWeight: "400",
            opacity: 0.85,
            maxWidth: "280px",
            textShadow: "0 2px 6px rgba(0,0,0,0.5)",
          }}
        >
          A modern photography management platform for professionals.
        </Typography>
      </Box>

      {/* CENTER LOGIN CARD */}
      <Box
        sx={{
          position: "relative",
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 4,
          p: 2,
        }}
      >
        <Paper
          elevation={10}
          sx={{
            p: 4,
            width: "380px",
            borderRadius: 4,
            backdropFilter: "blur(22px)",
            background: "rgba(255,255,255,0.25)",
            border: "1px solid rgba(255,255,255,0.35)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.45)",
          }}
        >
          <Typography
            variant="h4"
            align="center"
            sx={{
              mb: 3,
              fontWeight: "700",
              color: "#fff",
              textShadow: "0 3px 8px rgba(0,0,0,0.5)",
            }}
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
              variant="filled"
              InputProps={{
                disableUnderline: true,
                sx: {
                  background: "rgba(255,255,255,0.9)",
                  borderRadius: 2,
                },
              }}
              sx={{ mb: 2 }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <TextField
              label="Password"
              fullWidth
              type="password"
              variant="filled"
              InputProps={{
                disableUnderline: true,
                sx: {
                  background: "rgba(255,255,255,0.9)",
                  borderRadius: 2,
                },
              }}
              sx={{ mb: 3 }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              sx={{
                textTransform: "none",
                py: 1.4,
                borderRadius: "10px",
                fontSize: "17px",
                fontWeight: "700",
                background: "#0072ff",
                boxShadow: "0 4px 15px rgba(0,0,0,0.4)",
                "&:hover": { background: "#0057cc" },
              }}
            >
              Login
            </Button>
          </form>
        </Paper>
      </Box>
    </Box>
  );
}
