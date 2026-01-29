import { Routes, Route } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'
import DataWilayah from '../pages/DataWilayah'
import Personel from '../pages/Personel'
import Piket from '../pages/Piket'  
import Keamanan from '../pages/Keamanan'
import Analytics from '../pages/Analytics'
import Reports from '../pages/Reports'

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/wilayah" element={<DataWilayah />} />
      <Route path="/personel" element={<Personel />} />
      <Route path="/Piket" element={<Piket />} />
      <Route path="/keamanan" element={<Keamanan />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/reports" element={<Reports />} />
    </Routes>
  )
}