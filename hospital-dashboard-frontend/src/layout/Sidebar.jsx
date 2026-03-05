import { Link } from "react-router-dom";
import { FaTachometerAlt, FaChartLine, FaBell, FaUserInjured, FaBed, FaHospital} from "react-icons/fa";
import { LuBed } from "react-icons/lu";
import { CiLogout } from "react-icons/ci";
import "../styles/sidebar.css";

const Sidebar = ({open, onClose}) => {
  let role = "";

  try {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      role = decoded.role;
    }
  } catch (err) {
    console.error("Token decode error:", err);
  }
  return (
    <>
    {open && (<div className="sidebar-overlay" onClick={onClose}></div>)}
    <div className={`sidebar ${open ? "open" : ""}`}>
      
<div className="logo-content">
  <FaHospital className="logo-icon" />
  <h2 className="logo">
    <span className="logo-bold">Med</span>Flow
  </h2>
</div>

      <div className="sidebar-links">
        <Link to="/dashboard" className="sidebar-link" onClick={onClose}>
          <FaTachometerAlt className="sidebar-icon" /> Dashboard
        </Link>
        <Link to="/patients" className="sidebar-link" onClick={onClose}>
        <FaUserInjured className="sidebar-icon" /> Patients
        </Link>
        <Link to="/resources" className="sidebar-link" onClick={onClose}>
          <FaBed className="sidebar-icon" /> Resources
        </Link>
        <Link to="/alerts" className="sidebar-link" onClick={onClose}>
          <FaBell className="sidebar-icon" /> Alerts
        </Link>
        <Link to="/predictions" className="sidebar-link" onClick={onClose}>
          <FaChartLine className="sidebar-icon" /> Predictions
        </Link>
        
        
        
      </div>
      
      <button
        className="logout-btn"
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }}
      >
        <CiLogout className="logout-icon" />
        <span>Logout</span>
        
      </button>
    </div>
    </>
  );
};

export default Sidebar;