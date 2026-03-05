import { createContext, useState, useContext, useEffect } from "react";
import API from "../api";
import Toast from "../components/common/Toast";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
  const [latestAlertId, setLatestAlertId] = useState(null);

  const showToast = ({ message, type = "info", title }) => {
    setToast({ message, type, title });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };


  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          title={toast.title}
        />
      )}
    </ToastContext.Provider>
  );
};