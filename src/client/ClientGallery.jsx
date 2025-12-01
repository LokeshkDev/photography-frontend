import React, { useState, useEffect, useRef } from "react";
import API from "../utils/api";
import { useParams, useNavigate } from "react-router-dom";

/* MUI */
import {
  Box,
  Typography,
  Button,
  Grid,
  CircularProgress,
  IconButton,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function ClientGallery() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("clientToken");

  const [photos, setPhotos] = useState([]);
  const [selected, setSelected] = useState([]);
  const [limit, setLimit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [eventTitle, setEventTitle] = useState("");

  const [previewPhoto, setPreviewPhoto] = useState(null);
  const [previewIndex, setPreviewIndex] = useState(null);
  const [zoom, setZoom] = useState(1);

  const touchStartX = useRef(0);

  /* ---------------- LOAD EVENT TITLE + LIMIT ---------------- */
  useEffect(() => {
    async function loadEvent() {
      try {
        const res = await API.get(`/api/events/${eventId}`);
        setEventTitle(res.data?.title || "Event");
        const value = Number(res.data?.selectionLimit);
        setLimit(value === 0 ? null : value);
      } catch (err) {
        // console.error(err);
      }
    }

    loadEvent();
  }, [eventId]);

  /* ---------------- LOAD PHOTOS + EXISTING SELECTION ---------------- */
  useEffect(() => {
    loadPhotosAndSelection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  const loadPhotosAndSelection = async () => {
    try {
      const res = await API.get(`/api/photos/event/${eventId}`);
      const normalized = (res.data || []).map((p) => ({
        url: p.url,
        key: p.key || p.s3Key || p._id?.toString(),
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
      setLoading(false);
    }
  };

  /* ---------------- TOUCH + KEYBOARD CONTROLS ---------------- */
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    const endX = e.changedTouches[0].clientX;
    if (touchStartX.current - endX > 50) nextPhoto();
    if (endX - touchStartX.current > 50) prevPhoto();
  };

  useEffect(() => {
    const handleKey = (e) => {
      if (!previewPhoto) return;
      if (e.key === "ArrowRight") nextPhoto();
      if (e.key === "ArrowLeft") prevPhoto();
      if (e.key === "Escape") setPreviewPhoto(null);
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [previewPhoto, previewIndex, photos]);

  /* ---------------- PHOTO NAVIGATION ---------------- */
  const nextPhoto = () => {
    if (!photos.length) return;
    const nextIndex = (previewIndex + 1) % photos.length;
    setPreviewIndex(nextIndex);
    setPreviewPhoto(photos[nextIndex]);
    setZoom(1);
  };

  const prevPhoto = () => {
    if (!photos.length) return;
    const prevIndex = (previewIndex - 1 + photos.length) % photos.length;
    setPreviewIndex(prevIndex);
    setPreviewPhoto(photos[prevIndex]);
    setZoom(1);
  };

  /* ---------------- SELECT / UNSELECT ---------------- */
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

  /* ---------------- SELECT ALL / UNSELECT ALL ---------------- */
  const selectAll = () => {
    if (!photos.length) return;

    if (limit === null) {
      // no limit: select all
      setSelected(photos.map((p) => p.key));
    } else {
      // has limit: select up to limit (first N photos)
      if (photos.length <= limit) {
        setSelected(photos.map((p) => p.key));
      } else {
        const keys = photos.slice(0, limit).map((p) => p.key);
        setSelected(keys);
        alert(`Limit is ${limit}. Selected first ${limit} photos.`);
      }
    }
  };

  const unselectAll = () => {
    setSelected([]);
  };

  /* ---------------- SAVE + REDIRECT ---------------- */
  const saveSelection = async () => {
    try {
      await API.post(
        "/api/selections",
        { eventId, selections: selected },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Selection updated");
      navigate("/client/events"); // redirect after saving
    } catch (err) {
      alert("Failed to save selection.");
    }
  };

  /* ---------------- LOADING STATE ---------------- */
  if (loading)
    return (
      <Box sx={{ textAlign: "center", mt: 8 }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading Photos…</Typography>
      </Box>
    );

  return (
    <Box
      sx={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    mb: 3,
    flexWrap: "wrap",
    }}>
      {/* BACK BUTTON + TITLE */}
      <Box sx={{ display: "flex", alignItems: "center"}}>
        {limit !== null && (
         <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              onClick={() => navigate("/client/events")}
              sx={{
                background: "#e9ecef",
                "&:hover": { background: "#d6d6d6" },
              }}
            >
              <ArrowBackIcon />
            </IconButton>

            <Box>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: "#333", lineHeight: 1.2 }}
              >
                {eventTitle}
              </Typography>

              <Typography
                sx={{ color: "#555", fontSize: "15px", mt: "2px", mb: "8px"}}
              >
                Total Photos: {photos.length} • Selected: {selected.length} • Remaining:{" "}
                {limit === null ? "∞" : Math.max(limit - selected.length, 0)}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      {/* ACTIONS */}
      <Box sx={{ display: "flex", gap: 2, mb: 2}}>
        <Button variant="outlined" onClick={selectAll} disabled={!photos.length}>
          Select All
        </Button>

        <Button variant="outlined" onClick={unselectAll} disabled={!selected.length}>
          Unselect All
        </Button>

        <Box sx={{ flexGrow: 1 }} /> {/* spacer */}

        <Button variant="contained" onClick={saveSelection}
          sx={{
          textTransform: "none",
          px: 3,
          borderRadius: "8px",
          background: "#0d6efd",
        }}>
          Save Selection
        </Button>
      </Box>

      {/* IMAGE GRID */}
      <Grid container spacing={2}>
        {photos.map((p, index) => {
          const isSelected = selected.includes(p.key);
          return (
            <Grid item key={p.key}>
          <Box
            sx={{
              width: 160,
              borderRadius: "12px",
              overflow: "hidden",
              background: "#fff",
              boxShadow: isSelected
                ? "0 0 0 3px #0d6efd"
                : "0 2px 10px rgba(0,0,0,0.12)",
              transition: "0.2s",
              position: "relative",
              "&:hover": {
                transform: "scale(1.04)",
                boxShadow: "0 6px 16px rgba(0,0,0,0.18)",
              },
            }}
          >
            {/* CLICK IMAGE FOR PREVIEW */}
            <img
              src={p.url}
              loading="lazy" 
              onClick={() => {
                setPreviewIndex(index);
                setPreviewPhoto(p);
                setZoom(1);
              }}
              style={{
                width: "100%",
                height: 140,
                objectFit: "cover",
                cursor: "pointer",
              }}
            />

            {/* PHOTO NUMBER BADGE */}
            <Box
              sx={{
                position: "absolute",
                top: 8,
                left: 8,
                background: "rgba(0,0,0,0.55)",
                color: "white",
                padding: "2px 8px",
                borderRadius: "20px",
                fontSize: "12px",
                backdropFilter: "blur(3px)",
              }}
            >
              {index + 1}/{photos.length}
            </Box>

            {/* SELECT/UNSELECT BUTTON */}
            <Button
              variant={isSelected ? "contained" : "outlined"}
              onClick={() => toggleSelect(p.key)}
              fullWidth
              sx={{
                borderRadius: "0",
                textTransform: "none",
                fontSize: "13px",
              }}
            >
              {isSelected ? "Unselect" : "Select"}
            </Button>

            {/* SELECT BADGE */}
            {isSelected && (
              <Box
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  background: "#0d6efd",
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                  fontWeight: "bold",
                  boxShadow: "0 0 10px rgba(0,0,0,0.4)",
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
          <Box sx={{ position: "relative" }} onClick={(e) => e.stopPropagation()}>
            <img
              src={previewPhoto.url}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onClick={(e) => {
                if (e.detail === 2) setZoom(zoom === 1 ? 2.5 : 1);
              }}
              style={{
                maxWidth: zoom === 1 ? "90vw" : "none",
                maxHeight: zoom === 1 ? "85vh" : "none",
                transform: `scale(${zoom})`,
                transition: "transform 0.2s ease",
                cursor: zoom === 1 ? "zoom-in" : "zoom-out",
              }}
            />
            <Typography
              sx={{
                textAlign: "center",
                color: "white",
                mb: 1,
                fontSize: "14px",
                opacity: 0.8,
              }}
            >
              {previewIndex + 1} / {photos.length}
            </Typography>

            {/* LEFT & RIGHT NAV */}
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
              }}
            >
              {selected.includes(previewPhoto.key) ? "Unselect" : "Select"}
            </Button>

            {/* SELECT ALL INSIDE MODAL */}
            <Button
              variant="outlined"
              sx={{ mt: 1 }}
              fullWidth
              onClick={() => {
                if (limit === null) {
                  setSelected(photos.map((p) => p.key));
                } else {
                  const allowed = photos.slice(0, limit).map((p) => p.key);
                  setSelected(allowed);
                  alert(`Limit is ${limit}. Selected first ${limit} photos.`);
                }
              }}
            >
              Select All
            </Button>

            {/* UNSELECT ALL INSIDE MODAL */}
            <Button
              variant="outlined"
              color="warning"
              fullWidth
              sx={{ mt: 1 }}
              onClick={() => setSelected([])}
            >
              Unselect All
            </Button>

            {/* CLOSE BUTTON */}
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
