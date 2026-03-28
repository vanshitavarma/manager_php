import { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { downloadCSV, downloadPDF } from '../utils/export'

const genderBadge = (gender) => {
  const map = { male: 'bg-blue-100 text-blue-700 border-blue-200', female: 'bg-rose-100 text-rose-700 border-rose-200', other: 'bg-slate-100 text-slate-700 border-slate-200' }
  return (
    <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all hover:scale-105 ${map[gender] || 'bg-slate-100 text-slate-500'}`}>
      {gender}
    </span>
  )
}

const columns = [
  { name: 'ID', selector: (r) => r.id, sortable: true, width: '70px' },
  {
    name: 'Full Name',
    selector: (r) => `${r.first_name} ${r.last_name}`,
    sortable: true,
    cell: (r) => <span className="font-extrabold text-slate-900 tracking-tight">{r.first_name} {r.last_name}</span>,
  },
  { name: 'Email', selector: (r) => r.email, sortable: true, grow: 2, cell: (r) => <span className="text-slate-500 font-medium">{r.email}</span> },
  { name: 'University', selector: (r) => r.university_name, sortable: true, grow: 2, cell: (r) => <span className="font-bold text-slate-700">{r.university_name}</span> },
  { name: 'Gender', selector: (r) => r.gender, cell: (r) => genderBadge(r.gender) },
  { name: 'Year Joined', selector: (r) => r.year_joined, sortable: true, width: '130px', cell: (r) => <span className="text-slate-500 font-mono text-[11px] font-bold">{r.year_joined}</span> },
  {
    name: 'Bio',
    selector: (r) => r.bio,
    cell: (r) => <span className="text-slate-400 text-xs line-clamp-1 italic font-medium">{r.bio || '—'}</span>,
    grow: 2,
  },
]

export default function Teachers() {
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterText, setFilterText] = useState('')

  useEffect(() => {
    api.get('/teachers')
      .then((res) => setTeachers(res.data.data || []))
      .catch(() => toast.error('Failed to load teachers'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = teachers.filter(
    (t) =>
      `${t.first_name} ${t.last_name}`.toLowerCase().includes(filterText.toLowerCase()) ||
      t.email?.toLowerCase().includes(filterText.toLowerCase()) ||
      t.university_name?.toLowerCase().includes(filterText.toLowerCase())
  )

  const handleExportCSV = () => downloadCSV(filtered, 'Faculty_List.csv')
  const handleExportPDF = () => downloadPDF(filtered, 'Faculty Registry Report', 'Faculty_Export.pdf')

  return (
    <Layout>
      <div className="animate-fade-in">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
          <div>
            <p className="text-blue-600 font-black text-xs uppercase tracking-[0.2em] mb-1">Academic Faculty</p>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Teacher Registry</h1>
            <p className="text-slate-400 font-medium mt-1">Maintaining records for {teachers.length} academic professionals</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative group flex-1 sm:flex-none">
              <input
                type="text"
                placeholder="Search faculty..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="input-field pl-10 sm:w-60 bg-white border-slate-200 outline-none"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30 text-lg">🔍</span>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={handleExportCSV}
                className="px-4 py-3 rounded-xl bg-white text-emerald-600 border border-emerald-100 hover:bg-emerald-50 transition-all font-bold flex items-center gap-2 text-sm shadow-sm"
              >
                📊 CSV
              </button>
              <button 
                onClick={handleExportPDF}
                className="px-4 py-3 rounded-xl bg-white text-rose-600 border border-rose-100 hover:bg-rose-50 transition-all font-bold flex items-center gap-2 text-sm shadow-sm"
              >
                📄 PDF
              </button>
              <Link to="/teachers/add" className="btn-primary flex items-center gap-2 py-3 shadow-md px-6 shadow-blue-500/10 active:scale-95 transition-transform">
                <span>Add Member</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="glass-card overflow-hidden shadow-2xl shadow-slate-200/50">
          <DataTable
            columns={columns}
            data={filtered}
            progressPending={loading}
            progressComponent={
              <div className="py-20 flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Querying data...</p>
              </div>
            }
            pagination
            paginationPerPage={10}
            noDataComponent={
              <div className="py-24 text-center">
                <p className="text-5xl mb-4 grayscale opacity-40">🎓</p>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-3">No profiles found in your search results</p>
                <Link to="/teachers/add" className="text-blue-600 text-[10px] font-black uppercase tracking-widest hover:underline shadow-sm">Add first record →</Link>
              </div>
            }
          />
        </div>
      </div>
    </Layout>
  )
}
