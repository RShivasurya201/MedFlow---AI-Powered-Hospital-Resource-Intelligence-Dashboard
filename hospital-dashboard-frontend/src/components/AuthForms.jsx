import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from 'react-select';
import API from "../api";
import "../styles/auth.css";
import { useToast } from "../context/ToastContext";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: ""              
  });

  
  const roleOptions = [
    { value: 'ANALYST', label: 'Analyst' },
    { value: 'ADMIN', label: 'Admin' }
  ];


  const selectStyles = {
    control: (provided, state) => ({
      ...provided,
      width: '100%',
      minHeight: '48px',               
      padding: '12px',                 
      border: '1px solid #90e4c1',
      borderRadius: 6,
      backgroundColor: '#ffffff',
      marginBottom: '15px',            
      display: 'flex',
      alignItems: 'center',            
      boxShadow: state.isFocused ? '0 0 0 1px #014e56' : provided.boxShadow,
      '&:hover': {
        borderColor: '#014e56'
      }
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#999',                  
      textAlign: 'left',              
      marginLeft: 0                   
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#014e56',
      textAlign: 'left'               
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: 6,
      marginTop: 0
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#90e4c1' : '#ffffff',
      color: '#014e56'
    })
  };
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

 
  const validateEmail = (addr) => /\S+@\S+\.\S+/.test(addr);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    if (error) setError("");
  };

  const handleRoleChange = (selected) => {
    setFormData({
      ...formData,
      role: selected?.value || ''
    });
    if (error) setError("");
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      if (isLogin) {
        const res = await API.post("/auth/login", {
          email: formData.email,
          password: formData.password
        });

        localStorage.setItem("token", res.data.token);

        console.log("TOKEN:", res.data.token);
        navigate("/dashboard");

      } else {
        await API.post("/auth/register", formData);
        setSuccess("Registered successfully! Please login.");
        setIsLogin(true);
      }

    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">
          {isLogin ? "Login" : "Register"}
        </h2>

        {error && (
          <p style={{ color: "red", marginBottom: "10px" }}>
            {error}
          </p>
        )}
        {success && (
          <p style={{ color: "#28a745", marginBottom: "10px" }}>
            {success}
          </p>
        )}

        {!isLogin && (
          <>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="auth-input"
              onChange={handleChange}
            />

            <Select
              name="role"
              options={roleOptions}
              
              value={formData.role ? roleOptions.find(opt => opt.value === formData.role) : null}
              onChange={handleRoleChange}
              styles={selectStyles}
              placeholder="Role"
            />
          </>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="auth-input"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="auth-input"
          onChange={handleChange}
        />

        <button
  className="auth-button"
  onClick={handleSubmit}
  disabled={loading}
>
  {loading
    ? (isLogin ? "Logging in..." : "Registering...")
    : (isLogin ? "Login" : "Register")}
</button>

        <p
          className="auth-switch"
          onClick={() => {
            setIsLogin(!isLogin);
            setError("");
            setSuccess("");
          }}
        >
          {isLogin
            ? "Don't have an account?"
            : "Already have an account?"}
          <br />
          <span className="auth-clickable">
            {isLogin ? "Register here" : "Login here"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;