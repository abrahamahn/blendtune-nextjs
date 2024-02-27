/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        custom: ['Header', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        '3xl': '0px 0px 5px 8px rgba(0, 0, 0, 1)',
      },
      spacing: {
        '100': '28rem',
        '90': '24rem',
        '80': '20rem',
      }
    },
    fontSize: {
      '4xs': '0.25rem',
      '3xs': '0.6rem',
      '2xs': '0.65rem',
      xs: '0.75rem',
      sm: '0.85rem',
      base: '1rem',
      xl: '1.25rem',
      '2xl': '1.563rem',
      '3xl': '1.953rem',
      '4xl': '2.441rem',
      '5xl': '3.052rem',
      '6xl': '4rem',
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
