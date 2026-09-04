import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import adapter from 'svelte-adapter-bun';
import { defineConfig, type ServerOptions } from 'vite';

const opts: ServerOptions = { host: true, allowedHosts: true };

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project. Can be removed in Svelte 6.
				runes: true,
			},
			adapter: adapter(),
			alias: { $comp: 'src/comp' },
		}),
	],
	server: opts,
	preview: { ...opts, port: 3000 },
});
