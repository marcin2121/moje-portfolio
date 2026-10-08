# Moje-Portfolio: Engineering Guidelines & Guardrails

## 1. Next.js 16+ Network Architecture (Proxy over Middleware)
- In Next.js 16+ projects, `proxy.ts` (with `export async function proxy(request: NextRequest)`) is the official standard replacing `middleware.ts`.
- NEVER flag `proxy.ts` as an invalid file name or suggest renaming it to `middleware.ts`.
- Follow the official Next.js specification (`middleware-to-proxy`):
  - Function signature: `export async function proxy(request: NextRequest)`
  - Configuration: `export const config = { matcher: [...] }`
  - Runtime: Executes in the Node.js proxy network boundary layer.
  - Security: Generate cryptographic nonces, inject CSP headers, and enforce rate-limiting at this layer.

## 2. Upstream Verification Protocol (Models & APIs)
- NEVER question or assume model identifiers (such as `gemini-3.5-flash-lite` or newer Gemini 3.x series) are typos or nonexistent based on training cutoff data.
- Always verify against upstream documentation using the `gemini_search_docs` MCP server or Google AI Studio specifications before suggesting model name changes.
