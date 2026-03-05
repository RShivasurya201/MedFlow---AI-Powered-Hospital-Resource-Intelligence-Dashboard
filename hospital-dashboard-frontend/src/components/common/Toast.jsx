import "../../styles/toast.css";

const Toast = ({ message, type = "info", title }) => {
  return (
    <div className={`toast ${type}`}>
      {title && <strong>{title}</strong>}
      <p>{message}</p>
    </div>
  );
};

export default Toast;