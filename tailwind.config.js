/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Палитра сайта (по макету): тёмно-синий текст, синий панелей,
        // ледяной фон, бирюзовый акцент, приглушённый текст
        ink:   '#124a6a',
        blue:  '#287db6',
        ice:   '#e8f7fb',
        cyan:  '#88edf0',
        snow:  '#f0fbff',
        muted: '#628697',
        shell: '#e6f1f5',
        // Старая шкала — её ещё используют внутренние страницы и админка
        primary: {
          50:  '#eff8ff',
          100: '#dbeffe',
          200: '#bfe3fd',
          300: '#93d0fb',
          400: '#60b5f7',
          500: '#3b97f2',
          600: '#287db6',
          700: '#276f9f',
          800: '#1d5a84',
          900: '#124a6a',
        },
        accent: {
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'Segoe UI', 'Arial', 'sans-serif'],
        hand: ['Caveat', 'Segoe Print', 'cursive'],
      },
      screens: {
        xs: '375px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
}
