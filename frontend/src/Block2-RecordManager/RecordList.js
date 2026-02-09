// File: src/Block2-RecordManager/RecordList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import RecordForm from './RecordForm';

const RecordList = ({ schema, apiUrl }) => {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  
  // Extract keys from schema for table headers
  const columns = Object.keys(schema);

  useEffect(() => {
    fetchData();
  }, [apiUrl]);

  const fetchData = () => {
    axios.get(apiUrl)
      .then(res => setData(res.data))
      .catch(err => console.error("Fetch Error:", err));
  };

  const handleEdit = (row) => {
    setEditData(row);   
    setShowForm(true);  
  };

  const deleteRecord = (id) => {
    if (window.confirm("Are you sure you want to delete this?")) {
      axios.delete(`${apiUrl}/${id}`)
        .then(() => fetchData()) // Refresh list
        .catch(err => console.error("Delete Error:", err));
    }
  };

  return (
    <div style={{ marginTop: '20px' }}>
    <button 
	onClick={() => { 
    if (showForm) {
      setEditData(null);
      setShowForm(false);
    } else {
      setEditData(null);  // ← CLEAR EDIT DATA HERE
      setShowForm(true);
    }
	}}
	  style={{ padding: '10px 20px', cursor: 'pointer', 
	  backgroundColor: '#3498db', color: '#fff', border: 'none', borderRadius: '4px' }}>
	  {showForm ? "Close Form" : "+ Add New Entry"}
	</button>

      {showForm && (
        <RecordForm 
          editData={editData} 
          setEditData={setEditData} 
          schema={schema} 
          apiUrl={apiUrl} 
          refreshData={fetchData}
          closeForm={() => setShowForm(false)}
        />
      )} 

      <table border="1" cellPadding="10" style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
        <thead style={{ backgroundColor: '#f4f4f4' }}>
          <tr>
            {columns.map((col) => <th key={col}>{col.toUpperCase()}</th>)}
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row._id}>
              {columns.map((col) => <td key={col}>{row[col] || "N/A"}</td>)}
              <td>
                <button onClick={() => handleEdit(row)}>Edit</button>
                <button onClick={() => deleteRecord(row._id)} style={{ color: 'red', marginLeft: '10px' }}>Delete</button>
              </td>
            </tr>
          ))}
          {data.length === 0 && <tr><td colSpan={columns.length + 1} style={{ textAlign: 'center' }}>No records found.</td></tr>}
        </tbody>
      </table>
    </div>
  );
};

export default RecordList;