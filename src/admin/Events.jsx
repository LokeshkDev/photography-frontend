import { useState, useEffect } from "react";
import API from "../utils/api";

/* MUI */
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  MenuItem,
  Divider,
} from "@mui/material";

export default function Events() {
  const [clients, setClients] = useState([]);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [clientId, setClientId] = useState("");
  const [selectionLimit, setSelectionLimit] = useState(0);
  const [editingEvent, setEditingEvent] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchClients();
    fetchEvents();
  }, []);

  const fetchClients = async () => {
    const res = await API.get("/auth/clients");
    setClients(Array.isArray(res.data) ? res.data : []);
  };

  const fetchEvents = async () => {
    try {
      const res = await API.get("/events");
      const eventList = Array.isArray(res.data?.events) ? res.data.events : [];
      setEvents(eventList);
      setFilteredEvents(eventList);
    } catch (err) {
      setEvents([]);
    }
  };

  useEffect(() => {
    const filtered = events.filter((ev) => {
      const clientName = ev.clientName || ev.client?.name || "";
      return (
        ev.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        clientName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredEvents(filtered);
  }, [searchTerm, events]);

  const createEvent = async (e) => {
    e.preventDefault();
    if (!title) return alert("Title required");
    if (!clientId) return alert("Client required");

    await API.post("/events", {
      title,
      description,
      clientId,
      selectionLimit,
    });

    resetForm();
    fetchEvents();
  };

  const startEditing = (ev) => {
    setEditingEvent(ev._id);
    setTitle(ev.title);
    setDescription(ev.description);
    setClientId(ev.client?._id);
    setSelectionLimit(ev.selectionLimit);
  };

  const saveEdit = async () => {
    await API.put(`/events/${editingEvent}`, {
      title,
      description,
      clientId,
      selectionLimit,
    });
    resetForm();
    fetchEvents();
  };

  const duplicateEvent = async (eventId) => {
    await API.post(`/events/duplicate/${eventId}`);
    fetchEvents();
  };

  const archiveEvent = async (eventId) => {
    if (!window.confirm("Archive this event?")) return;
    await API.post(`/events/archive/${eventId}`);
    fetchEvents();
  };

  const deleteEvent = async (eventId) => {
    if (!window.confirm("Delete permanently?")) return;
    await API.delete(`/events/${eventId}`);
    fetchEvents();
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setClientId("");
    setSelectionLimit(0);
    setEditingEvent(null);
  };

  return (
    <Box>

      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        {editingEvent ? "Edit Event" : "Create Event"}
      </Typography>

      {/* FORM */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2} component="form" onSubmit={createEvent}>
            
            {/* ROW 1 */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Event Title"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Assign Client"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
              >
                <MenuItem value="">-- Select Client --</MenuItem>
                {clients.map((c) => (
                  <MenuItem key={c._id} value={c._id}>
                    {c.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* ROW 2 */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Description"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                type="number"
                label="Selection Limit"
                value={selectionLimit}
                onChange={e => setSelectionLimit(e.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              {editingEvent ? (
                <Button
                  variant="contained"
                  fullWidth
                  onClick={saveEdit}
                  sx={{ height: "100%" }}
                >
                  Save Changes
                </Button>
              ) : (
                <Button
                  variant="contained"
                  fullWidth
                  type="submit"
                  sx={{ height: "100%" }}
                >
                  Create Event
                </Button>
              )}
            </Grid>

          </Grid>
        </CardContent>
      </Card>

      {/* FILTER SEARCH */}
      <TextField
        fullWidth
        label="Search by event title or client name..."
        sx={{ mb: 3 }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* EVENTS LIST */}
      <Grid container spacing={2}>
        {filteredEvents.length === 0 && (
          <Typography color="text.secondary">No events found</Typography>
        )}

        {filteredEvents.map((ev) => (
          <Grid item xs={12} md={4} key={ev._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{ev.title}</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {ev.description}
                </Typography>

                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                  Client: {ev.clientName || ev.client?.name || "Not Assigned"}
                </Typography>

                <Divider sx={{ mb: 2 }} />

                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => startEditing(ev)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => duplicateEvent(ev._id)}
                  >
                    Duplicate
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => archiveEvent(ev._id)}
                  >
                    Archive
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => deleteEvent(ev._id)}
                  >
                    Delete
                  </Button>
                </Box>

              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
