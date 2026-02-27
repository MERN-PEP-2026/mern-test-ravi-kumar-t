import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function SkeletonProfile() {
  return (
    <div style={{ background:'#fff', border:'1px solid #e8e8e8', borderRadius:'16px', padding:'2rem' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'1.5rem', paddingBottom:'1.5rem', borderBottom:'1px solid #f0f0f0' }}>
        <div style={{ width:64, height:64, borderRadius:'50%', background:'#f0f0f0', animation:'shimmer 1.4s infinite', flexShrink:0 }} />
        <div style={{ flex:1 }}>
          <div style={{ height:18, width:'50%', borderRadius:6, background:'#f0f0f0', marginBottom:10, animation:'shimmer 1.4s infinite' }} />
          <div style={{ height:13, width:'70%', borderRadius:6, background:'#f0f0f0', animation:'shimmer 1.4s infinite' }} />
        </div>
      </div>
      {[90,75,55,80].map((w,i) => (
        <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'0.75rem 0', borderBottom:'1px solid #f5f5f7' }}>
          <div style={{ height:12, width:'25%', borderRadius:5, background:'#f0f0f0', animation:'shimmer 1.4s infinite' }} />
          <div style={{ height:12, width:`${w-30}%`, borderRadius:5, background:'#f0f0f0', animation:'shimmer 1.4s infinite' }} />
        </div>
      ))}
    </div>
  );
}

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const navigate = useNavigate();
  const token    = localStorage.getItem('token');
  const headers  = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/auth/profile`, { headers })
      .then(res => setProfile(res.data))
      .catch(err => {
        if (err.response?.status === 401) { localStorage.clear(); navigate('/login'); }
        else setError('Failed to load profile');
      })
      .finally(() => setLoading(false));
  }, []);

  const initials = profile?.name
    ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2)
    : '?';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        body{background:#f5f5f7}
        @keyframes fadeIn  {from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shimmer {0%{background:#f0f0f0}50%{background:#e6e6e6}100%{background:#f0f0f0}}

        .page{min-height:100vh;min-height:100dvh;background:#f5f5f7;font-family:'DM Sans',sans-serif;color:#1d1d1f}

        .nav{background:rgba(255,255,255,0.88);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-bottom:1px solid rgba(0,0,0,0.08);position:sticky;top:0;z-index:100;padding:0 1.5rem;height:52px;display:flex;align-items:center;justify-content:space-between}
        .nav-left{display:flex;align-items:center;gap:9px}
        .nav-icon{width:27px;height:27px;background:#000;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:13px}
        .nav-title{font-size:0.95rem;font-weight:600;color:#000}
        .nav-right{display:flex;align-items:center;gap:0.6rem}
        .back-btn{padding:5px 11px;background:transparent;border:1px solid #d2d2d7;border-radius:7px;font-size:0.78rem;font-family:'DM Sans',sans-serif;font-weight:500;color:#1d1d1f;cursor:pointer;text-decoration:none;display:flex;align-items:center;gap:4px;min-height:30px;transition:all 0.15s}
        .back-btn:hover{background:#f5f5f7}
        .logout-btn{padding:5px 11px;background:transparent;border:1px solid #d2d2d7;border-radius:7px;font-size:0.78rem;font-family:'DM Sans',sans-serif;font-weight:500;color:#1d1d1f;cursor:pointer;min-height:30px;transition:all 0.15s}
        .logout-btn:hover{background:#f5f5f7}

        .content{max-width:560px;margin:0 auto;padding:2rem 1.25rem;animation:fadeIn 0.4s ease}
        .page-title{font-size:1.6rem;font-weight:600;letter-spacing:-0.5px;color:#000;margin-bottom:1.5rem}

        .profile-card{background:#fff;border:1px solid #e8e8e8;border-radius:16px;padding:2rem;box-shadow:0 1px 3px rgba(0,0,0,0.04),0 8px 24px rgba(0,0,0,0.04)}

        .profile-header{display:flex;align-items:center;gap:1.25rem;margin-bottom:1.75rem;padding-bottom:1.75rem;border-bottom:1px solid #f0f0f0}
        .avatar{width:64px;height:64px;border-radius:50%;background:#000;display:flex;align-items:center;justify-content:center;font-size:1.25rem;font-weight:600;color:#fff;flex-shrink:0;letter-spacing:-0.5px}
        .profile-name{font-size:1.15rem;font-weight:600;color:#000;letter-spacing:-0.3px;margin-bottom:3px}
        .profile-email{font-size:0.875rem;color:#6e6e73}

        .info-row{display:flex;align-items:center;justify-content:space-between;padding:0.8rem 0;border-bottom:1px solid #f5f5f7}
        .info-row:last-child{border-bottom:none}
        .info-label{font-size:0.78rem;font-weight:500;color:#a0a0a5;text-transform:uppercase;letter-spacing:0.3px}
        .info-value{font-size:0.9rem;font-weight:500;color:#1d1d1f}

        .role-chip{display:inline-flex;align-items:center;gap:5px;padding:4px 12px;border-radius:20px;font-size:0.8rem;font-weight:600}
        .role-chip.admin  {background:#000;color:#fff}
        .role-chip.student{background:#f0f0f0;color:#555}

        .alert-error{padding:12px 16px;border-radius:10px;background:#fff1f1;color:#c00;border:1px solid #ffd0d0;font-size:0.875rem;margin-bottom:1rem}

        @media(max-width:480px){
          .content{padding:1.25rem 0.75rem}
          .profile-card{padding:1.5rem}
          .avatar{width:52px;height:52px;font-size:1rem}
          .nav{padding:0 1rem}
          .page-title{font-size:1.3rem;margin-bottom:1.25rem}
        }
      `}</style>

      <div className="page">
        <nav className="nav">
          <div className="nav-left">
            <div className="nav-icon">📚</div>
            <span className="nav-title">CourseKit</span>
          </div>
          <div className="nav-right">
            <Link to="/dashboard" className="back-btn">← Dashboard</Link>
            <button className="logout-btn" onClick={() => { localStorage.clear(); navigate('/login'); }}>Sign out</button>
          </div>
        </nav>

        <div className="content">
          <h1 className="page-title">My Profile</h1>

          {error && <div className="alert-error">{error}</div>}

          {loading ? <SkeletonProfile /> : profile && (
            <div className="profile-card">
              <div className="profile-header">
                <div className="avatar">{initials}</div>
                <div>
                  <div className="profile-name">{profile.name}</div>
                  <div className="profile-email">{profile.email}</div>
                </div>
              </div>

              <div className="info-row">
                <span className="info-label">Full Name</span>
                <span className="info-value">{profile.name}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Email</span>
                <span className="info-value">{profile.email}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Role</span>
                <span className={`role-chip ${profile.role}`}>
                  {profile.role === 'admin' ? '🛠️ Admin' : '🎓 Student'}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Member Since</span>
                <span className="info-value">
                  {new Date(parseInt(profile._id.substring(0,8), 16) * 1000)
                    .toLocaleDateString('en-US', { month:'long', year:'numeric' })}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}