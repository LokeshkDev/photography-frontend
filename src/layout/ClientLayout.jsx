import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

/* MUI */
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu"; // you can remove this if not needed

export default function ClientLayout() {
  const navigate = useNavigate();
  const [clientName, setClientName] = useState("Client");

  useEffect(() => {
    const clientToken = localStorage.getItem("clientToken");
    const role = localStorage.getItem("clientRole");
    const clientActive = localStorage.getItem("clientActive");
    const name = localStorage.getItem("clientName");

    if (name) setClientName(name);

    if (!clientToken || role !== "client" || clientActive === "false") {
      navigate("/client/login", { replace: true });
    }
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("clientToken");
    localStorage.removeItem("clientId");
    localStorage.removeItem("clientName");
    localStorage.removeItem("clientRole");
    localStorage.removeItem("clientActive");
    navigate("/client/login");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* ==== TOP BAR ==== */}
      <AppBar
        position="fixed"
        sx={{
          background: "#0d6efd",
        }}
      >
        <Toolbar>
          {/* MOBILE MENU ICON REMOVED SINCE NO SIDEBAR */}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            📷 Welcome, {clientName}
          </Typography>

          <Button color="inherit" onClick={logout} sx={{ textTransform: "none" }}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* ==== MAIN CONTENT ==== */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: "70px", // space below AppBar
          background: "#f7f9fc",
          minHeight: "100vh",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
