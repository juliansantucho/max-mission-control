import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          0: '#0a0a0f',
          1: '#0f0f17',
          2: '#14141f',
          3: '#1e1e2e',
          4: '#2a2a3e',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Cascadia Code', 'monospace'],
      },
      keyframes: {
        blink: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.2' } },
      },
      animation: {
        blink: 'blink 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
