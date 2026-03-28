import { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import Layout from '../components/Layout'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { downloadCSV, downloadPDF } from '../utils/export'

const columns = [
  { name: 'ID', selector: (r) => r.id, sortable: true, width: '70px' },
  { name: 'First Name', selector: (r) => r.first_name, sortable: true, cell: (r) => <span className="font-bold text-slate-800">{r.first_name}</span> },
  { name: 'Last Name', selector: (r) => r.last_name, sortable: true, cell: (r) => <span className="font-bold text-slate-800">{r.last_name}</span> },
  { name: 'Email', selector: (r) => r.email, sortable: true, grow: 2 },
  { name: 'Phone', selector: (r) => r.phone || '—', sortable: false },
  {
    name: 'Created At',
    selector: (r) => r.created_at,
    sortable: true,
    format: (r) => r.created_at ? new Date(r.created_at).toLocaleDateString() : '—',
  },
]

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterText, setFilterText] = useState('')

  useEffect(() => {
    api.get('/users')
      .then((res) => setUsers(res.data.data || []))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = users.filter(
    (u) =>
      u.first_name?.toLowerCase().includes(filterText.toLowerCase()) ||
      u.last_name?.toLowerCase().includes(filterText.toLowerCase()) ||
      u.email?.toLowerCase().includes(filterText.toLowerCase())
  )

  const handleExportCSV = () => downloadCSV(filtered, 'Users_List.csv')
  const handleExportPDF = () => downloadPDF(filtered, 'System User Registry', 'Users_Report.pdf')

  return (
    <Layout>
      <div className="animate-fade-in">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
          <div>
            <p className="text-blue-600 font-black text-xs uppercase tracking-widest mb-1">Account Registry</p>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">System Users</h1>
            <p className="text-slate-400 font-medium mt-1">Found {users.length} registered accounts in the database</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative group flex-1 sm:flex-none">
              <input
                type="text"
                placeholder="Search database..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="input-field pl-10 sm:w-60 bg-white border-slate-200 outline-none"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30 text-lg">🔍</span>
            </div>

            <button 
              onClick={handleExportCSV}
              className="px-4 py-2.5 rounded-xl bg-white text-emerald-600 border border-emerald-100 hover:bg-emerald-50 transition-all font-bold flex items-center gap-2 text-sm shadow-sm"
            >
              <span>📊</span> CSV
            </button>
            <button 
              onClick={handleExportPDF}
              className="px-4 py-2.5 rounded-xl bg-white text-rose-600 border border-rose-100 hover:bg-rose-50 transition-all font-bold flex items-center gap-2 text-sm shadow-sm"
            >
              <span>📄</span> PDF
            </button>
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
              <div className="py-20 text-center">
                <p className="text-5xl mb-4 group-hover:scale-110 transition-transform">👤</p>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No records found matching your query</p>
              </div>
            }
          />
        </div>
      </div>
    </Layout>
  )
}
