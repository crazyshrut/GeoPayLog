/**
 * GeoPayLog v2 — Dark Theme (GitHub-inspired)
 * Primary accent: #0D9488 (deep teal)
 * All colors pulled from GitHub's dark default palette
 */

export const COLORS = {
    // Core backgrounds (GitHub dark)
    bg: '#0d1117',
    bgCard: '#161b22',
    bgElevated: '#1c2128',
    bgOverlay: '#21262d',
    bgInset: '#010409',

    // Borders
    border: '#30363d',
    borderMuted: '#21262d',

    // Text hierarchy
    textPrimary: '#e6edf3',
    textSecondary: '#8b949e',
    textMuted: '#6e7681',
    textPlaceholder: '#484f58',

    // Accent — deep teal (the GeoPayLog signature)
    accent: '#0D9488',
    accentHover: '#0F766E',
    accentSubtle: 'rgba(13, 148, 136, 0.15)',
    accentBorder: 'rgba(13, 148, 136, 0.4)',

    // Semantic colors
    danger: '#f85149',
    dangerSubtle: 'rgba(248, 81, 73, 0.15)',
    warning: '#d29922',
    warningSubtle: 'rgba(210, 153, 34, 0.15)',
    success: '#3fb950',
    successSubtle: 'rgba(63, 185, 80, 0.15)',
    info: '#58a6ff',
    infoSubtle: 'rgba(88, 166, 255, 0.15)',

    // Category colors
    categoryFood: '#F97316',
    categoryCafe: '#A855F7',
    categoryTravel: '#EF4444',
    categoryShop: '#3B82F6',
    categoryOther: '#6B7280',

    // Tab bar
    tabBarBg: '#161b22',
    tabActive: '#0D9488',
    tabInactive: '#484f58',

    // Map
    mapOverlay: 'rgba(13, 17, 23, 0.85)',
};

export const CATEGORY_CONFIG = {
    Food: { icon: '🍔', color: COLORS.categoryFood, label: 'Food' },
    Cafe: { icon: '☕', color: COLORS.categoryCafe, label: 'Cafe' },
    Travel: { icon: '🚗', color: COLORS.categoryTravel, label: 'Travel' },
    Shop: { icon: '🛍️', color: COLORS.categoryShop, label: 'Shop' },
    Other: { icon: '📦', color: COLORS.categoryOther, label: 'Other' },
};

export const FONTS = {
    regular: { fontWeight: '400' },
    medium: { fontWeight: '500' },
    semiBold: { fontWeight: '600' },
    bold: { fontWeight: '700' },
    extraBold: { fontWeight: '800' },
};

export const SIZES = {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 22,
    xxxl: 28,
    title: 32,
    radius: 12,
    radiusSm: 8,
    radiusLg: 16,
    radiusXl: 20,
    radiusFull: 999,
};
