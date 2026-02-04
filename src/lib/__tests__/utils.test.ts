import { cn } from '@/lib/utils';

describe('Utils', () => {
  describe('cn', () => {
    it('merges class names correctly', () => {
      const result = cn('px-4', 'py-2', 'bg-blue-500');
      expect(result).toBe('px-4 py-2 bg-blue-500');
    });

    it('handles conditional classes', () => {
      const result = cn('base-class', true && 'true-class', false && 'false-class');
      expect(result).toContain('base-class');
      expect(result).toContain('true-class');
      expect(result).not.toContain('false-class');
    });

    it('merges conflicting Tailwind classes correctly', () => {
      const result = cn('px-4', 'px-6');
      expect(result).toBe('px-6');
    });

    it('handles undefined and null values', () => {
      const result = cn('base', undefined, null, 'valid');
      expect(result).toContain('base');
      expect(result).toContain('valid');
    });
  });
});
