import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ courseName: '', courseDescription: '', instructor: '' });
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const name = localStorage.getItem('name');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchCourses = async (searchTerm = '') => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5000/api/courses?search=${searchTerm}`,
        { headers }
      );
      setCourses(res.data);
    } catch (err) {
      setError('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('http://localhost:5000/api/courses', form, { headers });
      setForm({ courseName: '', courseDescription: '', instructor: '' });
      fetchCourses(search);
    } catch (err) {
      setError('Failed to create course');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/courses/${id}`, { headers });
      fetchCourses(search);
    } catch (err) {
      setError('Failed to delete course');
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    fetchCourses(e.target.value);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div style={styles.page}>

      {/* Navbar */}
      <div style={styles.navbar}>
        <h2 style={{ margin: 0, fontSize: '1.3rem' }}>📚 Course Management</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: '#e0e7ff' }}>👋 Welcome, {name}</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
        </div>
      </div>

      <div style={styles.content}>
        {error && <div style={styles.error}>{error}</div>}

        {/* Create Course Card */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>➕ Create New Course</h3>
          <form onSubmit={handleCreate}>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Course Name</label>
                <input style={styles.input} name="courseName"
                  placeholder="e.g. React Fundamentals"
                  value={form.courseName} required onChange={handleChange} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Instructor</label>
                <input style={styles.input} name="instructor"
                  placeholder="e.g. Sir Ahmed"
                  value={form.instructor} required onChange={handleChange} />
              </div>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Description</label>
              <input style={styles.input} name="courseDescription"
                placeholder="Brief course description"
                value={form.courseDescription} required onChange={handleChange} />
            </div>
            <button style={styles.createBtn} type="submit">
              + Add Course
            </button>
          </form>
        </div>

        {/* Courses List Card */}
        <div style={styles.card}>
          <div style={styles.listHeader}>
            <h3 style={{ margin: 0 }}>📋 All Courses ({courses.length})</h3>
            <input style={styles.searchInput} placeholder="🔍 Search courses..."
              value={search} onChange={handleSearch} />
          </div>

          {loading ? (
            <p style={{ textAlign: 'center', color: '#6b7280' }}>Loading...</p>
          ) : courses.length === 0 ? (
            <div style={styles.empty}>
              <p>No courses found. Create your first course above!</p>
            </div>
          ) : (
            courses.map(course => (
              <div key={course._id} style={styles.courseCard}>
                <div style={styles.courseInfo}>
                  <h4 style={styles.courseName}>{course.courseName}</h4>
                  <p style={styles.courseDesc}>{course.courseDescription}</p>
                  <div style={styles.courseMeta}>
                    <span>👨‍🏫 {course.instructor}</span>
                    <span style={{ marginLeft: '1rem' }}>
                      📅 {new Date(course.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <button onClick={() => handleDelete(course._id)} style={styles.deleteBtn}>
                  🗑️ Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight:'100vh', background:'#f3f4f6', fontFamily:'sans-serif' },
  navbar: { background:'#4f46e5', color:'white', padding:'1rem 2rem',
    display:'flex', justifyContent:'space-between', alignItems:'center',
    boxShadow:'0 2px 8px rgba(0,0,0,0.2)' },
  logoutBtn: { padding:'8px 16px', background:'white', color:'#4f46e5',
    border:'none', borderRadius:'6px', cursor:'pointer', fontWeight:'bold' },
  content: { maxWidth:'860px', margin:'2rem auto', padding:'0 1rem' },
  card: { background:'white', padding:'1.5rem', borderRadius:'10px',
    boxShadow:'0 2px 10px rgba(0,0,0,0.08)', marginBottom:'1.5rem' },
  cardTitle: { marginTop: 0, marginBottom:'1rem', color:'#374151' },
  formRow: { display:'flex', gap:'1rem' },
  formGroup: { flex: 1, marginBottom:'0.8rem' },
  label: { display:'block', marginBottom:'4px', fontWeight:'600',
    color:'#374151', fontSize:'0.85rem' },
  input: { width:'100%', padding:'10px 12px', borderRadius:'6px',
    border:'1px solid #d1d5db', boxSizing:'border-box', fontSize:'0.95rem' },
  createBtn: { padding:'10px 24px', background:'#4f46e5', color:'white',
    border:'none', borderRadius:'6px', cursor:'pointer', fontWeight:'bold',
    fontSize:'0.95rem', marginTop:'0.5rem' },
  listHeader: { display:'flex', justifyContent:'space-between',
    alignItems:'center', marginBottom:'1rem', flexWrap:'wrap', gap:'1rem' },
  searchInput: { padding:'9px 14px', borderRadius:'6px', border:'1px solid #d1d5db',
    width:'250px', fontSize:'0.95rem' },
  courseCard: { display:'flex', justifyContent:'space-between',
    alignItems:'center', padding:'1rem', border:'1px solid #e5e7eb',
    borderRadius:'8px', marginBottom:'0.8rem', background:'#fafafa' },
  courseInfo: { flex: 1 },
  courseName: { margin:'0 0 4px 0', color:'#1f2937', fontSize:'1.05rem' },
  courseDesc: { margin:'0 0 6px 0', color:'#6b7280', fontSize:'0.9rem' },
  courseMeta: { color:'#9ca3af', fontSize:'0.82rem' },
  deleteBtn: { padding:'8px 14px', background:'#ef4444', color:'white',
    border:'none', borderRadius:'6px', cursor:'pointer', fontWeight:'bold',
    marginLeft:'1rem', whiteSpace:'nowrap' },
  empty: { textAlign:'center', padding:'2rem', color:'#9ca3af' },
  error: { background:'#fee2e2', color:'#dc2626', padding:'12px',
    borderRadius:'6px', marginBottom:'1rem', textAlign:'center' }
};