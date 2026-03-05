import "../styles/topbar.css";

const Topbar = () => {
  const token = localStorage.getItem("token");
  let role = "";

  if (token) {
    role = JSON.parse(atob(token.split(".")[1])).role;
  }

  return (
    <div className="topbar">
      <span className="role-badge">{role}</span>
    </div>
  );
};

export default Topbar;