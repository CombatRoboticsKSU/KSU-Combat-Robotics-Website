<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>Admin Dashboard | KSU Combat Robotics</title>
</svelte:head>

<div class="admin-page">
	<div class="page-header">
		<h1>Dashboard</h1>
	</div>
	<p class="welcome">Welcome back, {data.user?.name ?? 'Admin'}.</p>

	<div class="stats-grid">
		<a href="/admin/leadership" class="stat-card">
			<span class="stat-icon">👥</span>
			<h3>Leadership</h3>
			<p>Manage board members</p>
		</a>
		<a href="/admin/bots" class="stat-card">
			<span class="stat-icon">🤖</span>
			<h3>Bots</h3>
			<p>Club & personal bots</p>
		</a>
		<a href="/admin/projects" class="stat-card">
			<span class="stat-icon">🔧</span>
			<h3>Projects</h3>
			<p>Club projects</p>
		</a>
		<a href="/admin/posts" class="stat-card">
			<span class="stat-icon">📝</span>
			<h3>Posts</h3>
			<p>Team updates & blog</p>
		</a>
		<a href="/admin/users" class="stat-card">
			<span class="stat-icon">🔑</span>
			<h3>Users</h3>
			<p>Manage roles & access</p>
		</a>
	</div>
</div>

<style>
	.admin-page { max-width: 900px; }

	.page-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 0.25rem;
	}

	.page-header h1 { font-size: 1.5rem; }

	.welcome {
		color: var(--text-muted);
		margin-bottom: 2rem;
	}

	.stats-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 1.25rem;
	}

	.stat-card {
		background: var(--bg-card, var(--bg-secondary));
		border: 1px solid var(--border-color);
		border-radius: 0.75rem;
		padding: 1.5rem;
		text-decoration: none;
		color: inherit;
		transition: border-color 0.2s, transform 0.2s;
	}

	.stat-card:hover {
		border-color: var(--gold);
		transform: translateY(-2px);
		color: inherit;
	}

	.stat-icon {
		font-size: 2rem;
		display: block;
		margin-bottom: 0.75rem;
	}

	.stat-card h3 {
		font-size: 1.125rem;
		margin-bottom: 0.25rem;
	}

	.stat-card p {
		font-size: 0.8125rem;
		color: var(--text-muted);
	}
</style>
