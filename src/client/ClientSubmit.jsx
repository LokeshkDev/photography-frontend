import { useState, useEffect } from "react";
import API from "../utils/api";
import { useParams, useNavigate } from "react-router-dom";

/* MUI */
import {
  Box,
  Typography,
  Button,
  Grid,
  CircularProgress,
} from "@mui/material";

export default function ClientSubmit() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("clientToken");

  const [photos, setPhotos] = useState([]);
  const [selected, setSelected] = useState([]);
  const [limit, setLimit] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEventLimit();
    loadPhotos();
  }, []);

  const loadEventLimit = async () => {
    const res = await API.get(`/api/events/${eventId}`);
    const limitValue = res.data?.selectionLimit;
    setLimit(limitValue === 0 ? null : limitValue);
  };

  const loadPhotos = async () => {
    const res = await API.get(`/api/photos/event/${eventId}`);

    const normalized = res.data.map((p) => ({
      url: p.url,
      key: p.key || p.s3Key || p._id.toString(),
    }));

    setPhotos(normalized);
    loadExistingSelection(normalized);
  };

  const loadExistingSelection = async (normalizedPhotos) => {
    const res = await API.get(`/api/selections/client/${eventId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    let sel = res.data?.selections || [];

    sel = sel.map((k) => k.toString());
    sel = sel.filter((k) => normalizedPhotos.some((p) => p.key === k));

    setSelected(sel);
    setLoading(false);
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

  const submit = async () => {
    setSubmitting(true);
    await API.post(
      "/api/selections",
      { eventId, selections: selected },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert("Your selection was saved ✔");
    navigate("/client/events");
    setSubmitting(false);
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

      <Grid container spacing={2}>
        {photos.map((p) => {
          const isSelected = selected.includes(p.key);
          return (
            <Grid item key={p.key}>
              <Box sx={{ position: "relative" }}>
                <img
                  src={p.url}
                  alt=""
                  onClick={() => toggleSelect(p.key)}
                  style={{
                    width: 150,
                    height: 150,
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
        onClick={submit}
        disabled={submitting}
      >
        {submitting ? "Saving…" : "Save Selection"}
      </Button>
    </Box>
  );
}
