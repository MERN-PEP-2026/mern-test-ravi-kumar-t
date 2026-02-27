import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('name', res.data.name);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        .auth-page {
          min-height: 100vh;
          background: #fafafa;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
          padding: 2rem;
        }

        .auth-wrapper {
          width: 100%;
          max-width: 420px;
          animation: fadeUp 0.5s ease forwards;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .auth-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 2.5rem;
          justify-content: center;
        }

        .auth-logo-icon {
          width: 36px;
          height: 36px;
          background: #000;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 18px;
        }

        .auth-logo-text {
          font-size: 1.1rem;
          font-weight: 600;
          color: #000;
          letter-spacing: -0.3px;
        }

        .auth-card {
          background: #fff;
          border: 1px solid #e8e8e8;
          border-radius: 18px;
          padding: 2.5rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04);
        }

        .auth-title {
          font-size: 1.6rem;
          font-weight: 600;
          color: #000;
          letter-spacing: -0.5px;
          margin-bottom: 0.4rem;
        }

        .auth-subtitle {
          font-size: 0.9rem;
          color: #888;
          margin-bottom: 2rem;
          font-weight: 400;
        }

        .field { margin-bottom: 1rem; }

        .field label {
          display: block;
          font-size: 0.8rem;
          font-weight: 500;
          color: #555;
          margin-bottom: 6px;
          letter-spacing: 0.1px;
          text-transform: uppercase;
        }

        .field input {
          width: 100%;
          padding: 12px 14px;
          border: 1px solid #e0e0e0;
          border-radius: 10px;
          font-size: 0.95rem;
          font-family: 'DM Sans', sans-serif;
          background: #fafafa;
          color: #000;
          outline: none;
          transition: all 0.2s ease;
        }

        .field input:focus {
          border-color: #000;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(0,0,0,0.06);
        }

        .field input::placeholder { color: #bbb; }

        .submit-btn {
          width: 100%;
          padding: 13px;
          background: #000;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 0.95rem;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          margin-top: 0.5rem;
          transition: all 0.2s ease;
        }

        .submit-btn:hover { background: #222; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
        .submit-btn:active { transform: translateY(0); }
        .submit-btn:disabled { background: #ccc; cursor: not-allowed; transform: none; box-shadow: none; }

        .alert-error {
          padding: 11px 14px;
          border-radius: 8px;
          font-size: 0.875rem;
          margin-bottom: 1.2rem;
          background: #fff1f1;
          color: #c00;
          border: 1px solid #ffd0d0;
        }

        .auth-footer {
          text-align: center;
          margin-top: 1.5rem;
          font-size: 0.875rem;
          color: #888;
        }

        .auth-footer a { color: #000; font-weight: 500; text-decoration: none; }
        .auth-footer a:hover { text-decoration: underline; }

        .divider { height: 1px; background: #f0f0f0; margin: 1.5rem 0; }
      `}</style>

      <div className="auth-page">
        <div className="auth-wrapper">
          <div className="auth-logo">
            <div className="auth-logo-icon">📚</div>
            <span className="auth-logo-text">CourseKit</span>
          </div>

          <div className="auth-card">
            <h1 className="auth-title">Welcome back</h1>
            <p className="auth-subtitle">Sign in to your account to continue</p>

            {error && <div className="alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="field">
                <label>Email Address</label>
                <input name="email" type="email" placeholder="you@example.com" required onChange={handleChange} />
              </div>
              <div className="field">
                <label>Password</label>
                <input name="password" type="password" placeholder="Your password" required onChange={handleChange} />
              </div>
              <button className="submit-btn" type="submit" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <div className="divider" />

            <div className="auth-footer">
              Don't have an account? <Link to="/register">Sign up</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}