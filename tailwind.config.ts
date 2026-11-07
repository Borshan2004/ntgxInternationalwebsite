import type { Config } from 'tailwindcss';
import tokens from './design-tokens.json';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ntgx: {
          red: '#E51919',
          redHover: '#C81212',
          redDark: '#9B0E0E',
          redLight: '#FEE2E2',
          redSubtle: '#FEF2F2',
          dark: '#18181B',
          darkHover: '#27272A',
          darker: '#09090B',
          gray: '#3F3F46',
          grayLight: '#71717A',
          accent: '#FF3333',
        },
        fedex: {
          purple: '#E51919',       // Replaced with NTGX Red
          purpleDark: '#C81212',
          orange: '#18181B',       // Replaced with NTGX Charcoal
          orangeDark: '#09090B',
          blue: '#007AB7',
        },
        brand: {
          red: '#E51919',
          redHover: '#C81212',
          redActive: '#9B0E0E',
          redSubtle: '#FEF2F2',
          dark: '#18181B',
          darkHover: '#27272A',
          gray: '#3F3F46',
          purple: '#E51919',
          purpleHover: '#C81212',
          purpleActive: '#9B0E0E',
          purpleSubtle: '#FEF2F2',
          orange: '#18181B',
          orangeHover: '#27272A',
          orangeSubtle: '#F4F4F5',
          accentBlue: '#007AB7',
          accentBlueHover: '#005F8F',
        },
        status: {
          draft: tokens.colors.status.draft,
          printed: tokens.colors.status.printed,
          pickupScheduled: tokens.colors.status.pickupScheduled,
          inTransit: tokens.colors.status.inTransit,
          outForDelivery: tokens.colors.status.outForDelivery,
          delivered: tokens.colors.status.delivered,
          exception: tokens.colors.status.exception,
        },
        neutral: {
          canvas: tokens.colors.neutral.canvas,
          surface: tokens.colors.neutral.surface,
          surfaceMuted: tokens.colors.neutral.surfaceMuted,
          border: tokens.colors.neutral.border,
          borderFocus: tokens.colors.neutral.borderFocus,
          textPrimary: tokens.colors.neutral.textPrimary,
          textSecondary: tokens.colors.neutral.textSecondary,
          textMuted: tokens.colors.neutral.textMuted,
          awbInk: tokens.colors.neutral.awbInk,
        },
      },
      fontFamily: {
        sans: [tokens.typography.fontFamily.sans, 'sans-serif'],
        mono: [tokens.typography.fontFamily.mono, 'monospace'],
      },
      fontSize: {
        '2xs': tokens.typography.fontSize['2xs'],
        xs: tokens.typography.fontSize.xs,
        sm: tokens.typography.fontSize.sm,
        base: tokens.typography.fontSize.base,
        lg: tokens.typography.fontSize.lg,
        xl: tokens.typography.fontSize.xl,
        '2xl': tokens.typography.fontSize['2xl'],
        '3xl': tokens.typography.fontSize['3xl'],
        '4xl': tokens.typography.fontSize['4xl'],
      },
      boxShadow: {
        xs: tokens.shadows.xs,
        sm: tokens.shadows.sm,
        md: tokens.shadows.md,
        lg: tokens.shadows.lg,
        card: tokens.shadows.card,
      },
      borderRadius: {
        none: tokens.radii.none,
        sm: tokens.radii.sm,
        md: tokens.radii.md,
        lg: tokens.radii.lg,
        full: tokens.radii.full,
      },
    },
  },
  plugins: [],
};

export default config;
