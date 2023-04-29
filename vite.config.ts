import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import WindiCSS from 'vite-plugin-windicss'
import UnoCSS from 'unocss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), UnoCSS()],
  server: {
    proxy: {
      '/old': {
        rewrite: (path) => path.replace(/^\/old/, ''),
        target: 'http://localhost/newdts/phpdts/',
        changeOrigin: true
      }
    }
  }
})
