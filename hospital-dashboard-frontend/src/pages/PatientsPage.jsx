import { useEffect, useState, useMemo, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import API from "../api";
import "../styles/patients.css";
import AddPatientModal from "../components/patients/AddPatientModal";
import PatientDrawer from "../components/patients/PatientDrawer";


const PatientsPage = () => {
  const token = localStorage.getItem("token");
  const didMountRef = useRef(false);
  const user = useMemo(() => {
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch {
      return null;
    }
  }, [token]);


  const isAdmin = user?.role?.toLowerCase() === "admin";

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    search: "",
    severity: "",
    ward: "",
    status: ""
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const limit = 10;

  const fetchPatients = async () => {
    try {
      if (initialLoad) setLoading(true)
      const res = await API.get("/patients/search", {
        params: {
          page,
          limit,
          ...filters
        }
      });

      setPatients(res.data.patients);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    }
    finally {
      setLoading(false);
      setInitialLoad(false);
        }
  };

  useEffect(() => {
  fetchPatients();
}, [page, filters.severity, filters.ward, filters.status]);

useEffect(() => {
  if (!didMountRef.current) {
    didMountRef.current = true;
    return; // skip first render
  }

  const delay = setTimeout(() => {
    fetchPatients();
  }, 500);

  return () => clearTimeout(delay);
}, [filters.search]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      severity: "",
      ward: "",
      status: ""
    });
  };

    if (loading) {
    return (
      <div className="prediction-loading">
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading patient data...</p>
      </div>
      </div>
    );
  }


  return (
    <div className="patients-page">

      <p>
        <span className="total-patients">Total Patients: </span> {total}
      </p>

      {/* FILTER BAR */}
      <div className="filters-bar">
        <input
          type="text"
          name="search"
          placeholder="Search by Patient ID"
          value={filters.search}
          onChange={handleFilterChange}
        />

        <select name="severity" value={filters.severity} onChange={handleFilterChange}>
          <option value="">All Severity</option>
          <option value="mild">Mild</option>
          <option value="moderate">Moderate</option>
          <option value="severe">Severe</option>
        </select>

        <select name="ward" value={filters.ward} onChange={handleFilterChange}>
          <option value="">All Wards</option>
          <option value="ICU">ICU</option>
          <option value="GENERAL">General</option>
        </select>

        <select name="status" value={filters.status} onChange={handleFilterChange}>
          <option value="">All Status</option>
          <option value="admitted">Admitted</option>
          <option value="discharged">Discharged</option>

        </select>

        <button className="clear-btn" onClick={clearFilters}>
          Clear
        </button>

        {/* 🔒 Admit Button — Admin Only */}
        {isAdmin && (
          <button
            className="primary-button admit-btn"
            onClick={() => setShowAddModal(true)}
          >
            + Admit Patient
          </button>
        )}
      </div>

      {/* TABLE */}
      <table className="patients-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Severity</th>
            <th>ICU Risk</th>
            <th>Ward</th>
            <th>Oxygen</th>
            <th>HR</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {patients.length === 0 ? (
            <tr>
              <td colSpan="8" className="no-records">
                No matching records found
              </td>
            </tr>
          ) : (
            patients.map((patient) => (
              <tr
                key={patient._id}
                onClick={() => setSelectedPatient(patient)}
                className="clickable-row"
              >
                <td>{patient.patientId}</td>
                <td>{patient.name}</td>
                <td>{patient.severity}</td>
                <td>
                  {(patient.icuRiskProbability * 100).toFixed(1)}%
                </td>
                <td>{patient.assignedBedType}</td>
                <td>{patient.oxygenLevel}</td>
                <td>{patient.heartRate}</td>
                <td>{patient.status}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* 🔒 Drawer — pass readOnly flag */}
      {selectedPatient && (
        <PatientDrawer
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
          onRefresh={fetchPatients}
          readOnly={!isAdmin}
        />
      )}

      {/* 🔒 Add Modal — Admin Only */}
      {isAdmin && showAddModal && (
        <AddPatientModal
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchPatients}
        />
      )}

      {/* PAGINATION */}
      <div className="pagination">
        <button
          className="page-btn"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          className="page-btn"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>

    </div>
  );
};

export default PatientsPage;