import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import {
  CircularProgress,
  Box,
  Typography,
  Alert,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tooltip,
  IconButton,
  DialogTitle,
  DialogContent,
  Avatar,
  DialogActions,
  Dialog,
  TextField,
  Button,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  //view dialog state
  const [viewProduct, setViewProduct] = useState(null);

  //edit dialog state
  const [editProduct, setEditProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
    image: "",
  });

  //open view dialog
  const openViewDialog = (product) => setViewProduct(product);

  const closeViewDialog = () => setViewProduct(null);

  const handleEditFormChange = (event) => {
    const { name, value } = event.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSave = async () => {
    if (!editProduct) return;
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/admin/editProduct/${
          editProduct._id
        }`,
        editForm,
        { withCredentials: true }
      );

      setProducts((prev) =>
        prev.map((p) => (p._id === editProduct._id ? response.data : p))
      );
      closeEditDialog();
    } catch (err) {
      alert(
        `Failed to update product: ${err.response?.data?.error || err.message}`
      );
    }
  };

  //fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/admin/products`,
          { withCredentials: true }
        );
        setProducts(response.data);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setError("Session expired.Please login again");
        } else {
          setError(
            `Failed to load products: ${
              err.response?.data?.error || err.message
            }`
          );
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  //open edit dialog
  const openEditDialog = (product) => {
    setEditProduct(product);
    setEditForm({
      title: product.title || "",
      price: product.price || "",
      description: product.description || "",
      category: product.category || "",
      image: product.image || "",
    });
  };

  const closeEditDialog = () => {
    setEditProduct(null);
  };

  //delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/admin/deleteProduct/${id}`,
        { withCredentials: true }
      );
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(
        `Failed to delete product: ${err.response?.data?.error || err.message}`
      );
    }
  };

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
        Products
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
        }}
      >
        <Table
          sx={{
            minWidth: 400,
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
              <TableCell>Image</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Price</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>
                    <Avatar
                      src={product.image}
                      variant="square"
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        boxShadow: "0 1px 4px rgba(25, 118, 210, 0.08)",
                        mx: "auto",
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>
                    {product.title}
                  </TableCell>
                  <TableCell sx={{ color: "#1976d2", fontWeight: 600 }}>
                    ${product.price}
                  </TableCell>

                  <TableCell align="center">
                    <Tooltip title="View">
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => openViewDialog(product)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Edit">
                      <IconButton
                        color="secondary"
                        size="small"
                        onClick={() => openEditDialog(product)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete">
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDelete(product._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* View Product Dialog */}
      <Dialog
        open={!!viewProduct}
        onClose={closeViewDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Product Details</DialogTitle>
        <DialogContent dividers>
          {viewProduct && (
            <Box>
              <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                <Avatar
                  src={viewProduct.image}
                  variant="square"
                  sx={{ width: 80, height: 80, borderRadius: 2 }}
                />
              </Box>
              <Typography variant="subtitle1">
                <b>Title:</b> {viewProduct.title}
              </Typography>
              <Typography variant="subtitle1">
                <b>Price:</b> ${viewProduct.price}
              </Typography>
              <Typography variant="subtitle1">
                <b>Category:</b> {viewProduct.category}
              </Typography>
              <Typography variant="subtitle1">
                <b>Description:</b> {viewProduct.description}
              </Typography>
              {viewProduct.rating && (
                <Typography variant="subtitle1">
                  <b>Rating:</b> {viewProduct.rating.rate} (
                  {viewProduct.rating.count} reviews)
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeViewDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit product dialog */}
      <Dialog
        open={!!editProduct}
        onClose={closeEditDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Title"
            type="text"
            fullWidth
            variant="outlined"
            value={editForm.title}
            onChange={handleEditFormChange}
            sx={{ mb: 2 }}
          />

          <TextField
            margin="dense"
            name="price"
            label="Price"
            type="number"
            fullWidth
            variant="outlined"
            value={editForm.price}
            onChange={handleEditFormChange}
            sx={{ mb: 2 }}
          />

          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            value={editForm.description}
            onChange={handleEditFormChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="category"
            label="Category"
            type="text"
            fullWidth
            variant="outlined"
            value={editForm.category}
            onChange={handleEditFormChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="image"
            label="Image URL"
            type="url"
            fullWidth
            variant="outlined"
            value={editForm.image}
            onChange={handleEditFormChange}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditDialog}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
