<script lang="ts">
	import { links, navigation } from '$lib/data/portfolio';

	let menuOpen = $state(false);
	const closeMenu = () => (menuOpen = false);
</script>

<svelte:window onkeydown={(event) => event.key === 'Escape' && closeMenu()} />

<header class="topbar" aria-label="Primary navigation">
	<a class="monogram" href="#top" aria-label="Kanish S — back to top" onclick={closeMenu}>KS</a>
	<nav class:open={menuOpen} aria-label="Main navigation">
		{#each navigation as item}
			<a href={item.href} onclick={closeMenu}>{item.label}</a>
		{/each}
	</nav>
	<a class="nav-resume" href={links.resume} download>Resume <span aria-hidden="true">↘</span></a>
	<button
		class="menu-toggle"
		type="button"
		aria-label="Toggle navigation menu"
		aria-expanded={menuOpen}
		onclick={() => (menuOpen = !menuOpen)}
	>
		<span></span><span></span>
	</button>
</header>
