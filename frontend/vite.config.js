import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue2';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
  },
  build: {
    outDir: '../public',
    emptyOutDir: true,
    sourcemap: false,
  },
  server: {
    proxy: {
      '/media': { target: 'http://localhost:4000' }
    }
  },
  css: {
    preprocessorOptions: {
      scss: {}
    }
  }
});
