import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'
import AppRouter from './router'
import SidebarProvider from './context/SidebarContext'

export default function App() {
  return (
    <SidebarProvider>
      <div className="app-container">
        <Navbar />
        <div className="layout">
          <Sidebar />
          <main className="content">
            <AppRouter />
          </main>
        </div>
        <Footer />
      </div>
    </SidebarProvider>
  )
}