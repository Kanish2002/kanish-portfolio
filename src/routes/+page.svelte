<script lang="ts">
  import { onMount } from 'svelte';
  import terminal from '$lib/data/terminal.html?raw';
  import '$lib/data/terminal.css';

  onMount(() => {
    const root = document.querySelector('main');
    if (!root) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const sections = [...root.querySelectorAll<HTMLElement>('[data-reveal]')];
    let observer: IntersectionObserver | undefined;
    if (!reducedMotion && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('revealed');
          observer?.unobserve(entry.target);
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -35px 0px' });
      sections.forEach((section) => observer?.observe(section));
      document.documentElement.classList.add('reveal-ready');
    }

    const toggle = document.getElementById('menu-toggle');
    const mobile = document.getElementById('mobile-nav');
    const closeMenu = () => {
      mobile?.classList.remove('is-open');
      toggle?.setAttribute('aria-expanded', 'false');
      toggle?.setAttribute('aria-label', 'Open navigation');
    };
    const toggleMenu = () => {
      const open = mobile?.classList.toggle('is-open') ?? false;
      toggle?.setAttribute('aria-expanded', String(open));
      toggle?.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    };
    toggle?.addEventListener('click', toggleMenu);
    mobile?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
    const copy = document.getElementById('copy-email');
    const copyEmail = async () => {
      try {
        await navigator.clipboard.writeText('kanish.sridhar.dev@gmail.com');
        if (copy) copy.textContent = 'Copied!';
        window.setTimeout(() => { if (copy) copy.textContent = 'Copy'; }, 2000);
      } catch {
        window.location.href = 'mailto:kanish.sridhar.dev@gmail.com';
      }
    };
    copy?.addEventListener('click', copyEmail);

    // This trading terminal is a labelled visual simulation, not a live market feed.
    const bids = [3420, 2150, 4800, 1280, 1950];
    const asks = [2890, 2100, 5120, 1150, 1840];
    let tick = 0;
    const timer = window.setInterval(() => {
      if (document.hidden || reducedMotion) return;
      tick++;
      const bidSide = tick % 2 === 1;
      const side = bidSide ? bids : asks;
      const i = tick % 5;
      side[i] = Math.max(500, side[i] + ((tick * 73) % 450) - 225);
      root.querySelectorAll<HTMLElement>(bidSide ? '[data-bid-row]' : '[data-ask-row]').forEach((row, index) => {
        const quantity = row.querySelector(bidSide ? '.bid-qty' : '.ask-qty');
        if (quantity) quantity.textContent = side[index].toLocaleString('en-IN');
        const bar = row.querySelector<HTMLElement>('.depth-bar');
        if (bar) bar.style.width = `${Math.min(95, Math.max(25, side[index] / 60))}%`;
      });
      const bidTotal = root.querySelector('#total-bid-depth');
      const askTotal = root.querySelector('#total-ask-depth');
      if (bidTotal) bidTotal.textContent = bids.reduce((a,b) => a+b, 0).toLocaleString('en-IN');
      if (askTotal) askTotal.textContent = asks.reduce((a,b) => a+b, 0).toLocaleString('en-IN');
      const rate = root.querySelector('#live-tick-rate');
      if (rate) rate.textContent = `~${600 + (tick * 7) % 24} ticks/sec`;
    }, 1200);

    return () => {
      observer?.disconnect();
      document.documentElement.classList.remove('reveal-ready');
      window.clearInterval(timer);
      toggle?.removeEventListener('click', toggleMenu);
      copy?.removeEventListener('click', copyEmail);
    };
  });
</script>

<svelte:head>
  <title>Kanish S. — Java Backend Engineer</title>
  <meta name="description" content="Kanish S. builds Java backend systems for trading and digital wallets. Explore experience, projects, architecture, and a downloadable résumé." />
</svelte:head>

{@html terminal}
