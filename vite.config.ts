import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // El proyecto vive dentro de una carpeta sincronizada por OneDrive, que
    // crea archivos temporales fugaces mientras sincroniza. El watcher nativo
    // de Node (fs.watch) tira un error no capturado y mata el proceso apenas
    // intenta observar uno de esos archivos a medio escribir. Con polling,
    // Vite no depende del watcher nativo del sistema de archivos.
    watch: {
      usePolling: true,
      interval: 300,
    },
  },
})
