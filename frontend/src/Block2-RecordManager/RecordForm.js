// File: src/Block2-RecordManager/RecordForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios'; 

const RecordForm = ({ editData, setEditData, schema, apiUrl, refreshData, closeForm }) => {
  const [formData, setFormData] = useState({});
  const fields = Object.keys(schema);

  useEffect(() => {
    if (editData) {
      setFormData(editData);
    } else {
      setFormData({});
    }
  }, [editData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editData) {
      axios.put(`${apiUrl}/${editData._id}`, formData)
        .then(() => {
          alert("Updated Successfully!");
          refreshData();
          setEditData(null);
          closeForm();
        })
        .catch(err => console.error("Update Error:", err));
    } else {
      axios.post(apiUrl, formData)
        .then(() => {
          alert("Saved Successfully!");
          refreshData();
          setFormData({});
          closeForm();
        })
        .catch(err => console.error("Save Error:", err));
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ border: "2px solid #3498db", padding: "20px", marginTop: "20px", borderRadius: "8px" }}>
      <h3>{editData ? "📝 Edit Record" : "➕ Add New Record"}</h3>
      
      {fields.map((field) => {
        const fieldConfig = schema[field];
        const isDropdown = typeof fieldConfig === "object" && fieldConfig.type === "dropdown";

        return (
          <div key={field} style={{ marginBottom: "15px" }}>
            <label style={{ fontWeight: 'bold' }}>{field.toUpperCase()}: </label>
            <br />
            {isDropdown ? (
              <select name={field} value={formData[field] || ""} onChange={handleChange} required style={{ width: '100%', padding: '8px' }}>
                <option value="">-- Select {field} --</option>
                {fieldConfig.options.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <input 
                type={fieldConfig === "number" ? "number" : "text"} 
                name={field} 
                value={formData[field] || ""} 
                onChange={handleChange} 
                required 
                style={{ width: '100%', padding: '8px' }}
              />
            )}
          </div>
        );
      })}
      
      <button type="submit" style={{ backgroundColor: '#2ecc71', color: 'white', padding: '10px 15px', border: 'none', cursor: 'pointer' }}>
        {editData ? "Update Record" : "Save Record"}
      </button>
      <button type="button" onClick={closeForm} style={{ marginLeft: "10px", padding: '10px 15px' }}>Cancel</button>
    </form>
  );
};

export default RecordForm;