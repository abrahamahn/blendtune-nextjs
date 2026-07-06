// main/apps/web/postcss.config.js
// Vite runs with this app as CWD; point tailwind at the repo-root config explicitly.
const path = require('path');

module.exports = {
  plugins: {
    tailwindcss: { config: path.resolve(__dirname, '../../../tailwind.config.js') },
    autoprefixer: {},
  },
};
