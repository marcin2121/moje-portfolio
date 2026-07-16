import { describe, it, expect } from 'vitest';
import { fixOrphans } from '../utils/typography';

describe('fixOrphans', () => {
  it('should replace spaces after 1-2 letter words with non-breaking spaces', () => {
    expect(fixOrphans('Ala ma kota')).toBe('Ala ma\u00A0kota');
    expect(fixOrphans('Z boku')).toBe('Z\u00A0boku');
    expect(fixOrphans('To jest na stole')).toBe('To\u00A0jest na\u00A0stole');
  });

  it('should handle multiple short words next to each other', () => {
    expect(fixOrphans('A z tego')).toBe('A\u00A0z\u00A0tego');
    expect(fixOrphans('To i o nim')).toBe('To\u00A0i\u00A0o\u00A0nim');
  });

  it('should not break on empty or non-string input', () => {
    expect(fixOrphans('')).toBe('');
    // @ts-expect-error testing invalid input
    expect(fixOrphans(null)).toBe(null);
  });

  it('should handle special words like e-mail and e-commerce with non-breaking hyphens', () => {
    expect(fixOrphans('Twój e-mail')).toBe('Twój e\u2011mail');
    expect(fixOrphans('Branża E-commerce')).toBe('Branża E\u2011commerce');
  });
});
