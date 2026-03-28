import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Layout from '../components/Layout'
import api from '../api/axios'

const currentYear = new Date().getFullYear()

export default function AddTeacher() {
  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '', password: '', phone: '',
    university_name: '', gender: '', year_joined: '', bio: ''
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/teachers/create', form)
      toast.success('Teacher added successfully! 🎓')
      navigate('/teachers')
    } catch (err) {
      const errors = err.response?.data?.errors
      if (errors) {
        Object.values(errors).forEach((msg) => toast.error(msg))
      } else {
        toast.error(err.response?.data?.message || 'Failed to add teacher')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="animate-fade-in max-w-2xl mx-auto">
        <div className="mb-8">
          <p className="text-violet-400 text-xs font-mono uppercase tracking-widest mb-1">Faculty</p>
          <h1 className="text-3xl font-bold text-white">Add New Teacher</h1>
          <p className="text-slate-400 text-sm mt-1">This will create both a user account and teacher profile.</p>
        </div>

        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section: Account Info */}
            <div>
              <h3 className="text-xs uppercase tracking-widest font-semibold text-violet-400 mb-4 pb-2 border-b border-violet-500/20">
                Account Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">First Name</label>
                  <input type="text" name="first_name" value={form.first_name}
                    onChange={handleChange} placeholder="Jane" className="input-field" required />
                </div>
                <div>
                  <label className="label">Last Name</label>
                  <input type="text" name="last_name" value={form.last_name}
                    onChange={handleChange} placeholder="Smith" className="input-field" required />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Email Address</label>
                  <input type="email" name="email" value={form.email}
                    onChange={handleChange} placeholder="jane.smith@university.edu" className="input-field" required />
                </div>
                <div>
                  <label className="label">Password</label>
                  <input type="password" name="password" value={form.password}
                    onChange={handleChange} placeholder="Min. 6 characters" className="input-field" required />
                </div>
                <div>
                  <label className="label">Phone <span className="text-slate-600 normal-case tracking-normal font-normal">(optional)</span></label>
                  <input type="tel" name="phone" value={form.phone}
                    onChange={handleChange} placeholder="+91 98765 43210" className="input-field" />
                </div>
              </div>
            </div>

            {/* Section: Teacher Info */}
            <div>
              <h3 className="text-xs uppercase tracking-widest font-semibold text-cyan-400 mb-4 pb-2 border-b border-cyan-500/20">
                Teacher Profile
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="label">University Name</label>
                  <input type="text" name="university_name" value={form.university_name}
                    onChange={handleChange} placeholder="e.g. Mumbai University" className="input-field" required />
                </div>
                <div>
                  <label className="label">Gender</label>
                  <select name="gender" value={form.gender} onChange={handleChange}
                    className="input-field" required>
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="label">Year Joined</label>
                  <input type="number" name="year_joined" value={form.year_joined}
                    onChange={handleChange} placeholder={currentYear} min="1900" max={currentYear}
                    className="input-field" required />
                </div>
                <div className="sm:col-span-2">
                  <label className="label">Bio <span className="text-slate-600 normal-case tracking-normal font-normal">(optional)</span></label>
                  <textarea name="bio" value={form.bio} onChange={handleChange}
                    placeholder="Brief description about the teacher..."
                    rows={3} className="input-field resize-none" />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => navigate('/teachers')}
                className="flex-1 px-6 py-3 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-all font-semibold">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="btn-primary flex-1">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Adding teacher...
                  </span>
                ) : 'Add Teacher'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}
