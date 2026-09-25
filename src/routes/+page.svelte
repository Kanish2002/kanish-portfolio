<script lang="ts">
  import { onMount } from 'svelte';
  import terminal from '$lib/data/terminal.html?raw';
  import '$lib/data/terminal.css';

  onMount(() => {
    const root = document.querySelector('main');
    if (!root) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    type ThemeMode = 'dark' | 'light';
    type ThemeVars = Record<string, string>;
    type ThemeProfile = {
      id: string;
      name: string;
      short: string;
      meta: string;
      mode: ThemeMode;
      swatches: [string, string, string];
      vars?: ThemeVars;
    };
    const themes: Record<string, ThemeProfile> = {
      emerald: { id: 'emerald', name: 'Emerald Exchange', short: 'Emerald', meta: '#10141a', mode: 'dark', swatches: ['#00ff87', '#4edea3', '#ffb95f'] },
      ocean: { id: 'ocean', name: 'Ocean Terminal', short: 'Ocean', meta: '#07111d', mode: 'dark', swatches: ['#31daff', '#70acff', '#ffb86c'] },
      violet: { id: 'violet', name: 'Violet Ledger', short: 'Violet', meta: '#140e1f', mode: 'dark', swatches: ['#b780ff', '#ff77c0', '#ffc75a'] },
      ember: { id: 'ember', name: 'Ember Markets', short: 'Ember', meta: '#1b110e', mode: 'dark', swatches: ['#ff7d46', '#37dab7', '#ffcb5f'] },
      arctic: { id: 'arctic', name: 'Arctic Desk', short: 'Arctic', meta: '#f4f8fc', mode: 'light', swatches: ['#007095', '#006e74', '#aa5200'] },
      rose: { id: 'rose', name: 'Rose Banking', short: 'Rose', meta: '#fff7fa', mode: 'light', swatches: ['#b41c58', '#7042b1', '#995b00'] }
    };
    const builtInThemeIds = Object.keys(themes);
    const defaultActiveThemes = ['emerald', 'arctic'];
    const storage = {
      active: 'portfolio-active-themes',
      custom: 'portfolio-custom-themes',
      last: 'portfolio-last-theme'
    } as const;
    const readJSON = <T,>(key: string, fallback: T): T => {
      try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) as T : fallback;
      } catch {
        return fallback;
      }
    };
    const writeJSON = (key: string, value: unknown) => {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* Local preferences are optional. */ }
    };
    const isCustomTheme = (value: unknown): value is ThemeProfile => {
      if (!value || typeof value !== 'object') return false;
      const theme = value as Partial<ThemeProfile>;
      return typeof theme.id === 'string' && theme.id.startsWith('custom-') && typeof theme.name === 'string' &&
        (theme.mode === 'dark' || theme.mode === 'light') && Array.isArray(theme.swatches) && theme.swatches.length === 3 &&
        Boolean(theme.vars && typeof theme.vars === 'object');
    };
    let customThemes = readJSON<unknown[]>(storage.custom, []).filter(isCustomTheme).slice(0, 2);
    let generatedTheme: ThemeProfile | null = null;
    const getTheme = (id: string) => themes[id] ?? customThemes.find((theme) => theme.id === id) ?? (generatedTheme?.id === id ? generatedTheme : undefined);
    const normalizeActiveThemes = (candidate: unknown) => {
      const available = new Set([...builtInThemeIds, ...customThemes.map((theme) => theme.id)]);
      const normalized = Array.isArray(candidate)
        ? [...new Set(candidate.filter((id): id is string => typeof id === 'string' && available.has(id)))]
        : [];
      for (const fallback of defaultActiveThemes) {
        if (normalized.length >= 2) break;
        if (!normalized.includes(fallback)) normalized.push(fallback);
      }
      return normalized;
    };
    let activeThemeIds = normalizeActiveThemes(readJSON<unknown>(storage.active, defaultActiveThemes));
    writeJSON(storage.active, activeThemeIds);
    writeJSON(storage.custom, customThemes);
    const themePanel = document.getElementById('theme-panel');
    const themeToggle = document.getElementById('theme-toggle');
    const themeClose = document.getElementById('theme-close');
    const themeShuffle = document.getElementById('theme-shuffle');
    const themeGenerate = document.getElementById('theme-generate');
    const themePreviewApply = document.getElementById('theme-preview-apply');
    const themePreviewSave = document.getElementById('theme-preview-save') as HTMLButtonElement | null;
    const themePreview = document.getElementById('theme-custom-preview');
    const themePreviewName = document.getElementById('theme-preview-name');
    const themePreviewMode = document.getElementById('theme-preview-mode');
    const activeThemeList = document.getElementById('active-theme-list');
    const inactiveThemeList = document.getElementById('inactive-theme-list');
    const savedThemeList = document.getElementById('saved-theme-list');
    const activeThemeCount = document.getElementById('active-theme-count');
    const inactiveThemeCount = document.getElementById('inactive-theme-count');
    const savedThemeCount = document.getElementById('saved-theme-count');
    const themeCurrentName = document.getElementById('theme-current-name');
    const themeCurrentShort = document.querySelector<HTMLElement>('.theme-current-short');
    const themeStatus = document.getElementById('theme-status');
    const builtInThemeCards = [...document.querySelectorAll<HTMLElement>('[data-theme-card]')];
    let currentThemeId = document.documentElement.dataset.themeId || document.documentElement.dataset.theme || 'emerald';
    if (!getTheme(currentThemeId)) currentThemeId = 'emerald';
    let themeTransitionTimer = 0;
    let customVariableNames: string[] = document.documentElement.dataset.theme === 'custom'
      ? Object.keys(getTheme(currentThemeId)?.vars ?? {})
      : [];

    const hslToRgb = (hue: number, saturation: number, lightness: number): [number, number, number] => {
      const s = saturation / 100;
      const l = lightness / 100;
      const chroma = (1 - Math.abs(2 * l - 1)) * s;
      const x = chroma * (1 - Math.abs((hue / 60) % 2 - 1));
      const m = l - chroma / 2;
      const [red, green, blue] = hue < 60 ? [chroma, x, 0] : hue < 120 ? [x, chroma, 0] : hue < 180 ? [0, chroma, x] : hue < 240 ? [0, x, chroma] : hue < 300 ? [x, 0, chroma] : [chroma, 0, x];
      return [red, green, blue].map((channel) => Math.round((channel + m) * 255)) as [number, number, number];
    };
    const rgb = (color: [number, number, number]) => color.join(' ');
    const hex = (color: [number, number, number]) => `#${color.map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;
    const tone = (hue: number, saturation: number, lightness: number) => hslToRgb((hue + 360) % 360, saturation, lightness);
    const contrastText = ([red, green, blue]: [number, number, number]) => {
      const linear = [red, green, blue].map((channel) => {
        const value = channel / 255;
        return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
      });
      const luminance = 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
      return luminance > 0.2 ? '18 24 30' : '255 255 255';
    };
    const generateTheme = (): ThemeProfile => {
      const hue = Math.floor(Math.random() * 360);
      const secondaryHue = (hue + 45 + Math.floor(Math.random() * 55)) % 360;
      const tertiaryHue = (hue + 145 + Math.floor(Math.random() * 70)) % 360;
      const mode: ThemeMode = Math.random() > 0.48 ? 'dark' : 'light';
      const accent = tone(hue, mode === 'dark' ? 88 : 78, mode === 'dark' ? 62 : 39);
      const secondary = tone(secondaryHue, mode === 'dark' ? 76 : 70, mode === 'dark' ? 65 : 37);
      const tertiary = tone(tertiaryHue, mode === 'dark' ? 88 : 76, mode === 'dark' ? 68 : 38);
      const surface = tone(hue, mode === 'dark' ? 24 : 24, mode === 'dark' ? 8 : 97);
      const hueLabels = ['Crimson', 'Solar', 'Amber', 'Lime', 'Emerald', 'Aqua', 'Cyan', 'Cobalt', 'Indigo', 'Violet', 'Magenta', 'Rose'];
      const nouns = ['Terminal', 'Ledger', 'Exchange', 'Pulse', 'Circuit', 'Desk', 'Matrix', 'Signal'];
      const label = hueLabels[Math.floor(((hue + 15) % 360) / 30)];
      const name = `${label} ${nouns[Math.floor(Math.random() * nouns.length)]}`;
      const vars: ThemeVars = mode === 'dark' ? {
        'surface': rgb(surface), 'surface-lowest': rgb(tone(hue, 25, 4)), 'surface-low': rgb(tone(hue, 24, 11)), 'surface-container': rgb(tone(hue, 23, 14)), 'surface-high': rgb(tone(hue, 21, 18)), 'surface-highest': rgb(tone(hue, 19, 23)), 'surface-bright': rgb(tone(hue, 18, 27)),
        'primary': rgb(tone(hue, 18, 96)), 'on-surface': rgb(tone(hue, 15, 90)), 'on-surface-variant': rgb(tone(hue, 19, 72)), 'outline': rgb(tone(hue, 18, 58)), 'outline-variant': rgb(tone(hue, 20, 27)),
        'accent': rgb(accent), 'primary-fixed': rgb(tone(hue, 88, 76)), 'primary-fixed-dim': rgb(tone(hue, 82, 57)), 'on-accent': contrastText(accent), 'on-primary': contrastText(accent), 'on-primary-fixed-variant': rgb(tone(hue, 75, 28)), 'inverse-primary': rgb(tone(hue, 72, 38)),
        'secondary': rgb(secondary), 'secondary-container': rgb(tone(secondaryHue, 66, 36)), 'secondary-fixed': rgb(tone(secondaryHue, 72, 78)), 'on-secondary': contrastText(secondary), 'on-secondary-container': rgb(tone(secondaryHue, 60, 12)), 'on-secondary-fixed': rgb(tone(secondaryHue, 55, 10)), 'on-secondary-fixed-variant': rgb(tone(secondaryHue, 60, 28)),
        'tertiary-accent': rgb(tertiary), 'tertiary': rgb(tone(tertiaryHue, 18, 96)), 'tertiary-fixed': rgb(tone(tertiaryHue, 78, 80)), 'tertiary-container': rgb(tone(tertiaryHue, 75, 74)), 'on-tertiary': contrastText(tertiary), 'on-tertiary-container': rgb(tone(tertiaryHue, 68, 30)), 'on-tertiary-fixed': rgb(tone(tertiaryHue, 55, 10)), 'on-tertiary-fixed-variant': rgb(tone(tertiaryHue, 60, 27)),
        'error': '255 180 171', 'error-container': '147 0 10', 'on-error': '105 0 5', 'on-error-container': '255 218 214', 'inverse-surface': rgb(tone(hue, 15, 90)), 'inverse-on-surface': rgb(tone(hue, 18, 18)), 'shadow': '0 0 0'
      } : {
        'surface': rgb(surface), 'surface-lowest': '255 255 255', 'surface-low': rgb(tone(hue, 24, 93)), 'surface-container': rgb(tone(hue, 24, 89)), 'surface-high': rgb(tone(hue, 23, 84)), 'surface-highest': rgb(tone(hue, 22, 78)), 'surface-bright': '255 255 255',
        'primary': rgb(tone(hue, 38, 14)), 'on-surface': rgb(tone(hue, 30, 17)), 'on-surface-variant': rgb(tone(hue, 25, 35)), 'outline': rgb(tone(hue, 22, 46)), 'outline-variant': rgb(tone(hue, 24, 76)),
        'accent': rgb(accent), 'primary-fixed': rgb(tone(hue, 74, 82)), 'primary-fixed-dim': rgb(tone(hue, 77, 48)), 'on-accent': contrastText(accent), 'on-primary': contrastText(accent), 'on-primary-fixed-variant': rgb(tone(hue, 72, 28)), 'inverse-primary': rgb(tone(hue, 80, 70)),
        'secondary': rgb(secondary), 'secondary-container': rgb(tone(secondaryHue, 62, 86)), 'secondary-fixed': rgb(tone(secondaryHue, 65, 88)), 'on-secondary': contrastText(secondary), 'on-secondary-container': rgb(tone(secondaryHue, 55, 25)), 'on-secondary-fixed': rgb(tone(secondaryHue, 48, 13)), 'on-secondary-fixed-variant': rgb(tone(secondaryHue, 56, 29)),
        'tertiary-accent': rgb(tertiary), 'tertiary': rgb(tone(tertiaryHue, 56, 24)), 'tertiary-fixed': rgb(tone(tertiaryHue, 72, 84)), 'tertiary-container': rgb(tone(tertiaryHue, 70, 82)), 'on-tertiary': contrastText(tertiary), 'on-tertiary-container': rgb(tone(tertiaryHue, 60, 25)), 'on-tertiary-fixed': rgb(tone(tertiaryHue, 50, 12)), 'on-tertiary-fixed-variant': rgb(tone(tertiaryHue, 58, 28)),
        'error': '186 26 26', 'error-container': '255 218 214', 'on-error': '255 255 255', 'on-error-container': '65 0 2', 'inverse-surface': rgb(tone(hue, 25, 20)), 'inverse-on-surface': rgb(tone(hue, 20, 94)), 'shadow': rgb(tone(hue, 35, 16))
      };
      return {
        id: `custom-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
        name,
        short: label,
        meta: hex(surface),
        mode,
        swatches: [hex(accent), hex(secondary), hex(tertiary)],
        vars
      };
    };

    const clearCustomVariables = () => {
      customVariableNames.forEach((name) => document.documentElement.style.removeProperty(`--${name}`));
      customVariableNames = [];
      document.documentElement.style.removeProperty('color-scheme');
    };
    const applyTheme = (theme: ThemeProfile, announce = true) => {
      currentThemeId = theme.id;
      if (!reducedMotion) {
        document.documentElement.classList.add('theme-changing');
        window.clearTimeout(themeTransitionTimer);
        themeTransitionTimer = window.setTimeout(() => document.documentElement.classList.remove('theme-changing'), 480);
      }
      clearCustomVariables();
      if (theme.vars) {
        document.documentElement.dataset.theme = 'custom';
        document.documentElement.style.colorScheme = theme.mode;
        customVariableNames = Object.keys(theme.vars);
        Object.entries(theme.vars).forEach(([name, value]) => document.documentElement.style.setProperty(`--${name}`, value));
      } else {
        document.documentElement.dataset.theme = theme.id;
      }
      document.documentElement.dataset.themeId = theme.id;
      try { localStorage.setItem(storage.last, theme.id); } catch { /* Local preferences are optional. */ }
      syncThemeUI(announce);
    };
    const shuffleTheme = () => {
      activeThemeIds = normalizeActiveThemes(activeThemeIds);
      const options = activeThemeIds.filter((id) => id !== currentThemeId && getTheme(id));
      const nextId = options[Math.floor(Math.random() * options.length)] ?? activeThemeIds[0];
      const nextTheme = getTheme(nextId);
      if (nextTheme) applyTheme(nextTheme);
    };
    const announce = (message: string) => { if (themeStatus) themeStatus.textContent = message; };
    const toggleThemeMembership = (id: string) => {
      if (activeThemeIds.includes(id)) {
        if (activeThemeIds.length <= 2) {
          announce('Keep at least two active themes so reloads can always show a different theme.');
          return;
        }
        activeThemeIds = activeThemeIds.filter((themeId) => themeId !== id);
      } else {
        activeThemeIds = [...activeThemeIds, id];
      }
      writeJSON(storage.active, activeThemeIds);
      syncThemeUI(false);
      announce(`${getTheme(id)?.name ?? 'Theme'} moved to ${activeThemeIds.includes(id) ? 'active' : 'inactive'} themes.`);
    };
    const themeCardMarkup = (theme: ThemeProfile) => `
      <article class="theme-card" data-custom-theme="${theme.id}" style="--swatch-a:${theme.swatches[0]};--swatch-b:${theme.swatches[1]};--swatch-c:${theme.swatches[2]}">
        <button type="button" class="theme-apply" data-theme-choice="${theme.id}" aria-pressed="false">
          <span class="theme-swatches"><i></i><i></i><i></i></span><span><strong>${theme.name}</strong><small>${theme.mode === 'dark' ? 'Dark' : 'Light'} · generated palette</small></span><span class="material-symbols-outlined theme-check">check_circle</span>
        </button>
        <div class="theme-card-actions"><button type="button" class="theme-membership" data-theme-membership="${theme.id}" aria-pressed="false"><span class="material-symbols-outlined">add_circle</span><span class="membership-label">Activate</span></button><button type="button" class="theme-delete" data-theme-delete="${theme.id}" aria-label="Delete ${theme.name}"><span class="material-symbols-outlined">delete</span></button></div>
      </article>`;
    function syncThemeUI(shouldAnnounce = true) {
      const config = getTheme(currentThemeId) ?? themes.emerald;
      if (themeCurrentName) themeCurrentName.textContent = config.name;
      if (themeCurrentShort) themeCurrentShort.textContent = config.short;
      if (themeStatus && shouldAnnounce) themeStatus.textContent = `${config.name} theme applied.`;
      builtInThemeCards.forEach((card) => {
        const id = card.dataset.themeCard ?? '';
        const isCurrent = id === currentThemeId;
        const isRotationActive = activeThemeIds.includes(id);
        card.classList.toggle('is-current', isCurrent);
        card.classList.toggle('is-rotation-active', isRotationActive);
        card.querySelector<HTMLButtonElement>('[data-theme-choice]')?.setAttribute('aria-pressed', String(isCurrent));
        const membership = card.querySelector<HTMLButtonElement>('[data-theme-membership]');
        membership?.setAttribute('aria-pressed', String(isRotationActive));
        if (membership) membership.disabled = isRotationActive && activeThemeIds.length <= 2;
        const label = card.querySelector<HTMLElement>('.membership-label');
        const icon = membership?.querySelector<HTMLElement>('.material-symbols-outlined');
        if (label) label.textContent = isRotationActive ? 'Active' : 'Activate';
        if (icon) icon.textContent = isRotationActive ? 'remove_circle' : 'add_circle';
        (isRotationActive ? activeThemeList : inactiveThemeList)?.append(card);
      });
      if (savedThemeList) {
        savedThemeList.innerHTML = customThemes.length
          ? customThemes.map(themeCardMarkup).join('')
          : '<p class="theme-empty">No saved custom themes yet.</p>';
        savedThemeList.querySelectorAll<HTMLElement>('[data-custom-theme]').forEach((card) => {
          const id = card.dataset.customTheme ?? '';
          const isCurrent = id === currentThemeId;
          const isRotationActive = activeThemeIds.includes(id);
          card.classList.toggle('is-current', isCurrent);
          card.classList.toggle('is-rotation-active', isRotationActive);
          card.querySelector<HTMLButtonElement>('[data-theme-choice]')?.setAttribute('aria-pressed', String(isCurrent));
          const membership = card.querySelector<HTMLButtonElement>('[data-theme-membership]');
          membership?.setAttribute('aria-pressed', String(isRotationActive));
          if (membership) membership.disabled = isRotationActive && activeThemeIds.length <= 2;
          const label = card.querySelector<HTMLElement>('.membership-label');
          const icon = membership?.querySelector<HTMLElement>('.material-symbols-outlined');
          if (label) label.textContent = isRotationActive ? 'Active' : 'Activate';
          if (icon) icon.textContent = isRotationActive ? 'remove_circle' : 'add_circle';
        });
      }
      if (activeThemeCount) activeThemeCount.textContent = String(activeThemeIds.filter((id) => builtInThemeIds.includes(id)).length);
      if (inactiveThemeCount) inactiveThemeCount.textContent = String(builtInThemeIds.filter((id) => !activeThemeIds.includes(id)).length);
      if (savedThemeCount) savedThemeCount.textContent = `${customThemes.length}/2 saved`;
      if (themePreviewSave) themePreviewSave.disabled = !generatedTheme || customThemes.length >= 2 || customThemes.some((theme) => theme.id === generatedTheme?.id);
      document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute('content', config.meta);
    }
    const showGeneratedTheme = () => {
      generatedTheme = generateTheme();
      themePreview?.classList.remove('is-empty');
      if (themePreviewName) themePreviewName.textContent = generatedTheme.name;
      if (themePreviewMode) themePreviewMode.textContent = `${generatedTheme.mode === 'dark' ? 'Dark' : 'Light'} · new unsaved palette`;
      generatedTheme.swatches.forEach((swatch, index) => themePreview?.style.setProperty(`--preview-${index + 1}`, swatch));
      if (themePreviewSave) themePreviewSave.disabled = customThemes.length >= 2;
      announce(`${generatedTheme.name} generated. Preview, apply, or save it.`);
    };
    const applyGeneratedTheme = () => {
      if (generatedTheme) applyTheme(generatedTheme);
      else announce('Generate a custom theme first.');
    };
    const saveGeneratedTheme = () => {
      if (!generatedTheme) return announce('Generate a custom theme first.');
      if (customThemes.length >= 2) return announce('Two custom themes are already saved. Delete one before saving another.');
      if (!customThemes.some((theme) => theme.id === generatedTheme?.id)) customThemes = [...customThemes, generatedTheme];
      activeThemeIds = [...new Set([...activeThemeIds, generatedTheme.id])];
      writeJSON(storage.custom, customThemes);
      writeJSON(storage.active, activeThemeIds);
      applyTheme(generatedTheme, false);
      announce(`${generatedTheme.name} saved and added to active rotation.`);
    };
    const deleteCustomTheme = (id: string) => {
      const removed = customThemes.find((theme) => theme.id === id);
      customThemes = customThemes.filter((theme) => theme.id !== id);
      activeThemeIds = normalizeActiveThemes(activeThemeIds.filter((themeId) => themeId !== id));
      writeJSON(storage.custom, customThemes);
      writeJSON(storage.active, activeThemeIds);
      if (currentThemeId === id) shuffleTheme();
      else syncThemeUI(false);
      announce(`${removed?.name ?? 'Custom theme'} deleted.`);
    };
    const openThemePanel = () => {
      themePanel?.classList.add('is-open');
      themePanel?.setAttribute('aria-hidden', 'false');
      themeToggle?.setAttribute('aria-expanded', 'true');
      themeToggle?.setAttribute('aria-label', 'Close theme settings');
      themePanel?.querySelector<HTMLButtonElement>('.theme-card.is-current .theme-apply')?.focus();
    };
    const closeThemePanel = (restoreFocus = false) => {
      themePanel?.classList.remove('is-open');
      themePanel?.setAttribute('aria-hidden', 'true');
      themeToggle?.setAttribute('aria-expanded', 'false');
      themeToggle?.setAttribute('aria-label', 'Open theme settings');
      if (restoreFocus) themeToggle?.focus();
    };
    const closeThemeWithFocus = () => closeThemePanel(true);
    const toggleThemePanel = () => themePanel?.classList.contains('is-open') ? closeThemePanel() : openThemePanel();
    const outsideThemeClick = (event: PointerEvent) => {
      const target = event.target as Node;
      if (themePanel?.classList.contains('is-open') && !themePanel.contains(target) && !themeToggle?.contains(target)) closeThemePanel();
    };
    const themeKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && themePanel?.classList.contains('is-open')) closeThemePanel(true);
    };
    const themePanelClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const choice = target.closest<HTMLElement>('[data-theme-choice]')?.dataset.themeChoice;
      const membership = target.closest<HTMLElement>('[data-theme-membership]')?.dataset.themeMembership;
      const deletion = target.closest<HTMLElement>('[data-theme-delete]')?.dataset.themeDelete;
      if (choice) {
        const theme = getTheme(choice);
        if (theme) applyTheme(theme);
      } else if (membership) toggleThemeMembership(membership);
      else if (deletion) deleteCustomTheme(deletion);
    };
    syncThemeUI(false);
    themeToggle?.addEventListener('click', toggleThemePanel);
    themeClose?.addEventListener('click', closeThemeWithFocus);
    themeShuffle?.addEventListener('click', shuffleTheme);
    themeGenerate?.addEventListener('click', showGeneratedTheme);
    themePreviewApply?.addEventListener('click', applyGeneratedTheme);
    themePreviewSave?.addEventListener('click', saveGeneratedTheme);
    themePanel?.addEventListener('click', themePanelClick);
    document.addEventListener('pointerdown', outsideThemeClick);
    document.addEventListener('keydown', themeKeydown);

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
      themeToggle?.removeEventListener('click', toggleThemePanel);
      themeClose?.removeEventListener('click', closeThemeWithFocus);
      themeShuffle?.removeEventListener('click', shuffleTheme);
      themeGenerate?.removeEventListener('click', showGeneratedTheme);
      themePreviewApply?.removeEventListener('click', applyGeneratedTheme);
      themePreviewSave?.removeEventListener('click', saveGeneratedTheme);
      themePanel?.removeEventListener('click', themePanelClick);
      document.removeEventListener('pointerdown', outsideThemeClick);
      document.removeEventListener('keydown', themeKeydown);
      window.clearTimeout(themeTransitionTimer);
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
