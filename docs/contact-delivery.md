# Contact delivery

The form posts to `/api/contact`, a Vercel Node.js function using the
[Resend email API](https://resend.com/docs/api-reference/emails/send-email).
Set these server-only variables privately in the Vercel environments that
should deliver messages, then redeploy:

- `RESEND_API_KEY`: Resend sending API key.
- `CONTACT_FROM`: sender address on a Resend-verified domain.
- `CONTACT_TO`: Shanice's private destination inbox.

Do not put these values in Git or any `VITE_*` variable. The recipient never
appears in the frontend bundle or API response. Replies go to the visitor's
address. Messages are sent as plain text; the app does not persist them.

The site builds without configuration. The API returns 503 when configuration
is missing; the form preserves the message and offers retry/LinkedIn. Success
means Resend accepted the message, not confirmation of inbox placement.

Vite's development/preview server does not run Vercel functions. Use a Vercel
preview or `vercel dev` with private local environment configuration for a real
delivery check. Unit tests mock delivery and do not send email.

The handler validates field types/lengths and includes a honeypot. Configure
Vercel Firewall rate limiting for `/api/contact` before exposing delivery to
public traffic; the honeypot is not a distributed rate limiter.

The SPA rewrite excludes `/api/`, leaving function requests with Vercel's
filesystem routing instead of rewriting them to `index.html`.
