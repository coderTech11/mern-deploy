import { NavLink, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./auth.css";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

  //Redirect to home if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

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
    setErrors({ email: "", password: "" });

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/login`,
        formData,
        { withCredentials: true }
      );

      if (response.data && response.data.user) {
        setIsAuthenticated(true);
        navigate("/");
      }
    } catch (error) {
      if (error.response && error.response.data.errors) {
        toast.error("Login failed. Please try again later.", {
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
          <h1 className="heading">Login</h1>

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
            Login
          </button>
        </form>
      </div>

      <div className="create_accountinfo">
        <p className="no-account-text">Don't have an account?</p>
        <NavLink to="/signup">
          <button>Create your Account</button>
        </NavLink>
      </div>
      <ToastContainer />
    </section>
  );
}
