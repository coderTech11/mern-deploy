import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Typography,
  Paper,
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

export default function CreateUser() {
  const [createUserForm, setCreateUserForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleCreateUserFormChange = (event) => {
    const { name, value } = event.target;
    setCreateUserForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
    setError("");
    setSuccessMessage("");
  };

  const handleCreateUserSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    if (
      !createUserForm.username.trim() ||
      !createUserForm.email.trim() ||
      !createUserForm.password
    ) {
      setError("Username, email and password are required");
      return;
    }

    if (createUserForm.password !== createUserForm.confirmPassword) {
      setError("Password do not match");
      return;
    }

    if (createUserForm.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    //basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(createUserForm.email)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const newUserPayload = {
        username: createUserForm.username,
        email: createUserForm.email,
        password: createUserForm.password,
        role: createUserForm.role,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/admin/signup`,
        newUserPayload,
        { withCredentials: true }
      );
      console.log("response is", response);

      toast.success("User created successfully!", { position: "top-right" });
      setCreateUserForm({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "user",
      });
    } catch (err) {
      if (err.response && err.response.data.errors) {
        setError(err.response.data.errors);
      } else {
        setError("An unexpected error occured.Please try again");
      }
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
          Create New User
        </Typography>
        <Paper
          component="form"
          onSubmit={handleCreateUserSubmit}
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
              {typeof error === "string"
                ? error
                : Object.values(error).map((mssg, i) => (
                    <div key={i}>{mssg}</div>
                  ))}
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
            name="username"
            label="Username"
            type="text"
            variant="outlined"
            value={createUserForm.username}
            onChange={handleCreateUserFormChange}
            disabled={loading || !!successMessage}
            autoComplete="off"
          />

          <TextField
            required
            fullWidth
            margin="normal"
            name="email"
            label="Email"
            type="email"
            variant="outlined"
            value={createUserForm.email}
            onChange={handleCreateUserFormChange}
            disabled={loading || !!successMessage}
            autoComplete="off"
          />

          <TextField
            required
            fullWidth
            margin="normal"
            name="password"
            label="Password"
            type="password"
            variant="outlined"
            value={createUserForm.password}
            onChange={handleCreateUserFormChange}
            disabled={loading || !!successMessage}
            autoComplete="new-password"
          />

          <TextField
            required
            fullWidth
            margin="normal"
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            variant="outlined"
            value={createUserForm.confirmPassword}
            onChange={handleCreateUserFormChange}
            disabled={loading || !!successMessage}
            autoComplete="new-password"
          />

          <FormControl
            fullWidth
            margin="normal"
            disabled={loading || !!successMessage}
          >
            <InputLabel id="role-select-label">Role</InputLabel>
            <Select
              labelId="role-select-label"
              id="role-select"
              name="role"
              value={createUserForm.role}
              label="Role"
              onChange={handleCreateUserFormChange}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, py: 1.5, fontSize: "1rem" }}
            disabled={loading || !!successMessage}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Create User"
            )}
          </Button>
        </Paper>
      </Box>
      <ToastContainer />
    </>
  );
}
