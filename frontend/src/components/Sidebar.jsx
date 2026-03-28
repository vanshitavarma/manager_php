import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/users', label: 'User Registry', icon: '👥' },
  { to: '/teachers', label: 'Faculty List', icon: '📋' },
  { to: '/teachers/add', label: 'Add Member', icon: '➕' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 z-50 flex flex-col bg-white border-r border-slate-200 shadow-sm transition-all duration-300">
      {/* Brand */}
      <div className="p-8 pb-4">
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 duration-200"
            style={{ background: 'linear-gradient(135deg, #2563eb, #3b82f6)' }}>
            <span className="text-white font-bold text-lg italic tracking-wider">T</span>
          </div>
          <div>
            <h1 className="font-extrabold text-xl text-slate-800 tracking-tight">TeachVault</h1>
            <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-0.5">Admin Portal</p>
          </div>
        </Link>
      </div>

      <div className="h-px w-3/4 mx-auto bg-slate-100 my-4" />

      {/* Navigation */}
      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.to
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                isActive
                  ? 'text-blue-600 bg-blue-50/50 border border-blue-100 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span className={`text-lg transition-transform group-hover:scale-110 ${isActive ? '' : 'grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100'}`}>
                {link.icon}
              </span>
              <span>{link.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 bg-blue-600 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.4)]" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Profile & Logout */}
      <div className="p-4 mt-auto">
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 font-bold shadow-sm">
              {user?.first_name?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 truncate">{user?.first_name} {user?.last_name}</p>
              <p className="text-[10px] text-slate-400 font-medium truncate uppercase tracking-tighter">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full py-2.5 rounded-lg text-xs font-bold text-red-500 border border-red-100 bg-white hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
          >
            <span>🚪</span>
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  )
}
