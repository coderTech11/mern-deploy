import {
  Paper,
  Table,
  Box,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  IconButton,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  //state for view dialog
  const [viewUser, setViewUser] = useState(null);

  //state for edit dialog
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({ username: "", email: "" });

  //view functionality
  const openViewDialog = (user) => {
    setViewUser(user);
  };

  const closeViewDialog = () => {
    setViewUser(null);
  };

  //edit functionality
  const openEditDialog = (user) => {
    setEditUser(user);
    setEditForm({ username: user.username, email: user.email });
  };

  const closeEditDialog = () => {
    setEditUser(null);
  };

  const handleEditFormChange = (event) => {
    const { name, value } = event.target;
    setEditForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleEditSave = async () => {
    if (!editUser) return;
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/admin/editUsers/${editUser._id}`,
        editForm,
        { withCredentials: true }
      );
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u._id === editUser._id ? response.data : u))
      );
      closeEditDialog();
    } catch (err) {
      alert(
        `Failed to update user: ${err.response?.data?.error || err.message}`
      );
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/admin/users`,
          { withCredentials: true }
        );
        setUsers(response.data);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setError("Session expired.Please login again");
        } else {
          setError(
            `Failed to load users: ${err.response?.data?.error || err.message} `
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  //delete functionality
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user")) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/admin/deleteUsers/${id}`,
        { withCredentials: true }
      );
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
    } catch (err) {
      alert(
        `Failed to delete user: ${err.response?.data?.error || err.message}`
      );
    }
  };

  if (loading)
    return (
      <CircularProgress sx={{ display: "block", margin: "auto", mt: 5 }} />
    );
  if (error)
    return (
      <Typography color="error" textAlign="center" mt={5}>
        {error}
      </Typography>
    );

  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #f5f6fa 0%, #e3eafc 100%)",
        minHeight: "100vh",
        width: "100%",
        py: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ textAlign: "center", mb: 3 }}>
        All Users
      </Typography>
      <Paper
        sx={{
          p: 2,
          maxWidth: "900px",
          margin: "0 auto",
          width: "95%",
          borderRadius: 3,
          boxShadow: 3,
        }}
      >
        <Box sx={{ overflowX: "auto" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: { xs: 60, sm: 100 } }}>
                  Username
                </TableCell>
                <TableCell sx={{ width: { xs: 100, sm: 200 } }}>
                  Email
                </TableCell>
                <TableCell sx={{ width: { xs: 60, sm: 100 } }}>Role</TableCell>

                <TableCell align="center" sx={{ width: { xs: 90, sm: 120 } }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length === 0 && !loading ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell sx={{ width: { xs: 60, sm: 100 } }}>
                      {user.username}
                    </TableCell>
                    <TableCell
                      sx={{
                        width: { xs: 100, sm: 200 },
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {user.email}
                    </TableCell>
                    <TableCell
                      sx={{
                        width: { xs: 60, sm: 100 },
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {user.role}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ width: { xs: 90, sm: 120 } }}
                    >
                      <Tooltip title="View">
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => openViewDialog(user)}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Edit">
                        <IconButton
                          color="secondary"
                          size="small"
                          onClick={() => openEditDialog(user)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete">
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleDelete(user._id)}
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
        </Box>
      </Paper>

      {/* edit user dialog */}
      <Dialog
        open={!!editUser}
        onClose={closeEditDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="username"
            label="Username"
            type="text"
            fullWidth
            variant="outlined"
            value={editForm.username}
            onChange={handleEditFormChange}
            sx={{ mb: 2 }}
          />
        </DialogContent>

        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={editForm.email}
            onChange={handleEditFormChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditDialog}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* View user dialog */}
      <Dialog
        open={!!viewUser}
        onClose={closeViewDialog}
        maxWIdth="sm"
        fullWidth
      >
        <DialogTitle>User Details</DialogTitle>
        <DialogContent>
          {viewUser && (
            <Box>
              <Typography variant="body1" gutterBottom>
                <strong>Username: </strong>
                {viewUser.username}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Email: </strong>
                {viewUser.email}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>ID: </strong>
                {viewUser._id}
              </Typography>
              {viewUser.role && (
                <Typography variant="body1" gutterBottom>
                  <strong>Role: </strong>
                  {viewUser.role}
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeViewDialog} variant="contained" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
