import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
const API = import.meta.env.VITE_API_URL;

function Toast({ toasts }) {
  return (
    <div style={{ position:'fixed', bottom:'1rem', right:'1rem', left:'1rem', display:'flex', flexDirection:'column', gap:'0.5rem', zIndex:1000, pointerEvents:'none', alignItems:'flex-end' }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          display:'flex', alignItems:'center', gap:'10px',
          background:'#1a1a1a', color:'#fff', padding:'12px 16px', borderRadius:'12px',
          fontSize:'0.875rem', boxShadow:'0 4px 20px rgba(0,0,0,0.18)',
          animation:'toastIn 0.3s cubic-bezier(0.34,1.56,0.64,1)',
          pointerEvents:'all', width:'100%', maxWidth:'360px',
          borderLeft:`3px solid ${t.type === 'error' ? '#ff4444' : '#34c759'}`
        }}>
          <span>{t.type === 'error' ? '✕' : '✓'}</span>
          <span style={{ flex:1 }}>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

function Spinner({ size = 13, color = '#fff' }) {
  return (
    <span style={{ width:size, height:size, border:`2px solid rgba(255,255,255,0.25)`, borderTop:`2px solid ${color}`, borderRadius:'50%', display:'inline-block', animation:'spin 0.7s linear infinite', flexShrink:0 }} />
  );
}

function SkeletonCard() {
  return (
    <div style={{ background:'#fff', border:'1px solid #e8e8e8', borderRadius:'14px', padding:'1.1rem 1.25rem', display:'flex', alignItems:'center', gap:'0.9rem' }}>
      <div style={{ width:30, height:30, borderRadius:7, background:'#f0f0f0', flexShrink:0, animation:'shimmer 1.4s infinite' }} />
      <div style={{ flex:1 }}>
        <div style={{ height:14, borderRadius:6, background:'#f0f0f0', width:'55%', marginBottom:8, animation:'shimmer 1.4s infinite' }} />
        <div style={{ height:11, borderRadius:6, background:'#f0f0f0', width:'80%', marginBottom:6, animation:'shimmer 1.4s infinite' }} />
        <div style={{ height:10, borderRadius:6, background:'#f0f0f0', width:'40%', animation:'shimmer 1.4s infinite' }} />
      </div>
      <div style={{ width:68, height:32, borderRadius:8, background:'#f0f0f0', flexShrink:0, animation:'shimmer 1.4s infinite' }} />
    </div>
  );
}

export default function Dashboard() {
  const [courses, setCourses]       = useState([]);
  const [form, setForm]             = useState({ courseName:'', courseDescription:'', instructor:'' });
  const [search, setSearch]         = useState('');
  const [loading, setLoading]       = useState(true);
  const [adding, setAdding]         = useState(false);
  const [showForm, setShowForm]     = useState(false);
  const [editId, setEditId]         = useState(null);
  const [editForm, setEditForm]     = useState({});
  const [savingId, setSavingId]     = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [enrollingId, setEnrollingId] = useState(null);
  const [toasts, setToasts]         = useState([]);

  const navigate = useNavigate();
  const token  = localStorage.getItem('token');
  const name   = localStorage.getItem('name');
  const role   = localStorage.getItem('role');
  const userId = localStorage.getItem('userId');
  const headers = { Authorization: `Bearer ${token}` };

  const isAdmin = role === 'admin';

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  const fetchCourses = useCallback(async (q = '') => {
    try {
      const res = await axios.get(`${API}/api/courses?search=${q}`, { headers });
      setCourses(res.data);
    } catch (err) {
      addToast('Failed to load courses', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCourses(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      await axios.post(`${API}/api/courses`, form, { headers });
      setForm({ courseName:'', courseDescription:'', instructor:'' });
      setShowForm(false);
      await fetchCourses(search);
      addToast('Course created!');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to create course', 'error');
    } finally {
      setAdding(false);
    }
  };

  const startEdit = (course) => {
    setEditId(course._id);
    setEditForm({ courseName:course.courseName, courseDescription:course.courseDescription, instructor:course.instructor });
  };
  const cancelEdit = () => { setEditId(null); setEditForm({}); };
  const handleSaveEdit = async (id) => {
    setSavingId(id);
    try {
      await axios.put(`${API}/api/courses/${id}`, editForm, { headers });
      setEditId(null);
      await fetchCourses(search);
      addToast('Course updated!');
    } catch {
      addToast('Failed to update', 'error');
    } finally {
      setSavingId(null);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await axios.delete(`${API}/api/courses/${id}`, { headers });
      await fetchCourses(search);
      addToast('Course deleted');
    } catch {
      addToast('Failed to delete', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const isEnrolled = (course) => course.enrolledStudents?.some(s => (s._id || s) === userId);

  const handleEnroll = async (id) => {
    setEnrollingId(id);
    try {
      await axios.post(`${API}/api/courses/${id}/enroll`, {}, { headers });
      await fetchCourses(search);
      addToast('Enrolled successfully! 🎉');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to enroll', 'error');
    } finally {
      setEnrollingId(null);
    }
  };

  const handleLeave = async (id) => {
    setEnrollingId(id);
    try {
      await axios.delete(`${API}/api/courses/${id}/leave`, { headers });
      await fetchCourses(search);
      addToast('Left course');
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to leave', 'error');
    } finally {
      setEnrollingId(null);
    }
  };

  const handleSearch = (e) => { setSearch(e.target.value); fetchCourses(e.target.value); };
  const handleLogout = () => { localStorage.clear(); navigate('/login'); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
        body{background:#f5f5f7}

        @keyframes spin      { to{transform:rotate(360deg)} }
        @keyframes toastIn   { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn    { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes cardIn    { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer   { 0%{background:#f0f0f0} 50%{background:#e4e4e4} 100%{background:#f0f0f0} }

        .dash{min-height:100vh;min-height:100dvh;background:#f5f5f7;font-family:'DM Sans',sans-serif;color:#1d1d1f}

        /* Navbar */
        .nav{background:rgba(255,255,255,0.88);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-bottom:1px solid rgba(0,0,0,0.08);position:sticky;top:0;z-index:100;padding:0 1.5rem;height:52px;display:flex;align-items:center;justify-content:space-between}
        .nav-left{display:flex;align-items:center;gap:9px}
        .nav-icon{width:27px;height:27px;background:#000;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0}
        .nav-title{font-size:0.95rem;font-weight:600;letter-spacing:-0.2px;color:#000}
        .nav-right{display:flex;align-items:center;gap:0.6rem}
        .nav-greeting{font-size:0.82rem;color:#6e6e73;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:110px}
        .nav-greeting span{color:#000;font-weight:500}

        /* Role badge */
        .role-badge{padding:3px 9px;border-radius:20px;font-size:0.72rem;font-weight:600;letter-spacing:0.2px}
        .role-badge.admin{background:#000;color:#fff}
        .role-badge.student{background:#f0f0f0;color:#555}

        .nav-profile-btn{padding:5px 11px;background:transparent;border:1px solid #d2d2d7;border-radius:7px;font-size:0.78rem;font-family:'DM Sans',sans-serif;font-weight:500;color:#1d1d1f;cursor:pointer;transition:all 0.15s;text-decoration:none;display:flex;align-items:center;white-space:nowrap;min-height:30px}
        .nav-profile-btn:hover{background:#f5f5f7}
        .logout-btn{padding:5px 11px;background:transparent;border:1px solid #d2d2d7;border-radius:7px;font-size:0.78rem;font-family:'DM Sans',sans-serif;font-weight:500;color:#1d1d1f;cursor:pointer;transition:all 0.15s;white-space:nowrap;min-height:30px;touch-action:manipulation}
        .logout-btn:hover{background:#f5f5f7}

        .content{max-width:780px;margin:0 auto;padding:2rem 1.25rem;animation:fadeIn 0.4s ease}

        .page-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:1.75rem;gap:1rem}
        .page-title{font-size:1.6rem;font-weight:600;letter-spacing:-0.5px;color:#000}
        .page-count{font-size:0.95rem;color:#6e6e73;font-weight:400;margin-left:5px}
        .add-btn{display:flex;align-items:center;gap:5px;padding:9px 16px;background:#000;color:#fff;border:none;border-radius:10px;font-size:0.875rem;font-weight:500;font-family:'DM Sans',sans-serif;cursor:pointer;transition:all 0.2s;white-space:nowrap;min-height:40px;touch-action:manipulation}
        .add-btn:hover{background:#222;transform:translateY(-1px);box-shadow:0 4px 12px rgba(0,0,0,0.15)}
        .add-btn:active{transform:scale(0.98)}

        .form-panel{background:#fff;border:1px solid #e8e8e8;border-radius:16px;padding:1.5rem;margin-bottom:1.25rem;box-shadow:0 1px 3px rgba(0,0,0,0.04);animation:slideDown 0.25s ease}
        .form-panel-title{font-size:0.95rem;font-weight:600;color:#000;margin-bottom:1rem}
        .form-row{display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:0.75rem}
        .field label{display:block;font-size:0.72rem;font-weight:500;color:#6e6e73;margin-bottom:4px;text-transform:uppercase;letter-spacing:0.3px}
        .field input{width:100%;padding:10px 12px;border:1px solid #e0e0e0;border-radius:9px;font-size:max(16px,0.875rem);font-family:'DM Sans',sans-serif;background:#fafafa;color:#000;outline:none;transition:all 0.2s}
        .field input:focus{border-color:#000;background:#fff;box-shadow:0 0 0 3px rgba(0,0,0,0.05)}
        .field input::placeholder{color:#bbb}
        .form-actions{display:flex;gap:0.6rem;margin-top:1rem;flex-wrap:wrap}
        .save-btn{display:flex;align-items:center;gap:7px;padding:10px 20px;background:#000;color:#fff;border:none;border-radius:9px;font-size:0.875rem;font-weight:500;font-family:'DM Sans',sans-serif;cursor:pointer;min-width:110px;justify-content:center;transition:all 0.2s;min-height:42px;touch-action:manipulation}
        .save-btn:hover{background:#222}
        .save-btn:disabled{background:#aaa;cursor:not-allowed}
        .cancel-btn{padding:10px 16px;background:transparent;border:1px solid #d2d2d7;border-radius:9px;font-size:0.875rem;font-weight:500;font-family:'DM Sans',sans-serif;color:#1d1d1f;cursor:pointer;transition:all 0.15s;min-height:42px}
        .cancel-btn:hover{background:#f5f5f7}

        .search-wrap{position:relative;margin-bottom:1rem}
        .search-icon{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#aaa;pointer-events:none;font-size:0.9rem}
        .search-input{width:100%;padding:11px 14px 11px 36px;border:1px solid #e0e0e0;border-radius:10px;font-size:max(16px,0.875rem);font-family:'DM Sans',sans-serif;background:#fff;color:#000;outline:none;transition:all 0.2s}
        .search-input:focus{border-color:#000;box-shadow:0 0 0 3px rgba(0,0,0,0.05)}
        .search-input::placeholder{color:#bbb}

        .courses-list{display:flex;flex-direction:column;gap:0.65rem}
        .course-card{background:#fff;border:1px solid #e8e8e8;border-radius:14px;padding:1.1rem 1.25rem;transition:all 0.2s;animation:cardIn 0.3s ease}
        .course-card:hover{border-color:#c8c8cc;box-shadow:0 2px 12px rgba(0,0,0,0.06)}
        .course-card-view{display:flex;align-items:center;gap:0.9rem}
        .course-number{width:30px;height:30px;background:#f5f5f7;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:0.78rem;font-weight:600;color:#6e6e73;flex-shrink:0}
        .course-body{flex:1;min-width:0}
        .course-name{font-size:0.92rem;font-weight:600;color:#000;letter-spacing:-0.1px;margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .course-desc{font-size:0.8rem;color:#6e6e73;margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .course-meta{display:flex;gap:0.75rem;font-size:0.75rem;color:#a0a0a5;flex-wrap:wrap}
        .enrolled-count{font-size:0.72rem;color:#007aff;font-weight:500;margin-top:3px}

        .card-actions{display:flex;gap:0.4rem;flex-shrink:0;flex-wrap:wrap;justify-content:flex-end}

        /* Admin buttons */
        .edit-btn{padding:6px 12px;background:transparent;border:1px solid #d2d2d7;border-radius:7px;font-size:0.78rem;font-weight:500;font-family:'DM Sans',sans-serif;color:#1d1d1f;cursor:pointer;transition:all 0.15s;min-height:34px;touch-action:manipulation}
        .edit-btn:hover{background:#f5f5f7}
        .delete-btn{display:flex;align-items:center;gap:5px;padding:6px 12px;background:transparent;border:1px solid #ffd0d0;border-radius:7px;font-size:0.78rem;font-weight:500;font-family:'DM Sans',sans-serif;color:#c00;cursor:pointer;transition:all 0.15s;min-width:64px;justify-content:center;min-height:34px;touch-action:manipulation}
        .delete-btn:hover{background:#fff1f1;border-color:#ffb0b0}
        .delete-btn:disabled{opacity:0.5;cursor:not-allowed}

        /* Student enroll/leave buttons */
        .enroll-btn{display:flex;align-items:center;gap:6px;padding:7px 14px;background:#000;color:#fff;border:none;border-radius:8px;font-size:0.8rem;font-weight:500;font-family:'DM Sans',sans-serif;cursor:pointer;transition:all 0.2s;min-width:90px;justify-content:center;min-height:34px;touch-action:manipulation}
        .enroll-btn:hover{background:#222}
        .enroll-btn:disabled{background:#aaa;cursor:not-allowed}
        .leave-btn{display:flex;align-items:center;gap:6px;padding:7px 14px;background:transparent;border:1px solid #d2d2d7;border-radius:8px;font-size:0.8rem;font-weight:500;font-family:'DM Sans',sans-serif;color:#555;cursor:pointer;transition:all 0.15s;min-width:90px;justify-content:center;min-height:34px;touch-action:manipulation}
        .leave-btn:hover{background:#f5f5f7;border-color:#aaa}
        .leave-btn:disabled{opacity:0.5;cursor:not-allowed}

        /* Inline edit */
        .edit-form{border-top:1px solid #f0f0f0;margin-top:0.9rem;padding-top:0.9rem;animation:slideDown 0.2s ease}
        .edit-row{display:grid;grid-template-columns:1fr 1fr;gap:0.65rem;margin-bottom:0.65rem}
        .edit-field label{display:block;font-size:0.7rem;font-weight:500;color:#6e6e73;margin-bottom:4px;text-transform:uppercase;letter-spacing:0.3px}
        .edit-field input{width:100%;padding:9px 11px;border:1px solid #e0e0e0;border-radius:8px;font-size:max(16px,0.85rem);font-family:'DM Sans',sans-serif;background:#fafafa;color:#000;outline:none;transition:all 0.2s}
        .edit-field input:focus{border-color:#000;background:#fff;box-shadow:0 0 0 3px rgba(0,0,0,0.05)}
        .edit-actions{display:flex;gap:0.5rem;margin-top:0.75rem;flex-wrap:wrap}
        .save-edit-btn{display:flex;align-items:center;gap:6px;padding:8px 16px;background:#000;color:#fff;border:none;border-radius:8px;font-size:0.82rem;font-weight:500;font-family:'DM Sans',sans-serif;cursor:pointer;min-width:88px;justify-content:center;transition:all 0.2s;min-height:38px}
        .save-edit-btn:hover{background:#222}
        .save-edit-btn:disabled{background:#aaa;cursor:not-allowed}
        .cancel-edit-btn{padding:8px 13px;background:transparent;border:1px solid #d2d2d7;border-radius:8px;font-size:0.82rem;font-family:'DM Sans',sans-serif;color:#555;cursor:pointer;transition:all 0.15s;min-height:38px}
        .cancel-edit-btn:hover{background:#f5f5f7}

        .state-box{background:#fff;border:1px solid #e8e8e8;border-radius:14px;padding:3rem 1.5rem;text-align:center;color:#a0a0a5}
        .state-box p{font-size:0.875rem;margin-top:0.5rem}
        .state-icon{font-size:2rem;margin-bottom:0.5rem}

        /* Skeleton list */
        .skeleton-list{display:flex;flex-direction:column;gap:0.65rem}

        @media(max-width:640px){
          .content{padding:1.5rem 1rem}
          .page-title{font-size:1.35rem}
          .form-row{grid-template-columns:1fr}
          .edit-row{grid-template-columns:1fr}
          .nav{padding:0 1rem}
          .nav-greeting{max-width:80px}
        }
        @media(max-width:480px){
          .content{padding:1.25rem 0.75rem}
          .page-title{font-size:1.2rem}
          .course-card-view{flex-wrap:wrap}
          .card-actions{width:100%;justify-content:flex-end;margin-top:0.5rem;padding-top:0.5rem;border-top:1px solid #f5f5f7}
          .enroll-btn,.leave-btn,.edit-btn,.delete-btn{flex:1;justify-content:center}
          .form-panel{padding:1.25rem}
          .add-btn{padding:8px 13px;font-size:0.82rem}
        }
        @media(max-width:360px){
          .nav-greeting{display:none}
          .content{padding:1rem 0.65rem}
          .role-badge{display:none}
        }
      `}</style>

      <Toast toasts={toasts} />

      <div className="dash">
        {}
        <nav className="nav">
          <div className="nav-left">
            <div className="nav-icon">📚</div>
            <span className="nav-title">CourseKit</span>
          </div>
          <div className="nav-right">
            <span className="nav-greeting">Hi, <span>{name}</span></span>
            <span className={`role-badge ${isAdmin ? 'admin' : 'student'}`}>
              {isAdmin ? '🛠️ Admin' : '🎓 Student'}
            </span>
            <Link to="/profile" className="nav-profile-btn">Profile</Link>
            <button className="logout-btn" onClick={handleLogout}>Sign out</button>
          </div>
        </nav>

        <div className="content">
          {/* Page Header */}
          <div className="page-header">
            <h1 className="page-title">
              Courses
              <span className="page-count">({courses.length})</span>
            </h1>
            {isAdmin && (
              <button className="add-btn" onClick={() => { setShowForm(!showForm); setEditId(null); }}>
                {showForm ? '✕ Cancel' : '+ New Course'}
              </button>
            )}
          </div>

          {}
          {isAdmin && showForm && (
            <div className="form-panel">
              <p className="form-panel-title">New Course</p>
              <form onSubmit={handleCreate}>
                <div className="form-row">
                  <div className="field">
                    <label>Course Name</label>
                    <input name="courseName" placeholder="e.g. React Basics"
                      value={form.courseName} required
                      onChange={e => setForm({ ...form, courseName:e.target.value })} />
                  </div>
                  <div className="field">
                    <label>Instructor</label>
                    <input name="instructor" placeholder="e.g. Sir Ahmed"
                      value={form.instructor} required
                      onChange={e => setForm({ ...form, instructor:e.target.value })} />
                  </div>
                </div>
                <div className="field">
                  <label>Description</label>
                  <input name="courseDescription" placeholder="Brief description"
                    value={form.courseDescription} required
                    onChange={e => setForm({ ...form, courseDescription:e.target.value })} />
                </div>
                <div className="form-actions">
                  <button className="save-btn" type="submit" disabled={adding}>
                    {adding ? <><Spinner /><span>Adding...</span></> : 'Add Course'}
                  </button>
                  <button className="cancel-btn" type="button" onClick={() => setShowForm(false)}>Cancel</button>
                </div>
              </form>
            </div>
          )}

          {}
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input className="search-input" placeholder="Search courses..."
              value={search} onChange={handleSearch} />
          </div>

          {}
          {loading ? (
            <div className="skeleton-list">
              {[1,2,3].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : courses.length === 0 ? (
            <div className="state-box">
              <div className="state-icon">📭</div>
              <p>{search ? `No courses match "${search}"` : 'No courses yet.'}</p>
            </div>
          ) : (
            <div className="courses-list">
              {courses.map((course, i) => {
                const enrolled = isEnrolled(course);
                return (
                  <div key={course._id} className="course-card">

                    {}
                    {editId !== course._id ? (
                      <div className="course-card-view">
                        <div className="course-number">{i + 1}</div>
                        <div className="course-body">
                          <div className="course-name">{course.courseName}</div>
                          <div className="course-desc">{course.courseDescription}</div>
                          <div className="course-meta">
                            <span>👨‍🏫 {course.instructor}</span>
                            <span>📅 {new Date(course.createdAt).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' })}</span>
                          </div>
                          <div className="enrolled-count">
                            👥 {course.enrolledStudents?.length || 0} enrolled
                          </div>
                        </div>

                        <div className="card-actions">
                          {}
                          {isAdmin ? (
                            <>
                              <button className="edit-btn" onClick={() => startEdit(course)}>✏️ Edit</button>
                              <button className="delete-btn"
                                onClick={() => handleDelete(course._id)}
                                disabled={deletingId === course._id}>
                                {deletingId === course._id
                                  ? <><Spinner size={11} color="#c00" /><span>...</span></>
                                  : 'Delete'}
                              </button>
                            </>
                          ) : (
                            enrolled ? (
                              <button className="leave-btn"
                                onClick={() => handleLeave(course._id)}
                                disabled={enrollingId === course._id}>
                                {enrollingId === course._id
                                  ? <><Spinner size={11} color="#555" /><span>...</span></>
                                  : '✓ Leave'}
                              </button>
                            ) : (
                              <button className="enroll-btn"
                                onClick={() => handleEnroll(course._id)}
                                disabled={enrollingId === course._id}>
                                {enrollingId === course._id
                                  ? <><Spinner /><span>...</span></>
                                  : 'Enroll'}
                              </button>
                            )
                          )}
                        </div>
                      </div>

                    ) : (
                      <>
                        <div className="course-card-view">
                          <div className="course-number">{i + 1}</div>
                          <div className="course-body">
                            <div className="course-name" style={{ color:'#aaa', fontStyle:'italic', fontWeight:400 }}>Editing...</div>
                          </div>
                        </div>
                        <div className="edit-form">
                          <div className="edit-row">
                            <div className="edit-field">
                              <label>Course Name</label>
                              <input value={editForm.courseName} required
                                onChange={e => setEditForm({ ...editForm, courseName:e.target.value })} />
                            </div>
                            <div className="edit-field">
                              <label>Instructor</label>
                              <input value={editForm.instructor} required
                                onChange={e => setEditForm({ ...editForm, instructor:e.target.value })} />
                            </div>
                          </div>
                          <div className="edit-field">
                            <label>Description</label>
                            <input value={editForm.courseDescription} required
                              onChange={e => setEditForm({ ...editForm, courseDescription:e.target.value })} />
                          </div>
                          <div className="edit-actions">
                            <button className="save-edit-btn"
                              disabled={savingId === course._id}
                              onClick={() => handleSaveEdit(course._id)}>
                              {savingId === course._id
                                ? <><Spinner /><span>Saving...</span></>
                                : '✓ Save Changes'}
                            </button>
                            <button className="cancel-edit-btn" onClick={cancelEdit}>Cancel</button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}