import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { isCustomElement } from 'leafer-vue/compiler'
// https://vite.dev/config/
export default defineConfig({
  plugins: [vue({
    template:{
      compilerOptions:{
        isCustomElement:isCustomElement
      }
    }
  })],
})
