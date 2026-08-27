import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

/**
 * Copies pdf.js standard font data into static/ so the waiver modal can render PDFs that
 * use the base-14 fonts (Helvetica, Times, Courier). Those are not embedded in a PDF by
 * convention, so without this data pdf.js draws nothing for that text.
 *
 * This lives here rather than in scripts/ because scripts/ is gitignored, so a build step
 * there would never reach the deploy. Copying at build time rather than committing the
 * files keeps them from drifting out of sync with the installed pdfjs-dist.
 *
 * cmaps are deliberately not copied: they are only needed for CJK encodings and cost
 * about 1.5 MB.
 */
function pdfjsStandardFonts() {
	return {
		name: 'pdfjs-standard-fonts',
		buildStart() {
			const src = resolve('node_modules/pdfjs-dist/standard_fonts');
			const dest = resolve('static/pdfjs/standard_fonts');
			if (!existsSync(src)) {
				throw new Error(`pdfjs-dist standard_fonts not found at ${src}`);
			}
			mkdirSync(dirname(dest), { recursive: true });
			cpSync(src, dest, { recursive: true });
		}
	};
}

export default defineConfig({
	plugins: [pdfjsStandardFonts(), sveltekit()]
});
