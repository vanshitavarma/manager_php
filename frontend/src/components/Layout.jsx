import Sidebar from './Sidebar'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <div className="orb orb-1 opacity-[0.03]" />
      <div className="orb orb-2 opacity-[0.03]" />
      <Sidebar />
      <main className="relative z-10 flex-1 ml-64 min-h-screen p-10 lg:p-14 max-w-[1440px] mx-auto overflow-x-hidden">
        {children}
      </main>
    </div>
  )
}
