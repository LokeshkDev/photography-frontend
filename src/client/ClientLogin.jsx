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

export default function ClientLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

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
        display: "flex",
        height: "94vh",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={4}
        sx={{ width: 370, p: 4, borderRadius: 2 }}
      >
        <Typography
          variant="h5"
          align="center"
          sx={{ fontWeight: "bold", mb: 2 }}
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
            sx={{ mb: 2 }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            required
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
