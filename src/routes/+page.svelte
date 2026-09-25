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
    const targets = [...new Set([
      ...root.querySelectorAll<HTMLElement>('section:not(:first-child) h2'),
      ...root.querySelectorAll<HTMLElement>('.interactive-card:not(#orderbook-terminal)'),
      ...root.querySelectorAll<HTMLElement>('.shine-panel')
    ])];
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

    // Scroll progress and active navigation make the long, dense page easier to scan.
    const progress = document.createElement('div');
    progress.className = 'scroll-progress';
    progress.setAttribute('aria-hidden', 'true');
    document.body.prepend(progress);
    const navLinks = [...document.querySelectorAll<HTMLAnchorElement>('nav[aria-label="Primary navigation"] a[href^="#"]')];
    const navSections = navLinks
      .map((link) => ({ link, section: link.hash ? document.querySelector<HTMLElement>(link.hash) : root.querySelector<HTMLElement>('section') }))
      .filter((item): item is { link: HTMLAnchorElement; section: HTMLElement } => Boolean(item.section));
    const updateScrollState = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
      const current = [...navSections].reverse().find(({ section }) => section.getBoundingClientRect().top <= 150) ?? navSections[0];
      navLinks.forEach((link) => link.classList.toggle('is-current', link === current?.link));
    };
    window.addEventListener('scroll', updateScrollState, { passive: true });
    updateScrollState();

    const domainModels = {
      trading: {
        kicker: 'PRODUCTION EXPERIENCE // TRADING',
        title: 'Low-Latency Order Lifecycle',
        summary: 'Preserve event order, absorb feed bursts, and keep broker state consistent from placement through execution.',
        state: 'ORDERED',
        flowLabel: 'Trading platform system flow',
        nodes: [['Market Feed','WebSocket ticks'],['Kafka','Keyed events'],['OMS','Order lifecycle'],['Broker Adapter','Execution updates']],
        risk: ['Out-of-order events','Partition related events by account and serialize state transitions.'],
        choice: ['Backpressure + retry','Control bursts without losing lifecycle updates or overwhelming consumers.'],
        control: ['Idempotent updates','Use stable keys and reconciliation to make retries safe.'],
        evidence: 'NSE/BSE OMS, paper broker, and approximately 600 market ticks/sec ingestion.',
        scope: 'Production and project experience'
      },
      wallet: {
        kicker: 'PRODUCTION EXPERIENCE // DIGITAL WALLET',
        title: 'Transaction Integrity Across Services',
        summary: 'Coordinate payment, wallet, accounting, and settlement states while keeping refunds and rollbacks traceable.',
        state: 'CONSISTENT',
        flowLabel: 'Digital wallet transaction flow',
        nodes: [['Payment API','Cash-in / P2P'],['Wallet','Debit or credit'],['Accounting','Ledger entry'],['Settlement','Reconcile funds']],
        risk: ['Partial completion','A downstream failure can leave wallet and accounting states misaligned.'],
        choice: ['Compensating flow','Model refund and rollback paths as first-class business transitions.'],
        control: ['Maker-checker','Separate adjustment initiation and approval with an audit trail.'],
        evidence: 'Cash-In, Cash-Out, P2P, refunds, rollbacks, accounting APIs, and Retool operations workflows.',
        scope: 'Production experience at Barq'
      },
      banking: {
        kicker: 'DOMAIN MODEL // BANKING PRODUCTS',
        title: 'Governed Product and Pricing Rules',
        summary: 'Externalize product definitions, eligibility, rates, fees, and exceptions so changes remain explainable and auditable.',
        state: 'GOVERNED',
        flowLabel: 'Banking product decision flow',
        nodes: [['Product Catalog','Versioned offer'],['Rule Engine','Segment + eligibility'],['Rate / Fee','Margin + exception'],['Audit Trail','Explain decision']],
        risk: ['Rule inconsistency','Scattered configuration creates conflicting offers and unclear customer outcomes.'],
        choice: ['Centralized decisioning','Evaluate product, customer segment, rates, fees, and exceptions through governed rules.'],
        control: ['Approval + audit','Track who changed a rule, why it changed, and which decisions used it.'],
        evidence: 'Applicable backend foundations: rule evaluation, financial workflows, Kafka events, PostgreSQL, Redis, and audit-friendly APIs.',
        scope: 'Domain understanding, clearly separated from work history'
      }
    } as const;
    const domainButtons = [...root.querySelectorAll<HTMLButtonElement>('[data-domain-mode]')];
    const domainDisplay = root.querySelector<HTMLElement>('#domain-display');
    const applyDomain = (mode: keyof typeof domainModels) => {
      const model = domainModels[mode];
      domainButtons.forEach((button) => {
        const active = button.dataset.domainMode === mode;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-selected', String(active));
      });
      const values: Record<string,string> = {
        '#domain-kicker': model.kicker, '#domain-title': model.title, '#domain-summary': model.summary,
        '#domain-state': model.state, '#domain-risk': model.risk[0], '#domain-risk-detail': model.risk[1],
        '#domain-choice': model.choice[0], '#domain-choice-detail': model.choice[1],
        '#domain-control': model.control[0], '#domain-control-detail': model.control[1],
        '#domain-evidence': model.evidence, '#domain-scope': model.scope
      };
      Object.entries(values).forEach(([selector,value]) => {
        const element = root.querySelector(selector);
        if (element) element.textContent = value;
      });
      root.querySelector('#domain-flow')?.setAttribute('aria-label', model.flowLabel);
      root.querySelectorAll<HTMLElement>('#domain-flow .domain-node').forEach((node,index) => {
        const strong = node.querySelector('strong');
        const small = node.querySelector('small');
        if (strong) strong.textContent = model.nodes[index][0];
        if (small) small.textContent = model.nodes[index][1];
      });
      domainDisplay?.classList.remove('is-switching');
      void domainDisplay?.offsetWidth;
      domainDisplay?.classList.add('is-switching');
    };
    const domainHandlers = domainButtons.map((button) => {
      const handler = () => applyDomain(button.dataset.domainMode as keyof typeof domainModels);
      button.addEventListener('click', handler);
      return { button, handler };
    });

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
      window.removeEventListener('scroll', updateScrollState);
      progress.remove();
      domainHandlers.forEach(({ button, handler }) => button.removeEventListener('click', handler));
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
