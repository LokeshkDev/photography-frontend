import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";

/* MUI */
import {
  Box,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

export default function ClientDashboard() {
  const navigate = useNavigate();

  const clientId = localStorage.getItem("clientId");
  const clientName = localStorage.getItem("clientName");

  const [eventCount, setEventCount] = useState(0);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const token = localStorage.getItem("clientToken");
      const res = await API.get(`/api/events/client/${clientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEventCount(res.data.length);
    } catch (err) {}
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        Welcome, {clientName} 👋
      </Typography>

      {/* ===== DASHBOARD CARDS GRID ===== */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 3,
        }}
      >
        {/* Assigned Events Count Card */}
        <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6">Your Assigned Events</Typography>

            <Typography
              variant="h2"
              sx={{ mt: 1, fontWeight: "bold", color: "#0d6efd" }}
            >
              {eventCount}
            </Typography>
          </CardContent>
        </Card>

        {/* My Events Card (Clickable) */}
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: 3,
            cursor: "pointer",
            transition: "0.2s",
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow: 6,
            },
          }}
          onClick={() => navigate("/client/events")}
        >
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: "600" }}>
              My Events
            </Typography>

            <Typography sx={{ mt: 1, fontSize: "15px", color: "text.secondary" }}>
              View and explore all your assigned events.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
