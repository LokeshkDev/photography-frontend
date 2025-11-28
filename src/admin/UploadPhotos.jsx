import { useEffect, useState } from "react";
import API from "../utils/api";

/* MUI */
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  MenuItem,
  TextField,
  CircularProgress,
  IconButton,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";

export default function UploadPhotos() {
  const [events, setEvents] = useState([]);
  const safeEvents = Array.isArray(events) ? events : events?.events || [];

  const [selectedEvent, setSelectedEvent] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [loading, setLoading] = useState(false);

  const [previewIndex, setPreviewIndex] = useState(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await API.get("/api/events");
        const eventList = Array.isArray(res.data?.events) ? res.data.events : [];
        setEvents(eventList);
      } catch (err) {
        setEvents([]);
      }
    }
    fetchEvents();
  }, []);

  useEffect(() => {
    async function fetchPhotos() {
      if (!selectedEvent) {
        setUploadedPhotos([]);
        return;
      }
      try {
        const res = await API.get(`/api/photos/event/${selectedEvent}`);
        setUploadedPhotos(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setUploadedPhotos([]);
      }
    }
    fetchPhotos();
  }, [selectedEvent]);

  const handleFileSelect = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleUpload = async () => {
    if (!selectedEvent) return alert("Select event");
    if (!selectedFiles.length) return alert("Select photos");

    const eventObj = safeEvents.find(ev => ev._id === selectedEvent);
    if (!eventObj) return alert("Invalid event selected");

    const clientName = eventObj?.client?.name?.replace(/\s+/g, "_") || "client";
    const eventName = eventObj?.title?.replace(/\s+/g, "_") || "event";
    const folderPath = `${clientName}/${eventName}`;

    setLoading(true);

    try {
      for (let file of selectedFiles) {
        const signedRes = await API.post("/api/upload/presign", {
          fileName: file.name,
          fileType: file.type,
          folderPath,
        });

        await fetch(signedRes.data.uploadURL, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type },
        });

        await API.post("/api/upload/confirm", {
          eventId: selectedEvent,
          key: signedRes.data.key,
        });
      }

      setSelectedFiles([]);
      // showToast("Upload completed!", "success");
      alert("Upload completed!")

      const updatedRes = await API.get(`/api/photos/event/${selectedEvent}`);
      setUploadedPhotos(Array.isArray(updatedRes.data) ? updatedRes.data : []);

    } catch (err) {
      alert("Upload failed!")
    }

    setLoading(false);
  };

  const deletePhoto = async (key) => {
    if (!window.confirm("Are you sure you want to delete this photo?")) return;

    try {
      await API.post("/api/photos/delete", { eventId: selectedEvent, key });

      const updatedRes = await API.get(`/api/photos/event/${selectedEvent}`);
      setUploadedPhotos(Array.isArray(updatedRes.data) ? updatedRes.data : []);

    } catch (err) {
      // showToast("Delete failed", "error");
      alert("Delete failed");
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        📸 Upload Event Photos
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">

            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Select Event"
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
              >
                <MenuItem value="">Choose event</MenuItem>

                {safeEvents.map((ev) => (
                  <MenuItem key={ev._id} value={ev._id}>
                    {ev?.client?.name || "No Client"} — {ev.title}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <Button
                variant="contained"
                component="label"
                fullWidth
                sx={{ height: "100%" }}
              >
                Select Files
                <input
                  hidden
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                />
              </Button>
            </Grid>

            {selectedFiles.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  {selectedFiles.length} files selected
                </Typography>
              </Grid>
            )}

            <Grid item xs={12}>
              <Button
                variant="contained"
                disabled={loading}
                onClick={handleUpload}
                fullWidth
                size="large"
              >
                {loading ? <CircularProgress size={24} /> : "Upload Photos"}
              </Button>
            </Grid>

          </Grid>
        </CardContent>
      </Card>

      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
        Photos ({uploadedPhotos.length})
      </Typography>

      {uploadedPhotos.length === 0 ? (
        <Typography color="text.secondary">No photos uploaded for this event yet.</Typography>
      ) : (
        <Grid container spacing={2}>
          {uploadedPhotos.map((p, index) => (
            <Grid item key={p.key}>
              <Box sx={{ position: "relative" }}>
                <img
                  src={p.url}
                  alt=""
                  onClick={() => setPreviewIndex(index)}
                  style={{
                    width: 140,
                    height: 140,
                    objectFit: "cover",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                />

                <IconButton
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    bgcolor: "rgba(255,0,0,0.7)",
                    color: "white",
                    "&:hover": { bgcolor: "red" },
                  }}
                  onClick={() => deletePhoto(p.key)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

      {/* FULLSCREEN PREVIEW - UNCHANGED BEHAVIOR */}
      {previewIndex !== null && (
        <Box
          onClick={() => setPreviewIndex(null)}
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.8)",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={uploadedPhotos[previewIndex].url}
            alt=""
            style={{ maxWidth: "90%", maxHeight: "90%" }}
          />
        </Box>
      )}
    </Box>
  );
}
