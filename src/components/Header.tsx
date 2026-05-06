import React from 'react'
import { Link } from 'react-router-dom'
import { Sun, Menu, X, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

export default function Header(){
  const [open, setOpen] = React.useState(false)
  const { mode: theme, toggleMode, bg, setBg, cycleBg } = useTheme()
  const toggleTheme = ()=> toggleMode()

  return (
    <header className="w-full border-b border-gray-200 bg-bg/60 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center text-secondary font-display">KTBC</div>
          <div className="hidden sm:block">
            <div className="text-sm font-semibold">KTBC 2026</div>
            <div className="text-xs text-muted">Youth Summit · Lagos</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-3">
          <Link to="/register" className="ktbc-btn-primary px-4 py-2 rounded-lg">Register</Link>
          <Link to="/scanner" className="ktbc-btn-secondary px-4 py-2 rounded-lg">Check-In</Link>
          <div className="flex items-center gap-2">
            <select aria-label="Background" value={bg} onChange={(e)=> setBg(e.target.value as any) } className="rounded px-2 py-1 border">
              <option value="offwhite">Soft</option>
              <option value="white">White</option>
              <option value="dark">Dark</option>
            </select>
            <button aria-label="Toggle theme" onClick={toggleTheme} className="p-2 rounded-md hover:bg-gray-100">
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>
        </nav>

        {/* Mobile controls */}
        <div className="md:hidden flex items-center gap-2">
          <button aria-label="Toggle theme" onClick={toggleTheme} className="p-2 rounded-md hover:bg-gray-100">
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button aria-label="Open menu" onClick={()=> setOpen(o=>!o)} className="p-2 rounded-md border">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu drawer */}
      {open && (
        <div className="md:hidden bg-bg/95 border-t border-gray-100">
          <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-3">
            <Link to="/register" onClick={()=>setOpen(false)} className="ktbc-btn-primary w-full text-center px-4 py-3 rounded-lg">Register</Link>
            <Link to="/scanner" onClick={()=>setOpen(false)} className="ktbc-btn-secondary w-full text-center px-4 py-3 rounded-lg">Check-In</Link>
            <div className="flex gap-2">
              <select aria-label="Background" value={bg} onChange={(e)=> setBg(e.target.value as any) } className="rounded px-2 py-1 border w-full">
                <option value="offwhite">Soft</option>
                <option value="white">White</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            <button onClick={toggleTheme} className="w-full px-4 py-3 rounded-lg border">Toggle {theme === 'light' ? 'Dark' : 'Light'}</button>
          </div>
        </div>
      )}
    </header>
  )
}
