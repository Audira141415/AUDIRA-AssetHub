import { NextResponse } from "next/server";

interface RateLimitStore {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitStore>();

export function rateLimit(request: Request, limit: number = 50, windowMs: number = 60000) {
  // Try to get IP address from headers
  const ip = request.headers.get("x-forwarded-for") || 
             request.headers.get("x-real-ip") || 
             "127.0.0.1";
             
  const key = `${ip}-${new URL(request.url).pathname}`;
  const now = Date.now();
  
  let record = store.get(key);
  
  if (!record || record.resetTime < now) {
    // New or expired record
    record = {
      count: 1,
      resetTime: now + windowMs
    };
    store.set(key, record);
  } else {
    // Existing valid record
    record.count++;
    if (record.count > limit) {
      return {
        success: false,
        response: NextResponse.json(
          { error: "Too Many Requests", message: `Please wait ${Math.ceil((record.resetTime - now) / 1000)}s` }, 
          { 
            status: 429,
            headers: {
              'Retry-After': Math.ceil((record.resetTime - now) / 1000).toString(),
              'X-RateLimit-Limit': limit.toString(),
              'X-RateLimit-Remaining': '0',
            }
          }
        )
      };
    }
  }

  return {
    success: true,
    headers: {
      'X-RateLimit-Limit': limit.toString(),
      'X-RateLimit-Remaining': (limit - record.count).toString(),
    }
  };
}
