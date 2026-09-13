import { afterEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Contact from '../pages/Contact.jsx'
import { contact } from '../content/contact.js'

afterEach(() => vi.unstubAllGlobals())

function fillForm() {
  render(<MemoryRouter><Contact /></MemoryRouter>)
  fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Visitor' } })
  fireEvent.change(screen.getByLabelText('Your email'), { target: { value: 'visitor@example.org' } })
  fireEvent.change(screen.getByLabelText('Message'), { target: { value: 'A useful question.' } })
}

describe('contact submission', () => {
  it('submits once while pending and clears the form only after confirmed acceptance', async () => {
    let finish
    const request = vi.fn(() => new Promise((resolve) => { finish = resolve }))
    vi.stubGlobal('fetch', request)
    fillForm()
    fireEvent.submit(screen.getByRole('form'))
    expect(screen.getByRole('button')).toBeDisabled()
    fireEvent.submit(screen.getByRole('form'))
    expect(request).toHaveBeenCalledTimes(1)
    const [url, options] = request.mock.calls[0]
    expect(url).toBe('/api/contact')
    expect(JSON.parse(options.body)).toEqual({ name: 'Visitor', email: 'visitor@example.org', message: 'A useful question.', website: '' })
    finish({ ok: true, json: async () => ({ ok: true }) })
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(contact.form.success))
    expect(screen.getByLabelText('Message')).toHaveValue('')
  })

  it.each([
    ['unavailable', () => Promise.resolve({ ok: false, json: async () => ({ ok: false }) })],
    ['unexpected HTML response', () => Promise.resolve({ ok: true, json: async () => { throw new Error('HTML') } })],
    ['network failure', () => Promise.reject(new Error('Offline'))],
  ])('preserves the message on %s and allows retry', async (_, response) => {
    vi.stubGlobal('fetch', vi.fn(response))
    fillForm()
    fireEvent.submit(screen.getByRole('form'))
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(contact.form.error))
    expect(screen.getByLabelText('Message')).toHaveValue('A useful question.')
    expect(screen.getByRole('button')).toBeEnabled()
  })
})
