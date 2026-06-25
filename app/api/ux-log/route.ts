import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    // Top 1%: Zabezpieczenie pamięci RAM (max 25KB)
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > 25000) {
      return NextResponse.json({ error: 'Payload too large' }, { status: 413 });
    }

    const data = await request.text();
    
    // Top 1%: Sanitaryzacja wejścia zapobiegająca zatrutym enterom w JSONL
    const parsedData = JSON.parse(data);
    const safeJsonLine = JSON.stringify(parsedData) + '\n';

    const logsDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    const filePath = path.join(logsDir, 'ux-logs.jsonl');
    fs.appendFileSync(filePath, safeJsonLine);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
  }
}
