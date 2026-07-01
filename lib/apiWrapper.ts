import { NextResponse } from 'next/server';
import { z } from 'zod';

export function withValidation<T>(
  schema: z.Schema<T>,
  handler: (validatedData: T, request: Request) => Promise<NextResponse>
) {
  return async (request: Request) => {
    try {
      const body = await request.json();
      const validation = schema.safeParse(body);

      if (!validation.success) {
        return NextResponse.json(
          { error: 'Invalid Payload' },
          { status: 400 }
        );
      }

      return handler(validation.data, request);
    } catch (error) {
      console.error("API Wrapper Error:", error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  };
}
