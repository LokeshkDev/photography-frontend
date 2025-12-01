import { Box, Grid, Card, CardContent, Typography } from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import GroupIcon from "@mui/icons-material/Group";
import usePageTitle from "../hooks/usePageTitle";

export default function Dashboard() {

  usePageTitle("Dashboard");
  return (
    <Box>
      <Typography
        variant="h4"
        sx={{ mb: 3, fontWeight: "bold" }}
      >
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* TOTAL EVENTS */}
        <Grid item xs={12} sm={6} md={4} sx={{ display: "flex" }}>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                  >
                    Total Events
                  </Typography>
                  <Typography variant="h3" sx={{ mt: 1 }}>
                    12
                  </Typography>
                </Box>
                <EventIcon sx={{ fontSize: 40, color: "primary.main" }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* TOTAL CLIENTS */}
        <Grid item xs={12} sm={6} md={4} sx={{ display: "flex" }}>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                  >
                    Total Clients
                  </Typography>
                  <Typography variant="h3" sx={{ mt: 1 }}>
                    48
                  </Typography>
                </Box>
                <GroupIcon sx={{ fontSize: 40, color: "primary.main" }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
