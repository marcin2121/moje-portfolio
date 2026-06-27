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
  journey: z.array(z.object({
    timestamp: z.number(),
    action: z.string().max(50),
    metadata_summary: z.string().max(100).optional()
  })).optional(),
});

const postHandler = async (data: z.infer<typeof LogSchema>) => {
  const safeJsonLine = JSON.stringify(data) + '\n';
  
  const logsDir = path.join(process.cwd(), 'logs');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }

  const filePath = path.join(logsDir, 'ux-logs.jsonl');
  await fs.promises.appendFile(filePath, safeJsonLine);

  return NextResponse.json({ success: true });
};

// PRINCIPAL ENGINEER REMINDER: Verify Coolify Docker Persistent Storage mapping for './logs' 
// to prevent ephemeral loss of telemetry on container restart.
const handler = withValidation(LogSchema, postHandler);

export const POST = async (req: Request) => {
  const contentLength = req.headers.get('content-length');
  if (contentLength && parseInt(contentLength, 10) > 15 * 1024) {
    return NextResponse.json({ error: "Payload too large (Max 15KB)" }, { status: 413 });
  }
  return handler(req);
};
