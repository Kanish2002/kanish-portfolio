<script lang="ts">
	import type { CaseStudy } from '$lib/data/portfolio';
	let { study }: { study: CaseStudy } = $props();
</script>

<article class="case-card">
	<header>
		<span class="case-index">{study.index}</span>
		<p>{study.domain}</p>
	</header>
	<h3>{study.title}</h3>
	<p class="case-summary">{study.summary}</p>
	<div class="capabilities" aria-label={`${study.title} technologies and capabilities`}>
		{#each study.capabilities as capability}<span>{capability}</span>{/each}
	</div>
	{#if study.outcome}<p class="case-outcome"><span>Verified outcome</span>{study.outcome}</p>{/if}
	{#if study.professional}<p class="confidentiality">Professional work · proprietary details intentionally summarized.</p>{/if}
</article>
