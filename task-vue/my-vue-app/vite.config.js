import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src') // 確保 '@' 指向 'src'
    }
  },
  base: './', // 讓 S3 部署時能正確找到靜態資源
})
