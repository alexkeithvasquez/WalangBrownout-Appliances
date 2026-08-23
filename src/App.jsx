import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import Home from './components/Home'
import PurchasingDashboard from './components/PurchasingDashboard'
import WarehouseScannerApp from './components/WarehouseScannerApp'
import OnlineStorefront from './components/OnlineStorefront'
import ManagementReporting from './components/ManagementReporting'
import './App.css'

function NotFound() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-24 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-power">404</p>
      <h1 className="mt-2 font-display text-2xl font-semibold text-ink">Module not found</h1>
      <p className="mt-2 text-sm text-muted">That route isn't wired up to anything.</p>
      <Link to="/" className="mt-6 inline-block text-sm text-online hover:underline">
        Back to the panel
      </Link>
    </main>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-bg font-body text-ink">
        <Navbar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/purchasing" element={<PurchasingDashboard />} />
            <Route path="/warehouse" element={<WarehouseScannerApp />} />
            <Route path="/storefront" element={<OnlineStorefront />} />
            <Route path="/reporting" element={<ManagementReporting />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
