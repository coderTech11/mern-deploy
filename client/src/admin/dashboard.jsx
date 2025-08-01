import { useEffect, useState } from "react";
import axios from "axios";
import {
  CardContent,
  Typography,
  Grid,
  Card,
  TableHead,
  TableRow,
  TableBody,
  Paper,
  Table,
  TableCell,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  const chartData =
    stats && stats.topProducts
      ? stats.topProducts.map((product) => ({
          product: product.title,
          purchases: product.count,
        }))
      : [];

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/admin/dashboard`,
          { withCredentials: true }
        );
        setStats(response.data);
        setLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setError("Session expired.Please login again");
        } else {
          setError("Failed to load dashboard data");
        }
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <Typography variant="h6" align="center" sx={{ my: 4 }}>
        Loading dashboard data....
      </Typography>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" color="error" align="center" sx={{ my: 4 }}>
        {error}
      </Typography>
    );
  }

  if (!stats) {
    return (
      <Typography variant="h6" color="error" align="center" sx={{ my: 4 }}>
        No data available
      </Typography>
    );
  }

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #f5f6fa 0%, #e3eafc 100%)",
        boxSizing: "border-box",
        padding: "2rem",
        width: "100%",
        overflowX: "hidden",
        maxWidth: "1300px",
        margin: "0 auto",
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Admin Dashboard
      </Typography>

      <Grid
        container
        spacing={3}
        alignItems="center"
        style={{ marginTop: "2rem" }}
      >
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          description="Registered Customers"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          description="Orders Placed"
        />
        <StatCard
          title="Total Revenue"
          value={`${stats.totalRevenue.toFixed(2)}`}
          description="Gross Revenue"
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          description="Active Listings"
        />
      </Grid>

      <Grid
        container
        spacing={3}
        alignItems="stretch"
        style={{ marginTop: "2rem" }}
      >
        {/* Bar Chart */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={3}
            style={{
              padding: "1.5rem 1rem 1.5rem 1rem",
              borderRadius: "16px",
              background: "#f9fafb",
              boxShadow: "0 2px 12px rgba(25, 118, 210, 0.06)",
              width: "100%",
              boxSizing: "border-box",
              marginBottom: "1rem",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Top Products By Sales
            </Typography>
            <div
              style={{
                width: "100%",
              }}
            >
              <BarChart
                xAxis={[
                  {
                    dataKey: "product",
                    label: "Product",
                    tickLabelStyle: { display: "none" },
                  },
                ]}
                series={[
                  {
                    dataKey: "purchases",
                    label: "Purchases",
                    color: "#1976d2",
                  },
                ]}
                dataset={chartData}
                height={350}
              />
            </div>
          </Paper>
        </Grid>

        {/* Recent Orders */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={3}
            style={{
              padding: "1rem",
              borderRadius: "16px",
              width: "100%",
              boxSizing: "border-box",
              marginBottom: "1rem",
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}
            >
              Recent Orders
            </Typography>
            <Table sx={{ fontSize: { xs: "0.80rem", md: "1rem" } }}>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontSize: { xs: "0.65rem", md: "0.95rem" },
                      padding: { xs: "2px", md: "6px" },
                    }}
                  >
                    Email
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: { xs: "0.65rem", md: "0.95rem" },
                      padding: { xs: "2px", md: "6px" },
                    }}
                  >
                    Amount
                  </TableCell>
                  <TableCell
                    sx={{
                      fontSize: { xs: "0.65rem", md: "0.95rem" },
                      padding: { xs: "2px", md: "6px" },
                    }}
                  >
                    Date
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {stats.recentOrders.map((order, index) => (
                  <TableRow key={index}>
                    <TableCell
                      sx={{
                        fontSize: { xs: "0.65rem", md: "0.89rem" },
                        padding: { xs: "2px", md: "6px" },
                        wordBreak: "break-all",
                        whiteSpace: "normal",
                        maxWidth: 140,
                      }}
                    >
                      {order.email}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: { xs: "0.65rem", md: "0.89rem" },
                        padding: { xs: "2px", md: "6px" },
                      }}
                    >
                      ${order.amount.toFixed(2)}
                    </TableCell>
                    <TableCell
                      sx={{
                        fontSize: { xs: "0.65rem", md: "0.87rem" },
                        padding: { xs: "2px", md: "6px" },
                      }}
                    >
                      {new Date(order.purchasedAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
                {stats.recentOrders.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      align="center"
                      sx={{
                        fontSize: { xs: "0.75rem", md: "1rem" },
                        padding: { xs: "4px", md: "8px" },
                      }}
                    >
                      No Recent Orders
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Paper>
        </Grid>

        {/* Top Purchased Products */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={3}
            style={{
              padding: "1rem",
              borderRadius: "16px",
              width: "100%",
              boxSizing: "border-box",
              marginBottom: "1rem",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Top Purchased Products
            </Typography>
            <List>
              {stats.topProducts.map((product, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={product.title}
                    secondary={`Purchased: ${product.count} times`}
                  />
                </ListItem>
              ))}
              {stats.topProducts.length === 0 && (
                <ListItem>
                  <ListItemText primary="No purchase data available for now" />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

function StatCard({ title, value, description }) {
  return (
    <Grid size={{ xs: 12, md: 3 }}>
      <Card
        sx={{
          borderLeft: "6px solid #1976d2",
          background: "#fff",
          boxShadow: "0 2px 12px rgba(25, 118, 210, 0.08)",
          borderRadius: "16px",
          marginBottom: "1rem",
        }}
      >
        <CardContent>
          <Typography color="textSecondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h5" sx={{ color: "#1976d2", fontWeight: 700 }}>
            {value}
          </Typography>
          {description && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {description}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Grid>
  );
}
