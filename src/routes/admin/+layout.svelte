<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/stores';
	import { authClient } from '$lib/auth-client';
	import { goto } from '$app/navigation';

	let { children }: { children: Snippet } = $props();

	// Don't show admin chrome on the login page
	let isLoginPage = $derived($page.url.pathname === '/admin/login');

	const navItems = [
		{ href: '/admin', label: 'Dashboard', icon: '📊' },
		{ href: '/admin/leadership', label: 'Leadership', icon: '👥' },
		{ href: '/admin/bots', label: 'Bots', icon: '🤖' },
		{ href: '/admin/projects', label: 'Projects', icon: '🔧' },
		{ href: '/admin/posts', label: 'Posts', icon: '📝' },
		{ href: '/admin/publicity', label: 'Publicity', icon: '📰' },
		{ href: '/admin/users', label: 'Users', icon: '🔑' }
	];

	async function signOut() {
		await authClient.signOut();
		goto('/admin/login');
	}
</script>

{#if isLoginPage}
	{@render children()}
{:else}
	<div class="admin-shell">
		<aside class="admin-sidebar">
			<div class="sidebar-header">
				<a href="/admin" class="sidebar-logo">KSU CR Admin</a>
			</div>
			<nav class="sidebar-nav">
				{#each navItems as item}
					<a
						href={item.href}
						class="nav-item"
						class:active={$page.url.pathname === item.href}
					>
						<span class="nav-icon">{item.icon}</span>
						{item.label}
					</a>
				{/each}
			</nav>
			<div class="sidebar-footer">
				<a href="/" class="nav-item">← Back to Site</a>
				<button class="nav-item sign-out" onclick={signOut}>Sign Out</button>
			</div>
		</aside>
		<main class="admin-main">
			{@render children()}
		</main>
	</div>
{/if}

<style>
	.admin-shell {
		display: flex;
		min-height: 100vh;
		background: var(--bg-primary);
	}

	.admin-sidebar {
		width: 240px;
		background: var(--bg-card, var(--bg-secondary));
		border-right: 1px solid var(--border-color);
		display: flex;
		flex-direction: column;
		position: sticky;
		top: 0;
		height: 100vh;
		flex-shrink: 0;
	}

	.sidebar-header {
		padding: 1.5rem;
		border-bottom: 1px solid var(--border-color);
	}

	.sidebar-logo {
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--gold);
		text-decoration: none;
	}

	.sidebar-nav {
		flex: 1;
		padding: 1rem 0.75rem;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		overflow-y: auto;
		min-height: 0;
	}

	.nav-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.625rem 0.75rem;
		border-radius: 0.5rem;
		color: var(--text-secondary);
		text-decoration: none;
		font-size: 0.9375rem;
		transition: background 0.15s, color 0.15s;
		border: none;
		background: none;
		cursor: pointer;
		font-family: inherit;
		width: 100%;
		text-align: left;
	}

	.nav-item:hover {
		background: rgba(235, 171, 33, 0.08);
		color: var(--text-primary);
	}

	.nav-item.active {
		background: rgba(235, 171, 33, 0.15);
		color: var(--gold);
		font-weight: 600;
	}

	.nav-icon {
		font-size: 1.125rem;
	}

	.sidebar-footer {
		padding: 0.75rem;
		border-top: 1px solid var(--border-color);
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.sign-out {
		color: var(--text-muted);
	}

	.sign-out:hover {
		color: #ef4444;
		background: rgba(239, 68, 68, 0.08);
	}

	.admin-main {
		flex: 1;
		padding: 2rem;
		overflow-y: auto;
	}
</style>
