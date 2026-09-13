import process from 'node:process'

// This module runs only on Vercel. Never import server configuration into src/.
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ ok: false })
  }
  if (!req.headers['content-type']?.startsWith('application/json')) {
    return res.status(415).json({ ok: false })
  }
  let body
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
  } catch {
    return res.status(400).json({ ok: false })
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return res.status(400).json({ ok: false })
  const { name, email, message, website } = body
  if (website) return res.status(400).json({ ok: false })
  if (
    typeof name !== 'string' || !name.trim() || name.length > 100 || /[\r\n]/.test(name) ||
    typeof email !== 'string' || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    typeof message !== 'string' || !message.trim() || message.length > 5000
  ) return res.status(400).json({ ok: false })

  const { RESEND_API_KEY, CONTACT_FROM, CONTACT_TO } = process.env
  if (!RESEND_API_KEY || !CONTACT_FROM || !CONTACT_TO) return res.status(503).json({ ok: false })

  try {
    const delivery = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: CONTACT_FROM,
        to: [CONTACT_TO],
        reply_to: email,
        subject: `Website message from ${name.trim()}`,
        text: `${name.trim()}\n${email}\n\n${message.trim()}`,
      }),
      signal: AbortSignal.timeout(10000),
    })
    if (!delivery.ok) return res.status(502).json({ ok: false })
    const result = await delivery.json()
    if (!result.id) return res.status(502).json({ ok: false })
    return res.status(200).json({ ok: true })
  } catch {
    return res.status(502).json({ ok: false })
  }
}
