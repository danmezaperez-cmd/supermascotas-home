import type { Config } from 'tailwindcss'

/**
 * Sistema de diseño Supermascotas.
 * Paleta derivada del logotipo oficial. Ningún color fuera de estas escalas.
 * Espaciado: escala nativa de Tailwind (múltiplos de 4 px). No usar valores sueltos.
 */
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './data/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#EEF2FC', 100: '#DCE4F8', 200: '#B6C6F0', 300: '#8AA3E4',
          400: '#5877CE', 500: '#2E52B5', 600: '#173DA0', 700: '#123184',
          800: '#0E2666', 900: '#0A1B47',
          DEFAULT: '#173DA0',
        },
        accent: {
          50: '#FDF2F2', 100: '#FADFDF', 200: '#F3BBBB', 300: '#E68E8E',
          400: '#D25E5E', 500: '#C13C3C', 600: '#B02828', 700: '#8F1F1F',
          800: '#6E1919', 900: '#4B1111',
          DEFAULT: '#B02828',
        },
        lime: {
          50: '#F6FAE8', 100: '#EBF4CB', 200: '#D7E99B', 300: '#C2DD6B',
          400: '#B1D052', 500: '#A4C33D', 600: '#8CA831', 700: '#6E8426',
          800: '#52631C', 900: '#374213',
          DEFAULT: '#A4C33D',
        },
        sun: {
          50: '#FEFCE9', 100: '#FDF8C7', 200: '#FAF08D', 300: '#F5E866',
          400: '#EFE14B', 500: '#DCCB33', 600: '#BAA926', 700: '#93851F',
          800: '#6C6117', 900: '#47400F',
          DEFAULT: '#EFE14B',
        },
        ink: { DEFAULT: '#111B2E', soft: '#243352' },
        muted: '#5A6780',
        cream: '#F6F8FC',
        line: '#E1E7F3',
      },
      fontFamily: {
        sans: [
          'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI',
          'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif',
        ],
      },
      fontSize: {
        // [size, { lineHeight, letterSpacing }] — ritmo vertical definido, no improvisado
        display: ['clamp(1.625rem, 1.15rem + 2.4vw, 3.125rem)', { lineHeight: '1.05', letterSpacing: '-0.03em', fontWeight: '800' }],
        title:   ['clamp(1.375rem, 1.15rem + 1.15vw, 2rem)',    { lineHeight: '1.12', letterSpacing: '-0.02em', fontWeight: '800' }],
        subtitle:['clamp(1.0625rem, 1rem + 0.4vw, 1.25rem)',    { lineHeight: '1.3',  letterSpacing: '-0.01em', fontWeight: '700' }],
        'body-lg':['1.0625rem', { lineHeight: '1.6' }],
        body:    ['0.9375rem', { lineHeight: '1.6' }],
        micro:   ['0.75rem',   { lineHeight: '1.35', letterSpacing: '0.02em' }],
        eyebrow: ['0.6875rem', { lineHeight: '1.2', letterSpacing: '0.1em', fontWeight: '700' }],
      },
      borderRadius: {
        sm: '0.5rem', md: '0.75rem', lg: '1rem', xl: '1.375rem', '2xl': '1.75rem', pill: '999px',
      },
      boxShadow: {
        e1: '0 1px 2px rgba(17,27,46,.06), 0 1px 3px rgba(17,27,46,.05)',
        e2: '0 4px 10px rgba(17,27,46,.07), 0 12px 24px -8px rgba(17,27,46,.12)',
        e3: '0 12px 28px rgba(17,27,46,.13), 0 32px 64px -16px rgba(17,27,46,.22)',
        inset1: 'inset 0 0 0 1px #E1E7F3',
      },
      transitionTimingFunction: { soft: 'cubic-bezier(.22,.61,.36,1)' },
      transitionDuration: { fast: '150ms', base: '200ms', slow: '250ms' },
      maxWidth: { shell: '80rem' },
      keyframes: {
        pop: { '0%': { transform: 'scale(.85)', opacity: '0' }, '60%': { transform: 'scale(1.06)', opacity: '1' }, '100%': { transform: 'scale(1)' } },
        risein: { from: { opacity: '0', transform: 'translateY(6px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slidein: { from: { transform: 'translateX(100%)' }, to: { transform: 'translateX(0)' } },
        shimmer: { '100%': { transform: 'translateX(100%)' } },
      },
      animation: {
        pop: 'pop 250ms cubic-bezier(.22,.61,.36,1)',
        risein: 'risein 200ms cubic-bezier(.22,.61,.36,1)',
        slidein: 'slidein 250ms cubic-bezier(.22,.61,.36,1)',
        shimmer: 'shimmer 1.4s infinite',
      },
    },
  },
  plugins: [],
}
export default config
