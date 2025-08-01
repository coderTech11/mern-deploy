import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Paper,
  Select,
  TextField,
  Typography,
  MenuItem,
} from "@mui/material";

export default function AddProduct() {
  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
    setSuccessMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    //validation
    if (!form.title.trim() || !form.price || !form.category) {
      setError("Title, price and category are required");
      return;
    }
    if (isNaN(form.price) || Number(form.price) <= 0) {
      setError("Price must be a positive number");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
      };
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/admin/products`,
        payload,
        { withCredentials: true }
      );
      toast.success("Product added successfully!", { position: "top-right" });
      setForm({
        title: "",
        price: "",
        description: "",
        category: "",
        image: "",
      });
      setSuccessMessage("Product added successfully!");
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "An unexpected error occured.Please try again"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box
        sx={{
          background: "linear-gradient(135deg, #f5f6fa 0%, #e3eafc 100%)",
          minHeight: "calc(100vh - 64px)",
          width: "100%",
          py: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ mb: 3, textAlign: "center" }}
        >
          Add New Product
        </Typography>
        <Paper
          component="form"
          onSubmit={handleSubmit}
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            maxWidth: "600px",
            width: "95%",
            borderRadius: 3,
            boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.1)",
          }}
        >
          {error && (
            <Typography color="error" sx={{ mb: 2, textAlign: "center" }}>
              {error}
            </Typography>
          )}

          {successMessage && (
            <Typography
              color="success.main"
              sx={{ mb: 2, textAlign: "center" }}
            >
              {successMessage}
            </Typography>
          )}

          <TextField
            required
            fullWidth
            margin="normal"
            name="title"
            label="Title"
            type="text"
            variant="outlined"
            value={form.title}
            onChange={handleChange}
            disabled={loading}
            autoComplete="off"
          />
          <TextField
            required
            fullWidth
            margin="normal"
            name="price"
            label="Price"
            type="number"
            variant="outlined"
            value={form.price}
            onChange={handleChange}
            disabled={loading}
            autoComplete="off"
          />
          <TextField
            required
            fullWidth
            margin="normal"
            name="description"
            label="Description"
            type="text"
            variant="outlined"
            value={form.description}
            onChange={handleChange}
            disabled={loading}
            autoComplete="off"
          />
          <FormControl fullWidth margin="normal" disabled={loading}>
            <InputLabel id="category-select-label">Category</InputLabel>
            <Select
              lableId="category-select-label"
              id="category-select"
              name="category"
              value={form.category}
              label="Category"
              onChange={handleChange}
            >
              <MenuItem value="men's clothing">Men's Clothing</MenuItem>
              <MenuItem value="women's clothing">Women's Clothing</MenuItem>
              <MenuItem value="electronics">Electronics</MenuItem>
              <MenuItem value="jewelery">Jewelery</MenuItem>
            </Select>
          </FormControl>

          <TextField
            required
            fullWidth
            margin="normal"
            name="image"
            label="Image URL"
            type="url"
            variant="outlined"
            value={form.image}
            onChange={handleChange}
            disabled={loading}
            autoComplete="off"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, py: 1.5, fontSize: "1rem" }}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Add Product"
            )}
          </Button>
        </Paper>
      </Box>
      <ToastContainer />
    </>
  );
}
