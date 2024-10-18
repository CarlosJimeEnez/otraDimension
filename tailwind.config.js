/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        text: 'var(--text)',
        background: 'var(--background)',
        primary: 'var(--primary)',
        primaryv1: 'var(--primary-v1)',
        primaryv2: 'var(--primary-v2)',
        primaryv3: 'var(--primary-v3)',
        primaryv4: 'var(--primary-v4)',
        primaryv5: 'var(--primary-v5)',

        secondary: 'var(--secondary)',
        secondaryv1: 'var(--secondary-v2)',
        
        accent: 'var(--accent)',
        accentv1: 'var(--accent-v1)',
        accentv2: 'var(--accent-v2)',
        accentv3: 'var(--accent-v3)',
      },
    },
  },
  fontFamily: {
    poppins: ['Poppins', 'sans-serif'],
  },
  plugins: [],
};
