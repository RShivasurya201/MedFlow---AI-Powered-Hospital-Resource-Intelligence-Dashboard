import { useState, useRef, useEffect } from "react";
import API from "../../api";
import { useToast } from "../../context/ToastContext";

const UpdateVitalsForm = ({ patient, onClose, onUpdated }) => {
  const [form, setForm] = useState({
    severityScore: patient.severityScore ?? "",
    oxygenLevel: patient.oxygenLevel ?? "",
    heartRate: patient.heartRate ?? ""
  });
  const formRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { showToast } = useToast();
  useEffect(() => {
  const handleClickOutside = (event) => {
    if (formRef.current && !formRef.current.contains(event.target)) {
      onClose();
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [onClose]);
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value === "" ? "" : Number(e.target.value)
    });
  };

  const validate = () => {
  const newErrors = {};

  if (form.severityScore < 0 || form.severityScore > 10) {
    newErrors.severityScore = "Severity must be between 0 and 10";
  }

  if (form.oxygenLevel < 70 || form.oxygenLevel > 100) {
    newErrors.oxygenLevel = "Oxygen must be between 70 and 100";
  }

  if (form.heartRate < 30 || form.heartRate > 200) {
    newErrors.heartRate = "Heart rate must be between 30 and 200";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
  
  const handleSubmit = async () => {
  if (!validate()) return;

  try {
    setLoading(true);

    await API.put(
      `/patients/vitals/${patient.patientId}`,
      form
    );
    showToast({
  title: "Vitals Updated",
  message: "Patient vitals updated successfully",
  type: "success"
});
    onUpdated();
  } catch (err) {
    console.error(err);
    alert("Failed to update vitals");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="update-vitals-card" ref={formRef}>
      <h4>Update Vitals</h4>

      <input
        name="severityScore"
        type="number"
        step="0.1"
        value={form.severityScore}
        onChange={handleChange}
        placeholder="Severity Score"
      />
      {errors.severityScore && (
  <span className="form-error">{errors.severityScore}</span>
)}
      <input
        name="oxygenLevel"
        type="number"
        value={form.oxygenLevel}
        onChange={handleChange}
        placeholder="Oxygen Level"
      />
      {errors.oxygenLevel && (
  <span className="form-error">{errors.oxygenLevel}</span>
)}
      <input
        name="heartRate"
        type="number"
        value={form.heartRate}
        onChange={handleChange}
        placeholder="Heart Rate"
      />
      {errors.heartRate && (
  <span className="form-error">{errors.heartRate}</span>
)}

      <div className="update-actions">
        <button className="primary-button" onClick={onClose}>Cancel</button>
        <button
          className="primary-button"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Updating..." : "Save"}
        </button>
      </div>
    </div>
  );
};

export default UpdateVitalsForm;