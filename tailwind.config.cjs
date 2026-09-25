const color = (token) => `rgb(var(--${token}) / <alpha-value>)`;

module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'secondary-container': color('secondary-container'),
        'outline-variant': color('outline-variant'),
        'on-error': color('on-error'),
        'primary-fixed': color('primary-fixed'),
        'on-secondary-fixed-variant': color('on-secondary-fixed-variant'),
        'surface-variant': color('surface-highest'),
        surface: color('surface'),
        'tertiary-fixed-dim': color('tertiary-accent'),
        'on-secondary-container': color('on-secondary-container'),
        'primary-fixed-dim': color('primary-fixed-dim'),
        'on-background': color('on-surface'),
        'on-tertiary-container': color('on-tertiary-container'),
        'tertiary-container': color('tertiary-container'),
        'on-primary-fixed': color('on-primary'),
        'inverse-primary': color('inverse-primary'),
        'surface-container-high': color('surface-high'),
        'surface-container-lowest': color('surface-lowest'),
        'surface-container-low': color('surface-low'),
        'surface-bright': color('surface-bright'),
        'on-primary-fixed-variant': color('on-primary-fixed-variant'),
        'secondary-fixed-dim': color('secondary'),
        'primary-container': color('accent'),
        'inverse-surface': color('inverse-surface'),
        'secondary-fixed': color('secondary-fixed'),
        secondary: color('secondary'),
        'on-tertiary': color('on-tertiary'),
        'on-primary': color('on-primary'),
        'on-error-container': color('on-error-container'),
        'tertiary-fixed': color('tertiary-fixed'),
        'inverse-on-surface': color('inverse-on-surface'),
        'surface-container-highest': color('surface-highest'),
        'on-surface-variant': color('on-surface-variant'),
        error: color('error'),
        'surface-container': color('surface-container'),
        'on-secondary': color('on-secondary'),
        primary: color('primary'),
        'surface-tint': color('accent'),
        'error-container': color('error-container'),
        outline: color('outline'),
        'surface-dim': color('surface'),
        'on-primary-container': color('on-accent'),
        background: color('surface'),
        tertiary: color('tertiary'),
        'on-tertiary-fixed': color('on-tertiary-fixed'),
        'on-surface': color('on-surface'),
        'on-secondary-fixed': color('on-secondary-fixed'),
        'on-tertiary-fixed-variant': color('on-tertiary-fixed-variant')
      },
      borderRadius: { DEFAULT: '0.125rem', lg: '0.25rem', xl: '0.5rem', full: '0.75rem' },
      spacing: {
        'space-xs': '0.25rem', 'space-sm': '0.5rem', 'margin-lg': '2rem', 'gutter-lg': '1.25rem',
        gutter: '0.75rem', 'space-md': '0.75rem', 'space-lg': '1.25rem', margin: '1rem', 'space-xl': '2rem'
      },
      fontFamily: {
        'headline-xl': ['Plus Jakarta Sans'], 'headline-md': ['Plus Jakarta Sans'], 'headline-lg': ['Plus Jakarta Sans'],
        'code-lg': ['JetBrains Mono'], 'label-md': ['JetBrains Mono'], 'body-sm': ['Plus Jakarta Sans'],
        'code-sm': ['JetBrains Mono'], 'headline-xl-mobile': ['Plus Jakarta Sans'], 'body-lg': ['Plus Jakarta Sans'],
        'headline-lg-mobile': ['Plus Jakarta Sans'], 'body-md': ['Plus Jakarta Sans'], 'code-md': ['JetBrains Mono'],
        'label-xs': ['JetBrains Mono']
      },
      fontSize: {
        'headline-xl': ['48px', { lineHeight: '56px', letterSpacing: '-0.03em', fontWeight: '700' }],
        'headline-md': ['20px', { lineHeight: '28px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'headline-lg': ['32px', { lineHeight: '40px', letterSpacing: '-0.02em', fontWeight: '600' }],
        'code-lg': ['14px', { lineHeight: '20px', fontWeight: '500' }],
        'label-md': ['12px', { lineHeight: '16px', letterSpacing: '0.05em', fontWeight: '600' }],
        'body-sm': ['12px', { lineHeight: '16px', fontWeight: '400' }],
        'code-sm': ['11px', { lineHeight: '14px', letterSpacing: '0.02em', fontWeight: '400' }],
        'headline-xl-mobile': ['32px', { lineHeight: '40px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'body-lg': ['16px', { lineHeight: '24px', letterSpacing: '-0.005em', fontWeight: '400' }],
        'headline-lg-mobile': ['24px', { lineHeight: '32px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'body-md': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'code-md': ['12px', { lineHeight: '18px', fontWeight: '400' }],
        'label-xs': ['10px', { lineHeight: '12px', letterSpacing: '0.08em', fontWeight: '700' }]
      }
    }
  }
};
