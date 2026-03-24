import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        risk: {
          red: '#ef4444',
          amber: '#f59e0b',
          green: '#22c55e',
        },
        completeness: {
          gray: '#6b7280',
          amber: '#f59e0b',
          blue: '#3b82f6',
          green: '#22c55e',
        },
      },
    },
  },
  plugins: [],
} satisfies Config
