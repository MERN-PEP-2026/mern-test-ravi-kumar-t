import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/register', form);
      setSuccess('Account created!');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        .auth-page{min-height:100vh;min-height:100dvh;background:#fafafa;display:flex;align-items:center;justify-content:center;font-family:'DM Sans',sans-serif;padding:1.5rem}
        .auth-wrapper{width:100%;max-width:420px;animation:fadeUp 0.5s ease forwards}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .auth-logo{display:flex;align-items:center;gap:10px;margin-bottom:2rem;justify-content:center}
        .auth-logo-icon{width:34px;height:34px;background:#000;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:16px}
        .auth-logo-text{font-size:1.05rem;font-weight:600;color:#000;letter-spacing:-0.3px}
        .auth-card{background:#fff;border:1px solid #e8e8e8;border-radius:18px;padding:2rem;box-shadow:0 1px 3px rgba(0,0,0,0.04),0 8px 24px rgba(0,0,0,0.04)}
        .auth-title{font-size:1.5rem;font-weight:600;color:#000;letter-spacing:-0.5px;margin-bottom:0.35rem}
        .auth-subtitle{font-size:0.875rem;color:#888;margin-bottom:1.75rem}
        .field{margin-bottom:0.9rem}
        .field label{display:block;font-size:0.75rem;font-weight:500;color:#555;margin-bottom:5px;text-transform:uppercase;letter-spacing:0.2px}
        .field input{width:100%;padding:12px 14px;border:1px solid #e0e0e0;border-radius:10px;font-size:max(16px,0.95rem);font-family:'DM Sans',sans-serif;background:#fafafa;color:#000;outline:none;transition:all 0.2s}
        .field input:focus{border-color:#000;background:#fff;box-shadow:0 0 0 3px rgba(0,0,0,0.06)}
        .field input::placeholder{color:#bbb}
        .role-toggle{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem}
        .role-option{position:relative}
        .role-option input[type="radio"]{position:absolute;opacity:0;width:0;height:0}
        .role-label{display:flex;align-items:center;justify-content:center;gap:7px;padding:11px 14px;border:1px solid #e0e0e0;border-radius:10px;font-size:0.875rem;font-weight:500;color:#555;cursor:pointer;transition:all 0.2s;background:#fafafa;user-select:none}
        .role-option input[type="radio"]:checked + .role-label{border-color:#000;background:#000;color:#fff}
        .role-label:hover{border-color:#aaa}
        .submit-btn{width:100%;padding:13px;background:#000;color:#fff;border:none;border-radius:10px;font-size:0.95rem;font-weight:500;font-family:'DM Sans',sans-serif;cursor:pointer;margin-top:0.4rem;transition:all 0.2s;min-height:48px;touch-action:manipulation}
        .submit-btn:hover{background:#222}
        .submit-btn:active{transform:scale(0.99)}
        .submit-btn:disabled{background:#ccc;cursor:not-allowed}
        .alert{padding:11px 14px;border-radius:8px;font-size:0.875rem;margin-bottom:1.2rem}
        .alert-error{background:#fff1f1;color:#c00;border:1px solid #ffd0d0}
        .alert-success{background:#f0faf4;color:#1a7a42;border:1px solid #b6e8c9}
        .auth-footer{text-align:center;margin-top:1.4rem;font-size:0.875rem;color:#888}
        .auth-footer a{color:#000;font-weight:500;text-decoration:none}
        .auth-footer a:hover{text-decoration:underline}
        .divider{height:1px;background:#f0f0f0;margin:1.4rem 0}
        @media(max-width:480px){.auth-page{padding:1rem;align-items:flex-start;padding-top:2.5rem}.auth-card{padding:1.5rem;border-radius:16px}.auth-title{font-size:1.3rem}}
      `}</style>

      <div className="auth-page">
        <div className="auth-wrapper">
          <div className="auth-logo">
            <div className="auth-logo-icon">📚</div>
            <span className="auth-logo-text">CourseKit</span>
          </div>
          <div className="auth-card">
            <h1 className="auth-title">Create account</h1>
            <p className="auth-subtitle">Choose your role to get started</p>

            {error   && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleSubmit}>
              <div className="field">
                <label>I am a</label>
                <div className="role-toggle">
                  <div className="role-option">
                    <input type="radio" id="student" name="role" value="student"
                      checked={form.role === 'student'} onChange={handleChange} />
                    <label className="role-label" htmlFor="student">🎓 Student</label>
                  </div>
                  <div className="role-option">
                    <input type="radio" id="admin" name="role" value="admin"
                      checked={form.role === 'admin'} onChange={handleChange} />
                    <label className="role-label" htmlFor="admin">🛠️ Admin</label>
                  </div>
                </div>
              </div>
              <div className="field">
                <label>Full Name</label>
                <input name="name" placeholder="Your full name" autoComplete="name" required onChange={handleChange} />
              </div>
              <div className="field">
                <label>Email Address</label>
                <input name="email" type="email" placeholder="you@example.com" autoComplete="email" required onChange={handleChange} />
              </div>
              <div className="field">
                <label>Password</label>
                <input name="password" type="password" placeholder="Min. 6 characters" autoComplete="new-password" required onChange={handleChange} />
              </div>
              <button className="submit-btn" type="submit" disabled={loading}>
                {loading ? 'Creating account...' : 'Create account'}
              </button>
            </form>

            <div className="divider" />
            <div className="auth-footer">
              Already have an account? <Link to="/login">Sign in</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}