import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('name', res.data.name);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>📚 Welcome Back</h2>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input style={styles.input} name="email" type="email"
              placeholder="Enter your email" required onChange={handleChange} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input style={styles.input} name="password" type="password"
              placeholder="Enter password" required onChange={handleChange} />
          </div>
          <button style={styles.btn} type="submit">Login</button>
        </form>
        <p style={styles.linkText}>
          No account? <Link to="/register" style={styles.link}>Register here</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { display:'flex', justifyContent:'center', alignItems:'center',
    minHeight:'100vh', background:'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  card: { background:'white', padding:'2.5rem', borderRadius:'12px',
    width:'400px', boxShadow:'0 10px 30px rgba(0,0,0,0.2)' },
  title: { textAlign:'center', marginBottom:'1.5rem', color:'#4f46e5' },
  formGroup: { marginBottom:'1rem' },
  label: { display:'block', marginBottom:'5px', fontWeight:'600', color:'#374151', fontSize:'0.9rem' },
  input: { width:'100%', padding:'12px', borderRadius:'6px', border:'1px solid #d1d5db',
    boxSizing:'border-box', fontSize:'1rem' },
  btn: { width:'100%', padding:'12px', background:'#4f46e5', color:'white',
    border:'none', borderRadius:'6px', cursor:'pointer', fontWeight:'bold',
    fontSize:'1rem', marginTop:'0.5rem' },
  error: { background:'#fee2e2', color:'#dc2626', padding:'10px',
    borderRadius:'6px', marginBottom:'1rem', textAlign:'center' },
  linkText: { textAlign:'center', marginTop:'1rem', color:'#6b7280' },
  link: { color:'#4f46e5', fontWeight:'600' }
};