import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { z } from 'zod';
import { withValidation } from '@/lib/apiWrapper';

const LogSchema = z.object({
  session_id: z.string(),
  device: z.string(),
  duration_seconds: z.number(),
  max_scroll_depth: z.string(),
  journey: z.array(z.record(z.string(), z.any())).optional(),
});

const postHandler = async (data: z.infer<typeof LogSchema>) => {
  const safeJsonLine = JSON.stringify(data) + '\n';
  
  const logsDir = path.join(process.cwd(), 'logs');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }

  const filePath = path.join(logsDir, 'ux-logs.jsonl');
  fs.appendFileSync(filePath, safeJsonLine);

  return NextResponse.json({ success: true });
};

export const POST = withValidation(LogSchema, postHandler);
