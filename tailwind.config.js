/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'space-black': '#050714',
                'space-blue': '#0a1128',
                'teleport-cyan': '#00f3ff',
                'teleport-glow': '#00a8ff',
                'saiyan-gold': '#ffd700',
                'saiyan-orange': '#ff8c00',
                'terminal-green': '#00ff41',
                'error-red': '#ff003c',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['Fira Code', 'monospace'],
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 3s ease-in-out infinite',
                'teleport-in': 'teleport-in 0.5s ease-out forwards',
                'saiyan-aura': 'saiyan-aura 2s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                'teleport-in': {
                    '0%': { opacity: '0', transform: 'scale(0) translateY(50px)' },
                    '80%': { opacity: '1', transform: 'scale(1.1)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                'saiyan-aura': {
                    '0%, 100%': { boxShadow: '0 0 20px #ffd700, 0 0 40px #ff8c00' },
                    '50%': { boxShadow: '0 0 40px #ffd700, 0 0 80px #ff8c00' },
                }
            }
        },
    },
    plugins: [],
}
