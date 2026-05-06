import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'

function Sidebar(){
  return (
    <aside className="w-64 bg-white border-r hidden md:block">
      <div className="p-4 border-b">KTBC 2026</div>
      <nav className="p-4 space-y-2">
        <Link to="/admin" className="block p-2 rounded hover:bg-gray-50">Overview</Link>
        <Link to="/admin/registrations" className="block p-2 rounded hover:bg-gray-50">Registrations</Link>
        <Link to="/admin/checkin" className="block p-2 rounded hover:bg-gray-50">Check-In</Link>
      </nav>
    </aside>
  )
}

export default function Admin(){
  return (
    <div className="min-h-[80vh] bg-bg">
      <div className="max-w-7xl mx-auto flex">
        <Sidebar />
        <div className="flex-1 p-6">
          <h2 className="text-2xl font-display">Platform Overview</h2>
          <p className="text-sm text-muted">KTBC 2026 — Admin dashboard for the Digital Registration & Check-In System. Architecture: Frontend PWA (this app), Backend APIs (Node.js), PostgreSQL (Supabase), Messaging via WhatsApp/SMS. Core components include Registration, Parental Consent, QR Generator, Scanner App, Admin Dashboard, and Help Desk.</p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded shadow">Total Registered<br/><strong className="text-2xl">4,012</strong></div>
            <div className="p-4 bg-white rounded shadow">Checked In Today<br/><strong className="text-2xl">1,243</strong></div>
            <div className="p-4 bg-white rounded shadow">Pending Consent<br/><strong className="text-2xl">68</strong></div>
            <div className="p-4 bg-white rounded shadow">Flagged<br/><strong className="text-2xl">4</strong></div>
          </div>
        </div>
      </div>
    </div>
  )
}
