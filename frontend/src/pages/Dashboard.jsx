import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'
import api from '../api/axios'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

const StatCard = ({ label, value, icon, color }) => (
  <div className="bg-white p-7 rounded-[22px] border border-slate-100 flex items-center gap-6 shadow-sm hover:shadow-md transition-all duration-300">
    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm"
      style={{ background: color, border: '1px solid rgba(0,0,0,0.03)' }}>
      {icon}
    </div>
    <div>
      <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-1">{label}</p>
      <p className="text-3xl font-extrabold text-slate-800 tracking-tight leading-none">{value}</p>
    </div>
  </div>
)

const QuickLink = ({ to, label, desc, icon }) => (
  <Link to={to} className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center gap-4 hover:border-blue-400/30 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 group">
    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-inner transition-transform group-hover:scale-110"
      style={{ background: '#f8fafc' }}>
      {icon}
    </div>
    <div className="flex-1">
      <p className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{label}</p>
      <p className="text-slate-400 text-xs font-medium">{desc}</p>
    </div>
    <span className="text-slate-200 group-hover:text-blue-400 transition-all font-bold">→</span>
  </Link>
)

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ users: 0, teachers: 0 })
  const [teacherData, setTeacherData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [u, t] = await Promise.all([api.get('/users'), api.get('/teachers')])
        setStats({ users: u.data.data.length, teachers: t.data.data.length })
        setTeacherData(t.data.data || [])
      } catch (_) {
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const barData = [
    { name: 'Accounts', count: stats.users },
    { name: 'Faculty', count: stats.teachers },
  ]

  const genderDistribution = teacherData.reduce((acc, curr) => {
    acc[curr.gender] = (acc[curr.gender] || 0) + 1
    return acc
  }, {})

  const pieData = Object.keys(genderDistribution).map(key => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value: genderDistribution[key]
  }))

  const COLORS = ['#2563eb', '#06b6d4', '#4f46e5']

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <Layout>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="mb-12">
          <p className="text-blue-600 text-xs font-black uppercase tracking-[0.2em] mb-2">{greeting} ✨</p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-5xl font-extrabold text-slate-900 mb-3 tracking-tighter">
                Welcome, <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{user?.first_name}</span>
              </h1>
              <p className="text-slate-400 font-medium max-w-xl text-lg">Your academic administrative overview is ready.</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <StatCard label="Total Users" value={stats.users} icon="👥"
            color="#f0f9ff" />
          <StatCard label="Faculty" value={stats.teachers} icon="🎓"
            color="#eff6ff" />
          <StatCard label="System" value="Active" icon="✅"
            color="#f0fdf4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
          <div className="bg-white p-8 rounded-[30px] border border-slate-100 shadow-sm">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-8 flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              Registration Growth
            </h3>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}} />
                  <Tooltip 
                    contentStyle={{border: 'none', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)'}}
                    cursor={{fill: '#f8fafc'}}
                  />
                  <Bar dataKey="count" fill="#2563eb" radius={[10, 10, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[30px] border border-slate-100 shadow-sm">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-8 flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
              Gender Demographics
            </h3>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={8} dataKey="value">
                    {pieData.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} cornerRadius={8} stroke="#fff" strokeWidth={4} />)}
                  </Pie>
                  <Tooltip contentStyle={{border: 'none', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)'}} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="mb-14">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.25em] mb-6">Management shortcuts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            <QuickLink to="/users" label="User Registry" desc="Auditing & Access" icon="👤" />
            <QuickLink to="/teachers" label="Faculty List" desc="Academic Data" icon="📊" />
            <QuickLink to="/teachers/add" label="New Member" desc="Manual Insertion" icon="➕" />
            <QuickLink to="/users" label="Audit Logs" desc="Security Events" icon="🛡️" />
          </div>
        </div>
      </div>
    </Layout>
  )
}
