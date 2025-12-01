// import { Link } from "react-router-dom";

// export default function Sidebar() {
//   return (
//     <div className="bg-dark text-white sidebar p-3" style={{ width: "250px", minHeight: "100vh" }}>
//       <h4 className="mb-4">Admin Panel</h4>

//       <ul className="nav flex-column">

//         <li className="nav-item mb-2">
//           <Link to="/admin/dashboard" className="nav-link text-white">
//             <i className="fas fa-home me-2"></i> Dashboard
//           </Link>
//         </li>

//         <li className="nav-item mb-2">
//           <Link to="/admin/events" className="nav-link text-white">
//             <i className="fas fa-folder me-2"></i> Events
//           </Link>
//         </li>

//         <li className="nav-item mb-2">
//           <Link to="/admin/upload" className="nav-link text-white">
//             <i className="fas fa-upload me-2"></i> Upload Photos
//           </Link>
//         </li>

//         <li className="nav-item mb-2">
//           <Link to="/admin/clients" className="nav-link text-white">
//             <i className="fas fa-users me-2"></i> Clients
//           </Link>
//         </li>

//         <li className="nav-item mb-2">
//           <Link to="/admin/selections" className="nav-link text-white">
//             <i className="fas fa-check me-2"></i> Selections
//           </Link>
//         </li>

//       </ul>
//     </div>
//   );
// }

import { Link, useLocation } from "react-router-dom";

/* MUI COMPONENTS */
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

/* MUI ICONS */
import HomeIcon from "@mui/icons-material/Home";
import EventIcon from "@mui/icons-material/Event";
import UploadIcon from "@mui/icons-material/Upload";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    { text: "Dashboard", icon: <HomeIcon />, path: "/admin/dashboard" },
    { text: "Clients", icon: <PeopleIcon />, path: "/admin/clients" },
    { text: "Events", icon: <EventIcon />, path: "/admin/events" },
    { text: "Upload Photos", icon: <UploadIcon />, path: "/admin/upload" },
    { text: "Selections", icon: <CheckCircleIcon />, path: "/admin/selections" },
  ];

  return (
    <Box sx={{ width: 230, p: 2 }}>
      <Typography
        variant="h6"
        sx={{
          color: "white",
          fontWeight: "bold",
          mb: 2,
          textAlign: "center",
        }}
      >
        Admin Panel
      </Typography>

      <List>
        {menuItems.map((item) => {
          const active = location.pathname === item.path;

          return (
            <ListItemButton
              key={item.text}
              component={Link}
              to={item.path}
              sx={{
                mb: 1,
                borderRadius: 1,
                color: active ? "#0d6efd" : "#ddd",
                background: active ? "rgba(13,110,253,0.15)" : "transparent",
                "&:hover": {
                  background: "rgba(255,255,255,0.08)",
                },
              }}
            >
              <ListItemIcon sx={{ color: active ? "#0d6efd" : "#bbb" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: 15,
                }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
}
