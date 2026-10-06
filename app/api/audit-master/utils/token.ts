/**
 * Moduł generatora i parsera tokenów audytowych (izomorficzny - działa na serwerze i w przeglądarce)
 * Koduje domenę wewnątrz tokenu (base64url), co pozwala odzyskać kontekst audytu
 * nawet po restarcie kontenera Docker lub wygaśnięciu lokalnego cache.
 */

export function generateAuditToken(domain: string): string {
  const cleanDomain = domain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
  const domainPart = typeof Buffer !== 'undefined'
    ? Buffer.from(cleanDomain).toString('base64url')
    : btoa(cleanDomain).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const randomPart = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 6);
  return `${domainPart}-${randomPart}`;
}

export function parseDomainFromToken(token: string): string | null {
  if (!token) return null;
  try {
    const parts = token.split('-');
    if (parts.length >= 2 && parts[0]) {
      let b64 = parts[0].replace(/-/g, '+').replace(/_/g, '/');
      while (b64.length % 4) b64 += '=';
      const decoded = typeof atob === 'function'
        ? atob(b64)
        : typeof Buffer !== 'undefined'
        ? Buffer.from(parts[0], 'base64url').toString('utf-8')
        : '';
      if (decoded && decoded.includes('.') && decoded.length < 100) {
        return decoded.toLowerCase();
      }
    }
  } catch {
    // Cichy fallback dla starych losowych tokenów hex
  }
  return null;
}
