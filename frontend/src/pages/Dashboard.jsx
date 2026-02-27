import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// ─── Toast Component ───────────────────────────────────────────────
function Toast({ toasts }) {
  return (
    <div style={{
      position: 'fixed', bottom: '1.5rem', right: '1.5rem',
      display: 'flex', flexDirection: 'column', gap: '0.5rem',
      zIndex: 1000, pointerEvents: 'none'
    }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          background: '#1a1a1a', color: '#fff',
          padding: '12px 18px', borderRadius: '12px',
          fontSize: '0.875rem', fontWeight: '400',
          boxShadow: '0 4px 20px rgba(0,0,0,0.18)',
          animation: 'toastIn 0.3s cubic-bezier(0.34,1.56,0.64,1)',
          pointerEvents: 'all', minWidth: '240px',
          borderLeft: `3px solid ${t.type === 'error' ? '#ff4444' : t.type === 'success' ? '#34c759' : '#007aff'}`
        }}>
          <span>{t.type === 'error' ? '✕' : '✓'}</span>
          <span style={{ flex: 1 }}>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Spinner Component ─────────────────────────────────────────────
function Spinner({ size = 14, color = '#fff' }) {
  return (
    <span style={{
      width: size, height: size,
      border: `2px solid rgba(255,255,255,0.25)`,
      borderTop: `2px solid ${color}`,
      borderRadius: '50%', display: 'inline-block',
      animation: 'spin 0.7s linear infinite', flexShrink: 0
    }} />
  );
}

// ─── Main Dashboard ────────────────────────────────────────────────
export default function Dashboard() {
  const [courses, setCourses]       = useState([]);
  const [form, setForm]             = useState({ courseName: '', courseDescription: '', instructor: '' });
  const [search, setSearch]         = useState('');
  const [loading, setLoading]       = useState(true);
  const [adding, setAdding]         = useState(false);
  const [showForm, setShowForm]     = useState(false);
  const [editId, setEditId]         = useState(null);
  const [editForm, setEditForm]     = useState({});
  const [savingId, setSavingId]     = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [toasts, setToasts]         = useState([]);

  const navigate = useNavigate();
  const token    = localStorage.getItem('token');
  const name     = localStorage.getItem('name');
  const headers  = { Authorization: `Bearer ${token}` };

  // ── Toast helpers ──────────────────────────────────────────────
  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  // ── Fetch ──────────────────────────────────────────────────────
  const fetchCourses = useCallback(async (q = '') => {
    try {
      const res = await axios.get(`http://localhost:5000/api/courses?search=${q}`, { headers });
      setCourses(res.data);
    } catch {
      addToast('Failed to load courses', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCourses(); }, []);

  // ── Create ─────────────────────────────────────────────────────
  const handleCreate = async (e) => {
    e.preventDefault();
    setAdding(true);
    try {
      await axios.post('http://localhost:5000/api/courses', form, { headers });
      setForm({ courseName: '', courseDescription: '', instructor: '' });
      setShowForm(false);
      await fetchCourses(search);
      addToast('Course created successfully!', 'success');
    } catch {
      addToast('Failed to create course', 'error');
    } finally {
      setAdding(false);
    }
  };

  // ── Edit ───────────────────────────────────────────────────────
  const startEdit = (course) => {
    setEditId(course._id);
    setEditForm({
      courseName: course.courseName,
      courseDescription: course.courseDescription,
      instructor: course.instructor
    });
  };

  const cancelEdit = () => { setEditId(null); setEditForm({}); };

  const handleSaveEdit = async (id) => {
    setSavingId(id);
    try {
      await axios.put(`http://localhost:5000/api/courses/${id}`, editForm, { headers });
      setEditId(null);
      await fetchCourses(search);
      addToast('Course updated!', 'success');
    } catch {
      addToast('Failed to update course', 'error');
    } finally {
      setSavingId(null);
    }
  };

  // ── Delete ─────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await axios.delete(`http://localhost:5000/api/courses/${id}`, { headers });
      await fetchCourses(search);
      addToast('Course deleted', 'success');
    } catch {
      addToast('Failed to delete course', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSearch = (e) => { setSearch(e.target.value); fetchCourses(e.target.value); };
  const handleLogout = () => { localStorage.clear(); navigate('/login'); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        body { background:#f5f5f7; }

        @keyframes spin     { to { transform: rotate(360deg); } }
        @keyframes toastIn  { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }
        @keyframes fadeIn   { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideDown{ from { opacity:0; transform:translateY(-8px);  } to { opacity:1; transform:translateY(0); } }
        @keyframes cardIn   { from { opacity:0; transform:translateY(6px);   } to { opacity:1; transform:translateY(0); } }

        .dash { min-height:100vh; background:#f5f5f7; font-family:'DM Sans',sans-serif; color:#1d1d1f; }

        .nav { background:rgba(255,255,255,0.85); backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px); border-bottom:1px solid rgba(0,0,0,0.08); position:sticky; top:0; z-index:100; padding:0 2rem; height:52px; display:flex; align-items:center; justify-content:space-between; }
        .nav-left { display:flex; align-items:center; gap:10px; }
        .nav-icon { width:28px; height:28px; background:#000; border-radius:6px; display:flex; align-items:center; justify-content:center; font-size:14px; }
        .nav-title { font-size:0.95rem; font-weight:600; letter-spacing:-0.2px; color:#000; }
        .nav-right { display:flex; align-items:center; gap:1rem; }
        .nav-greeting { font-size:0.85rem; color:#6e6e73; }
        .nav-greeting span { color:#000; font-weight:500; }
        .logout-btn { padding:6px 14px; background:transparent; border:1px solid #d2d2d7; border-radius:7px; font-size:0.82rem; font-family:'DM Sans',sans-serif; font-weight:500; color:#1d1d1f; cursor:pointer; transition:all 0.15s; }
        .logout-btn:hover { background:#f5f5f7; border-color:#a0a0a5; }

        .content { max-width:780px; margin:0 auto; padding:2.5rem 1.5rem; animation:fadeIn 0.4s ease; }

        .page-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:2rem; }
        .page-title { font-size:1.7rem; font-weight:600; letter-spacing:-0.5px; color:#000; }
        .page-count { font-size:1rem; color:#6e6e73; font-weight:400; margin-left:6px; }
        .add-btn { display:flex; align-items:center; gap:6px; padding:9px 18px; background:#000; color:#fff; border:none; border-radius:10px; font-size:0.875rem; font-weight:500; font-family:'DM Sans',sans-serif; cursor:pointer; transition:all 0.2s; }
        .add-btn:hover { background:#222; transform:translateY(-1px); box-shadow:0 4px 12px rgba(0,0,0,0.15); }

        .form-panel { background:#fff; border:1px solid #e8e8e8; border-radius:16px; padding:1.8rem; margin-bottom:1.5rem; box-shadow:0 1px 3px rgba(0,0,0,0.04); animation:slideDown 0.25s ease; }
        .form-panel-title { font-size:1rem; font-weight:600; color:#000; margin-bottom:1.2rem; letter-spacing:-0.2px; }
        .form-row { display:grid; grid-template-columns:1fr 1fr; gap:0.8rem; margin-bottom:0.8rem; }
        .field label { display:block; font-size:0.75rem; font-weight:500; color:#6e6e73; margin-bottom:5px; text-transform:uppercase; letter-spacing:0.3px; }
        .field input { width:100%; padding:10px 12px; border:1px solid #e0e0e0; border-radius:9px; font-size:0.9rem; font-family:'DM Sans',sans-serif; background:#fafafa; color:#000; outline:none; transition:all 0.2s; }
        .field input:focus { border-color:#000; background:#fff; box-shadow:0 0 0 3px rgba(0,0,0,0.05); }
        .field input::placeholder { color:#bbb; }
        .form-actions { display:flex; gap:0.7rem; margin-top:1.2rem; align-items:center; }

        .save-btn { display:flex; align-items:center; gap:8px; padding:10px 22px; background:#000; color:#fff; border:none; border-radius:9px; font-size:0.875rem; font-weight:500; font-family:'DM Sans',sans-serif; cursor:pointer; transition:all 0.2s; min-width:120px; justify-content:center; }
        .save-btn:hover { background:#222; }
        .save-btn:disabled { background:#aaa; cursor:not-allowed; }
        .cancel-btn { padding:10px 18px; background:transparent; border:1px solid #d2d2d7; border-radius:9px; font-size:0.875rem; font-weight:500; font-family:'DM Sans',sans-serif; color:#1d1d1f; cursor:pointer; transition:all 0.15s; }
        .cancel-btn:hover { background:#f5f5f7; }

        .search-wrap { position:relative; margin-bottom:1.2rem; }
        .search-icon { position:absolute; left:13px; top:50%; transform:translateY(-50%); color:#aaa; pointer-events:none; }
        .search-input { width:100%; padding:11px 14px 11px 38px; border:1px solid #e0e0e0; border-radius:10px; font-size:0.9rem; font-family:'DM Sans',sans-serif; background:#fff; color:#000; outline:none; transition:all 0.2s; }
        .search-input:focus { border-color:#000; box-shadow:0 0 0 3px rgba(0,0,0,0.05); }
        .search-input::placeholder { color:#bbb; }

        .courses-list { display:flex; flex-direction:column; gap:0.7rem; }
        .course-card { background:#fff; border:1px solid #e8e8e8; border-radius:14px; padding:1.2rem 1.4rem; transition:all 0.2s; animation:cardIn 0.3s ease; }
        .course-card:hover { border-color:#c8c8cc; box-shadow:0 2px 12px rgba(0,0,0,0.06); }
        .course-card-view { display:flex; align-items:center; gap:1rem; }
        .course-number { width:32px; height:32px; background:#f5f5f7; border-radius:8px; display:flex; align-items:center; justify-content:center; font-size:0.8rem; font-weight:600; color:#6e6e73; flex-shrink:0; }
        .course-body { flex:1; min-width:0; }
        .course-name { font-size:0.95rem; font-weight:600; color:#000; letter-spacing:-0.2px; margin-bottom:3px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .course-desc { font-size:0.83rem; color:#6e6e73; margin-bottom:5px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .course-meta { display:flex; gap:1rem; font-size:0.78rem; color:#a0a0a5; }
        .card-actions { display:flex; gap:0.5rem; flex-shrink:0; }

        .edit-btn { padding:7px 14px; background:transparent; border:1px solid #d2d2d7; border-radius:8px; font-size:0.8rem; font-weight:500; font-family:'DM Sans',sans-serif; color:#1d1d1f; cursor:pointer; transition:all 0.15s; }
        .edit-btn:hover { background:#f5f5f7; border-color:#a0a0a5; }

        .delete-btn { display:flex; align-items:center; gap:6px; padding:7px 14px; background:transparent; border:1px solid #ffd0d0; border-radius:8px; font-size:0.8rem; font-weight:500; font-family:'DM Sans',sans-serif; color:#c00; cursor:pointer; transition:all 0.15s; min-width:74px; justify-content:center; }
        .delete-btn:hover { background:#fff1f1; border-color:#ffb0b0; }
        .delete-btn:disabled { opacity:0.5; cursor:not-allowed; }

        .edit-form { border-top:1px solid #f0f0f0; margin-top:1rem; padding-top:1rem; animation:slideDown 0.2s ease; }
        .edit-row { display:grid; grid-template-columns:1fr 1fr; gap:0.7rem; margin-bottom:0.7rem; }
        .edit-field label { display:block; font-size:0.72rem; font-weight:500; color:#6e6e73; margin-bottom:4px; text-transform:uppercase; letter-spacing:0.3px; }
        .edit-field input { width:100%; padding:9px 11px; border:1px solid #e0e0e0; border-radius:8px; font-size:0.875rem; font-family:'DM Sans',sans-serif; background:#fafafa; color:#000; outline:none; transition:all 0.2s; }
        .edit-field input:focus { border-color:#000; background:#fff; box-shadow:0 0 0 3px rgba(0,0,0,0.05); }
        .edit-actions { display:flex; gap:0.6rem; margin-top:0.8rem; }
        .save-edit-btn { display:flex; align-items:center; gap:7px; padding:8px 18px; background:#000; color:#fff; border:none; border-radius:8px; font-size:0.82rem; font-weight:500; font-family:'DM Sans',sans-serif; cursor:pointer; min-width:90px; justify-content:center; transition:all 0.2s; }
        .save-edit-btn:hover { background:#222; }
        .save-edit-btn:disabled { background:#aaa; cursor:not-allowed; }
        .cancel-edit-btn { padding:8px 14px; background:transparent; border:1px solid #d2d2d7; border-radius:8px; font-size:0.82rem; font-family:'DM Sans',sans-serif; color:#555; cursor:pointer; transition:all 0.15s; }
        .cancel-edit-btn:hover { background:#f5f5f7; }

        .state-box { background:#fff; border:1px solid #e8e8e8; border-radius:14px; padding:3rem 2rem; text-align:center; color:#a0a0a5; }
        .state-box p { font-size:0.9rem; margin-top:0.5rem; }
        .state-icon { font-size:2rem; margin-bottom:0.5rem; }
      `}</style>

      {/* Toast Notifications */}
      <Toast toasts={toasts} />

      <div className="dash">
        {/* Navbar */}
        <nav className="nav">
          <div className="nav-left">
            <div className="nav-icon">📚</div>
            <span className="nav-title">CourseKit</span>
          </div>
          <div className="nav-right">
            <span className="nav-greeting">Hello, <span>{name}</span></span>
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
            <button className="add-btn" onClick={() => { setShowForm(!showForm); setEditId(null); }}>
              {showForm ? '✕ Cancel' : '+ New Course'}
            </button>
          </div>

          {/* Create Form */}
          {showForm && (
            <div className="form-panel">
              <p className="form-panel-title">New Course</p>
              <form onSubmit={handleCreate}>
                <div className="form-row">
                  <div className="field">
                    <label>Course Name</label>
                    <input name="courseName" placeholder="e.g. React Basics"
                      value={form.courseName} required
                      onChange={e => setForm({ ...form, courseName: e.target.value })} />
                  </div>
                  <div className="field">
                    <label>Instructor</label>
                    <input name="instructor" placeholder="e.g. Sir Ahmed"
                      value={form.instructor} required
                      onChange={e => setForm({ ...form, instructor: e.target.value })} />
                  </div>
                </div>
                <div className="field">
                  <label>Description</label>
                  <input name="courseDescription" placeholder="Brief description"
                    value={form.courseDescription} required
                    onChange={e => setForm({ ...form, courseDescription: e.target.value })} />
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

          {/* Search */}
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input className="search-input" placeholder="Search courses..."
              value={search} onChange={handleSearch} />
          </div>

          {/* Course List */}
          {loading ? (
            <div className="state-box">
              <div className="state-icon">⏳</div>
              <p>Loading courses...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="state-box">
              <div className="state-icon">📭</div>
              <p>{search ? `No courses match "${search}"` : 'No courses yet. Create your first one!'}</p>
            </div>
          ) : (
            <div className="courses-list">
              {courses.map((course, i) => (
                <div key={course._id} className="course-card">

                  {/* ── View Mode ── */}
                  {editId !== course._id ? (
                    <div className="course-card-view">
                      <div className="course-number">{i + 1}</div>
                      <div className="course-body">
                        <div className="course-name">{course.courseName}</div>
                        <div className="course-desc">{course.courseDescription}</div>
                        <div className="course-meta">
                          <span>👨‍🏫 {course.instructor}</span>
                          <span>📅 {new Date(course.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                      </div>
                      <div className="card-actions">
                        <button className="edit-btn" onClick={() => startEdit(course)}>
                          ✏️ Edit
                        </button>
                        <button className="delete-btn"
                          onClick={() => handleDelete(course._id)}
                          disabled={deletingId === course._id}>
                          {deletingId === course._id
                            ? <><Spinner size={12} color="#c00" /><span>...</span></>
                            : 'Delete'}
                        </button>
                      </div>
                    </div>

                  ) : (
                  /* ── Edit Mode (inline) ── */
                    <>
                      <div className="course-card-view">
                        <div className="course-number">{i + 1}</div>
                        <div className="course-body">
                          <div className="course-name" style={{ color:'#aaa', fontStyle:'italic', fontWeight:400 }}>
                            Editing course...
                          </div>
                        </div>
                      </div>
                      <div className="edit-form">
                        <div className="edit-row">
                          <div className="edit-field">
                            <label>Course Name</label>
                            <input value={editForm.courseName} required
                              onChange={e => setEditForm({ ...editForm, courseName: e.target.value })} />
                          </div>
                          <div className="edit-field">
                            <label>Instructor</label>
                            <input value={editForm.instructor} required
                              onChange={e => setEditForm({ ...editForm, instructor: e.target.value })} />
                          </div>
                        </div>
                        <div className="edit-field">
                          <label>Description</label>
                          <input value={editForm.courseDescription} required
                            onChange={e => setEditForm({ ...editForm, courseDescription: e.target.value })} />
                        </div>
                        <div className="edit-actions">
                          <button className="save-edit-btn"
                            disabled={savingId === course._id}
                            onClick={() => handleSaveEdit(course._id)}>
                            {savingId === course._id
                              ? <><Spinner /><span>Saving...</span></>
                              : '✓ Save Changes'}
                          </button>
                          <button className="cancel-edit-btn" onClick={cancelEdit}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  );
} 