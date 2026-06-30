## 2026-06-30 - [Medium] Server Action Data Leak & Missing Validation
**Vulnerability:** The server action `sendContactEmail` passed raw `FormData` values directly into the Resend API, lacked strict type checking and length limits, and leaked `error.message` from the upstream API directly back to the client upon failure.
**Learning:** Next.js Server Actions process user input similarly to traditional API routes. Relying on `formData.get(...) as string` bypasses true validation. Furthermore, passing an unhandled 3rd party API error message back to the client in a production setting can lead to information leakage (e.g. rate limit counts, internal paths, or API configuration missteps).
**Prevention:** Always validate `typeof` and set sensible `.length` caps for string inputs from `FormData` to prevent payload/DoS abuse. Catch downstream API errors gracefully, log them server-side, and return a sanitized, generic error string to the user.

## 2026-06-30 - [Critical] SSRF Vulnerability in Audit Endpoint
**Vulnerability:** The `audit-master` API endpoint accepted an arbitrary URL parameter and directly invoked `fetch()` on it from the server without validating the hostname, exposing the server to Server-Side Request Forgery (SSRF) targeting internal networks and cloud metadata.
**Learning:** Internal server execution of user-supplied URLs requires explicit hostname denylisting. Attackers can map internal infrastructure (e.g. `localhost`, `10.x.x.x`) or fetch cloud IAM credentials (e.g. `169.254.169.254`).
**Prevention:** Always parse the URL natively (`new URL()`) and strictly filter the `hostname` against localhost, cloud provider metadata IPs, and private subnet IP ranges before executing any server-side fetch requests. Also impose strict length limits on URLs to prevent parser DoS.

## 2026-06-30 - [High] Denial of Wallet (Rate Limiting) in Audit Endpoint
**Vulnerability:** The udit-master endpoint could be spammed without limits, potentially exhausting downstream API quotas (PageSpeed, GoogleGenAI) and causing a Denial of Wallet.
**Learning:** Publicly accessible endpoints that perform heavy computations or call external paid APIs must implement rate limiting to prevent abuse.
**Prevention:** Implemented an in-memory sliding window rate limiter (10 requests per hour per IP) using a standard JavaScript Map with periodic garbage collection for stale entries. Localhost and development IPs bypass this limit for uninterrupted testing.

## 2026-06-30 - [High] Email HTML Injection / Spoofing (Phishing Relay) in send-report API
**Vulnerability:** The Zod schema in send-report used z.any() for the outputs and inputs fields. These fields were later directly interpolated into an HTML email template sent via Resend. An attacker could craft a payload with malicious HTML or phishing links in these fields, using the server to relay spoofed emails from the company domain to any victim.
**Learning:** Never use z.any() for data that will be rendered or interpolated into sensitive contexts like HTML emails. Type bypass allows attackers to inject arbitrary strings where numbers or booleans were expected.
**Prevention:** Strictly type all Zod schemas (e.g. z.number()). The strict types prevent string interpolation attacks in templates that expect numerical data.

## 2026-06-30 - [Medium] Data Leakage in accept-offer API
**Vulnerability:** Similar to the sendContactEmail action, the ccept-offer endpoint was returning raw Resend API error objects back to the client. This exposes internal API state or misconfiguration details to the public.
**Prevention:** Caught the error, logged it securely on the server-side, and returned a sanitized, generic error message string to the client.
