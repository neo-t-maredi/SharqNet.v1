import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import OperatorDashboard from './pages/OperatorDashboard'
import InvestorView from './pages/InvestorView'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/grid" element={<OperatorDashboard />} />
        <Route path="/investor" element={<InvestorView />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App