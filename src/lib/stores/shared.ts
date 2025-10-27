import { writable } from 'svelte/store';

// Create stores for sharing data across components
// export const sharedData = writable({
// 	test: 'default'
// });

// Individual stores
export const debug = writable(false);
debug.subscribe((value) => {
    if (value) console.log('Debug mode is ON');
});

// export const localFile = writable(false);