// src/shared/constants/theme.js

export const COLORS = {
  primary: '#fada28',
  primaryDark: '#daa520',
  background: '#e7dbcb',
  surface: '#f4ede2',
  surfaceHover: '#efe4d3',
  border: '#d9ccb8',
  text: '#3f3528',
  textBody: '#5f5342',
  textLight: '#7b6b57',
  error: '#6b2d22',
  errorBg: '#e7b7ac',
  success: '#2f7a4f',
  warning: '#b9852c',
  white: '#ffffff',
  placeholder: '#b3a58a',
};

export const FONT_FAMILY = {
  regular: 'Inter',
  system: 'System',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const FONT_SIZE = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
};

export const BORDER_RADIUS = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  full: 9999,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 30,
    elevation: 6,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.12,
    shadowRadius: 60,
    elevation: 10,
  },
  primary: {
    shadowColor: '#fada28',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 25,
    elevation: 8,
  },
};

export const TYPOGRAPHY = {
  fontFamily: 'Inter, system-ui, sans-serif',
};
