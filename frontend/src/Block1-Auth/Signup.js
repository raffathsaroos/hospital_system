import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Signup() {
  const [formData, setFormData] = useState({ Username: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();

      if (response.ok) {
        alert("Account Created! Now please login.");
        navigate('/'); // Send them to the login page
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage("Connection to server failed.");
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'center' }}>Create Account</h2>
      <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input 
          type="text" 
          placeholder="Full Name" 
          style={{ padding: '10px' }}
          onChange={(e) => setFormData({...formData, Username: e.target.value})} 
          required 
        />
        <input 
          type="email" 
          placeholder="Email Address" 
          style={{ padding: '10px' }}
          onChange={(e) => setFormData({...formData, email: e.target.value})} 
          required 
        />
        <input 
          type="password" 
          placeholder="Create Password" 
          style={{ padding: '10px' }}
          onChange={(e) => setFormData({...formData, password: e.target.value})} 
          required 
        />
        <button type="submit" style={{ padding: '10px', backgroundColor: '#27ae60', color: 'white', border: 'none', cursor: 'pointer' }}>
          Register
        </button>
      </form>
      
      {message && <p style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>{message}</p>}
      
      <p style={{ textAlign: 'center', marginTop: '20px' }}>
        Already have an account? <Link to="/">Login here</Link>
      </p>
    </div>
  );
}

export default Signup;