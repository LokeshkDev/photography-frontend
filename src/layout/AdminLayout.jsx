// import { useEffect, useState } from "react";
// import { Outlet, useNavigate } from "react-router-dom";
// import Sidebar from "../components/Sidebar";

// export default function AdminLayout() {
//   const navigate = useNavigate();
//   const [adminName, setAdminName] = useState("");

//   useEffect(() => {
//     const token = localStorage.getItem("adminToken");
//     const role = localStorage.getItem("adminRole");
//     const name = localStorage.getItem("adminName");

//     setAdminName(name || "Admin");

//     if (!token || role !== "admin") {
//       navigate("/admin/login", { replace: true });
//     }
//   }, [navigate]);

//   const logoutAdmin = () => {
//     localStorage.removeItem("adminToken");
//     localStorage.removeItem("adminRole");
//     localStorage.removeItem("adminId");
//     localStorage.removeItem("adminName");

//     navigate("/admin/login", { replace: true });
//   };

//   return (
//     <div style={{ display: "flex", minHeight: "100vh" }}>
//       <Sidebar />

//       <main style={{ flex: 1, padding: "20px" }}>
//         <div
//           style={{
//             padding: "10px",
//             background: "#111",
//             color: "#fff",
//             display: "flex",
//             justifyContent: "space-between",
//             marginBottom: "15px",
//             borderRadius: "6px",
//           }}
//         >
//           <span>👑 Admin: {adminName}</span>
//           <button
//             className="btn btn-danger btn-sm"
//             onClick={logoutAdmin}
//           >
//             Logout
//           </button>
//         </div>

//         <Outlet />
//       </main>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

/* MUI */
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import Sidebar from "../components/Sidebar";

const drawerWidth = 230;

export default function AdminLayout() {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState("Admin");
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleDrawer = () => setMobileOpen((prev) => !prev);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const role = localStorage.getItem("adminRole");
    const name = localStorage.getItem("adminName");

    console.log("ADMIN NAME STORED:", name);
    if (name) setAdminName(name);
    if (!token || role !== "admin") {
      navigate("/admin/login", { replace: true });
    }
  }, [navigate]);

  const logoutAdmin = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRole");
    localStorage.removeItem("adminId");
    localStorage.removeItem("adminName");
    navigate("/admin/login", { replace: true });
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* ===== TOP APP BAR ===== */}
      <AppBar
        position="fixed"
        sx={{
          background: "#111",
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          {/* Mobile menu button */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            👑 Admin: {adminName}
          </Typography>

          <Button
            color="error"
            variant="contained"
            size="small"
            onClick={logoutAdmin}
            sx={{ textTransform: "none" }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* ===== SIDEBAR DESKTOP ===== */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            background: "#000",
            color: "#fff",
          },
        }}
        open
      >
        <Sidebar />
      </Drawer>

      {/* ===== SIDEBAR MOBILE ===== */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={toggleDrawer}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            background: "#000",
            color: "#fff",
          },
        }}
      >
        <Sidebar />
      </Drawer>

      {/* ===== MAIN CONTENT ===== */}
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

