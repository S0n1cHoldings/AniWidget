import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { config } from 'dotenv';
import adapter from 'svelte-adapter-bun';
import { defineConfig, type ServerOptions } from 'vite';
import pkginfo from './package.json' with { type: 'json' };

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../..', '.env'), quiet: true });

const opts: ServerOptions = { host: true, allowedHosts: true };

const dependencies = Object.keys(pkginfo.dependencies ?? {});
const external_dependency = (id: string) =>
	dependencies.some((dependency) => id === dependency || id.startsWith(`${dependency}/`));

export default defineConfig({
	server: opts,
	preview: opts,
	environments: {
		ssr: {
			build: {
				rollupOptions: {
					external: external_dependency,
				},
			},
		},
	},
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
});
