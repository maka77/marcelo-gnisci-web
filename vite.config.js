
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                story: resolve(__dirname, 'story.html'),
                admin: resolve(__dirname, 'admin.html'),
                novedades: resolve(__dirname, 'novedades.html'),
            },
        },
    },
})
