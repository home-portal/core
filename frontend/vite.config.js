import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// Plugin to remove crossorigin attributes from built HTML
// (moleculer-web returns 403 ORIGIN_NOT_ALLOWED for static assets with Origin header)
function removeCrossorigin() {
  return {
    name: 'remove-crossorigin',
    transformIndexHtml(html) {
      return html.replace(/ crossorigin/g, '');
    }
  };
}

export default defineConfig({
  plugins: [
    vue(),
    nodePolyfills({
      include: ['process', 'events', 'stream', 'os', 'path', 'crypto', 'util', 'buffer', 'timers'],
      globals: {
        process: true,
        Buffer: true,
      },
    }),
    removeCrossorigin(),
  ],
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    alias: {
      // Mock Node.js modules that moleculer-browser requires but doesn't actually use in browser
      'glob': '/dev/null',
      'cpus': '/dev/null',
      'raf-perf': '/dev/null',
    },
  },
  build: {
    modulePreload: { polyfill: false },
    outDir: '../public',
    emptyOutDir: false,
    sourcemap: false,
    cssCodeSplit: false,
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      }
    }
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
