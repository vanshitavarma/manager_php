import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const navLinks = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/users', label: 'Users' },
  { to: '/teachers', label: 'Teachers' },
  { to: '/teachers/add', label: '+ Add Teacher' },
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50" style={{
      background: 'rgba(7,7,17,0.85)',
      borderBottom: '1px solid rgba(139,92,246,0.15)',
      backdropFilter: 'blur(20px)',
    }}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)' }}>
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <span className="font-bold text-lg gradient-text">TeachVault</span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                location.pathname === link.to
                  ? 'text-violet-400 bg-violet-500/10 border border-violet-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* User + Logout */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-semibold text-white">
              {user?.first_name} {user?.last_name}
            </span>
            <span className="text-xs text-slate-500 font-mono">{user?.email}</span>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-red-400 border border-red-500/20 hover:bg-red-500/10 transition-all duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}
