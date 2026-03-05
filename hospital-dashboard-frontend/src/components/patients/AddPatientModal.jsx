import { useState } from "react";
import API from "../../api";
import "../../styles/patients.css";
import { useToast } from "../../context/ToastContext";

const AddPatientModal = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    patientId: "",
    name: "",
    age: "",
    severity: "moderate",
    severityScore: "",
    oxygenLevel: "",
    heartRate: "",
    comorbiditiesCount: ""
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { showToast } = useToast();

  const checkDuplicate = async () => {
  if (!form.patientId.trim()) return;

  try {
    const res = await API.get(`/patients/check/${form.patientId}`);

    if (res.data.exists) {
      setErrors((prev) => ({
        ...prev,
        patientId: "Patient ID already exists"
      }));
    }
  } catch (err) {
    console.error(err);
  }
};

  const handleChange = (e) => {
  const { name, value } = e.target;

  setForm({ ...form, [name]: value });

  // remove error when user edits field
  if (errors[name]) {
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated[name];
      return updated;
    });
  }
};

  const validate = () => {
  const newErrors = {};

  if (!form.patientId.trim())
    newErrors.patientId = "Patient ID is required";
  if (!form.name.trim())
    newErrors.name = "Patient name is required";
  if (!form.age)
    newErrors.age = "Age is required";
  else if (form.age < 0 || form.age > 120)
    newErrors.age = "Age must be between 0 and 120";

  if (form.severityScore === "")
    newErrors.severityScore = "Severity score required";
  else if (form.severityScore < 0 || form.severityScore > 10)
    newErrors.severityScore = "Must be between 0 and 10";

  if (form.oxygenLevel === "")
    newErrors.oxygenLevel = "Oxygen level required";
  else if (form.oxygenLevel < 70 || form.oxygenLevel > 100)
    newErrors.oxygenLevel = "Must be between 70 and 100";

  if (form.heartRate === "")
    newErrors.heartRate = "Heart rate required";
  else if (form.heartRate < 30 || form.heartRate > 200)
    newErrors.heartRate = "Must be between 30 and 200";

  if (form.comorbiditiesCount === "")
    newErrors.comorbiditiesCount = "Comorbidities required";
  else if (form.comorbiditiesCount < 0 || form.comorbiditiesCount > 20)
    newErrors.comorbiditiesCount = "Must be between 0 and 20";

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  const handleSubmit = async () => {
  if (!validate()) return;

  try {
    setLoading(true);

    await API.post("/patients/admit", {
      ...form,
      age: Number(form.age),
      severityScore: Number(form.severityScore),
      oxygenLevel: Number(form.oxygenLevel),
      heartRate: Number(form.heartRate),
      comorbiditiesCount: Number(form.comorbiditiesCount)
    });

showToast({
  title: "Patient Admitted",
  message: `${form.name} admitted successfully`,
  type: "success"
});

onSuccess();
onClose();

    onSuccess();
    onClose();
  } catch (err) {
    if (err.response?.data?.field) {
    setErrors((prev) => ({
      ...prev,
      [err.response.data.field]: err.response.data.message
    }));
  } else {
    console.error(err);
  } 
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h3>Admit New Patient</h3>

        <input
          name="patientId"
          placeholder="Patient ID"
          onChange={handleChange}
          onBlur={checkDuplicate}
        />
        {errors.patientId && (
  <span className="form-error">{errors.patientId}</span>
)}
        <input
          name="name"
          placeholder="name"
          onChange={handleChange}
          
        />
        {errors.name && (
  <span className="form-error">{errors.name}</span>
)}

        <input
          name="age"
          placeholder="Age"
          onChange={handleChange}
          
        />
        {errors.age && (
  <span className="form-error">{errors.age}</span>
)}

        <select name="severity" onChange={handleChange}>
          <option value="mild">Mild</option>
          <option value="moderate">Moderate</option>
          <option value="severe">Severe</option>
        </select>
        

        <input
          name="severityScore"
          placeholder="Severity Score"
          onChange={handleChange}
        />
        {errors.severityScore && (
  <span className="form-error">{errors.severityScore}</span>
)}
        <input
          name="oxygenLevel"
          placeholder="Oxygen Level"
          onChange={handleChange}
        />
        {errors.oxygenLevel && (
  <span className="form-error">{errors.oxygenLevel}</span>
)}
        <input
          name="heartRate"
          placeholder="Heart Rate"
          onChange={handleChange}
        />
        {errors.heartRate && (
  <span className="form-error">{errors.heartRate}</span>
)}

        <input
          name="comorbiditiesCount"
          placeholder="Comorbidities Count"
          onChange={handleChange}
        />
        {errors.comorbiditiesCount && (
  <span className="form-error">{errors.comorbiditiesCount}</span>
)}

        <div className="modal-actions">
          <button className="primary-button" onClick={onClose}>Cancel</button>
          <button
            className="primary-button"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Admitting..." : "Admit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPatientModal;