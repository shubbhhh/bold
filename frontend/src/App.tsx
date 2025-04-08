import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import { Home } from './pages/Home'
import Builder from './pages/Builder'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/build' element={<Builder />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
