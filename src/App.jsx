import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

/* UI Theme */
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";
import { ToastProvider } from "./components/ToastProvider";
/* Auth */
import ProtectedRoute from "./utils/ProtectedRoute";

/* ADMIN */
import AdminLogin from "./admin/AdminLogin";
import AdminLayout from "./layout/AdminLayout";
import Dashboard from "./admin/Dashboard";
import Events from "./admin/Events";
import UploadPhotos from "./admin/UploadPhotos";
import Clients from "./admin/Clients";
import ViewSelections from "./admin/ViewSelections";

/* CLIENT */
import ClientLogin from "./client/ClientLogin";
import ClientLayout from "./layout/ClientLayout";
import ClientDashboard from "./client/ClientDashboard";
import ClientEvents from "./client/ClientEvents";
import ClientGallery from "./client/ClientGallery";
import ClientSubmit from "./client/ClientSubmit";

export default function App() {
  return (
     <ThemeProvider theme={theme}>
      <CssBaseline />

      <ToastProvider>
        <Router>
          <Routes>

            {/* ================= ADMIN ================= */}

            <Route path="/admin/login" element={<AdminLogin />} />

            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="clients" element={<Clients />} />
              <Route path="upload" element={<UploadPhotos />} />
              <Route path="events" element={<Events />} />              
              <Route path="selections" element={<ViewSelections />} />
            </Route>


            {/* ================= CLIENT ================= */}

            <Route path="/client/login" element={<ClientLogin />} />

            <Route
              path="/client"
              element={
                <ProtectedRoute role="client">
                  <ClientLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<ClientDashboard />} />
              <Route path="events" element={<ClientEvents />} />
              <Route path="gallery/:eventId" element={<ClientGallery />} />
              <Route path="submit/:eventId" element={<ClientSubmit />} />
            </Route>


            {/* DEFAULT FALLBACK */}
            <Route path="*" element={<AdminLogin />} />

          </Routes>
        </Router>
      </ToastProvider>
    </ThemeProvider>
  );
}
