<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { goto } from '$app/navigation';

	let email = $state('');
	let password = $state('');
	let name = $state('');
	let error = $state('');
	let loading = $state(false);
	let mode = $state<'login' | 'register'>('login');

	// Check URL for error param
	if (typeof window !== 'undefined') {
		const params = new URLSearchParams(window.location.search);
		if (params.get('error') === 'unauthorized') {
			error = 'Your account does not have admin access. Contact a site administrator.';
		}
	}

	async function handleLogin() {
		error = '';
		loading = true;
		try {
			const result = await authClient.signIn.email({ email, password });
			if (result.error) {
				error = result.error.message ?? 'Invalid email or password.';
			} else {
				goto('/admin');
			}
		} catch {
			error = 'Something went wrong. Please try again.';
		}
		loading = false;
	}

	async function handleRegister() {
		error = '';
		loading = true;
		try {
			const result = await authClient.signUp.email({ email, password, name });
			if (result.error) {
				error = result.error.message ?? 'Registration failed.';
			} else {
				goto('/admin');
			}
		} catch {
			error = 'Something went wrong. Please try again.';
		}
		loading = false;
	}

	async function handleDiscord() {
		error = '';
		loading = true;
		try {
			// Redirects the browser to Discord; control does not return here on success.
			await authClient.signIn.social({ provider: 'discord', callbackURL: '/admin' });
		} catch {
			error = 'Something went wrong. Please try again.';
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Admin Login | KSU Combat Robotics</title>
</svelte:head>

<div class="login-page">
	<div class="login-card">
		<h1>{mode === 'login' ? 'Admin Login' : 'Create Account'}</h1>
		<p>{mode === 'login' ? 'Sign in to manage the website.' : 'Register a new admin account.'}</p>

		{#if error}
			<div class="error-msg">{error}</div>
		{/if}

		<button type="button" class="btn-discord" onclick={handleDiscord} disabled={loading}>
			<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
				<path d="M20.317 4.369A19.79 19.79 0 0 0 15.885 3c-.21.375-.444.882-.608 1.283a18.27 18.27 0 0 0-5.487 0A12.6 12.6 0 0 0 9.18 3a19.74 19.74 0 0 0-4.434 1.369C1.96 8.555 1.2 12.63 1.58 16.65a19.94 19.94 0 0 0 6.075 3.078c.49-.668.927-1.378 1.304-2.124a12.94 12.94 0 0 1-2.053-.989c.172-.127.34-.26.503-.397a14.2 14.2 0 0 0 12.18 0c.165.14.333.272.504.397-.655.39-1.345.722-2.056.99.378.745.814 1.455 1.304 2.123a19.9 19.9 0 0 0 6.078-3.078c.448-4.66-.766-8.697-3.203-12.281ZM8.02 14.18c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.955-2.42 2.157-2.42 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.955 2.419-2.157 2.419Zm7.974 0c-1.183 0-2.157-1.086-2.157-2.419 0-1.333.955-2.42 2.157-2.42 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.419-2.157 2.419Z" />
			</svg>
			Continue with Discord
		</button>

		<div class="divider"><span>or</span></div>

		<form onsubmit={(e) => { e.preventDefault(); mode === 'login' ? handleLogin() : handleRegister(); }}>
			{#if mode === 'register'}
				<label>
					Name
					<input type="text" bind:value={name} required placeholder="Your name" />
				</label>
			{/if}
			<label>
				Email
				<input type="email" bind:value={email} required placeholder="admin@example.com" />
			</label>
			<label>
				Password
				<input type="password" bind:value={password} required placeholder="••••••••" minlength="8" />
			</label>
			<button type="submit" class="btn-submit" disabled={loading}>
				{loading ? 'Loading...' : mode === 'login' ? 'Sign In' : 'Create Account'}
			</button>
		</form>

		<button class="mode-toggle" onclick={() => { mode = mode === 'login' ? 'register' : 'login'; error = ''; }}>
			{mode === 'login' ? "Don't have an account? Register" : 'Already have an account? Sign in'}
		</button>
	</div>
</div>

<style>
	.login-page {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--bg-primary);
		padding: 2rem;
	}

	.login-card {
		background: var(--bg-card, var(--bg-secondary));
		border: 1px solid var(--border-color);
		border-radius: 1rem;
		padding: 3rem;
		max-width: 420px;
		width: 100%;
		text-align: center;
	}

	.login-card h1 {
		font-size: 1.75rem;
		margin-bottom: 0.5rem;
	}

	.login-card p {
		color: var(--text-muted);
		margin-bottom: 2rem;
	}

	.error-msg {
		background: rgba(239, 68, 68, 0.1);
		border: 1px solid rgba(239, 68, 68, 0.3);
		color: #ef4444;
		padding: 0.75rem 1rem;
		border-radius: 0.5rem;
		font-size: 0.875rem;
		margin-bottom: 1.5rem;
	}

	.btn-discord {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		width: 100%;
		padding: 0.75rem 1.5rem;
		background: #5865f2;
		color: #fff;
		font-weight: 600;
		font-size: 1rem;
		font-family: inherit;
		border: none;
		border-radius: 0.5rem;
		cursor: pointer;
		transition: opacity 0.15s;
	}

	.btn-discord:hover { opacity: 0.9; }
	.btn-discord:disabled { opacity: 0.5; cursor: not-allowed; }

	.divider {
		display: flex;
		align-items: center;
		text-align: center;
		color: var(--text-muted);
		font-size: 0.8125rem;
		margin: 1.5rem 0;
	}

	.divider::before,
	.divider::after {
		content: '';
		flex: 1;
		border-bottom: 1px solid var(--border-color);
	}

	.divider span { padding: 0 0.75rem; }

	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		text-align: left;
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		font-size: 0.8125rem;
		color: var(--text-secondary);
		font-weight: 500;
	}

	input {
		padding: 0.625rem 0.75rem;
		border: 1px solid var(--border-color);
		border-radius: 0.5rem;
		background: var(--bg-primary);
		color: inherit;
		font-family: inherit;
		font-size: 0.9375rem;
	}

	input:focus {
		outline: none;
		border-color: var(--gold);
	}

	.btn-submit {
		padding: 0.75rem 1.5rem;
		background: var(--gold);
		color: #000;
		font-weight: 600;
		border: none;
		border-radius: 0.5rem;
		font-size: 1rem;
		font-family: inherit;
		cursor: pointer;
		transition: opacity 0.15s;
		margin-top: 0.5rem;
	}

	.btn-submit:hover { opacity: 0.9; }
	.btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }

	.mode-toggle {
		margin-top: 1.5rem;
		background: none;
		border: none;
		color: var(--gold);
		font-size: 0.875rem;
		cursor: pointer;
		font-family: inherit;
	}

	.mode-toggle:hover { text-decoration: underline; }
</style>
