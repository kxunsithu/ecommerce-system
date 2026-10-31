// Theme (light/dark) management

export const THEME_KEY = 'shopease_theme';

export const getPreferredTheme = () => {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch (e) {}
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const applyTheme = (theme) => {
  const isDark = theme === 'dark';
  document.documentElement.classList.toggle('dark', isDark);
  try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
  // update toggle icons if present
  document.querySelectorAll('[data-theme-icon]').forEach((el) => {
    el.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
  });
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
};

export const toggleTheme = () => {
  applyTheme(document.documentElement.classList.contains('dark') ? 'light' : 'dark');
};

export const initTheme = () => {
  applyTheme(getPreferredTheme());
};
