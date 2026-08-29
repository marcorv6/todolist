import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter() {
    return {
      prefetch: () => null,
      push: () => null,
    };
  },
  usePathname() {
    return '';
  },
}));

// Mock next-themes
vi.mock('next-themes', () => ({
  useTheme() {
    return {
      theme: 'dark',
      setTheme: vi.fn(),
    };
  },
}));
