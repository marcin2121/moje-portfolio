const rateLimitMap = new Map<string, { count: number, timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 godzina
const MAX_REQUESTS = 10;

export function checkRateLimit(ip: string, host: string): { allowed: boolean; error?: string } {
  const isLocalRequest = host.includes('localhost') || ip === '127.0.0.1' || ip === '::1';
  
  if (!isLocalRequest && ip !== 'unknown-ip') {
    const now = Date.now();
    const clientRecord = rateLimitMap.get(ip);
    
    if (clientRecord && now - clientRecord.timestamp < RATE_LIMIT_WINDOW) {
      if (clientRecord.count >= MAX_REQUESTS) {
        return { allowed: false, error: 'Przekroczono limit darmowych skanów (10/godzinę). Spróbuj ponownie później.' };
      }
      clientRecord.count++;
    } else {
      rateLimitMap.set(ip, { count: 1, timestamp: now });
    }
    
    // Garbage collection dla Rate Limitera (zapobieganie wyciekom pamięci)
    if (rateLimitMap.size > 1000) {
      setTimeout(() => {
        for (const [key, val] of rateLimitMap.entries()) {
          if (now - val.timestamp >= RATE_LIMIT_WINDOW) rateLimitMap.delete(key);
        }
      }, 0);
    }
  }

  return { allowed: true };
}
