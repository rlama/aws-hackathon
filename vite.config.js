import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react()
	],
	base: '', //To change the path to relative
	build: {
		outDir: 'build',
		sourcemap: true,
		assetsDir: 'static'
	},
	server:
    {
        host: true,
		open: '/index.html',
    },
	resolve: {
		alias: {
		  '~prez': path.resolve(__dirname, 'node_modules/@metro-prez'),
		}
	}
})
