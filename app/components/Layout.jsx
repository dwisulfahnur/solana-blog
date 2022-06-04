import Navbar from './Navbar'

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 p-5 md:p-10">
        <Navbar />
        {children}
      </div>
    </div>
  )
}

export default Layout
