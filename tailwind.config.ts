import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        lavender: '#9370DB', 
        'lavender-dark': '#7B52C6',
        'lavender-light': '#B399E9',
        skyblue: {
          light: '#87CEEB',
          DEFAULT: '#4FB3E8',
          dark: '#2097D7'
        },
        mint: {
          light: '#98FB98',
          DEFAULT: '#72E672',
          dark: '#42D142'
        },
        darkbg: '#121212',
      },
      screens: {
        xs: '475px',
      },
      boxShadow: {
        glow: '0 0 15px rgba(147, 112, 219, 0.5)'
      },
    },
  },
  plugins: [],
};

export default config; 