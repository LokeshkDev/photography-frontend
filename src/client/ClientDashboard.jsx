import { useEffect, useState } from "react";
import API from "../utils/api";

/* MUI */
import {
  Box,
  Card,
  CardContent,
  Typography,
} from "@mui/material";

export default function ClientDashboard() {
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
    } catch (err) {
      // console.error("Error loading client events:", err);
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        Welcome, {clientName} 👋
      </Typography>

      <Card sx={{ maxWidth: 350 }}>
        <CardContent>
          <Typography variant="h6">
            Your Assigned Events
          </Typography>

          <Typography
            variant="h2"
            sx={{ mt: 1, fontWeight: "bold", color: "#0d6efd" }}
          >
            {eventCount}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
