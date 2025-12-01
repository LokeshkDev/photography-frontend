import { useEffect, useState } from "react";
import API from "../utils/api";
import usePageTitle from "../hooks/usePageTitle";

/* MUI */
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Typography,
  IconButton,
  Switch,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LockResetIcon from "@mui/icons-material/LockReset";

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  const [resetPwdId, setResetPwdId] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  usePageTitle("Client Management");
  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const res = await API.get("/api/auth/clients");
      setClients(res.data);
    } catch (err) {
      console.log("Error loading clients:", err);
    }
  };

  const createClient = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      return alert("All fields are required");
    }

    try {
      await API.post("/api/auth/create-client", { name, email, password });
      // showToast("Client created successfully", "success");
      alert("Client created successfully");
      setName("");
      setEmail("");
      setPassword("");
      loadClients();
    } catch (err) {
      alert("Error creating client");
    }
  };

  const startEdit = (client) => {
    setEditId(client._id);
    setEditName(client.name);
    setEditEmail(client.email);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditName("");
    setEditEmail("");
  };

  const saveEdit = async (id) => {
    try {
      await API.put(`/api/auth/client/${id}`, {
        name: editName,
        email: editEmail,
      });
      alert("Client updated successfully");
      cancelEdit();
      loadClients();
    } catch (err) {
      alert("Update failed");
    }
  };

  const deleteClient = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await API.delete(`/api/auth/client/${id}`);
      alert("Client deleted");
      loadClients();
    } catch (err) {
      alert("Failed to delete client");
    }
  };

  const resetPassword = async (id) => {
    if (!newPassword) return alert("Enter new password");

    try {
      await API.post(`/api/auth/client/reset-password/${id}`, { newPassword });
      alert("Password reset successfully!");
      setResetPwdId(null);
      setNewPassword("");
    } catch (err) {
      alert("Failed to reset password");
    }
  };

  const toggleActive = async (client) => {
    try {
      await API.post(`/api/auth/client/active/${client._id}`, {
        active: !client.active,
      });
      loadClients();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>

      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        Manage Clients
      </Typography>

      {/* ADD CLIENT FORM */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2} component="form" onSubmit={createClient}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Client Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Client Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <Button fullWidth type="submit" variant="contained"
                sx={{
                  height: "56px",
                  width: 180,  
                  fontWeight: "bold"
                }}>
                Create Client
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* SEARCH */}
      <TextField
        fullWidth
        label="Search clients…"
        sx={{ mb: 3 }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* CLIENT CARDS */}
      <Grid container spacing={2}>
        {filteredClients.map((client) => (
          <Grid item xs={12} sm={6} md={4} key={client._id}>
            <Card sx={{ p: 1 }}>
              <CardContent>

                {editId === client._id ? (
                  <>
                    <TextField
                      fullWidth
                      sx={{ mb: 1 }}
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      label="Name"
                    />
                    <TextField
                      fullWidth
                      sx={{ mb: 1 }}
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      label="Email"
                    />
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => saveEdit(client._id)}
                      >
                        Save
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={cancelEdit}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </>
                ) : (
                  <>
                    <Typography variant="h6">{client.name}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {client.email}
                    </Typography>
                    
                    <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                      <Typography sx={{ mr: 1 }}>
                        {client.active ? "Active" : "Inactive"}
                      </Typography>
                      <Switch
                        checked={client.active}
                        onChange={() => toggleActive(client)}
                      />
                    </Box>

                    <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                      <IconButton size="small" onClick={() => startEdit(client)}>
                        <EditIcon />
                      </IconButton>

                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => deleteClient(client._id)}
                      >
                        <DeleteIcon />
                      </IconButton>

                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => setResetPwdId(client._id)}
                      >
                        <LockResetIcon />
                      </IconButton>
                    </Box>
                  </>
                )}

              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* RESET PASSWORD POPUP */}
      <Dialog open={!!resetPwdId} onClose={() => setResetPwdId(null)}>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="New Password"
            sx={{ mt: 1 }}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetPwdId(null)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => resetPassword(resetPwdId)}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}
