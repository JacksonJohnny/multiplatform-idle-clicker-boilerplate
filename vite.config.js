import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  clearScreen: false,
  server: {
    watch: {
      ignored: ['**/src-tauri/**'],
    },
  },
});
