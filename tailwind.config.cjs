module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,html}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1A1F5E',
        secondary: '#F5A623',
        accent: '#00C9B1',
        bg: '#F8F9FF',
        darkbg: '#0D0F2B',
        text: '#1C1C2E',
        muted: '#6B7280',
        success: '#10B981',
        error: '#EF4444'
      },
      fontFamily: {
        display: ['"Clash Display"', 'CabinetGrotesk', 'ui-sans-serif', 'system-ui'],
        body: ['"DM Sans"', 'PlusJakartaSans', 'ui-sans-serif', 'system-ui'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular']
      }
    }
  },
  plugins: []
}
