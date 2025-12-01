import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";

/* MUI */
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  IconButton,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function ClientEvents() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

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
    <Box sx={{ p: 1 }}>
      {/* BACK BUTTON */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <IconButton
          onClick={() => navigate("/client/dashboard")}
          sx={{
            mr: 1,
            background: "#e9ecef",
            "&:hover": { background: "#d6d6d6" },
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          Your Events
        </Typography>
      </Box>

      {events.length === 0 && (
        <Typography color="text.secondary">No events found.</Typography>
      )}

      {/* CARD GRID */}
      <Grid
        container
        spacing={3}
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        }}
      >
        {events.map((ev) => (
          <Card
            key={ev._id}
            sx={{
              width: "100%",
              height: "100%",
              borderRadius: "14px",
              boxShadow: "0px 3px 12px rgba(0,0,0,0.1)",
              display: "flex",
              flexDirection: "column",
              padding: "15px",
              transition: "0.2s",
              "&:hover": {
                transform: "translateY(-5px)",
                boxShadow: "0px 6px 18px rgba(0,0,0,0.15)",
              },
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" sx={{ mb: 1, fontWeight: "600" }}>
                {ev.title}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 2, minHeight: "40px" }}
              >
                {ev.description}
              </Typography>
            </CardContent>

            <Button
              variant="contained"
              sx={{
                width: "100%",
                textTransform: "none",
                fontWeight: 600,
                mt: "auto",
              }}
              onClick={() =>
                (window.location.href = `/client/gallery/${ev._id}`)
              }
            >
              View Gallery
            </Button>
          </Card>
        ))}
      </Grid>
    </Box>
  );
}
