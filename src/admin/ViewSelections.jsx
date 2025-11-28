import { useState, useEffect } from "react";
import API from "../utils/api";

export default function ViewSelections() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [selections, setSelections] = useState([]);
  const [photos, setPhotos] = useState([]);

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    try {
      const res = await API.get("/events");
      setEvents(res.data?.events || []);
    } catch (err) {
      // console.error("fetchEvents:", err);
    }
  };

  const loadSelections = async (eventId) => {
    setSelectedEvent(eventId);

    try {
      const token = localStorage.getItem("token");

      const res = await API.get(`/selections/event/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const selData = Array.isArray(res.data) ? res.data : [];
      setSelections(selData);

      const p = await API.get(`/photos/event/${eventId}`);
      const normalized = (p.data || []).map((pic) => ({
        url: pic.url,
        key: pic.key || pic.s3Key || pic._id?.toString(),
      }));

      setPhotos(normalized);

    } catch (err) {
      // console.error("loadSelections:", err);
    }
  };

  const findPhotoUrl = (key) => {
    const match = photos.find((p) => p.key === key);
    return match?.url || null;
  };

  // IMPORTANT — CLEAN + GROUP PROPERLY
  const groupByClient = selections.reduce((acc, sel) => {
  const user = sel.clientId;

  if (!user || !user._id) return acc;

  const clientId = user._id;
  const clientName = user.name || "Unknown";

  if (!acc[clientId]) {
    acc[clientId] = { 
      clientId, 
      clientName, 
      selections: new Set() 
    };
  }

  sel.selections.forEach((photoKey) => {
    if (findPhotoUrl(photoKey)) {
      acc[clientId].selections.add(photoKey);
    }
  });

  return acc;
}, {});

  return (
    <div className="container mt-4">
      <h3 className="mb-4">View Client Selections</h3>

      <div className="mb-4">
        <label className="form-label">Select Event</label>
        <select
          className="form-select"
          onChange={(e) => loadSelections(e.target.value)}
          value={selectedEvent}
        >
          <option value="">-- Select Event --</option>
          {events.map((ev) => (
            <option key={ev._id} value={ev._id}>
              {ev.clientName || ev.client?.name} — {ev.title}
            </option>
          ))}
        </select>
      </div>

      {!selectedEvent && <p className="text-muted">Please select an event.</p>}

      {selectedEvent && (
      <>
        <h5 className="mb-3">
          Total Submissions: {
            Object.values(groupByClient).filter(entry => entry.selections.size > 0).length
          }
        </h5>

        {Object.values(groupByClient)
          .filter(entry => entry.selections.size > 0)   // 👈 remove empty cards
          .map((entry, idx) => (
            <div key={idx} className="card shadow-sm p-3 mb-4">

              <h5 className="mb-3">
                Client: {entry.clientName}
              </h5>

              <div className="d-flex flex-wrap">
                {[...entry.selections].map((photoKey, i) => {
                  const url = findPhotoUrl(photoKey);
                  if (!url) return null;
                  return (
                    <div
                      key={photoKey + i}
                      style={{
                        width: 160,
                        height: 160,
                        margin: 5,
                        border: "1px solid #ccc",
                        borderRadius: 4,
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={url}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

        {Object.values(groupByClient).filter(entry => entry.selections.size > 0).length === 0 && (
          <p className="text-muted">No selections submitted.</p>
        )}
      </>
    )}
    </div>
  );
}
