import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import OperatorDashboard from './pages/OperatorDashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/grid" element={<OperatorDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App