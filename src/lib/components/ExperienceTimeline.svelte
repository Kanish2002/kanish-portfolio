<script lang="ts">
	import { experience } from '$lib/data/portfolio';
</script>

<div class="experience-list">
	{#each experience as item, companyIndex}
		<article class="experience-company">
			<div class="company-rail">
				<span>{String(companyIndex + 1).padStart(2, '0')}</span>
				<div class="rail-line"></div>
			</div>
			<div class="company-content">
				<header>
					<div>
						<h3>{item.company}</h3>
						{#if item.kind}<p class="company-kind">{item.kind}</p>{/if}
					</div>
					<span class="role-count">{item.roles.length} {item.roles.length === 1 ? 'role' : 'roles'}</span>
				</header>
				<div class="roles">
					{#each item.roles as role}
						<section class="role">
							<div class="role-head">
								<div><h4>{role.title}</h4><p>{role.location}</p></div>
								<time>{role.period}</time>
							</div>
							<ul>
								{#each role.points as point}<li>{point}</li>{/each}
							</ul>
						</section>
					{/each}
				</div>
			</div>
		</article>
	{/each}
</div>
