import { useEffect, useState } from "react";
import API from "../utils/api";

/* MUI */
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
} from "@mui/material";

export default function ClientEvents() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function fetchEvents() {
      const clientId = localStorage.getItem("clientId");
      if (!clientId) return;

      const res = await API.get(`/api/events/client/${clientId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("clientToken")}`,
        },
      });

      setEvents(res.data);
    }

    fetchEvents();
  }, []);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        Your Events
      </Typography>

      {events.length === 0 && (
        <Typography color="text.secondary">No events found.</Typography>
      )}

      <Grid container spacing={2}>
        {events.map((ev) => (
          <Grid item key={ev._id} xs={12} sm={6} md={4}>
            <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  {ev.title}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {ev.description}
                </Typography>

                <Button
                  variant="contained"
                  size="small"
                  onClick={() => (window.location.href = `/client/gallery/${ev._id}`)}
                >
                  View Gallery
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
