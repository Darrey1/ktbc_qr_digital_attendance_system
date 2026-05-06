import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Landing from './pages/Landing'
import Register from './pages/Register'
import Scanner from './pages/Scanner'
import Admin from './pages/Admin'
import Header from './components/Header'
import Footer from './components/Footer'

export default function App(){
  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/scanner" element={<Scanner/>} />
          {/* <Route path="/admin/*" element={<Admin/>} /> */}
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
