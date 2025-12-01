import { useState, useEffect } from "react";
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

export default function ClientLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Albumo Captura | Client Login";
  }, []);
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/api/auth/login", { email, password });

      if (res.data.user.role !== "client") {
        return setErr("This login is only for clients");
      }

      localStorage.setItem("clientToken", res.data.token);
      localStorage.setItem("clientRole", "client");
      localStorage.setItem("clientId", res.data.user._id);
      localStorage.setItem("clientName", res.data.user.name);
      localStorage.setItem("clientActive", res.data.user.active);

      navigate("/client/dashboard");
    } catch (e) {
      setErr("Login failed — invalid credentials");
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* BACKGROUND IMAGE */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          zIndex: 1,
        }}
      />

      {/* DARK/WHITE GRADIENT OVERLAY */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom right, rgba(0,0,0,0.65), rgba(255,255,255,0.15))",
          zIndex: 2,
        }}
      />

      {/* BRANDING (LEFT-SIDE) */}
      <Box
        sx={{
          position: "absolute",
          left: 50,
          top: 50,
          zIndex: 3,
          color: "white",
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 900,
            letterSpacing: "1.5px",
            textShadow: "0 5px 14px rgba(0,0,0,0.7)",
          }}
        >
          Albumo-Captura
        </Typography>
        <Typography
          variant="h6"
          sx={{
            opacity: 0.85,
            maxWidth: "270px",
            mt: 1,
            textShadow: "0 3px 8px rgba(0,0,0,0.5)",
          }}
        >
          Your memories beautifully captured.
        </Typography>
      </Box>

      {/* LOGIN CARD CENTERED */}
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
            backdropFilter: "blur(18px)",
            background: "rgba(255,255,255,0.22)",
            border: "1px solid rgba(255,255,255,0.45)",
            boxShadow: "0 8px 30px rgba(0,0,0,0.45)",
          }}
        >
          <Typography
            variant="h4"
            align="center"
            sx={{
              mb: 3,
              fontWeight: 700,
              color: "#fff",
              textShadow: "0 4px 10px rgba(0,0,0,0.6)",
            }}
          >
            Client Login
          </Typography>

          {err && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {err}
            </Alert>
          )}

          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              required
              variant="filled"
              InputProps={{
                disableUnderline: true,
                sx: {
                  background: "rgba(255,255,255,0.85)",
                  borderRadius: 2,
                },
              }}
              sx={{ mb: 2 }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              required
              variant="filled"
              InputProps={{
                disableUnderline: true,
                sx: {
                  background: "rgba(255,255,255,0.85)",
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
                fontWeight: 700,
                background: "#0072ff",
                boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
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
