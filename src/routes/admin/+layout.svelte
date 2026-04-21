<script lang="ts">
	import type { Snippet } from 'svelte';
	import { page } from '$app/stores';
	import { authClient } from '$lib/auth-client';
	import { goto } from '$app/navigation';
	import { LayoutDashboard, Users, Bot, Wrench, FileText, Newspaper, Key, Globe, LogOut, Settings, ChevronDown, Star, Link } from 'lucide-svelte';

	let { data, children } = $props();

	// Don't show admin chrome on the login page
	let isLoginPage = $derived($page.url.pathname === '/admin/login');

	const navItems = [
		{ href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
		{ href: '/admin/leadership', label: 'Leadership', icon: Users },
		{ href: '/admin/bots', label: 'Bots', icon: Bot },
		{ href: '/admin/projects', label: 'Projects', icon: Wrench },
		{ href: '/admin/posts', label: 'Posts', icon: FileText },
		{ href: '/admin/publicity', label: 'Publicity', icon: Newspaper },
		{ href: '/admin/sponsors', label: 'Sponsors', icon: Star },
		{ href: '/admin/social', label: 'Social Links', icon: Link },
		{ href: '/admin/users', label: 'Users', icon: Key },
		{ href: '/admin/settings', label: 'Settings', icon: Settings }
	];

	async function signOut() {
		await authClient.signOut();
		goto('/admin/login');
	}

	let userMenuOpen = $state(false);
	
	function toggleUserMenu() {
		userMenuOpen = !userMenuOpen;
	}

	function getInitials(name: string | null | undefined) {
		if (!name) return 'AD';
		const parts = name.trim().split(/\s+/);
		if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
		return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
	}

	// Close dropdown when clicking outside
	function handleWindowClick(e: MouseEvent) {
		const target = e.target as HTMLElement;
		if (!target.closest('.user-menu-container')) {
			userMenuOpen = false;
		}
	}
</script>

<svelte:window onclick={handleWindowClick} />

{#if isLoginPage}
	{@render children()}
{:else}
	<div class="admin-shell">
		<aside class="admin-sidebar">
			<div class="sidebar-header">
				<a href="/admin" class="sidebar-logo">
					<img src="/USINGimg/Logos.png" alt="KSU CR" class="logo-img" />
					<span>Admin</span>
				</a>
			</div>
			<nav class="sidebar-nav">
				<div class="nav-section-title">Menu</div>
				{#each navItems as item}
					{@const Icon = item.icon}
					<a
						href={item.href}
						class="nav-item"
						class:active={$page.url.pathname === item.href || ($page.url.pathname !== '/admin' && item.href !== '/admin' && $page.url.pathname.startsWith(item.href))}
					>
						<span class="nav-icon"><Icon size={20} /></span>
						{item.label}
					</a>
				{/each}
			</nav>
			<div class="sidebar-footer">
				<a href="/" class="nav-item nav-item-ghost">
					<span class="nav-icon"><Globe size={20} /></span>
					Back to Site
				</a>
			</div>
		</aside>
		
		<div class="admin-content-wrapper">
			<header class="admin-topbar">
				<div class="topbar-breadcrumb">
					{#if $page.url.pathname === '/admin'}
						Overview
					{:else}
						{navItems.find(i => $page.url.pathname.startsWith(i.href) && i.href !== '/admin')?.label || 'Dashboard'}
					{/if}
				</div>
				<div class="topbar-actions">
					<div class="user-menu-container">
						<button class="user-badge" onclick={toggleUserMenu} aria-expanded={userMenuOpen}>
							<div class="user-avatar">{getInitials(data.user?.name)}</div>
							<span class="user-name">{data.user?.name || 'Admin User'}</span>
							<ChevronDown size={14} class="menu-chevron" style="transform: rotate({userMenuOpen ? '180deg' : '0'}); transition: transform 0.2s; margin-right: 0.25rem; color: var(--text-muted);" />
						</button>
						
						{#if userMenuOpen}
							<div class="user-dropdown">
								<div class="dropdown-header">
									<div class="dropdown-name">{data.user?.name || 'Admin'}</div>
									<div class="dropdown-email">{data.user?.email || ''}</div>
								</div>
								<div class="dropdown-divider"></div>
								<button class="dropdown-item sign-out-item" onclick={signOut}>
									<LogOut size={16} />
									<span>Sign Out</span>
								</button>
							</div>
						{/if}
					</div>
				</div>
			</header>
			<main class="admin-main">
				<div class="main-container">
					{@render children()}
				</div>
			</main>
		</div>
	</div>
{/if}

<style>
	.admin-shell {
		display: flex;
		height: 100vh;
		overflow: hidden;
		background: #0f172a; /* Slightly deeper than bg-primary for contrast */
		color: var(--text-primary);
		font-family: 'Inter', sans-serif;
	}

	.admin-sidebar {
		width: 260px;
		background: #1e293b;
		border-right: 1px solid rgba(255,255,255,0.05);
		display: flex;
		flex-direction: column;
		position: sticky;
		top: 0;
		height: 100vh;
		flex-shrink: 0;
		box-shadow: 4px 0 24px rgba(0,0,0,0.2);
		z-index: 10;
	}

	.sidebar-header {
		padding: 1.5rem;
	}

	.sidebar-logo {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-size: 1.125rem;
		font-weight: 700;
		color: white;
		text-decoration: none;
		letter-spacing: 0.02em;
	}

	.logo-img {
		height: 24px;
		width: auto;
	}

	.sidebar-nav {
		flex: 1;
		padding: 0 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		overflow-y: auto;
	}

	.nav-section-title {
		font-size: 0.6875rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--text-secondary);
		margin: 1rem 0 0.5rem 0.75rem;
		font-weight: 600;
	}

	.nav-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.625rem 0.875rem;
		border-radius: 0.5rem;
		color: #b4c4d6;
		text-decoration: none;
		font-size: 0.9375rem;
		font-weight: 500;
		transition: all 0.2s ease;
		border: 1px solid transparent;
		background: transparent;
		cursor: pointer;
		width: 100%;
		text-align: left;
	}

	.nav-item:hover {
		background: rgba(255,255,255,0.05);
		color: var(--text-primary);
	}

	.nav-item.active {
		background: rgba(235, 171, 33, 0.1);
		border-color: rgba(235, 171, 33, 0.2);
		color: var(--gold);
		box-shadow: 0 2px 8px rgba(0,0,0,0.1);
	}

	.nav-icon {
		font-size: 1.125rem;
		opacity: 0.8;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 24px;
	}

	.nav-item.active .nav-icon {
		opacity: 1;
	}

	.sidebar-footer {
		padding: 1rem;
		border-top: 1px solid rgba(255,255,255,0.05);
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.nav-item-ghost {
		font-size: 0.875rem;
		color: var(--text-secondary);
	}

	.nav-item-ghost:hover {
		color: var(--text-primary);
		background: rgba(255,255,255,0.05);
	}

	.admin-content-wrapper {
		flex: 1;
		display: flex;
		flex-direction: column;
		min-width: 0;
	}

	.admin-topbar {
		height: 64px;
		background: rgba(30, 41, 59, 0.8);
		backdrop-filter: blur(12px);
		border-bottom: 1px solid rgba(255,255,255,0.05);
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 2rem;
		position: sticky;
		top: 0;
		z-index: 5;
	}

	.topbar-breadcrumb {
		font-weight: 600;
		font-size: 1.125rem;
		color: var(--text-primary);
		letter-spacing: 0.01em;
	}

	.topbar-actions {
		display: flex;
		align-items: center;
	}

	.user-badge {
		display: flex;
		align-items: center;
		color: var(--text-primary);
		gap: 0.75rem;
		padding: 0.375rem 0.5rem 0.375rem 0.375rem;
		background: rgba(0,0,0,0.2);
		border: 1px solid rgba(255,255,255,0.05);
		border-radius: 2rem;
		cursor: pointer;
		transition: border-color 0.2s;
	}

	.user-badge:hover {
		border-color: rgba(255,255,255,0.15);
	}

	.user-avatar {
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background: var(--gold);
		color: #000;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		font-size: 0.8125rem;
	}

	.user-name {
		font-size: 0.875rem;
		font-weight: 500;
		padding-right: 0.5rem;
		color: var(--text-secondary);
	}

	.admin-main {
		flex: 1;
		padding: 2rem;
		overflow-y: auto;
	}

	.main-container {
		max-width: 1200px;
		margin: 0 auto;
	}

	.user-menu-container {
		position: relative;
	}

	.user-dropdown {
		position: absolute;
		top: calc(100% + 0.5rem);
		right: 0;
		width: 240px;
		background: #1e293b;
		border: 1px solid rgba(255,255,255,0.1);
		border-radius: 0.75rem;
		box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5), 0 8px 10px -6px rgba(0,0,0,0.3);
		padding: 0.5rem 0;
		z-index: 50;
		animation: dropdown-in 0.2s ease-out forwards;
		transform-origin: top right;
	}

	@keyframes dropdown-in {
		from { opacity: 0; transform: scale(0.95); }
		to { opacity: 1; transform: scale(1); }
	}

	.dropdown-header {
		padding: 0.75rem 1rem;
	}

	.dropdown-name {
		font-weight: 600;
		font-size: 0.9375rem;
		color: #fff;
		margin-bottom: 0.125rem;
	}

	.dropdown-email {
		font-size: 0.8125rem;
		color: var(--text-secondary);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.dropdown-divider {
		height: 1px;
		background: rgba(255,255,255,0.1);
		margin: 0.25rem 0;
	}

	.dropdown-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		width: 100%;
		padding: 0.625rem 1rem;
		border: none;
		background: transparent;
		color: var(--text-secondary);
		font-size: 0.875rem;
		font-weight: 500;
		cursor: pointer;
		text-align: left;
		transition: all 0.15s;
	}

	.dropdown-item:hover {
		background: rgba(255,255,255,0.05);
		color: #fff;
	}

	.sign-out-item {
		color: #ef4444;
	}

	.sign-out-item:hover {
		background: rgba(239, 68, 68, 0.1);
		color: #f87171;
	}
</style>
