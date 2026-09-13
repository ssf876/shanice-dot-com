import { describe, expect, it } from 'vitest'
import { timeline } from '../content/timeline.js'
import { dateValue, endpointLabel, timelineDomain, timelineGeometry, timelineHeight, timelinePosition } from './timeline.js'

const entry = (id) => timeline.find((item) => item.id === id)

describe('continuous timeline scale', () => {
  it('uses equal distance for equal elapsed time, independent of item count', () => {
    const year = timelinePosition(2020) - timelinePosition(2021)
    expect(timelinePosition(2016) - timelinePosition(2020)).toBeCloseTo(year * 4)
    expect(timelinePosition(2023) - timelinePosition(2026)).toBeCloseTo(year * 3)
    expect(timelinePosition(dateValue(2020, 5)) - timelinePosition(dateValue(2020, 7))).toBeCloseTo(year / 6)
  })
  it('anchors year-only dates without fabricating month labels', () => {
    expect(dateValue(2021, null)).toBe(2021)
    expect(endpointLabel(2021, null)).toBe('')
    expect(entry('columbia').startMonth).toBeNull()
    expect(entry('paypal-analyst').startMonth).toBeNull()
  })
  it('keeps Howard and BNP separated by the supplied two-month gap', () => {
    const howard = timelineGeometry(entry('howard'))
    const bnp = timelineGeometry(entry('bnp-analyst'))
    expect(howard.top - bnp.anchor).toBeCloseTo(100 / (timelineDomain.end - timelineDomain.start) / 6)
  })
  it('shows the actual anchored overlaps across work and education', () => {
    const columbia = timelineGeometry(entry('columbia'))
    const bnp = timelineGeometry(entry('bnp-analyst'))
    const paypal = timelineGeometry(entry('paypal-analyst'))
    expect(columbia.anchor).toBeGreaterThan(bnp.top)
    expect(columbia.anchor).toBeLessThan(bnp.anchor)
    expect(paypal.anchor).toBeGreaterThan(columbia.top)
    expect(paypal.anchor).toBeLessThan(columbia.anchor)
  })
  it('joins the PayPal ranges at February 2026 exactly', () => {
    const analyst = timelineGeometry(entry('paypal-analyst'))
    const engineer = timelineGeometry(entry('paypal-engineer'))
    expect(analyst.top).toBe(engineer.anchor)
    expect(analyst.top).toBe(timelinePosition(dateValue(2026, 2)))
    expect(engineer.top).toBe(0)
  })
  it('scales every interval uniformly to fit compact tiles within the shortest range', () => {
    const height = timelineHeight(timeline)
    for (const item of timeline) {
      expect(timelineGeometry(item).height * height / 100).toBeGreaterThanOrEqual(18)
    }
  })
  it('centers every tile inside its true start and end boundaries', () => {
    for (const item of timeline) {
      const geometry = timelineGeometry(item)
      expect(geometry.anchor).toBe(timelinePosition(dateValue(item.startYear, item.startMonth)))
      expect(geometry.top + geometry.height).toBeCloseTo(geometry.anchor)
      expect(geometry.height).toBeGreaterThan(0)
      expect(geometry.center).toBeGreaterThan(geometry.top)
      expect(geometry.center).toBeLessThan(geometry.anchor)
      expect(geometry.center - geometry.top).toBeCloseTo(geometry.anchor - geometry.center)
    }
  })
})
