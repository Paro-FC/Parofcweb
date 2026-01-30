/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Excon', 'Arial', 'sans-serif'],
      },
      fontSize: {
        'xs': ['11px', { lineHeight: '1.5', letterSpacing: '0.01em' }],
        'sm': ['13px', { lineHeight: '1.5', letterSpacing: '0.01em' }],
        'base': ['15px', { lineHeight: '1.6', letterSpacing: '0' }],
        'lg': ['17px', { lineHeight: '1.6', letterSpacing: '0' }],
        'xl': ['19px', { lineHeight: '1.5', letterSpacing: '-0.01em' }],
        '2xl': ['24px', { lineHeight: '1.4', letterSpacing: '-0.02em' }],
        '3xl': ['30px', { lineHeight: '1.3', letterSpacing: '-0.02em' }],
        '4xl': ['36px', { lineHeight: '1.2', letterSpacing: '-0.03em' }],
        '5xl': ['48px', { lineHeight: '1.1', letterSpacing: '-0.04em' }],
        '6xl': ['60px', { lineHeight: '1.1', letterSpacing: '-0.05em' }],
      },
      colors: {
        'barca-blue': '#004d98',
        'barca-red': '#a50044',
        'barca-gold': '#edbb00',
        'dark-bg': '#0a0e27',
      },
      backgroundImage: {
        'gradient-barca': 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 50%, #2d1b3d 100%)',
      },
      animation: {
        'marquee': 'marquee 25s linear infinite',
        'marquee-reverse': 'marquee-reverse 25s linear infinite',
        'marquee-vertical': 'marquee-vertical 25s linear infinite',
        'marquee-vertical-reverse': 'marquee-vertical-reverse 25s linear infinite',
        'gradient': 'gradient 8s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        'marquee-vertical': {
          '0%': { transform: 'translateY(0%)' },
          '100%': { transform: 'translateY(-100%)' },
        },
        'marquee-vertical-reverse': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0%)' },
        },
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
      },
    },
  },
  plugins: [],
}

