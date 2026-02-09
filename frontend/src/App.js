import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { labSchema } from './Block2-RecordManager/recordTypes/labTests';
// Components & Schemas
import Login from './Block1-Auth/Login'; 
import Signup from './Block1-Auth/Signup'; 
import RecordList from './Block2-RecordManager/RecordList';
import { patientSchema } from './Block2-RecordManager/recordTypes/patients';
import { medicineSchema } from './Block2-RecordManager/recordTypes/medicines';

function App() {
  const [stats, setStats] = useState({ patients: 0, lowStock: 0, pendingTests: 0 });

  // Function to calculate stats
  const refreshStats = async () => {
    try {
      const pRes = await axios.get('http://localhost:5000/api/patients');
      const mRes = await axios.get('http://localhost:5000/api/medicines');
	  const lRes = await axios.get('http://localhost:5000/api/labtests');
      
      // Count patients and find medicines with stock < 5
      const lowStockMeds = mRes.data.filter(m => Number(m.stockQuantity) < 5).length;
	  const pendingTestsCount = lRes.data.filter(t => t.status === "Pending").length;
      
      setStats({
        patients: pRes.data.length,
        lowStock: lowStockMeds,
		pendingTests: pendingTestsCount
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  useEffect(() => {
    // Initial fetch
    refreshStats();
    // Refresh stats every 10 seconds automatically
    const interval = setInterval(refreshStats, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/dashboard" element={
            <div style={{ padding: '30px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
              
              {/* HEADER */}
              <header style={{ 
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                backgroundColor: '#2c3e50', color: 'white', padding: '15px 25px', borderRadius: '12px'
              }}>
                <h1 style={{ margin: 0, fontSize: '1.5rem' }}> Hospital Dashboard</h1>
                <button onClick={() => window.location.href = '/'} style={{ backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}>Logout</button>
              </header>

              {/* --- STATS BAR --- */}
              <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                <div style={{ flex: 1, backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderLeft: '5px solid #3498db' }}>
                  <h3 style={{ margin: 0, color: '#7f8c8d', fontSize: '0.9rem' }}>TOTAL PATIENTS</h3>
                  <p style={{ margin: '5px 0 0', fontSize: '1.8rem', fontWeight: 'bold', color: '#2c3e50' }}> {stats.patients}</p>
                </div>

                <div style={{ flex: 1, backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderLeft: '5px solid #e67e22' }}>
                  <h3 style={{ margin: 0, color: '#7f8c8d', fontSize: '0.9rem' }}>LOW STOCK MEDICINES</h3>
                  <p style={{ margin: '5px 0 0', fontSize: '1.8rem', fontWeight: 'bold', color: stats.lowStock > 0 ? '#e67e22' : '#27ae60' }}>
                     {stats.lowStock}
                  </p>
                </div>
				<div style={{ flex: 1, backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderLeft: '5px solid #8e44ad' }}>
				<h3 style={{ margin: 0, color: '#7f8c8d', fontSize: '0.9rem' }}>PENDING LAB TESTS</h3>
				<p style={{ margin: '5px 0 0', fontSize: '1.8rem', fontWeight: 'bold', color: '#2c3e50' }}>
					 {stats.pendingTests}
				</p>
				</div>
              </div>

              {/* TABLES SECTION */}
              <main style={{ marginTop: '30px' }}>
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                  <h2 style={{ color: '#2980b9', marginTop: 0 }}> Patient Management</h2>
                  <RecordList schema={patientSchema} apiUrl="http://localhost:5000/api/patients" />
                </div>

                <div style={{ marginTop: '30px', backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                  <h2 style={{ color: '#27ae60', marginTop: 0 }}> Pharmacy Inventory</h2>
                  <RecordList schema={medicineSchema} apiUrl="http://localhost:5000/api/medicines" />
                </div>
				{/* SECTION 3: LAB MANAGEMENT */}
				<div style={{ marginTop: '30px', backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
				<h2 style={{ color: '#8e44ad', marginTop: 0 }}> Lab Management</h2>
				<RecordList 
				schema={labSchema} 
				apiUrl="http://localhost:5000/api/labtests"/>
				</div>
              </main>

            </div>
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;