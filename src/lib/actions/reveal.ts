import type { Action } from 'svelte/action';

export const reveal: Action<HTMLElement> = (node) => {
	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		node.classList.add('is-visible');
		return;
	}

	const observer = new IntersectionObserver(
		([entry]) => {
			if (entry.isIntersecting) {
				node.classList.add('is-visible');
				observer.unobserve(node);
			}
		},
		{ threshold: 0.01, rootMargin: '0px 0px -4% 0px' }
	);

	observer.observe(node);
	return { destroy: () => observer.disconnect() };
};
