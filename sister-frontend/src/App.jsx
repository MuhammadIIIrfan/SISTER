import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AppRouter from './router'

export default function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="content">
        <AppRouter />
      </main>
      <Footer />
    </div>
  )
}