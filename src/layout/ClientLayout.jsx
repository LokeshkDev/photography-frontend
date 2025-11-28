// import { useEffect } from "react";
// import { Outlet, useNavigate, Link } from "react-router-dom";

// export default function ClientLayout() {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const clientToken = localStorage.getItem("clientToken");
//     const role = localStorage.getItem("clientRole");
//     const clientActive = localStorage.getItem("clientActive");

//     if (!clientToken || role !== "client" || clientActive === "false") {
//       navigate("/client/login", { replace: true });
//     }
//   }, [navigate]);

//   const logout = () => {
//     localStorage.removeItem("clientToken");
//     localStorage.removeItem("clientId");
//     localStorage.removeItem("clientName");
//     localStorage.removeItem("clientRole");
//     localStorage.removeItem("clientActive");
//     navigate("/client/login");
//   };

//   return (
//     <div>
//       {/* ==== NAVBAR ==== */}
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           padding: "10px 20px",
//           background: "#0d6efd",
//           color: "white",
//         }}
//       >
//         <div>
//           <b>{localStorage.getItem("clientName")}</b> — Client Panel
//         </div>

//         <div style={{ display: "flex", gap: "15px" }}>
//           <Link to="/client/dashboard" style={{ color: "white", textDecoration: "none" }}>
//             Dashboard
//           </Link>
//           <Link to="/client/events" style={{ color: "white", textDecoration: "none" }}>
//             Events
//           </Link>
//           <button
//             onClick={logout}
//             style={{
//               background: "white",
//               color: "#0d6efd",
//               border: "none",
//               padding: "5px 12px",
//               borderRadius: "4px",
//               cursor: "pointer",
//             }}
//           >
//             Logout
//           </button>
//         </div>
//       </div>

//       {/* ==== CONTENT ==== */}
//       <Outlet />
//     </div>
//   );
// }

import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

/* MUI */
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import EventIcon from "@mui/icons-material/Event";
import DashboardIcon from "@mui/icons-material/Dashboard";

const drawerWidth = 220;

export default function ClientLayout() {
  const navigate = useNavigate();
  const [clientName, setClientName] = useState("Client");
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleDrawer = () => setMobileOpen((prev) => !prev);

  useEffect(() => {
    const clientToken = localStorage.getItem("clientToken");
    const role = localStorage.getItem("clientRole");
    const clientActive = localStorage.getItem("clientActive");
    const name = localStorage.getItem("clientName");

    if (name) setClientName(name);

    // keep original protection logic (includes active flag)
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

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/client/dashboard" },
    { text: "My Events", icon: <EventIcon />, path: "/client/events" },
  ];

  const drawerContent = (
    <Box>
      <Box sx={{ p: 2, mt: 1 }}>
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: "bold", mb: 2 }}
        >
          CLIENT MENU
        </Typography>
      </Box>

      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            onClick={() => navigate(item.path)}
            sx={{ mb: 1 }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      {/* ==== TOP BAR ==== */}
      <AppBar
        position="fixed"
        sx={{
          background: "#0d6efd",
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            sx={{ display: { sm: "none" }, mr: 2 }}
            color="inherit"
            onClick={toggleDrawer}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            📷 Welcome, {clientName}
          </Typography>

          <Button color="inherit" onClick={logout} sx={{ textTransform: "none" }}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* ==== DESKTOP SIDEBAR ==== */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            background: "#f4f7fb",
            borderRight: "1px solid #e0e0e0",
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>

      {/* ==== MOBILE SIDEBAR ==== */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={toggleDrawer}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* ==== MAIN CONTENT ==== */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: "64px",
          minHeight: "100vh",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

