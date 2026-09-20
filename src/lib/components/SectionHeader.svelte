<script lang="ts">
	let {
		index,
		eyebrow,
		title,
		intro = ''
	}: { index: string; eyebrow: string; title: string; intro?: string } = $props();
</script>

<header class="section-heading">
	<div class="section-marker"><span>{index}</span><span>{eyebrow}</span></div>
	<div>
		<h2>{title}</h2>
		{#if intro}<p>{intro}</p>{/if}
	</div>
</header>
