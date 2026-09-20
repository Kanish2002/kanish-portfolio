<script lang="ts">
	import ApproachFlow from '$lib/components/ApproachFlow.svelte';
	import CaseStudyCard from '$lib/components/CaseStudyCard.svelte';
	import ExperienceTimeline from '$lib/components/ExperienceTimeline.svelte';
	import SectionHeader from '$lib/components/SectionHeader.svelte';
	import SiteFooter from '$lib/components/SiteFooter.svelte';
	import SiteNav from '$lib/components/SiteNav.svelte';
	import SystemMap from '$lib/components/SystemMap.svelte';
	import { reveal } from '$lib/actions/reveal';
	import {
		about,
		achievements,
		caseStudies,
		links,
		publicActivity,
		seo,
		skillGroups,
		snapshots
	} from '$lib/data/portfolio';

	const canonicalUrl = 'https://kanish-s-systems.nkrish2208.chatgpt.site';
	const personSchema = {
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: 'Kanish S',
		url: canonicalUrl,
		jobTitle: 'Java Backend Engineer',
		description: seo.description,
		email: 'mailto:kanish.sridhar.dev@gmail.com',
		address: {
			'@type': 'PostalAddress',
			addressLocality: 'Bengaluru',
			addressCountry: 'IN'
		},
		hasOccupation: {
			'@type': 'Occupation',
			name: 'Software Engineer',
			occupationLocation: { '@type': 'City', name: 'Bengaluru' },
			skills: 'Java, Kotlin, Spring Boot, Apache Kafka, distributed systems, trading systems, banking and payments'
		},
		sameAs: [links.github, links.linkedin, links.leetcode],
		knowsAbout: [
			'Java',
			'Kotlin',
			'Spring Boot',
			'Apache Kafka',
			'Distributed systems',
			'Trading systems',
			'Banking and payments'
		]
	};
	const personJsonLd = `<script type="application/ld+json">${JSON.stringify(personSchema).replace(/</g, '\\u003c')}<\/script>`;
</script>

<svelte:head>
	<title>{seo.title}</title>
	<meta name="description" content={seo.description} />
	<link rel="canonical" href={canonicalUrl} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:title" content={seo.title} />
	<meta property="og:description" content={seo.description} />
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content={seo.title} />
	<meta name="twitter:description" content={seo.description} />
	{@html personJsonLd}
</svelte:head>

