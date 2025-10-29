import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	// Use SvelteKit's plugin; Tailwind will be processed via PostCSS (postcss.config.cjs)
	plugins: [sveltekit()],
	server: {
		port: 3030 // Set the development server port
	},
	preview: {
		port: 4040 // Set the preview server port
	}
});
