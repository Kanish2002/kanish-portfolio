<script lang="ts">
	import { approach } from '$lib/data/portfolio';
</script>

<ol class="approach-flow">
	{#each approach as step, index}
		<li>
			<span>{String(index + 1).padStart(2, '0')}</span>
			<p>{step}</p>
		</li>
	{/each}
</ol>