<div class="site-shell">
	<SiteNav />

	<main id="top">
		<section class="hero" aria-labelledby="hero-title">
			<div class="hero-copy">
				<div class="status"><span aria-hidden="true"></span> Open to Java Backend and Distributed Systems opportunities</div>
				<p class="eyebrow">3+ years · Java Backend Engineer · Bengaluru, India</p>
				<h1 id="hero-title">Building fast, reliable systems for <em>trading, banking, and financial transactions.</em></h1>
				<p class="hero-intro">
					I design and build production-grade backend systems using Java, Kotlin, Spring Boot, Kafka,
					Redis, PostgreSQL, and event-driven microservices. My work spans trading order management,
					market-data processing, digital wallets, payments, accounting, and settlement workflows.
				</p>
				<div class="hero-actions" aria-label="Portfolio actions">
					<a class="button primary" href="#work">View engineering work <span aria-hidden="true">→</span></a>
					<a class="button secondary" href={links.resume} download>Download resume</a>
					<a class="text-action" href={links.email}>Email me</a>
				</div>
				<div class="profile-links" aria-label="Professional profiles">
					<a href={links.github} target="_blank" rel="noreferrer">GitHub ↗</a>
					<a href={links.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
					<a href={links.leetcode} target="_blank" rel="noreferrer">LeetCode ↗</a>
				</div>
			</div>
			<SystemMap />
		</section>

		<section class="snapshot" aria-label="Engineering snapshot">
			{#each snapshots as item}
				<div><strong>{item.value}</strong><span>{item.label}</span></div>
			{/each}
		</section>

		<section id="about" class="content-section reveal" use:reveal>
			<SectionHeader
				index="01"
				eyebrow="About"
				title="From real-time sensing to transaction-critical systems."
				intro="A career shaped by systems that need to react quickly, preserve state correctly, and keep operating under real-world pressure."
			/>
			<div class="about-grid">
				<div class="about-copy">
					{#each about as paragraph}<p>{paragraph}</p>{/each}
				</div>
				<aside class="signal-card" aria-label="Engineering focus">
					<p class="mono-label">CURRENT FOCUS</p>
					<h3>Reliable backend systems where latency and correctness both matter.</h3>
					<ul>
						<li>Trading order flows</li>
						<li>Banking and payments</li>
						<li>Distributed event processing</li>
						<li>Performance and production reliability</li>
					</ul>
					<a href="#contact">Discuss an opportunity <span aria-hidden="true">→</span></a>
				</aside>
			</div>
		</section>

		<section id="experience" class="content-section reveal" use:reveal>
			<SectionHeader
				index="02"
				eyebrow="Experience"
				title="Systems delivered across trading and banking."
				intro="A progression from research and engineering internships into production backend development, technical leadership, and financial platforms."
			/>
			<ExperienceTimeline />
		</section>

		<section id="work" class="content-section reveal" use:reveal>
			<SectionHeader
				index="03"
				eyebrow="Selected engineering work"
				title="Complex workflows, made observable and dependable."
				intro="Professional work is presented as anonymized case studies. Architecture and implementation details are summarized without disclosing proprietary information."
			/>
			<div class="case-grid">
				{#each caseStudies as study}<CaseStudyCard {study} />{/each}
			</div>
		</section>

		<section id="public-work" class="content-section reveal" use:reveal>
			<SectionHeader
				index="04"
				eyebrow="GitHub & public activity"
				title="Technical curiosity in the open."
				intro="A direct route to my public code and issue discussions, without turning exploratory work into inflated project claims."
			/>
			<div class="github-panel">
				<div class="github-profile">
					<p class="mono-label">GITHUB / KANISH2002</p>
					<h3>Browse my public repositories</h3>
					<p>Public code spans engineering experiments, academic work, and programming practice. My strongest production work remains appropriately summarized in the professional case studies above.</p>
					<a class="button primary" href={links.github} target="_blank" rel="noreferrer">Open GitHub profile ↗</a>
				</div>
				<div class="activity-list">
					<p class="mono-label">PUBLIC TECHNICAL DISCUSSIONS</p>
					{#each publicActivity as item}
						<a href={item.href} target="_blank" rel="noreferrer">
							<span><strong>{item.label}</strong><small>{item.detail}</small></span><span aria-hidden="true">↗</span>
						</a>
					{/each}
					<p class="activity-note">These links reflect issue reports, questions, and maintainer discussions—not claimed code contributions.</p>
				</div>
			</div>
		</section>

		<section id="expertise" class="content-section reveal" use:reveal>
			<SectionHeader
				index="05"
				eyebrow="Technical expertise"
				title="Depth across the backend lifecycle."
				intro="Tools and technologies grouped by the engineering problems they help solve."
			/>
			<div class="expertise-grid">
				{#each skillGroups as group, index}
					<article>
						<header><span>{String(index + 1).padStart(2, '0')}</span><h3>{group.name}</h3></header>
						<ul>{#each group.items as item}<li>{item}</li>{/each}</ul>
					</article>
				{/each}
			</div>
		</section>

		<section class="content-section approach-section reveal" use:reveal>
			<SectionHeader
				index="06"
				eyebrow="Engineering approach"
				title="How I approach backend systems."
				intro="The same disciplined path applies whether the workflow is a market-data event, a trading order, a wallet transfer, or a settlement instruction."
			/>
			<ApproachFlow />
		</section>

		<section id="achievements" class="content-section reveal" use:reveal>
			<SectionHeader
				index="07"
				eyebrow="Achievements & leadership"
				title="Recognition backed by initiative."
				intro="Academic distinction, student leadership, peer mentoring, and funded project work."
			/>
			<div class="achievements-grid">
				{#each achievements as item, index}
					<article><span>{String(index + 1).padStart(2, '0')}</span><h3>{item.title}</h3><p>{item.detail}</p></article>
				{/each}
			</div>
			<div class="publication-card">
				<span class="mono-label">PUBLICATION</span>
				<div>
					<h3>Augmented Reality Sandbox With Play Based Learning For Preschool Children</h3>
					<p>Research connecting real-time depth sensing, interactive terrain visualization, and play-based learning.</p>
				</div>
			</div>
		</section>

		<section id="education" class="content-section reveal" use:reveal>
			<SectionHeader index="08" eyebrow="Education" title="A strong technical foundation." />
			<div class="education-layout">
				<article class="education-card">
					<div class="education-top"><span>SCT / IT</span><span>Salem, India</span></div>
					<div>
						<p>Sona College of Technology</p>
						<h3>Bachelor of Technology in Information Technology</h3>
					</div>
					<div class="education-meta">
						<time>July 2019 – May 2023</time>
						<strong><span>CGPA</span>9.48/10</strong>
					</div>
				</article>
				<aside class="beyond-card">
					<span class="mono-label">BEYOND ENGINEERING</span>
					<h3>Patterns, patience, and a good cube.</h3>
					<p>I enjoy solving Rubik’s cubes from 3×3 through 7×7—an off-screen exercise in pattern recognition, patience, and structured problem-solving.</p>
					<div class="cube-sequence" aria-label="Rubik's cube sizes">3×3 <span>→</span> 4×4 <span>→</span> 5×5 <span>→</span> 6×6 <span>→</span> 7×7</div>
				</aside>
			</div>
		</section>

		<section id="contact" class="contact-section reveal" use:reveal>
			<div>
				<p class="eyebrow">09 · Contact</p>
				<h2>Let’s build reliable systems at scale.</h2>
				<p>I’m open to opportunities involving Java backend development, distributed systems, trading platforms, banking, payments, and high-performance financial applications.</p>
			</div>
			<div class="contact-actions">
				<a class="button primary" href={links.email}>Email Kanish <span aria-hidden="true">→</span></a>
				<a class="button secondary" href={links.resume} download>Download resume</a>
				<div>
					<a href={links.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
					<a href={links.github} target="_blank" rel="noreferrer">GitHub ↗</a>
					<a href={links.leetcode} target="_blank" rel="noreferrer">LeetCode ↗</a>
				</div>
			</div>
		</section>
	</main>

	<SiteFooter />
</div>
