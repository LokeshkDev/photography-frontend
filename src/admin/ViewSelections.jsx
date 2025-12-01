import { useState, useEffect } from "react";
import API from "../utils/api";
import usePageTitle from "../hooks/usePageTitle";
export default function ViewSelections() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [selections, setSelections] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);
 usePageTitle("Upload Event Photos");
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await API.get("/api/events");
      setEvents(res.data?.events || []);
    } catch (err) {}
  };

  const loadSelections = async (eventId) => {
    setSelectedEvent(eventId);

    try {
      const token = localStorage.getItem("token");

      const res = await API.get(`/api/selections/event/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const selData = Array.isArray(res.data) ? res.data : [];
      setSelections(selData);

      const p = await API.get(`/api/photos/event/${eventId}`);
      const normalized = (p.data || []).map((pic) => ({
        url: pic.url,
        key: pic.key || pic.s3Key || pic._id?.toString(),
      }));

      setPhotos(normalized);
    } catch (err) {}
  };

  const findPhotoUrl = (key) => {
    const match = photos.find((p) => p.key === key);
    return match?.url || null;
  };

  const groupByClient = selections.reduce((acc, sel) => {
    const user = sel.clientId;

    if (!user || !user._id) return acc;

    const clientId = user._id;
    const clientName = user.name || "Unknown";

    if (!acc[clientId]) {
      acc[clientId] = {
        clientId,
        clientName,
        selections: new Set(),
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
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      <h2
        style={{
          fontWeight: 800,
          marginBottom: "25px",
          textTransform: "uppercase",
        }}
      >
        View Client Selections
      </h2>

      {/* FILTER CARD */}
      <div
        style={{
          background: "#fff",
          padding: "25px",
          borderRadius: "18px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          marginBottom: "30px",
        }}
      >
        <label style={{ fontWeight: 600, marginBottom: "8px", display: "block" }}>
          Select Event
        </label>

        <select
          className="form-select"
          onChange={(e) => loadSelections(e.target.value)}
          value={selectedEvent}
          style={{
            width: "300px",
            height: "45px",
            borderRadius: "10px",
            fontSize: "16px",
            fontWeight: 500,
          }}
        >
          <option value="">-- Select Event --</option>
          {events.map((ev) => (
            <option key={ev._id} value={ev._id}>
              {ev.clientName || ev.client?.name} — {ev.title}
            </option>
          ))}
        </select>
      </div>

      {!selectedEvent && (
        <p style={{ color: "#777", fontSize: "15px" }}>Please select an event.</p>
      )}

      {selectedEvent && (
        <>
          <h4 style={{ marginBottom: "20px", fontWeight: 700 }}>
            Total Submissions:{" "}
            {
              Object.values(groupByClient).filter(
                (entry) => entry.selections.size > 0
              ).length
            }
          </h4>

          {Object.values(groupByClient)
            .filter((entry) => entry.selections.size > 0)
            .map((entry, idx) => (
              <div
                key={idx}
                style={{
                  background: "#fff",
                  borderRadius: "14px",
                  padding: "22px",
                  marginBottom: "25px",
                  boxShadow: "0px 4px 18px rgba(0,0,0,0.08)",
                }}
              >
                <h5 style={{ marginBottom: "15px", fontWeight: 700 }}>
                  Client: {entry.clientName}
                </h5>

                {/* Grid Photos */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "15px",
                  }}
                >
                  {[...entry.selections].map((photoKey, i) => {
                    const url = findPhotoUrl(photoKey);
                    if (!url) return null;

                    return (
                      <div
                        key={photoKey + i}
                        style={{
                          width: "160px",
                          height: "160px",
                          borderRadius: "10px",
                          overflow: "hidden",
                          background: "#f0f0f0",
                          boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
                        }}
                      >
                        <img
                          src={url}
                          onClick={() => setPreviewUrl(url)}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            cursor: "pointer",
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

          {/* No Selections */}
          {Object.values(groupByClient).filter(
            (entry) => entry.selections.size > 0
          ).length === 0 && (
            <p style={{ color: "#999", marginTop: "10px" }}>
              No selections submitted.
            </p>
          )}
        </>
      )}
      {previewUrl && (
  <div
    onClick={() => setPreviewUrl(null)}
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.85)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 2000,
      cursor: "zoom-out",
    }}
  >
    <img
      src={previewUrl}
      onClick={(e) => e.stopPropagation()} // prevent closing on image click
      style={{
        maxWidth: "90%",
        maxHeight: "90%",
        borderRadius: "10px",
        boxShadow: "0 4px 20px rgba(255,255,255,0.2)",
        cursor: "default",
      }}
    />

    {/* CLOSE BUTTON */}
    <button
      onClick={() => setPreviewUrl(null)}
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        background: "rgba(255,255,255,0.3)",
        border: "none",
        color: "white",
        fontSize: "22px",
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        cursor: "pointer",
        backdropFilter: "blur(8px)",
      }}
    >
      ✕
    </button>
  </div>
)}
    </div>
  );
}
