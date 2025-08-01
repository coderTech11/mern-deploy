import {
  Alert,
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/admin/orders`,
          { withCredentials: true }
        );
        setOrders(response.data);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setError("Session expired.Please login again");
        } else {
          setError(
            `Failed to load orders: ${err.response?.data?.error || err.message}`
          );
        }
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #f5f6fa 0%, #e3eafc 100%)",
        px: { xs: 1, sm: 2, md: 4 },
        py: { xs: 2, md: 4 },
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Orders
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper
        elevation={3}
        sx={{
          borderRadius: 3,
          overflowX: "auto",
          boxShadow: "0 2px 12px rgba(25, 118, 210, 0.06)",
          minWidth: { xs: 320, sm: 500, md: 850 },
        }}
      >
        <Table
          sx={{
            minWidth: { xs: 320, sm: 500, md: 850 },
            "& th, & td": {
              fontSize: { xs: "0.85rem", md: "1rem" },
              color: "#333",
              padding: { xs: "6px 4px", md: "14px 10px" },
            },
            "& th": {
              background: "#f5f6fa",
              letterSpacing: 0.5,
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order, idx) => (
                <TableRow key={idx}>
                  <TableCell>{order.username}</TableCell>
                  <TableCell>{order.email}</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{order.title}</TableCell>
                  <TableCell sx={{ color: "#1976d2", fontWeight: 600 }}>
                    ${order.price}
                  </TableCell>
                  <TableCell>{order.quantity}</TableCell>
                  <TableCell>${order.amount}</TableCell>
                  <TableCell>
                    {order.purchasedAt
                      ? dayjs(order.purchasedAt).format("YYYY-MM-DD HH:mm")
                      : "-"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
