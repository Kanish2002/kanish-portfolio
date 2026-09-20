<script lang="ts">
	import { links } from '$lib/data/portfolio';
</script>

<footer class="footer">
	<div class="footer-brand">
		<a class="monogram" href="#top" aria-label="Back to top">KS</a>
		<div><strong>Kanish S</strong><span>Java Backend Engineer · Bengaluru, India</span></div>
	</div>
	<nav aria-label="Footer links">
		<a href={links.github} target="_blank" rel="noreferrer">GitHub ↗</a>
		<a href={links.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
		<a href={links.leetcode} target="_blank" rel="noreferrer">LeetCode ↗</a>
		<a href="#top">Back to top ↑</a>
	</nav>
	<p>Designed around systems, reliability, and measurable engineering impact.</p>
</footer>
