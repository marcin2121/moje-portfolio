import { describe, it, expect } from 'vitest';
import { cn } from '../lib/utils';

describe('cn', () => {
  it('should merge class names correctly', () => {
    expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white');
  });

  it('should handle conditional class names', () => {
    expect(cn('bg-red-500', false && 'text-white', true && 'p-4')).toBe('bg-red-500 p-4');
  });

  it('should properly merge tailwind classes using tailwind-merge', () => {
    expect(cn('p-2 p-4')).toBe('p-4');
    expect(cn('bg-red-500 bg-blue-500')).toBe('bg-blue-500');
  });
});
