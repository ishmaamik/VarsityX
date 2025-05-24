import tailwindcss from '@tailwindcss/postcss';
import nesting from '@tailwindcss/nesting';
import autoprefixer from 'autoprefixer';

export default {
  plugins: [
    nesting(),
    tailwindcss({
      darkMode: 'class',
      config: './tailwind.config.js' // point to your config file
    }),
    autoprefixer
  ]
}