import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import handler from '../../api/contact.js'

const valid = { name: 'Visitor', email: 'visitor@example.org', message: 'A question.', website: '' }
const request = (body = valid, overrides = {}) => ({ method: 'POST', headers: { 'content-type': 'application/json' }, body, ...overrides })
const response = () => ({ setHeader: vi.fn(), status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() })

beforeEach(() => {
  vi.stubEnv('RESEND_API_KEY', 'test-key')
  vi.stubEnv('CONTACT_FROM', 'website@example.org')
  vi.stubEnv('CONTACT_TO', 'private@example.org')
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ id: 'test-delivery' }) }))
})
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals() })

describe('private contact delivery', () => {
  it('uses server-only routing and visitor reply-to with plain text', async () => {
    const res = response()
    await handler(request({ ...valid, to: 'attacker@example.org' }), res)
    expect(res.status).toHaveBeenCalledWith(200)
    const [, options] = fetch.mock.calls[0]
    expect(JSON.parse(options.body)).toEqual({ from: 'website@example.org', to: ['private@example.org'], reply_to: valid.email, subject: 'Website message from Visitor', text: 'Visitor\nvisitor@example.org\n\nA question.' })
    expect(res.json).toHaveBeenCalledWith({ ok: true })
  })
  it('fails closed without configuration', async () => {
    vi.stubEnv('RESEND_API_KEY', '')
    const res = response()
    await handler(request(), res)
    expect(res.status).toHaveBeenCalledWith(503)
    expect(fetch).not.toHaveBeenCalled()
  })
  it.each([null, '{', [], { ...valid, name: '' }, { ...valid, name: 'a\nb' }, { ...valid, email: 'invalid' }, { ...valid, message: ' ' }, { ...valid, message: 'a'.repeat(5001) }, { ...valid, website: 'spam' }])('rejects invalid payload %j without delivery', async (body) => {
    const res = response()
    await handler(request(body), res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(fetch).not.toHaveBeenCalled()
  })
  it('rejects unsupported methods and content types', async () => {
    for (const [override, code] of [[{ method: 'GET' }, 405], [{ headers: { 'content-type': 'text/plain' } }, 415]]) {
      const res = response()
      await handler(request(valid, override), res)
      expect(res.status).toHaveBeenCalledWith(code)
    }
    expect(fetch).not.toHaveBeenCalled()
  })
  it.each([
    () => Promise.resolve({ ok: false }),
    () => Promise.resolve({ ok: true, json: async () => ({}) }),
    () => Promise.reject(new Error('Provider timeout')),
  ])('does not report success when the provider fails', async (failure) => {
    vi.stubGlobal('fetch', vi.fn(failure))
    const res = response()
    await handler(request(), res)
    expect(res.status).toHaveBeenCalledWith(502)
    expect(res.json).toHaveBeenCalledWith({ ok: false })
  })
})
