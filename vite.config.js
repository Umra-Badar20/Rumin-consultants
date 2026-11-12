
import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import { copyFileSync, mkdirSync } from 'node:fs'

export default defineConfig({
  root: '.',

  publicDir: 'public',

  server: {
    port: 5173,
    open: true
  },

  plugins: [
    {
      name: 'copy-admin-supabase-files',
      apply: 'build',

      closeBundle() {
        const dist = resolve('dist')

        // Ensure admin folder exists
        mkdirSync(resolve(dist, 'admin'), {
          recursive: true
        })

        // Copy Supabase integration
        copyFileSync(
          resolve('supabase.js'),
          resolve(dist, 'supabase.js')
        )

        // Copy Admin JavaScript
        copyFileSync(
          resolve('admin/admin.js'),
          resolve(dist, 'admin/admin.js')
        )
      }
    }
  ],

  server: {
    port: 5173,
    open: true
  },

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    copyPublicDir: true,

    rollupOptions: {
      input: {
        index: resolve('index.html'),
        about: resolve('about.html'),
        service: resolve('service.html'),
        feature: resolve('feature.html'),
        countries: resolve('countries.html'),
        contact: resolve('contact.html'),
        admin: resolve('admin/index.html')
      }
    }
  }
})
