import { useState } from "react";
import API from "../utils/api";
import { Box, Paper, TextField, Button, Typography, Alert } from "@mui/material";

export default function CreateChildAdmin() {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");

    try {
      const token = localStorage.getItem("adminToken");

      const res = await API.post(
        "/api/auth/create-child-admin",
        { username, name, email, password },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMsg("Child Admin created successfully!");

      setUsername("");
      setName("");
      setEmail("");
      setPassword("");

    } catch (err) {
      setError(
        err.response?.data?.message || 
        err.response?.data?.error || 
        "Something went wrong"
      );
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, maxWidth: 500 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Create Child Admin
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {msg && <Alert severity="success" sx={{ mb: 2 }}>{msg}</Alert>}

        <form onSubmit={handleSubmit}>

          <TextField
            label="Username"
            fullWidth
            sx={{ mb: 2 }}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <TextField
            label="Name"
            fullWidth
            sx={{ mb: 2 }}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <TextField
            label="Email"
            fullWidth
            sx={{ mb: 2 }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <TextField
            label="Password"
            fullWidth
            type="password"
            sx={{ mb: 2 }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            fullWidth
            variant="contained"
            size="large"
            type="submit"
            sx={{ textTransform: "none" }}
          >
            Create Child Admin
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
