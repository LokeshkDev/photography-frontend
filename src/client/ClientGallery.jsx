import React, { useState, useEffect } from "react";
import API from "../utils/api";
import { useParams } from "react-router-dom";

/* MUI */
import {
  Box,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";

export default function ClientGallery() {
  const { eventId } = useParams();
  const token = localStorage.getItem("clientToken");

  const [photos, setPhotos] = useState([]);
  const [selected, setSelected] = useState([]);
  const [limit, setLimit] = useState(null);
  const [loading, setLoading] = useState(true);

  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [previewIndex, setPreviewIndex] = useState(null);

  const [zoom, setZoom] = useState(1);
  let startX = 0;

  useEffect(() => {
    loadEventLimit();
    loadPhotosAndSelection();
  }, [eventId]);

  const handleTouchStart = (e) => {
    startX = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const endX = e.changedTouches[0].clientX;
    if (startX - endX > 50) nextPhoto();
    if (endX - startX > 50) prevPhoto();
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (previewPhoto) {
        if (e.key === "ArrowRight") nextPhoto();
        if (e.key === "ArrowLeft") prevPhoto();
        if (e.key === "Escape") setPreviewPhoto(null);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [previewPhoto, previewIndex]);

  const loadEventLimit = async () => {
    try {
      const res = await API.get(`/api/events/${eventId}`);
      const value = Number(res.data?.selectionLimit);
      setLimit(value === 0 ? null : value);
    } catch (err) {
      // console.error("Error loading limit:", err);
    }
  };

  const loadPhotosAndSelection = async () => {
    try {
      const res = await API.get(`/api/photos/event/${eventId}`);
      const normalized = res.data.map((p) => ({
        url: p.url,
        key: p.key || p.s3Key || p._id.toString(),
      }));
      setPhotos(normalized);

      const selRes = await API.get(`/api/selections/client/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let existing = selRes.data?.selections || [];
      existing = existing.map((k) => k.toString());
      existing = existing.filter((k) => normalized.some((p) => p.key === k));

      setSelected(existing);
      setLoading(false);

    } catch (err) {
      // console.error("Error loading gallery & selection", err);
    }
  };

  const toggleSelect = (key) => {
    setSelected((prev) => {
      const has = prev.includes(key);
      const next = has ? prev.filter((x) => x !== key) : [...prev, key];

      if (!has && limit !== null && next.length > limit) {
        alert(`You can select max ${limit} photos`);
        return prev;
      }

      return next;
    });
  };

  const nextPhoto = () => {
    const nextIndex = (previewIndex + 1) % photos.length;
    setPreviewIndex(nextIndex);
    setPreviewPhoto(photos[nextIndex]);
    setZoom(1);
  };

  const prevPhoto = () => {
    const prevIndex = (previewIndex - 1 + photos.length) % photos.length;
    setPreviewIndex(prevIndex);
    setPreviewPhoto(photos[prevIndex]);
    setZoom(1);
  };

  const saveSelection = async () => {
    await API.post(
      "/api/selections",
      { eventId, selections: selected },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  //  showToast("Selection updated", "success");
  alert("Selection updated");
  };

  if (loading)
    return (
      <Box sx={{ textAlign: "center", mt: 8 }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading Photos…</Typography>
      </Box>
    );

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Select Photos ({selected.length}/{limit === null ? "∞" : limit})
      </Typography>

      {/* GRID OF IMAGES */}
      <Grid container spacing={2}>
        {photos.map((p, index) => {
          const isSelected = selected.includes(p.key);
          return (
            <Grid item key={p.key}>
              <Box sx={{ position: "relative" }}>
                <img
                  src={p.url}
                  onClick={() => {
                    setPreviewIndex(index);
                    setPreviewPhoto(p);
                    setZoom(1);
                  }}
                  style={{
                    width: 140,
                    height: 140,
                    objectFit: "cover",
                    cursor: "pointer",
                    border: isSelected ? "4px solid #0d6efd" : "1px solid #ddd",
                    borderRadius: 4,
                  }}
                />
                {isSelected && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 6,
                      right: 6,
                      width: 26,
                      height: 26,
                      background: "#0d6efd",
                      borderRadius: "50%",
                      color: "white",
                      fontSize: 16,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    ✓
                  </Box>
                )}
              </Box>
            </Grid>
          );
        })}
      </Grid>

      <Button
        variant="contained"
        sx={{ mt: 3 }}
        onClick={saveSelection}
      >
        Save Selection
      </Button>

      {/* FULLSCREEN MODAL */}
      {previewPhoto && (
        <Box
          onClick={() => setPreviewPhoto(null)}
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <Box
            sx={{ position: "relative" }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={previewPhoto.url}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onClick={(e) => {
                if (e.detail === 2) {
                  setZoom(zoom === 1 ? 2.5 : 1);
                }
              }}
              style={{
                maxWidth: zoom === 1 ? "90vw" : "none",
                maxHeight: zoom === 1 ? "85vh" : "none",
                transform: `scale(${zoom})`,
                transition: "transform 0.2s ease",
                cursor: zoom === 1 ? "zoom-in" : "zoom-out",
              }}
            />

            {/* LEFT ARROW */}
            <Button
              onClick={prevPhoto}
              sx={{
                position: "absolute",
                left: -60,
                top: "50%",
                fontSize: 40,
                color: "white",
              }}
            >
              ‹
            </Button>

            {/* RIGHT ARROW */}
            <Button
              onClick={nextPhoto}
              sx={{
                position: "absolute",
                right: -60,
                top: "50%",
                fontSize: 40,
                color: "white",
              }}
            >
              ›
            </Button>

            {/* SELECT / UNSELECT */}
            <Button
              variant="contained"
              sx={{ mt: 2 }}
              fullWidth
              onClick={() => {
                toggleSelect(previewPhoto.key);
                setPreviewPhoto(null);
              }}
            >
              {selected.includes(previewPhoto.key) ? "Unselect" : "Select"}
            </Button>

            {/* CLOSE */}
            <Button
              variant="outlined"
              color="error"
              fullWidth
              sx={{ mt: 1 }}
              onClick={() => setPreviewPhoto(null)}
            >
              Close
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}
