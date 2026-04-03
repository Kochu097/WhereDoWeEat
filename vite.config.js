import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { config } from 'dotenv';

config();

export default defineConfig({
  base: '/WhereDoWeEat/',
  define: {
    'process.env': process.env
  },
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: './src/test/setup.js',
  },
})
