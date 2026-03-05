import { Outlet } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useToast } from "../context/ToastContext";
import alertSound from "../assets/alert.mp3";
import API from "../api";
import Sidebar from "./Sidebar";
import "../styles/layout.css";



const MainLayout = () => {
  const { showToast } = useToast();
  const lastAlertId = useRef(localStorage.getItem("lastAlertId"));
  const audioRef = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ✅ Initialize audio ONCE
  useEffect(() => {
    audioRef.current = new Audio(alertSound);
    audioRef.current.volume = 1; // optional
  }, []);

  // ✅ Alert polling
  useEffect(() => {
    const checkAlerts = async () => {
      try {
        const res = await API.get("/alerts");

        if (!res.data.length) return;

        const newest = res.data[0];

        if (newest._id !== lastAlertId.current) {
  lastAlertId.current = newest._id;
  localStorage.setItem("lastAlertId", newest._id);

  showToast({
    title: "Risk Alert",
    message: newest.message,
    type: newest.severity
  });

  if (newest.severity === "high" && audioRef.current) {
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  }
}

      } catch (err) {
        console.error(err);
      }
    };

    checkAlerts();
    const interval = setInterval(checkAlerts, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="layout">
      <Sidebar
  open={sidebarOpen}
  onClose={() => setSidebarOpen(false)}
/>
      <div className="main-content">
        {/* MOBILE HAMBURGER */}
    {!sidebarOpen && (<button
      className="hamburger"
      onClick={() => setSidebarOpen(true)}
    >
      ☰
    </button>)}

        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;