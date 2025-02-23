import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./auth.css";
import axios from "axios";

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //Reset errors
    setErrors({ username: "", email: "", password: "" });

    const { username, email, password } = formData;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/signup`,
        { username, email, password },
        { withCredentials: true }
      );
      console.log("response is", response);

      if (response.data && response.data.user) {
        toast.success("Signup successful! Now you can proceed to login.", {
          position: "top-center",
        });
      }
    } catch (error) {
      if (error.response && error.response.data.errors) {
        toast.error("Signup failed. Please try again later.", {
          position: "top-center",
        });
        setErrors(error.response.data.errors);
      }
    }
  };

  return (
    <section className="sign_container">
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <h1 className="heading">Signup</h1>

          {/* Username Input */}
          <div className="form-data">
            <label className="form-label" htmlFor="username">
              Username
            </label>
            <input
              className="form-input"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            {errors.username && <div className="error">{errors.username}</div>}
          </div>

          {/* Email Input */}
          <div className="form-data">
            <label htmlFor="email">Email</label>
            <input
              className="form-input"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <div className="error">{errors.email}</div>}
          </div>

          {/* Password Input */}
          <div className="form-data">
            <label htmlFor="password">Password</label>
            <input
              className="form-input"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors.password && <div className="error">{errors.password}</div>}
          </div>

          <button className="btn" type="submit">
            Sign up
          </button>
        </form>
      </div>
      <ToastContainer />
    </section>
  );
}
