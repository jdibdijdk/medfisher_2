// Mesma configuração que ficava no <script> do index.html quando o Tailwind rodava no navegador (CDN).
module.exports = {
  content: ['../../index.html'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: { sans: ['Montserrat', 'ui-sans-serif', 'system-ui', 'sans-serif'] },
      colors: { brand: { DEFAULT: '#1E3A6B', 700: '#16294D', 50: '#EAF0FA' } }
    }
  }
};
