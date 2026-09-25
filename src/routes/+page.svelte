<script lang="ts">
  import { onMount } from 'svelte';
  import terminal from '$lib/data/terminal.html?raw';
  import '$lib/data/terminal.css';

  onMount(() => {
    const root = document.querySelector('main');
    if (!root) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Reveal individual pieces as they enter the viewport, including on return visits.
    const detailPanels = [
      ...root.querySelectorAll<HTMLElement>('#architecture .grid > div'),
      ...root.querySelectorAll<HTMLElement>('#orderbook-terminal > div:last-child > div'),
      ...root.querySelectorAll<HTMLElement>('section:nth-of-type(2) .grid[class*="md:grid-cols-4"] > div')
    ];
    detailPanels.forEach((panel) => panel.classList.add('shine-panel'));
    const targets = [
      ...root.querySelectorAll<HTMLElement>('section:not(:first-child) h2'),
      ...root.querySelectorAll<HTMLElement>('.interactive-card:not(#orderbook-terminal)'),
      ...detailPanels
    ];
    // The architecture shell contains smaller cards, so reveal its contents instead.
    const revealTargets = targets.filter((element) =>
      !(element.classList.contains('interactive-card') && element.querySelector('.shine-panel'))
    );
    let observer: IntersectionObserver | undefined;
    if (!reducedMotion && 'IntersectionObserver' in window) {
      revealTargets.forEach((element) => {
        element.classList.add('reveal-item');
        const siblings = [...(element.parentElement?.children ?? [])].filter((sibling) =>
          sibling.classList.contains('interactive-card') || sibling.classList.contains('shine-panel')
        );
        const position = siblings.indexOf(element);
        element.style.setProperty('--reveal-delay', `${Math.max(0, position % 4) * 95}ms`);
        if (position >= 0) element.style.setProperty('--slide-x', position % 2 ? '24px' : '-24px');
      });
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('revealed', entry.isIntersecting);
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });
      revealTargets.forEach((element) => observer?.observe(element));
      document.documentElement.classList.add('reveal-ready');
    }
    const shineMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return;
      const panel = (event.target as Element).closest<HTMLElement>('.interactive-card, .shine-panel');
      if (!panel) return;
      const bounds = panel.getBoundingClientRect();
      panel.style.setProperty('--shine-x', `${event.clientX - bounds.left}px`);
      panel.style.setProperty('--shine-y', `${event.clientY - bounds.top}px`);
    };
    root.addEventListener('pointermove', shineMove, { passive: true });

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

    // Visual simulation only. All prices and executions below are sample data.
    const bids = [3420, 2150, 4800, 1280, 1950];
    const asks = [2890, 2100, 5120, 1150, 1840];
    const log = root.querySelector('#execution-log-container');
    const formatPrice = (value: number) => value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const setText = (selector: string, value: string) => {
      const element = root.querySelector(selector);
      if (element) element.textContent = value;
    };
    let bestBid = 2418.5;
    let seed = 73;
    const next = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    let tick = 0;
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      tick++;
      const movement = next() < 0.5 ? -0.05 : 0.05;
      bestBid = Math.max(2409.5, Math.min(2427.5, Math.round((bestBid + movement) * 20) / 20));

      (['bid', 'ask'] as const).forEach((side) => {
        const levels = side === 'bid' ? bids : asks;
        const changed = Math.floor(next() * levels.length);
        levels[changed] = Math.max(500, Math.min(6000, levels[changed] + Math.round((next() - 0.5) * 1100)));
        root.querySelectorAll<HTMLElement>(`[data-${side}-row]`).forEach((row, index) => {
          const price = side === 'bid' ? bestBid - index * 0.05 : bestBid + (index + 1) * 0.05;
          const quantity = row.querySelector(`.${side}-qty`);
          const priceElement = row.querySelector(`.${side}-px`);
          if (quantity) quantity.textContent = levels[index].toLocaleString('en-IN');
          if (priceElement) priceElement.textContent = formatPrice(price);
          const bar = row.querySelector<HTMLElement>('.depth-bar');
          if (bar) bar.style.width = `${Math.min(95, Math.max(25, levels[index] / 60))}%`;
          if (index === changed && !reducedMotion) {
            row.classList.remove('quote-updated');
            void row.offsetWidth;
            row.classList.add('quote-updated');
          }
        });
      });

      const bidTotal = bids.reduce((sum, qty) => sum + qty, 0);
      const askTotal = asks.reduce((sum, qty) => sum + qty, 0);
      const imbalance = ((bidTotal - askTotal) / (bidTotal + askTotal)) * 100;
      setText('#total-bid-depth', bidTotal.toLocaleString('en-IN'));
      setText('#total-ask-depth', askTotal.toLocaleString('en-IN'));
      setText('#l2-mid-price', `₹${(bestBid + 0.025).toLocaleString('en-IN', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}`);
      setText('#l2-spread', `0.05 (${(0.05 / bestBid * 100).toFixed(3)}%)`);
      setText('#imbalance-badge', `${imbalance >= 0 ? '+' : ''}${imbalance.toFixed(1)}% ${imbalance >= 0 ? 'Buy pressure' : 'Sell pressure'}`);
      setText('#live-tick-rate', `~${590 + Math.floor(next() * 30)} ticks/sec`);
      setText('#buffer-pct', `${(13 + next() * 4).toFixed(1)}%`);

      if (log) {
        const action = ['BUY', 'SELL', 'MODIFY'][Math.floor(next() * 3)];
        const quantity = (Math.floor(next() * 19) + 2) * 50;
        const fill = action === 'BUY' ? bestBid : bestBid + 0.05;
        const row = document.createElement('div');
        row.className = `execution-entry flex items-center justify-between gap-2 bg-surface-container-lowest px-2 py-1 rounded border-l-2 ${action === 'SELL' ? 'border-error' : action === 'MODIFY' ? 'border-tertiary-fixed-dim' : 'border-primary-container'}`;
        const details = document.createElement('span');
        details.className = `font-bold ${action === 'SELL' ? 'text-error' : action === 'MODIFY' ? 'text-tertiary-fixed-dim' : 'text-primary-container'}`;
        details.textContent = `${action} ${quantity.toLocaleString('en-IN')} @ ${formatPrice(fill)}`;
        const status = document.createElement('span');
        status.className = 'text-on-surface-variant font-semibold';
        status.textContent = action === 'MODIFY' ? 'RE-QUEUED' : 'SIM ACK';
        row.append(details, status);
        log.prepend(row);
        while (log.children.length > 4) log.lastElementChild?.remove();
      }
    }, 900);

    return () => {
      observer?.disconnect();
      document.documentElement.classList.remove('reveal-ready');
      root.removeEventListener('pointermove', shineMove);
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
