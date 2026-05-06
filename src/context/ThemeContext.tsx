import React from 'react'

type BgChoice = 'offwhite' | 'white' | 'dark'
type Mode = 'light' | 'dark'

interface ThemeContextValue {
  mode: Mode
  bg: BgChoice
  setMode: (m: Mode) => void
  setBg: (b: BgChoice) => void
  toggleMode: () => void
  cycleBg: () => void
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }){
  const [mode, setMode] = React.useState<Mode>(() => (typeof window !== 'undefined' && (localStorage.getItem('ktbc-mode') as Mode)) || 'light')
  const [bg, setBgState] = React.useState<BgChoice>(() => (typeof window !== 'undefined' && (localStorage.getItem('ktbc-bg') as BgChoice)) || 'offwhite')

  React.useEffect(()=>{
    document.documentElement.setAttribute('data-theme', mode)
    localStorage.setItem('ktbc-mode', mode)
  },[mode])

  React.useEffect(()=>{
    document.documentElement.setAttribute('data-bg', bg)
    localStorage.setItem('ktbc-bg', bg)
  },[bg])

  const setBg = (b: BgChoice) => setBgState(b)
  const toggleMode = () => setMode(m => m === 'light' ? 'dark' : 'light')
  const cycleBg = () => setBgState(b => b === 'offwhite' ? 'white' : b === 'white' ? 'dark' : 'offwhite')

  return (
    <ThemeContext.Provider value={{ mode, bg, setMode, setBg, toggleMode, cycleBg }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(){
  const ctx = React.useContext(ThemeContext)
  if(!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}
