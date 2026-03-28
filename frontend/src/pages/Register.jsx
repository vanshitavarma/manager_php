import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../api/axios'

export default function Register() {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    phone: '',
    university_name: '',
    gender: 'male',
    year_joined: new Date().getFullYear().toString(),
    bio: ''
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/register', form)
      toast.success('Account & Teacher Profile created! Please login.')
      navigate('/login')
    } catch (err) {
      const errors = err.response?.data?.errors
      if (errors) {
        Object.values(errors).forEach((msg) => toast.error(msg))
      } else {
        toast.error(err.response?.data?.message || 'Registration failed')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <div className="relative z-10 w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #0ea5e9, #06b6d4)' }}>
            <span className="text-white font-bold text-2xl">T</span>
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">TeachVault</h1>
          <p className="text-slate-400 text-sm">Create your admin account</p>
        </div>

        <div className="glass-card p-8">
          <h2 className="text-xl font-bold text-white mb-6">Create Account</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">First Name</label>
                <input type="text" name="first_name" value={form.first_name}
                  onChange={handleChange} placeholder="John" className="input-field" required />
              </div>
              <div>
                <label className="label">Last Name</label>
                <input type="text" name="last_name" value={form.last_name}
                  onChange={handleChange} placeholder="Doe" className="input-field" required />
              </div>
            </div>

            <div>
              <label className="label">Email Address</label>
              <input type="email" name="email" value={form.email}
                onChange={handleChange} placeholder="you@example.com" className="input-field" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">University Name</label>
                <input type="text" name="university_name" value={form.university_name}
                  onChange={handleChange} placeholder="Stanford University" className="input-field" required />
              </div>
              <div>
                <label className="label">Year Joined</label>
                <input type="number" name="year_joined" value={form.year_joined}
                  onChange={handleChange} placeholder="2024" className="input-field" required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Gender</label>
                <select name="gender" value={form.gender} onChange={handleChange} className="input-field">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="label">Phone <span className="text-slate-600 normal-case tracking-normal font-normal">(optional)</span></label>
                <input type="tel" name="phone" value={form.phone}
                  onChange={handleChange} placeholder="+91 98765 43210" className="input-field" />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <input type="password" name="password" value={form.password}
                onChange={handleChange} placeholder="Min. 6 characters" className="input-field" required />
            </div>

            <div>
              <label className="label">Bio <span className="text-slate-600 normal-case tracking-normal font-normal">(optional)</span></label>
              <textarea name="bio" value={form.bio} onChange={handleChange}
                placeholder="Briefly describe your background..." className="input-field h-24 resize-none" />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-sky-400 hover:text-sky-300 font-semibold transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
