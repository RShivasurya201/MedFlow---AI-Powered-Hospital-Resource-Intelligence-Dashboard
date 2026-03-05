import { useEffect, useState } from "react";
import API from "../../api";
import "../../styles/patients.css";
import VitalsChart from "./VitalsChart";
import UpdateVitalsForm from "./UpdateVitalsForm";
import { useToast } from "../../context/ToastContext";

const PatientDrawer = ({ patient, onClose, onRefresh, readOnly = false }) => {
  const [history, setHistory] = useState([]);
  const [showVitalsForm, setShowVitalsForm] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await API.get(
          `/patients/history/${patient.patientId}`
        );
        setHistory(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchHistory();
  }, [patient]);

  const handleDischarge = async () => {
    try {
      await API.put(
        `/patients/discharge/${patient.patientId}`
      );

      showToast({
        title: "Patient Discharged",
        message: `${patient.name} discharged successfully`,
        type: "success"
      });

      onRefresh();
      onClose();
    } catch (err) {
      console.error(err);
      showToast({
        message: "Error discharging patient",
        type: "error"
      });
    }
  };

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div
        className="drawer"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="drawer-header">
          <div>
            <h3>
              <span className="label">Patient ID: </span>
              {patient.patientId}
            </h3>
            <h3>
              <span className="label">Name: </span>
              {patient.name}
            </h3>
          </div>
          <button onClick={onClose}>✕</button>
        </div>

        {/* SUMMARY */}
        <div className="drawer-summary">
          <div className="summary-item">
            <span className="label">Age</span>
            <span className="value">{patient.age}</span>
          </div>

          <div className="summary-item">
            <span className="label">Severity</span>
            <span className="value">{patient.severity}</span>
          </div>

          <div className="summary-item">
            <span className="label">Severity Score</span>
            <span className="value">
              {patient.severityScore}
            </span>
          </div>

          <div className="summary-item">
            <span className="label">ICU Risk</span>
            <span className="value">
              {(patient.icuRiskProbability * 100).toFixed(1)}%
            </span>
          </div>

          <div className="summary-item">
            <span className="label">Ward</span>
            <span className="value">
              {patient.assignedBedType}
            </span>
          </div>

          <div className="summary-item">
            <span className="label">Status</span>
            <span className="value">{patient.status}</span>
          </div>
        </div>

        {/* CHART */}
        <div className="drawer-chart">
          <h4>Vitals Trend</h4>
          <VitalsChart history={history} />
        </div>

        {/* UPDATE VITALS FORM (Admin Only) */}
        {!readOnly && showVitalsForm && (
          <UpdateVitalsForm
            patient={patient}
            onClose={() => setShowVitalsForm(false)}
            onUpdated={async () => {
              setShowVitalsForm(false);

              const res = await API.get(
                `/patients/history/${patient.patientId}`
              );
              setHistory(res.data);

              onRefresh();
            }}
          />
        )}

        {/* ACTIONS (Admin Only) */}
        {!readOnly && patient.status !== "discharged" && (
          <div className="drawer-actions">
            <button
              className="secondary-btn"
              onClick={() => setShowVitalsForm(true)}
            >
              Update Vitals
            </button>

            <button
              className="danger-btn"
              onClick={handleDischarge}
            >
              Discharge Patient
            </button>
          </div>
        )}

        
      </div>
    </div>
  );
};

export default PatientDrawer;