<script lang="ts">
	import { Users, Bot, Wrench, FileText, Newspaper, Key } from 'lucide-svelte';
	let { data } = $props();
	const c = $derived(data.counts);
</script>

<svelte:head>
	<title>Admin Dashboard | KSU Combat Robotics</title>
</svelte:head>

<div class="admin-page">
	<div class="page-header">
		<div>
			<h1>Dashboard Overview</h1>
			<p class="welcome">Welcome back to the control panel, {data.user?.name ?? 'Admin'}!</p>
		</div>
		<div class="header-actions">
			<a href="/" class="btn-primary-outline">View Live Site</a>
		</div>
	</div>

	<div class="stats-grid">
		<a href="/admin/leadership" class="stat-card">
			<div class="stat-icon-wrapper blue">
				<Users size={28} />
			</div>
			<div class="stat-info">
				<span class="stat-value">{c.leadership}</span>
				<h3 class="stat-label">Leadership</h3>
				<span class="stat-desc">Active board members</span>
			</div>
		</a>
		<a href="/admin/bots" class="stat-card">
			<div class="stat-icon-wrapper orange">
				<Bot size={28} />
			</div>
			<div class="stat-info">
				<span class="stat-value">{c.bots}</span>
				<h3 class="stat-label">Bots</h3>
				<span class="stat-desc">Club & personal builds</span>
			</div>
		</a>
		<a href="/admin/projects" class="stat-card">
			<div class="stat-icon-wrapper purple">
				<Wrench size={28} />
			</div>
			<div class="stat-info">
				<span class="stat-value">{c.projects}</span>
				<h3 class="stat-label">Projects</h3>
				<span class="stat-desc">Ongoing developments</span>
			</div>
		</a>
		<a href="/admin/posts" class="stat-card">
			<div class="stat-icon-wrapper green">
				<FileText size={28} />
			</div>
			<div class="stat-info">
				<span class="stat-value">{c.posts}</span>
				<h3 class="stat-label">Posts</h3>
				<span class="stat-desc">{c.published} public updates</span>
			</div>
		</a>
		<a href="/admin/publicity" class="stat-card">
			<div class="stat-icon-wrapper pink">
				<Newspaper size={28} />
			</div>
			<div class="stat-info">
				<span class="stat-value">{c.publicity}</span>
				<h3 class="stat-label">Publicity</h3>
				<span class="stat-desc">Features & press</span>
			</div>
		</a>
		<a href="/admin/users" class="stat-card">
			<div class="stat-icon-wrapper gray">
				<Key size={28} />
			</div>
			<div class="stat-info">
				<span class="stat-value">System</span>
				<h3 class="stat-label">Users</h3>
				<span class="stat-desc">Manage accounts</span>
			</div>
		</a>
	</div>
</div>

<style>
	.page-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		margin-bottom: 2.5rem;
		border-bottom: 1px solid rgba(255,255,255,0.05);
		padding-bottom: 1.5rem;
	}

	.page-header h1 {
		font-size: 1.875rem;
		font-weight: 700;
		color: #fff;
		margin-bottom: 0.375rem;
		letter-spacing: -0.01em;
	}

	.welcome {
		color: var(--text-secondary);
		font-size: 0.9375rem;
	}

	.btn-primary-outline {
		display: inline-flex;
		align-items: center;
		padding: 0.625rem 1.25rem;
		border-radius: 0.5rem;
		font-size: 0.875rem;
		font-weight: 600;
		text-decoration: none;
		background: rgba(235, 171, 33, 0.1);
		color: var(--gold);
		border: 1px solid rgba(235, 171, 33, 0.3);
		transition: all 0.2s;
	}

	.btn-primary-outline:hover {
		background: rgba(235, 171, 33, 0.2);
		border-color: rgba(235, 171, 33, 0.5);
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.5rem;
	}

	.stat-card {
		background: #1e293b;
		border: 1px solid rgba(255,255,255,0.05);
		border-radius: 1rem;
		padding: 1.5rem;
		text-decoration: none;
		color: inherit;
		display: flex;
		align-items: flex-start;
		gap: 1.25rem;
		transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
		position: relative;
		overflow: hidden;
	}

	.stat-card::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 4px;
		height: 100%;
		background: var(--gold);
		opacity: 0;
		transition: opacity 0.2s;
	}

	.stat-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 12px 24px rgba(0,0,0,0.2), 0 0 0 1px rgba(235,171,33,0.3);
		background: #233147;
	}

	.stat-card:hover::before {
		opacity: 1;
	}

	.stat-icon-wrapper {
		width: 56px;
		height: 56px;
		border-radius: 0.75rem;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1.5rem;
		flex-shrink: 0;
	}

	.stat-icon-wrapper.blue { background: rgba(59, 130, 246, 0.15); color: #60a5fa; }
	.stat-icon-wrapper.orange { background: rgba(249, 115, 22, 0.15); color: #fb923c; }
	.stat-icon-wrapper.purple { background: rgba(168, 85, 247, 0.15); color: #c084fc; }
	.stat-icon-wrapper.green { background: rgba(34, 197, 94, 0.15); color: #4ade80; }
	.stat-icon-wrapper.pink { background: rgba(236, 72, 153, 0.15); color: #f472b6; }
	.stat-icon-wrapper.gray { background: rgba(148, 163, 184, 0.15); color: #94a3b8; }

	.stat-info {
		display: flex;
		flex-direction: column;
	}

	.stat-value {
		font-size: 1.5rem;
		font-weight: 700;
		color: #fff;
		line-height: 1.2;
		margin-bottom: 0.125rem;
	}

	.stat-label {
		font-size: 1rem;
		font-weight: 600;
		color: var(--text-primary);
		margin-bottom: 0.25rem;
	}

	.stat-desc {
		font-size: 0.8125rem;
		color: var(--text-muted);
	}
</style>
