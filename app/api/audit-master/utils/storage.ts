import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AuditMasterResponse } from '../types';
import fs from 'fs';
import path from 'path';

let supabase: SupabaseClient | null = null;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    });
  } catch {
    supabase = null;
  }
}

// Lokalny folder cache na VPS / Coolify (zero latency fallback)
const LOCAL_CACHE_DIR = path.join(process.cwd(), 'data', 'audits');

function ensureLocalCacheDir() {
  if (!fs.existsSync(LOCAL_CACHE_DIR)) {
    fs.mkdirSync(LOCAL_CACHE_DIR, { recursive: true });
  }
}

export async function getAuditByToken(token: string): Promise<AuditMasterResponse | null> {
  // 1. Sprawdź Supabase
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('audit_reports')
        .select('data')
        .eq('token', token)
        .maybeSingle();

      if (!error && data?.data) {
        return {
          ...(data.data as AuditMasterResponse),
          cached: true
        };
      }
    } catch {
      // Fallback do lokalnego cache
    }
  }

  // 2. Sprawdź lokalny dysk VPS
  try {
    ensureLocalCacheDir();
    const filePath = path.join(LOCAL_CACHE_DIR, `${token}.json`);
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(raw) as AuditMasterResponse;
      return {
        ...parsed,
        cached: true
      };
    }
  } catch {
    // Ignoruj
  }

  return null;
}

export async function getAuditByDomain(
  domain: string,
  maxAgeDays = 7,
  siteType?: 'ecommerce' | 'services'
): Promise<AuditMasterResponse | null> {
  const cleanDomain = domain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
  const cutoffTime = new Date(Date.now() - maxAgeDays * 24 * 60 * 60 * 1000).toISOString();

  // 1. Sprawdź Supabase
  if (supabase) {
    try {
      let query = supabase
        .from('audit_reports')
        .select('data, created_at')
        .eq('domain', cleanDomain)
        .gte('created_at', cutoffTime);

      if (siteType) {
        query = query.eq('site_type', siteType);
      }

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data?.data) {
        return {
          ...(data.data as AuditMasterResponse),
          cached: true
        };
      }
    } catch {
      // Fallback do lokalnego cache
    }
  }

  // 2. Sprawdź lokalny dysk VPS
  try {
    ensureLocalCacheDir();
    const domainMapPath = path.join(LOCAL_CACHE_DIR, 'domains_index.json');
    if (fs.existsSync(domainMapPath)) {
      const mapRaw = fs.readFileSync(domainMapPath, 'utf-8');
      const map = JSON.parse(mapRaw) as Record<string, { token: string; timestamp: number; siteType?: string }>;
      const key = siteType ? `${cleanDomain}:${siteType}` : cleanDomain;
      const record = map[key] || map[cleanDomain];

      if (record && Date.now() - record.timestamp < maxAgeDays * 24 * 60 * 60 * 1000) {
        const audit = await getAuditByToken(record.token);
        if (audit && (!siteType || audit.siteType === siteType)) {
          return audit;
        }
      }
    }
  } catch {
    // Ignoruj
  }

  return null;
}

export async function saveAudit(audit: AuditMasterResponse): Promise<{ token: string }> {
  const cleanDomain = audit.domain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];

  // 1. Zapisz w Supabase
  if (supabase) {
    try {
      await supabase.from('audit_reports').insert({
        token: audit.token,
        domain: cleanDomain,
        url: audit.url,
        site_type: audit.siteType,
        overall_score: audit.overallScore,
        loss_percentage: audit.lossPercentage,
        data: audit
      });
    } catch {
      // Ignoruj błąd i zapisz lokalnie
    }
  }

  // 2. Zapisz lokalnie na VPS
  try {
    ensureLocalCacheDir();
    const filePath = path.join(LOCAL_CACHE_DIR, `${audit.token}.json`);
    fs.writeFileSync(filePath, JSON.stringify(audit, null, 2), 'utf-8');

    // Aktualizuj indeks domen
    const domainMapPath = path.join(LOCAL_CACHE_DIR, 'domains_index.json');
    let map: Record<string, { token: string; timestamp: number; siteType?: string }> = {};
    if (fs.existsSync(domainMapPath)) {
      try {
        map = JSON.parse(fs.readFileSync(domainMapPath, 'utf-8'));
      } catch {
        map = {};
      }
    }
    const entry = { token: audit.token, timestamp: Date.now(), siteType: audit.siteType };
    map[cleanDomain] = entry;
    map[`${cleanDomain}:${audit.siteType}`] = entry;
    fs.writeFileSync(domainMapPath, JSON.stringify(map, null, 2), 'utf-8');
  } catch {
    // Ignoruj
  }

  return { token: audit.token };
}

export async function saveLead(leadData: {
  auditToken?: string;
  domain: string;
  email: string;
  phone: string;
  notes?: string;
}): Promise<boolean> {
  const cleanDomain = leadData.domain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];

  // 1. Zapisz w Supabase
  if (supabase) {
    try {
      const { error } = await supabase.from('audit_leads').insert({
        audit_token: leadData.auditToken || null,
        domain: cleanDomain,
        email: leadData.email.trim(),
        phone: leadData.phone.trim(),
        notes: leadData.notes?.trim() || null
      });
      if (!error) return true;
    } catch {
      // Fallback
    }
  }

  // 2. Zapisz lokalnie w pliku leads.json na VPS
  try {
    ensureLocalCacheDir();
    const leadsFile = path.join(LOCAL_CACHE_DIR, 'leads.json');
    let leads: unknown[] = [];
    if (fs.existsSync(leadsFile)) {
      try {
        leads = JSON.parse(fs.readFileSync(leadsFile, 'utf-8'));
      } catch {
        leads = [];
      }
    }
    leads.push({
      ...leadData,
      domain: cleanDomain,
      created_at: new Date().toISOString()
    });
    fs.writeFileSync(leadsFile, JSON.stringify(leads, null, 2), 'utf-8');
    return true;
  } catch {
    return false;
  }
}
