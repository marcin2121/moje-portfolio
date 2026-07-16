import { describe, it, expect, vi, beforeEach } from 'vitest';
import { withValidation } from '../lib/apiWrapper';
import { z } from 'zod';
import { NextResponse } from 'next/server';

// Mock NextResponse
vi.mock('next/server', () => {
  return {
    NextResponse: {
      json: vi.fn((body, init) => {
        return {
          status: init?.status || 200,
          body,
        };
      }),
    },
  };
});

describe('withValidation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const schema = z.object({
    name: z.string(),
  });

  const mockHandler = vi.fn(async (data, req) => {
    return NextResponse.json({ success: true, data });
  });

  it('should call handler if validation succeeds', async () => {
    const wrapped = withValidation(schema, mockHandler);
    
    const request = {
      json: vi.fn().mockResolvedValue({ name: 'Test' }),
    } as unknown as Request;

    const response: any = await wrapped(request);

    expect(mockHandler).toHaveBeenCalledWith({ name: 'Test' }, request);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true, data: { name: 'Test' } });
  });

  it('should return 400 if validation fails', async () => {
    const wrapped = withValidation(schema, mockHandler);
    
    const request = {
      json: vi.fn().mockResolvedValue({ age: 25 }), // missing 'name'
    } as unknown as Request;

    const response: any = await wrapped(request);

    expect(mockHandler).not.toHaveBeenCalled();
    expect(NextResponse.json).toHaveBeenCalledWith({ error: 'Invalid Payload' }, { status: 400 });
    expect(response.status).toBe(400);
  });

  it('should return 500 if an error occurs (catch block in withValidation)', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const wrapped = withValidation(schema, mockHandler);
    
    // Simulate JSON parsing error
    const request = {
      json: vi.fn().mockRejectedValue(new Error('Syntax Error')),
    } as unknown as Request;

    const response: any = await wrapped(request);

    expect(NextResponse.json).toHaveBeenCalledWith({ error: 'Internal Server Error' }, { status: 500 });
    expect(response.status).toBe(500);
    expect(consoleErrorSpy).toHaveBeenCalledWith('API Wrapper Error:', expect.any(Error));
  });
});
